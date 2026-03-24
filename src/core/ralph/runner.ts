import { promises as fs } from "node:fs";
import path from "node:path";
import {
  RalphApplyInstructions,
  RalphExecutor,
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
  maxRetries?: number;
  initialBackoffMs?: number;
  maxBackoffMs?: number;
  maxAttempts?: number;
  maxStagnantRounds?: number;
  sleep?: (ms: number) => Promise<void>;
}

export class RalphRunner {
  private readonly executor: RalphExecutor;
  private readonly loadInstructions: () => Promise<RalphApplyInstructions>;
  private readonly snapshotPath: string;
  private readonly maxRetries: number;
  private readonly initialBackoffMs: number;
  private readonly maxBackoffMs: number;
  private readonly maxAttempts: number;
  private readonly maxStagnantRounds: number;
  private readonly sleepFn: (ms: number) => Promise<void>;

  constructor(options: RalphRunnerOptions) {
    this.executor = options.executor;
    this.loadInstructions = options.loadInstructions;
    this.snapshotPath = options.snapshotPath;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.initialBackoffMs = options.initialBackoffMs ?? DEFAULT_INITIAL_BACKOFF_MS;
    this.maxBackoffMs = options.maxBackoffMs ?? DEFAULT_MAX_BACKOFF_MS;
    this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
    this.maxStagnantRounds =
      options.maxStagnantRounds ?? DEFAULT_MAX_STAGNANT_ROUNDS;
    this.sleepFn = options.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  }

  async run(): Promise<RalphRunSummary> {
    const existingSnapshot = await this.readSnapshot();
    let attempts = existingSnapshot?.attempts ?? 0;
    let retries = existingSnapshot?.retries ?? 0;
    let stagnantRounds = 0;
    let lastCompletedCount = existingSnapshot?.lastCompletedCount ?? -1;

    while (attempts < this.maxAttempts) {
      const instructions = await this.loadInstructions();
      const completedCount = instructions.progress.complete;
      const totalCount = instructions.progress.total;
      const pendingTask = this.getPendingTask(instructions.tasks);

      if (instructions.state === "all_done") {
        await this.writeSnapshot({
          attempts,
          retries,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
        });
        return {
          changeName: instructions.changeName,
          status: "completed",
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
          attempts,
          retries,
          lastError: message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
        });
        return {
          changeName: instructions.changeName,
          status: "blocked",
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
      } else {
        stagnantRounds += 1;
      }
      lastCompletedCount = completedCount;

      if (!pendingTask && totalCount > 0 && instructions.state === "ready") {
        return {
          changeName: instructions.changeName,
          status: "failed",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message: "No pending task found while apply is still ready.",
        };
      }

      if (stagnantRounds > this.maxStagnantRounds) {
        const message =
          "Runner stopped due to stagnant progress. Manual intervention required.";
        await this.writeSnapshot({
          attempts,
          retries,
          lastError: message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
        });
        return {
          changeName: instructions.changeName,
          status: "failed",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message,
        };
      }

      attempts += 1;
      const result = await this.executor.execute({
        changeName: instructions.changeName,
        instructions,
        task: pendingTask,
      });

      if (result.kind === "success") {
        await this.writeSnapshot({
          attempts,
          retries,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
        });
        continue;
      }

      if (result.kind === "needs_input") {
        await this.writeSnapshot({
          attempts,
          retries,
          lastError: result.message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
        });
        return {
          changeName: instructions.changeName,
          status: "blocked",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message: result.message,
        };
      }

      if (result.kind === "fatal_error") {
        await this.writeSnapshot({
          attempts,
          retries,
          lastError: result.message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
        });
        return {
          changeName: instructions.changeName,
          status: "failed",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message: result.message,
        };
      }

      retries += 1;
      if (retries > this.maxRetries) {
        const message = `Retry limit reached: ${result.message}`;
        await this.writeSnapshot({
          attempts,
          retries,
          lastError: message,
          lastCompletedCount: completedCount,
          lastTaskId: pendingTask?.id,
        });
        return {
          changeName: instructions.changeName,
          status: "failed",
          attempts,
          retries,
          completedTasks: completedCount,
          totalTasks: totalCount,
          message,
        };
      }

      const delayMs = this.calculateBackoffMs(retries);
      await this.writeSnapshot({
        attempts,
        retries,
        lastError: result.message,
        lastCompletedCount: completedCount,
        lastTaskId: pendingTask?.id,
      });
      await this.sleepFn(delayMs);
    }

    const finalInstructions = await this.loadInstructions();
    return {
      changeName: finalInstructions.changeName,
      status: "failed",
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
