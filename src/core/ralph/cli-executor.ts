import { spawn } from "node:child_process";
import {
  RalphExecutionInput,
  RalphExecutionResult,
  RalphExecutor,
} from "./types.js";

const RETRYABLE_ERROR_RE =
  /(429|too many requests|rate limit|timed out|timeout|econnreset|socket hang up|5\d\d|temporar)/i;
const NEEDS_INPUT_RE =
  /(need(s)? user input|needs clarification|ambiguous|manual decision|human input)/i;

const PHSPEC_BIN_PATH = process.argv[1];

export interface RalphCliExecutorOptions {
  command?: string;
  args?: string[];
}

export class RalphCliExecutor implements RalphExecutor {
  private readonly command: string;
  private readonly args: string[];

  constructor(options: RalphCliExecutorOptions = {}) {
    if (options.command) {
      this.command = options.command;
      this.args = options.args ?? [];
    } else if (process.env.PHSPEC_RALPH_COMMAND) {
      this.command = process.env.PHSPEC_RALPH_COMMAND;
      this.args = options.args ?? this.resolveArgsFromEnv();
    } else {
      this.command = process.execPath;
      this.args = options.args ?? [PHSPEC_BIN_PATH, "__ralph-exec"];
    }
  }

  async execute(input: RalphExecutionInput): Promise<RalphExecutionResult> {
    const payload = this.buildPayload(input);
    try {
      const output = await this.runProcess(payload);
      if (output.exitCode === 0) {
        return {
          kind: "success",
          message: output.stdout.trim() || "Ralph run succeeded.",
          rawOutput: output.combined,
        };
      }

      return this.classifyFailure(output.combined);
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

  private classifyFailure(output: string): RalphExecutionResult {
    const normalizedOutput = output || "Unknown Ralph failure.";
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
