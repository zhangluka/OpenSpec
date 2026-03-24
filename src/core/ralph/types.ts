export interface RalphTaskItem {
  id: string;
  description: string;
  done: boolean;
}

export interface RalphApplyInstructions {
  changeName: string;
  schemaName: string;
  contextFiles: Record<string, string>;
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
}

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
  retries: number;
  attempts: number;
  lastError?: string;
  lastCompletedCount: number;
  lastTaskId?: string;
}

export interface RalphRunSummary {
  changeName: string;
  status: "completed" | "blocked" | "failed";
  attempts: number;
  retries: number;
  completedTasks: number;
  totalTasks: number;
  message: string;
}
