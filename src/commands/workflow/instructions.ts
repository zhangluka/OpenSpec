/**
 * Instructions Command
 *
 * Generates enriched instructions for creating artifacts or applying tasks.
 * Includes both artifact instructions and apply instructions.
 */

import ora from "ora";
import path from "path";
import * as fs from "fs";
import {
  loadChangeContext,
  generateInstructions,
  resolveSchema,
  type ArtifactInstructions,
} from "../../core/artifact-graph/index.js";
import {
  validateChangeExists,
  validateSchemaExists,
  type TaskItem,
  type ApplyInstructions,
} from "./shared.js";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface InstructionsOptions {
  change?: string;
  schema?: string;
  json?: boolean;
}

export interface ApplyInstructionsOptions {
  change?: string;
  schema?: string;
  json?: boolean;
}

// -----------------------------------------------------------------------------
// Artifact Instructions Command
// -----------------------------------------------------------------------------

export async function instructionsCommand(
  artifactId: string | undefined,
  options: InstructionsOptions,
): Promise<void> {
  const spinner = ora("正在生成指令...").start();

  try {
    const projectRoot = process.cwd();
    const changeName = await validateChangeExists(options.change, projectRoot);

    // Validate schema if explicitly provided
    if (options.schema) {
      validateSchemaExists(options.schema, projectRoot);
    }

    // loadChangeContext will auto-detect schema from metadata if not provided
    const context = loadChangeContext(projectRoot, changeName, options.schema);

    if (!artifactId) {
      spinner.stop();
      const validIds = context.graph.getAllArtifacts().map((a) => a.id);
      throw new Error(
        `缺少必填参数 <artifact>。有效制品：\n  ${validIds.join("\n  ")}`,
      );
    }

    const artifact = context.graph.getArtifact(artifactId);

    if (!artifact) {
      spinner.stop();
      const validIds = context.graph.getAllArtifacts().map((a) => a.id);
      throw new Error(
        `工作流模式 '${context.schemaName}' 中未找到制品 '${artifactId}'。有效制品：\n  ${validIds.join("\n  ")}`,
      );
    }

    const instructions = generateInstructions(context, artifactId, projectRoot);
    const isBlocked = instructions.dependencies.some((d) => !d.done);

    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(instructions, null, 2));
      return;
    }

    printInstructionsText(instructions, isBlocked);
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

export function printInstructionsText(
  instructions: ArtifactInstructions,
  isBlocked: boolean,
): void {
  const {
    artifactId,
    changeName,
    schemaName,
    changeDir,
    outputPath,
    description,
    instruction,
    context,
    rules,
    template,
    dependencies,
    unlocks,
  } = instructions;

  // Opening tag
  console.log(
    `<artifact id="${artifactId}" change="${changeName}" schema="${schemaName}">`,
  );
  console.log();

  // Warning for blocked artifacts
  if (isBlocked) {
    const missing = dependencies.filter((d) => !d.done).map((d) => d.id);
    console.log("<warning>");
    console.log("该制品存在未满足的依赖，请先完成依赖或谨慎继续。");
    console.log(`缺失：${missing.join(", ")}`);
    console.log("</warning>");
    console.log();
  }

  // Task directive
  console.log("<task>");
  console.log(`为变更 "${changeName}" 创建制品 ${artifactId}。`);
  console.log(description);
  console.log("</task>");
  console.log();

  // Project context (AI constraint - do not include in output)
  if (context) {
    console.log("<project_context>");
    console.log("<!-- 以下为背景信息，请勿写入你的输出。 -->");
    console.log(context);
    console.log("</project_context>");
    console.log();
  }

  // Rules (AI constraint - do not include in output)
  if (rules && rules.length > 0) {
    console.log("<rules>");
    console.log("<!-- 以下为须遵守的约束，请勿写入你的输出。 -->");
    for (const rule of rules) {
      console.log(`- ${rule}`);
    }
    console.log("</rules>");
    console.log();
  }

  // Dependencies (files to read for context)
  if (dependencies.length > 0) {
    console.log("<dependencies>");
    console.log("创建该制品前请先阅读以下文件：");
    console.log();
    for (const dep of dependencies) {
      const status = dep.done ? "done" : "missing";
      const fullPath = path.join(changeDir, dep.path);
      console.log(`<dependency id="${dep.id}" status="${status}">`);
      console.log(`  <path>${fullPath}</path>`);
      console.log(`  <description>${dep.description}</description>`);
      console.log("</dependency>");
    }
    console.log("</dependencies>");
    console.log();
  }

  // Output location
  console.log("<output>");
  console.log(`写入路径：${path.join(changeDir, outputPath)}`);
  console.log("</output>");
  console.log();

  // Instruction (guidance)
  if (instruction) {
    console.log("<instruction>");
    console.log(instruction.trim());
    console.log("</instruction>");
    console.log();
  }

  // Template
  console.log("<template>");
  console.log("<!-- 按此结构填写输出文件。 -->");
  console.log(template.trim());
  console.log("</template>");
  console.log();

  // Success criteria placeholder
  console.log("<success_criteria>");
  console.log("<!-- 由工作流模式校验规则定义 -->");
  console.log("</success_criteria>");
  console.log();

  // Unlocks
  if (unlocks.length > 0) {
    console.log("<unlocks>");
    console.log(`完成该制品后可进行：${unlocks.join(", ")}`);
    console.log("</unlocks>");
    console.log();
  }

  // Closing tag
  console.log("</artifact>");
}

// -----------------------------------------------------------------------------
// Apply Instructions Command
// -----------------------------------------------------------------------------

/**
 * Parses tasks.md content and extracts task items with their completion status.
 */
function parseTasksFile(content: string): TaskItem[] {
  const tasks: TaskItem[] = [];
  const lines = content.split("\n");
  let taskIndex = 0;

  for (const line of lines) {
    // Match checkbox patterns: - [ ] or - [x] or - [X]
    const checkboxMatch = line.match(/^[-*]\s*\[([ xX])\]\s*(.+)\s*$/);
    if (checkboxMatch) {
      taskIndex++;
      const done = checkboxMatch[1].toLowerCase() === "x";
      const description = checkboxMatch[2].trim();
      tasks.push({
        id: `${taskIndex}`,
        description,
        done,
      });
    }
  }

  return tasks;
}

/**
 * Checks if an artifact output exists in the change directory.
 * Supports glob patterns (e.g., "specs/*.md") by verifying at least one matching file exists.
 */
function artifactOutputExists(changeDir: string, generates: string): boolean {
  // Normalize the generates path to use platform-specific separators
  const normalizedGenerates = generates.split("/").join(path.sep);
  const fullPath = path.join(changeDir, normalizedGenerates);

  // If it's a glob pattern (contains ** or *), check for matching files
  if (generates.includes("*")) {
    // Extract the directory part before the glob pattern
    const parts = normalizedGenerates.split(path.sep);
    const dirParts: string[] = [];
    let patternPart = "";
    for (const part of parts) {
      if (part.includes("*")) {
        patternPart = part;
        break;
      }
      dirParts.push(part);
    }
    const dirPath = path.join(changeDir, ...dirParts);

    // Check if directory exists
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return false;
    }

    // Extract expected extension from pattern (e.g., "*.md" -> ".md")
    const extMatch = patternPart.match(/\*(\.[a-zA-Z0-9]+)$/);
    const expectedExt = extMatch ? extMatch[1] : null;

    // Recursively check for matching files
    const hasMatchingFiles = (dir: string): boolean => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            // For ** patterns, recurse into subdirectories
            if (
              generates.includes("**") &&
              hasMatchingFiles(path.join(dir, entry.name))
            ) {
              return true;
            }
          } else if (entry.isFile()) {
            // Check if file matches expected extension (or any file if no extension specified)
            if (!expectedExt || entry.name.endsWith(expectedExt)) {
              return true;
            }
          }
        }
      } catch {
        return false;
      }
      return false;
    };

    return hasMatchingFiles(dirPath);
  }

  return fs.existsSync(fullPath);
}

/**
 * Generates apply instructions for implementing tasks from a change.
 * Schema-aware: reads apply phase configuration from schema to determine
 * required artifacts, tracking file, and instruction.
 */
export async function generateApplyInstructions(
  projectRoot: string,
  changeName: string,
  schemaName?: string,
): Promise<ApplyInstructions> {
  // loadChangeContext will auto-detect schema from metadata if not provided
  const context = loadChangeContext(projectRoot, changeName, schemaName);
  const changeDir = path.join(projectRoot, "openspec", "changes", changeName);

  // Get the full schema to access the apply phase configuration
  const schema = resolveSchema(context.schemaName, projectRoot);
  const applyConfig = schema.apply;

  // Determine required artifacts and tracking file from schema
  // Fallback: if no apply block, require all artifacts
  const requiredArtifactIds =
    applyConfig?.requires ?? schema.artifacts.map((a) => a.id);
  const tracksFile = applyConfig?.tracks ?? null;
  const schemaInstruction = applyConfig?.instruction ?? null;

  // Check which required artifacts are missing
  const missingArtifacts: string[] = [];
  for (const artifactId of requiredArtifactIds) {
    const artifact = schema.artifacts.find((a) => a.id === artifactId);
    if (artifact && !artifactOutputExists(changeDir, artifact.generates)) {
      missingArtifacts.push(artifactId);
    }
  }

  // Build context files from all existing artifacts in schema
  const contextFiles: Record<string, string> = {};
  for (const artifact of schema.artifacts) {
    if (artifactOutputExists(changeDir, artifact.generates)) {
      contextFiles[artifact.id] = path.join(changeDir, artifact.generates);
    }
  }

  // Parse tasks if tracking file exists
  let tasks: TaskItem[] = [];
  let tracksFileExists = false;
  if (tracksFile) {
    const tracksPath = path.join(changeDir, tracksFile);
    tracksFileExists = fs.existsSync(tracksPath);
    if (tracksFileExists) {
      const tasksContent = await fs.promises.readFile(tracksPath, "utf-8");
      tasks = parseTasksFile(tasksContent);
    }
  }

  // Calculate progress
  const total = tasks.length;
  const complete = tasks.filter((t) => t.done).length;
  const remaining = total - complete;

  // Determine state and instruction
  let state: ApplyInstructions["state"];
  let instruction: string;

  if (missingArtifacts.length > 0) {
    state = "blocked";
    instruction = `Cannot apply this change yet. Missing artifacts: ${missingArtifacts.join(", ")}.\nUse the openspec-continue-change skill to create the missing artifacts first.`;
  } else if (tracksFile && !tracksFileExists) {
    // Tracking file configured but doesn't exist yet
    const tracksFilename = path.basename(tracksFile);
    state = "blocked";
    instruction = `缺少 ${tracksFilename} 文件，需先创建。\n请使用 openspec-continue-change 生成跟踪文件。`;
  } else if (tracksFile && tracksFileExists && total === 0) {
    // Tracking file exists but contains no tasks
    const tracksFilename = path.basename(tracksFile);
    state = "blocked";
    instruction = `文件 ${tracksFilename} 存在但无任务。\n请在 ${tracksFilename} 中添加任务，或使用 openspec-continue-change 重新生成。`;
  } else if (tracksFile && remaining === 0 && total > 0) {
    state = "all_done";
    instruction =
      "全部任务已完成！该变更可以归档。\n归档前建议运行测试并检查改动。";
  } else if (!tracksFile) {
    // No tracking file configured in schema - ready to apply
    state = "ready";
    instruction = schemaInstruction?.trim() ?? "所需制品均已就绪，可开始实施。";
  } else {
    state = "ready";
    instruction =
      schemaInstruction?.trim() ??
      "阅读上下文文件，按未完成任务逐项执行并勾选完成。\n若遇阻塞或需澄清请先暂停。";
  }

  return {
    changeName,
    changeDir,
    schemaName: context.schemaName,
    contextFiles,
    progress: { total, complete, remaining },
    tasks,
    state,
    missingArtifacts:
      missingArtifacts.length > 0 ? missingArtifacts : undefined,
    instruction,
  };
}

export async function applyInstructionsCommand(
  options: ApplyInstructionsOptions,
): Promise<void> {
  const spinner = ora("正在生成 apply 指令...").start();

  try {
    const projectRoot = process.cwd();
    const changeName = await validateChangeExists(options.change, projectRoot);

    // Validate schema if explicitly provided
    if (options.schema) {
      validateSchemaExists(options.schema, projectRoot);
    }

    // generateApplyInstructions uses loadChangeContext which auto-detects schema
    const instructions = await generateApplyInstructions(
      projectRoot,
      changeName,
      options.schema,
    );

    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(instructions, null, 2));
      return;
    }

    printApplyInstructionsText(instructions);
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

export function printApplyInstructionsText(
  instructions: ApplyInstructions,
): void {
  const {
    changeName,
    schemaName,
    contextFiles,
    progress,
    tasks,
    state,
    missingArtifacts,
    instruction,
  } = instructions;

  console.log(`## Apply: ${changeName}`);
  console.log(`工作流模式：${schemaName}`);
  console.log();

  // Warning for blocked state
  if (state === "blocked" && missingArtifacts) {
    console.log("### ⚠️ 受阻");
    console.log();
    console.log(`缺失制品：${missingArtifacts.join(", ")}`);
    console.log("请先用 openspec-continue-change 技能创建上述制品。");
    console.log();
  }

  // Context files (dynamically from schema)
  const contextFileEntries = Object.entries(contextFiles);
  if (contextFileEntries.length > 0) {
    console.log("### 上下文文件");
    for (const [artifactId, filePath] of contextFileEntries) {
      console.log(`- ${artifactId}: ${filePath}`);
    }
    console.log();
  }

  // Progress (only show if we have tracking)
  if (progress.total > 0 || tasks.length > 0) {
    console.log("### 进度");
    if (state === "all_done") {
      console.log(`${progress.complete}/${progress.total} 已完成 ✓`);
    } else {
      console.log(`${progress.complete}/${progress.total} 已完成`);
    }
    console.log();
  }

  // Tasks
  if (tasks.length > 0) {
    console.log("### 任务");
    for (const task of tasks) {
      const checkbox = task.done ? "[x]" : "[ ]";
      console.log(`- ${checkbox} ${task.description}`);
    }
    console.log();
  }

  // Instruction
  console.log("### 指令");
  console.log(instruction);
}
