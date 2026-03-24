import { promises as fs } from "node:fs";
import path from "node:path";
import {
  RalphApplyInstructions,
  RalphExecutor,
  RalphRunPolicy,
  RalphRunSummary,
  RalphSnapshot,
  RalphTaskItem,
} from "./types.js";

const DEFAULT_MAX_RETRIES = 8;
const DEFAULT_INITIAL_BACKOFF_MS = 2000;
const DEFAULT_MAX_BACKOFF_MS = 30000;
const DEFAULT_MAX_ATTEMPTS = 200;
const DEFAULT_MAX_STAGNANT_ROUNDS = 3;

export interface RalphRunnerOptions {
  executor: RalphExecutor;
  loadInstructions: () => Promise<RalphApplyInstructions>;
  snapshotPath: string;
  policy?: RalphRunPolicy;
  maxRetries?: number;
  initialBackoffMs?: number;
  maxBackoffMs?: number;
  maxAttempts?: number;
  maxStagnantRounds?: number;
  maxRuntimeMinutes?: number;
  sleep?: (ms: number) => Promise<void>;
}

export class RalphRunner {
  private readonly executor: RalphExecutor;
  private readonly loadInstructions: () => Promise<RalphApplyInstructions>;
  private readonly snapshotPath: string;
  private readonly policy: RalphRunPolicy;
  private readonly maxRetries: number;
  private readonly initialBackoffMs: number;
  private readonly maxBackoffMs: number;
  private readonly maxAttempts: number;
  private readonly maxStagnantRounds: number;
  private readonly maxRuntimeMs: number;
  private readonly sleepFn: (ms: number) => Promise<void>;

  constructor(options: RalphRunnerOptions) {
    this.executor = options.executor;
    this.loadInstructions = options.loadInstructions;
    this.snapshotPath = options.snapshotPath;
    this.policy = options.policy ?? "conservative";
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.initialBackoffMs = options.initialBackoffMs ?? DEFAULT_INITIAL_BACKOFF_MS;
    this.maxBackoffMs = options.maxBackoffMs ?? DEFAULT_MAX_BACKOFF_MS;
    this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    this.maxStagnantRounds =
      options.maxStagnantRounds ?? DEFAULT_MAX_STAGNANT_ROUNDS;
    this.maxRuntimeMs =
      options.maxRuntimeMinutes && options.maxRuntimeMinutes > 0
        ? options.maxRuntimeMinutes * 60_000
        : 0;
    this.sleepFn = options.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  }

  async run(): Promise<RalphRunSummary> {
    const startedAt = Date.now();
    const existingSnapshot = await this.readSnapshot();
    let attempts = existingSnapshot?.attempts ?? 0;
    let retries = existingSnapshot?.retries ?? 0;
    let sameErrorCount = existingSnapshot?.sameErrorCount ?? 0;
    let lastErrorFingerprint = existingSnapshot?.lastErrorFingerprint;
    let stagnantRounds = 0;
    let lastCompletedCount = existingSnapshot?.lastCompletedCount ?? -1;

    while (this.hasAttemptsRemaining(attempts)) {
      if (this.maxRuntimeMs > 0 && Date.now() - startedAt >= this.maxRuntimeMs) {
        const finalInstructions = await this.loadInstructions();
        const message = "Runtime budget reached before completion.";
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastError: message,
          lastCompletedCount: finalInstructions.progress.complete,
          lastTaskId: this.getPendingTask(finalInstructions.tasks)?.id,
          sameErrorCount,
          lastErrorFingerprint,
          lastProgressAt: new Date().toISOString(),
        });
        return {
          changeName: finalInstructions.changeName,
          status: "failed",
          stopReason: "runtime_budget",
          attempts,
          retries,
          completedTasks: finalInstructions.progress.complete,
          totalTasks: finalInstructions.progress.total,
          message,
        };
      }

      const instructions = await this.loadInstructions();
      const completedCount = instructions.progress.complete;
      const totalCount = instructions.progress.total;
      const pendingTask = this.getPendingTask(instructions.tasks);

      if (instructions.state === "all_done") {
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
          sameErrorCount,
          lastErrorFingerprint,
          lastProgressAt: new Date().toISOString(),
        });
        return {
          changeName: instructions.changeName,
          status: "completed",
          stopReason: "completed",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message: "All tasks are complete.",
        };
      }

      if (instructions.state === "blocked") {
        const missing = instructions.missingArtifacts?.join(", ");
        const message = missing
          ? `Apply is blocked. Missing artifacts: ${missing}`
          : instructions.instruction;
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastError: message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
          sameErrorCount,
          lastErrorFingerprint,
          lastProgressAt: new Date().toISOString(),
        });
        return {
          changeName: instructions.changeName,
          status: "blocked",
          stopReason: "blocked",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message,
        };
      }

      if (completedCount > lastCompletedCount) {
        retries = 0;
        stagnantRounds = 0;
        sameErrorCount = 0;
        lastErrorFingerprint = undefined;
      } else {
        stagnantRounds += 1;
      }
      lastCompletedCount = completedCount;

      if (!pendingTask && totalCount > 0 && instructions.state === "ready") {
        return {
          changeName: instructions.changeName,
          status: "failed",
          stopReason: "fatal_error",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message: "No pending task found while apply is still ready.",
        };
      }

      if (stagnantRounds > this.maxStagnantRounds) {
        const message = "Runner detected stagnant progress.";
        if (this.policy === "conservative") {
          await this.writeSnapshot({
            policy: this.policy,
            attempts,
            retries,
            lastError: `${message} Manual intervention required.`,
            lastCompletedCount: completedCount,
            lastTaskId: pendingTask?.id,
            sameErrorCount,
            lastErrorFingerprint,
            lastProgressAt: new Date().toISOString(),
          });
          return {
            changeName: instructions.changeName,
            status: "failed",
            stopReason: "stagnant",
            attempts,
            retries,
            completedTasks: completedCount,
            totalTasks: totalCount,
            message: `${message} Manual intervention required.`,
          };
        }

        retries += 1;
        if (!this.hasRetriesRemaining(retries)) {
          const retryMessage = `Retry limit reached after stagnant progress: ${message}`;
          await this.writeSnapshot({
            policy: this.policy,
            attempts,
            retries,
            lastError: retryMessage,
            lastCompletedCount: completedCount,
            lastTaskId: pendingTask?.id,
            sameErrorCount,
            lastErrorFingerprint,
            lastProgressAt: new Date().toISOString(),
          });
          return {
            changeName: instructions.changeName,
            status: "failed",
            stopReason: "retry_limit",
            attempts,
            retries,
            completedTasks: completedCount,
            totalTasks: totalCount,
            message: retryMessage,
          };
        }

        stagnantRounds = 0;
        const delayMs = this.calculateBackoffMs(retries);
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastError: `${message} Retrying in relentless mode.`,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
          sameErrorCount,
          lastErrorFingerprint,
          lastProgressAt: new Date().toISOString(),
        });
        await this.sleepFn(delayMs);
        continue;
      }

      attempts += 1;
      const result = await this.executor.execute({
        changeName: instructions.changeName,
        instructions,
        task: pendingTask,
        policy: this.policy,
      });

      if (result.kind === "success") {
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
          sameErrorCount: 0,
          lastErrorFingerprint: undefined,
          lastProgressAt: new Date().toISOString(),
        });
        continue;
      }

      if (result.kind === "needs_input" && this.policy === "conservative") {
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastError: result.message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
          sameErrorCount,
          lastErrorFingerprint,
          lastProgressAt: new Date().toISOString(),
        });
        return {
          changeName: instructions.changeName,
          status: "blocked",
          stopReason: "needs_input",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message: result.message,
        };
      }

      if (result.kind === "fatal_error" && this.policy === "conservative") {
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastError: result.message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
          sameErrorCount,
          lastErrorFingerprint,
          lastProgressAt: new Date().toISOString(),
        });
        return {
          changeName: instructions.changeName,
          status: "failed",
          stopReason: "fatal_error",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message: result.message,
        };
      }

      retries += 1;
      const errorFingerprint = this.buildErrorFingerprint(result.message);
      if (errorFingerprint === lastErrorFingerprint) {
        sameErrorCount += 1;
      } else {
        sameErrorCount = 1;
      }
      lastErrorFingerprint = errorFingerprint;

      if (!this.hasRetriesRemaining(retries)) {
        const message = `Retry limit reached: ${result.message}`;
        await this.writeSnapshot({
          policy: this.policy,
          attempts,
          retries,
          lastError: message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
          sameErrorCount,
          lastErrorFingerprint,
          lastProgressAt: new Date().toISOString(),
        });
        return {
          changeName: instructions.changeName,
          status: "failed",
          stopReason: "retry_limit",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message,
        };
      }

      const delayMs = this.calculateBackoffMs(retries);
      await this.writeSnapshot({
        policy: this.policy,
        attempts,
        retries,
        lastError: result.message,
        lastCompletedCount: completedCount,
        lastTaskId: pendingTask?.id,
        sameErrorCount,
        lastErrorFingerprint,
        lastProgressAt: new Date().toISOString(),
      });
      await this.sleepFn(delayMs);
    }

    const finalInstructions = await this.loadInstructions();
    return {
      changeName: finalInstructions.changeName,
      status: "failed",
      stopReason: "attempt_limit",
      attempts,
      retries,
      completedTasks: finalInstructions.progress.complete,
      totalTasks: finalInstructions.progress.total,
      message: "Attempt limit reached before completion.",
    };
  }

  private getPendingTask(tasks: RalphTaskItem[]): RalphTaskItem | null {
    for (const task of tasks) {
      if (!task.done) {
        return task;
      }
    }
    return null;
  }

  private calculateBackoffMs(retryCount: number): number {
    const raw = this.initialBackoffMs * 2 ** (retryCount - 1);
    return Math.min(raw, this.maxBackoffMs);
  }

  private hasAttemptsRemaining(attempts: number): boolean {
    if (this.maxAttempts === 0) {
      return true;
    }
    return attempts < this.maxAttempts;
  }

  private hasRetriesRemaining(retries: number): boolean {
    if (this.maxRetries === 0) {
      return true;
    }
    return retries <= this.maxRetries;
  }

  private buildErrorFingerprint(message: string): string {
    return message.replace(/\s+/g, " ").trim().slice(0, 200);
  }

  private async readSnapshot(): Promise<RalphSnapshot | null> {
    try {
      const raw = await fs.readFile(this.snapshotPath, "utf-8");
      const parsed = JSON.parse(raw) as RalphSnapshot;
      if (
        typeof parsed.retries !== "number" ||
        typeof parsed.attempts !== "number" ||
        typeof parsed.lastCompletedCount !== "number"
      ) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  private async writeSnapshot(
    snapshot: Omit<RalphSnapshot, "updatedAt">,
  ): Promise<void> {
    const payload: RalphSnapshot = {
      ...snapshot,
      updatedAt: new Date().toISOString(),
    };
    await fs.mkdir(path.dirname(this.snapshotPath), { recursive: true });
    await fs.writeFile(this.snapshotPath, JSON.stringify(payload, null, 2));
  }
}
