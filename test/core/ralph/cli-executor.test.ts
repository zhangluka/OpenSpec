import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("RalphCliExecutor default command resolution", () => {
  const originalArgv1 = process.argv[1];
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.PHSPEC_RALPH_COMMAND;
    delete process.env.PHSPEC_RALPH_ARGS;
  });

  afterEach(() => {
    process.argv[1] = originalArgv1;
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("uses process.execPath + __ralph-exec when no env override", async () => {
    const { RalphCliExecutor } = await import(
      "../../../src/core/ralph/cli-executor.js"
    );
    const executor = new RalphCliExecutor();
    expect((executor as any).command).toBe(process.execPath);
    expect((executor as any).args).toContain("__ralph-exec");
  });

  it("uses PHSPEC_RALPH_COMMAND when set", async () => {
    process.env.PHSPEC_RALPH_COMMAND = "/usr/bin/my-ralph";
    const { RalphCliExecutor } = await import(
      "../../../src/core/ralph/cli-executor.js"
    );
    const executor = new RalphCliExecutor();
    expect((executor as any).command).toBe("/usr/bin/my-ralph");
  });

  it("uses explicit options.command over everything", async () => {
    process.env.PHSPEC_RALPH_COMMAND = "/usr/bin/my-ralph";
    const { RalphCliExecutor } = await import(
      "../../../src/core/ralph/cli-executor.js"
    );
    const executor = new RalphCliExecutor({ command: "/custom/exec" });
    expect((executor as any).command).toBe("/custom/exec");
    expect((executor as any).args).toEqual([]);
  });

  it("builds payload with policy and tracking metadata", async () => {
    const { RalphCliExecutor } = await import(
      "../../../src/core/ralph/cli-executor.js"
    );
    const executor = new RalphCliExecutor();
    const payloadRaw = (executor as any).buildPayload({
      changeName: "demo-change",
      policy: "relentless",
      instructions: {
        changeName: "demo-change",
        changeDir: "/tmp/demo-change",
        schemaName: "lean-sdd",
        tracksFile: "/tmp/demo-change/tasks.md",
        contextFiles: {},
        progress: { total: 1, complete: 0, remaining: 1 },
        tasks: [{ id: "1", description: "task", done: false }],
        state: "ready",
        instruction: "run task",
      },
      task: { id: "1", description: "task", done: false },
    });
    const payload = JSON.parse(payloadRaw);
    expect(payload.policy).toBe("relentless");
    expect(payload.changeDir).toBe("/tmp/demo-change");
    expect(payload.tracksFile).toBe("/tmp/demo-change/tasks.md");
  });

  it("classifies by exit code before keyword regex", async () => {
    const { RalphCliExecutor } = await import(
      "../../../src/core/ralph/cli-executor.js"
    );
    const executor = new RalphCliExecutor();
    const byCodeNeedsInput = (executor as any).classifyFailure("unknown", 2);
    const byCodeRetryable = (executor as any).classifyFailure("unknown", 3);
    expect(byCodeNeedsInput.kind).toBe("needs_input");
    expect(byCodeRetryable.kind).toBe("retryable_error");
  });
});
