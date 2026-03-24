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
});
