import { describe, it, expect, vi } from "vitest";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { RalphRunner } from "../../../src/core/ralph/runner.js";
import {
  RalphApplyInstructions,
  RalphExecutionResult,
  RalphExecutor,
} from "../../../src/core/ralph/types.js";

class SequenceExecutor implements RalphExecutor {
  private readonly results: RalphExecutionResult[];
  private index = 0;

  constructor(results: RalphExecutionResult[]) {
    this.results = results;
  }

  async execute(): Promise<RalphExecutionResult> {
    const next = this.results[this.index] ?? this.results[this.results.length - 1];
    this.index += 1;
    return next;
  }
}

function buildInstructions(
  overrides: Partial<RalphApplyInstructions>,
): RalphApplyInstructions {
  return {
    changeName: "test-change",
    schemaName: "lean-sdd",
    contextFiles: {},
    progress: {
      total: 1,
      complete: 0,
      remaining: 1,
    },
    tasks: [{ id: "1", description: "task", done: false }],
    state: "ready",
    instruction: "do work",
    ...overrides,
  };
}

describe("RalphRunner", () => {
  it("retries on retryable errors and completes", async () => {
    const snapshotPath = path.join(
      os.tmpdir(),
      `phspec-ralph-runner-${Date.now()}-1.json`,
    );

    const instructionsSequence: RalphApplyInstructions[] = [
      buildInstructions({ state: "ready" }),
      buildInstructions({ state: "ready" }),
      buildInstructions({
        state: "all_done",
        progress: { total: 1, complete: 1, remaining: 0 },
        tasks: [{ id: "1", description: "task", done: true }],
      }),
    ];
    let readIndex = 0;

    const runner = new RalphRunner({
      executor: new SequenceExecutor([
        { kind: "retryable_error", message: "429 rate limit" },
        { kind: "success", message: "ok" },
      ]),
      loadInstructions: async () =>
        instructionsSequence[Math.min(readIndex++, instructionsSequence.length - 1)],
      snapshotPath,
      sleep: async () => {},
      maxRetries: 3,
    });

    const result = await runner.run();
    expect(result.status).toBe("completed");
    expect(result.stopReason).toBe("completed");
    expect(result.retries).toBe(1);
    expect(result.completedTasks).toBe(1);

    const snapshotRaw = await fs.readFile(snapshotPath, "utf-8");
    const snapshot = JSON.parse(snapshotRaw) as { retries: number; attempts: number };
    expect(snapshot.attempts).toBeGreaterThan(0);
  });

  it("returns blocked when executor needs input", async () => {
    const snapshotPath = path.join(
      os.tmpdir(),
      `phspec-ralph-runner-${Date.now()}-2.json`,
    );

    const runner = new RalphRunner({
      executor: new SequenceExecutor([
        { kind: "needs_input", message: "Need user input for ambiguous task" },
      ]),
      loadInstructions: async () => buildInstructions({ state: "ready" }),
      snapshotPath,
      sleep: async () => {},
    });

    const result = await runner.run();
    expect(result.status).toBe("blocked");
    expect(result.stopReason).toBe("needs_input");
    expect(result.message).toContain("Need user input");
  });

  it("fails when retry limit is exceeded", async () => {
    const snapshotPath = path.join(
      os.tmpdir(),
      `phspec-ralph-runner-${Date.now()}-3.json`,
    );

    const runner = new RalphRunner({
      executor: new SequenceExecutor([
        { kind: "retryable_error", message: "timeout" },
        { kind: "retryable_error", message: "timeout" },
      ]),
      loadInstructions: async () => buildInstructions({ state: "ready" }),
      snapshotPath,
      sleep: async () => {},
      maxRetries: 1,
    });

    const result = await runner.run();
    expect(result.status).toBe("failed");
    expect(result.stopReason).toBe("retry_limit");
    expect(result.message).toContain("Retry limit reached");
  });

  it("keeps running on needs_input/fatal_error in relentless mode", async () => {
    const snapshotPath = path.join(
      os.tmpdir(),
      `phspec-ralph-runner-${Date.now()}-4.json`,
    );

    const instructionsSequence: RalphApplyInstructions[] = [
      buildInstructions({ state: "ready" }),
      buildInstructions({ state: "ready" }),
      buildInstructions({ state: "ready" }),
      buildInstructions({
        state: "all_done",
        progress: { total: 1, complete: 1, remaining: 0 },
        tasks: [{ id: "1", description: "task", done: true }],
      }),
    ];
    let readIndex = 0;

    const runner = new RalphRunner({
      executor: new SequenceExecutor([
        { kind: "needs_input", message: "needs clarification" },
        { kind: "fatal_error", message: "unexpected failure" },
        { kind: "success", message: "ok" },
      ]),
      loadInstructions: async () =>
        instructionsSequence[Math.min(readIndex++, instructionsSequence.length - 1)],
      snapshotPath,
      sleep: async () => {},
      policy: "relentless",
      maxRetries: 0,
      maxAttempts: 0,
    });

    const result = await runner.run();
    expect(result.status).toBe("completed");
    expect(result.stopReason).toBe("completed");
  });

  it("stops with runtime budget reason when time limit reached", async () => {
    const snapshotPath = path.join(
      os.tmpdir(),
      `phspec-ralph-runner-${Date.now()}-5.json`,
    );

    const nowSpy = vi
      .spyOn(Date, "now")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(61_000);

    const runner = new RalphRunner({
      executor: new SequenceExecutor([{ kind: "success", message: "ok" }]),
      loadInstructions: async () => buildInstructions({ state: "ready" }),
      snapshotPath,
      maxRuntimeMinutes: 1,
      sleep: async () => {},
    });

    const result = await runner.run();
    expect(result.status).toBe("failed");
    expect(result.stopReason).toBe("runtime_budget");
    nowSpy.mockRestore();
  });
});
