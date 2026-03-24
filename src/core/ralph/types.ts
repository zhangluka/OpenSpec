export interface RalphTaskItem {
  id: string;
  description: string;
  done: boolean;
}

export interface RalphApplyInstructions {
  changeName: string;
  changeDir?: string;
  schemaName: string;
  contextFiles: Record<string, string>;
  tracksFile?: string;
  progress: {
    total: number;
    complete: number;
    remaining: number;
  };
  tasks: RalphTaskItem[];
  state: "blocked" | "all_done" | "ready";
  missingArtifacts?: string[];
  instruction: string;
}

export interface RalphExecutionInput {
  changeName: string;
  instructions: RalphApplyInstructions;
  task: RalphTaskItem | null;
  policy: RalphRunPolicy;
}

export type RalphRunPolicy = "conservative" | "relentless";

export type RalphExecutionResultKind =
  | "success"
  | "retryable_error"
  | "fatal_error"
  | "needs_input";

export interface RalphExecutionResult {
  kind: RalphExecutionResultKind;
  message: string;
  rawOutput?: string;
}

export interface RalphExecutor {
  execute(input: RalphExecutionInput): Promise<RalphExecutionResult>;
}

export interface RalphSnapshot {
  updatedAt: string;
  policy?: RalphRunPolicy;
  retries: number;
  attempts: number;
  lastError?: string;
  lastCompletedCount: number;
  lastTaskId?: string;
  sameErrorCount?: number;
  lastErrorFingerprint?: string;
  lastProgressAt?: string;
}

export interface RalphRunSummary {
  changeName: string;
  status: "completed" | "blocked" | "failed";
  stopReason:
    | "completed"
    | "blocked"
    | "fatal_error"
    | "needs_input"
    | "stagnant"
    | "retry_limit"
    | "attempt_limit"
    | "runtime_budget";
  attempts: number;
  retries: number;
  completedTasks: number;
  totalTasks: number;
  message: string;
}
