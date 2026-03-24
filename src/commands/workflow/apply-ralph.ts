import path from "node:path";
import { generateApplyInstructions } from "./instructions.js";
import { validateChangeExists, validateSchemaExists } from "./shared.js";
import {
  RalphCliExecutor,
  RalphRunner,
  type RalphRunPolicy,
} from "../../core/ralph/index.js";

export interface ApplyRalphOptions {
  change?: string;
  schema?: string;
  json?: boolean;
  snapshot?: string;
  policy?: string;
  maxRetries?: string;
  backoffMs?: string;
  maxBackoffMs?: string;
  maxAttempts?: string;
  maxStagnantRounds?: string;
  maxRuntimeMinutes?: string;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function parseNonNegativeInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

function parsePolicy(value: string | undefined): RalphRunPolicy {
  if (value === "relentless") {
    return "relentless";
  }
  return "conservative";
}

export async function applyRalphCommand(
  options: ApplyRalphOptions,
): Promise<void> {
  const projectRoot = process.cwd();
  const changeName = await validateChangeExists(options.change, projectRoot);

  if (options.schema) {
    validateSchemaExists(options.schema, projectRoot);
  }

  const changeDir = path.join(projectRoot, "phspec", "changes", changeName);
  const snapshotPath =
    options.snapshot ?? path.join(changeDir, ".phspec-apply-ralph.json");
  const policy = parsePolicy(options.policy);

  const runner = new RalphRunner({
    executor: new RalphCliExecutor(),
    loadInstructions: () =>
      generateApplyInstructions(projectRoot, changeName, options.schema),
    snapshotPath,
    policy,
    maxRetries: parseNonNegativeInt(options.maxRetries, 8),
    initialBackoffMs: parsePositiveInt(options.backoffMs, 2000),
    maxBackoffMs: parsePositiveInt(options.maxBackoffMs, 30000),
    maxAttempts: parseNonNegativeInt(options.maxAttempts, 200),
    maxStagnantRounds: parsePositiveInt(options.maxStagnantRounds, 3),
    maxRuntimeMinutes: parsePositiveInt(options.maxRuntimeMinutes, 0),
  });

  const result = await runner.run();

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`## Apply Ralph: ${result.changeName}`);
  console.log();
  console.log(`状态：${result.status}`);
  console.log(`策略：${policy}`);
  console.log(`停止原因：${result.stopReason}`);
  console.log(`进度：${result.completedTasks}/${result.totalTasks}`);
  console.log(`尝试次数：${result.attempts}（重试 ${result.retries}）`);
  console.log(`快照：${snapshotPath}`);
  console.log();
  console.log(result.message);
}
