import { promises as fs } from "node:fs";
import path from "node:path";
import {
  RalphExecutionInput,
  RalphExecutionResult,
  RalphExecutor,
} from "./types.js";
import { EnvironmentDetector } from "./environment-detector.js";
import { DevAgentExecutor } from "./devagent-executor.js";

const RETRYABLE_ERROR_RE =
  /(429|too many requests|rate limit|timed out|timeout|econnreset|socket hang up|5\d\d|temporar)/i;
const NEEDS_INPUT_RE =
  /(need(s)? user input|needs clarification|ambiguous|manual decision|human input)/i;
const MAX_RESULT_OUTPUT_CHARS = 4000;

const PHSPEC_BIN_PATH = process.argv[1];

export interface RalphCliExecutorOptions {
  command?: string;
  args?: string[];
  preferDevAgent?: boolean;
}

export class RalphCliExecutor implements RalphExecutor {
  private readonly command: string;
  private readonly args: string[];
  private readonly preferDevAgent: boolean;
  private readonly environmentDetector: EnvironmentDetector;
  private readonly devAgentExecutor?: DevAgentExecutor;

  constructor(options: RalphCliExecutorOptions = {}) {
    this.command = options.command || process.env.PHSPEC_RALPH_COMMAND || process.execPath;
    this.args = options.args ?? this.resolveArgsFromEnv();
    this.preferDevAgent = options.preferDevAgent ?? false;
    this.environmentDetector = new EnvironmentDetector();

    // 如果启用了 devagent 优先，创建 DevAgentExecutor
    if (this.preferDevAgent) {
      try {
        this.devAgentExecutor = new DevAgentExecutor();
      } catch (error) {
        console.warn("Failed to create DevAgentExecutor:", error);
      }
    }
  }

  async execute(input: RalphExecutionInput): Promise<RalphExecutionResult> {
    try {
      // 如果启用了 devagent 优先，尝试使用 DevAgentExecutor
      if (this.devAgentExecutor) {
        this.devAgentExecutor.emit("beforeExecute", input);
        const result = await this.devAgentExecutor.execute(input);
        this.devAgentExecutor.emit("afterExecute", input, result);
        return result;
      }

      // 使用传统的 CLI 执行方式
      return await this.executeLegacy(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        kind: "fatal_error",
        message: `Failed to run Ralph executor: ${message}`,
      };
    }
  }

  /**
   * 传统的 CLI 执行方式
   */
  private async executeLegacy(input: RalphExecutionInput): Promise<RalphExecutionResult> {
    const payload = this.buildPayload(input);
    try {
      const output = await this.runProcess(payload);
      if (output.exitCode === 0) {
        return {
          kind: "success",
          message: output.stdout.trim() || "Ralph run succeeded.",
          rawOutput: this.truncateOutput(output.combined),
        };
      }

      return this.classifyFailure(output.combined, output.exitCode);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        kind: "fatal_error",
        message: `Failed to run Ralph CLI: ${message}`,
      };
    }
  }

  private resolveArgsFromEnv(): string[] {
    const raw = process.env.PHSPEC_RALPH_ARGS?.trim();
    if (!raw) {
      return [];
    }
    return raw.split(/\s+/).filter(Boolean);
  }

  private buildPayload(input: RalphExecutionInput): string {
    return JSON.stringify(
      {
        mode: "phspec-apply",
        changeName: input.changeName,
        schemaName: input.instructions.schemaName,
        instruction: input.instructions.instruction,
        task: input.task
          ? { id: input.task.id, description: input.task.description }
          : null,
        policy: input.policy,
        changeDir: input.instructions.changeDir,
        tracksFile: input.instructions.tracksFile,
        progress: input.instructions.progress,
        contextFiles: input.instructions.contextFiles,
      },
      null,
      2,
    );
  }

  private runProcess(
    payload: string,
  ): Promise<{ exitCode: number; stdout: string; stderr: string; combined: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(this.command, this.args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += String(chunk);
      });
      child.stderr.on("data", (chunk) => {
        stderr += String(chunk);
      });
      child.on("error", reject);
      child.on("close", (exitCode) => {
        const code = typeof exitCode === "number" ? exitCode : 1;
        const combined = [stdout, stderr].filter(Boolean).join("\n").trim();
        resolve({ exitCode: code, stdout, stderr, combined });
      });

      child.stdin.write(payload);
      child.stdin.end();
    });
  }

  private truncateOutput(output: string): string {
    if (!output || output.length <= MAX_RESULT_OUTPUT_CHARS) {
      return output;
    }
    return `${output.slice(0, MAX_RESULT_OUTPUT_CHARS)}...<truncated>`;
  }

  private classifyFailure(output: string, exitCode?: number): RalphExecutionResult {
    const normalizedOutput = this.truncateOutput(output || "Unknown Ralph failure.");
    if (exitCode === 2) {
      return {
        kind: "needs_input",
        message: normalizedOutput,
        rawOutput: normalizedOutput,
      };
    }
    if (exitCode === 3) {
      return {
        kind: "retryable_error",
        message: normalizedOutput,
        rawOutput: normalizedOutput,
      };
    }
    if (NEEDS_INPUT_RE.test(normalizedOutput)) {
      return {
        kind: "needs_input",
        message: normalizedOutput,
        rawOutput: normalizedOutput,
      };
    }
    if (RETRYABLE_ERROR_RE.test(normalizedOutput)) {
      return {
        kind: "retryable_error",
        message: normalizedOutput,
        rawOutput: normalizedOutput,
      };
    }
    return {
      kind: "fatal_error",
      message: normalizedOutput,
      rawOutput: normalizedOutput,
    };
  }
}
