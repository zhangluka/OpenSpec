import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { EventEmitter } from "node:events";
import {
  RalphExecutionInput,
  RalphExecutionResult,
  RalphExecutor
} from "./types.js";
import { EnvironmentDetector } from "./environment-detector.js";
import { ErrorHandler } from "./error-handler.js";
import { Logger } from "./logger.js";

export interface DevAgentExecutorOptions {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  timeout?: number;
  maxRetries?: number;
}

/**
 * 专门的 devagent 执行器，参考 devAgentBatch 的成功模式
 */
export class DevAgentExecutor extends EventEmitter implements RalphExecutor {
  private readonly command: string;
  private readonly args: string[];
  private readonly env: Record<string, string>;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly logger: Logger;
  private readonly errorHandler: ErrorHandler;

  constructor(options: DevAgentExecutorOptions = {}) {
    super();

    // 使用环境检测器获取 devagent 配置
    const detector = new EnvironmentDetector();
    const detectedConfig = detector.detectDevAgent();

    this.command = options.command || detectedConfig.command;
    this.args = options.args || detectedConfig.args;
    this.env = {
      ...process.env,
      ...options.env,
      ...detectedConfig.env,
    };
    this.timeout = options.timeout || 300000; // 5分钟默认超时
    this.maxRetries = options.maxRetries || 3;
    this.logger = new Logger("DevAgentExecutor");
    this.errorHandler = new ErrorHandler();
  }

  async execute(input: RalphExecutionInput): Promise<RalphExecutionResult> {
    const executionId = this.generateExecutionId();
    this.logger.info(`开始执行 devagent 任务 [${executionId}]`, {
      changeName: input.changeName,
      task: input.task?.id,
      policy: input.policy,
    });

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt <= this.maxRetries) {
      attempt++;

      try {
        this.logger.debug(`执行尝试 ${attempt}/${this.maxRetries + 1}`, {
          executionId,
          command: this.command,
          args: this.args,
        });

        const result = await this.executeDevAgent(input, executionId);

        // 成功执行
        this.logger.info(`执行成功 [${executionId}]`, {
          executionId,
          attempt,
          resultKind: result.kind,
        });

        return result;

      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`执行失败 [${executionId}]`, {
          executionId,
          attempt,
          error: error instanceof Error ? error.message : String(error),
        });

        // 如果是最后一次尝试，返回错误结果
        if (attempt > this.maxRetries) {
          this.logger.error(`所有重试都失败 [${executionId}]`, {
            executionId,
            maxRetries: this.maxRetries,
            lastError: lastError?.message,
          });

          return {
            kind: "fatal_error",
            message: `DevAgent 执行失败: ${lastError?.message || "未知错误"}`,
            rawOutput: lastError?.stack || "",
          };
        }

        // 等待后重试
        const delay = this.calculateRetryDelay(attempt);
        this.logger.info(`等待 ${delay}ms 后重试...`, { executionId, delay });
        await this.sleep(delay);
      }
    }

    // 这行代码理论上不会执行到，但为了类型安全
    return {
      kind: "fatal_error",
      message: "未知执行错误",
      rawOutput: "",
    };
  }

  /**
   * 执行 devagent 命令
   */
  private async executeDevAgent(
    input: RalphExecutionInput,
    executionId: string
  ): Promise<RalphExecutionResult> {
    return new Promise((resolve, reject) => {
      // 构建 prompt
      const prompt = this.buildPrompt(input);

      this.logger.debug("构建的 prompt:", {
        executionId,
        prompt: prompt.substring(0, 200) + (prompt.length > 200 ? "..." : ""),
      });

      // 启动 devagent 进程
      const child = spawn(this.command, this.args, {
        env: this.env,
        stdio: ["pipe", "pipe", "pipe"],
        timeout: this.timeout,
      });

      let stdout = "";
      let stderr = "";
      let isResolved = false;

      // 处理 stdout 数据
      child.stdout.on("data", (chunk) => {
        const data = chunk.toString();
        stdout += data;

        // 实时输出到控制台
        process.stdout.write(data);

        // 检查是否需要人工干预
        this.checkForNeedsInput(data, resolve);
      });

      // 处理 stderr 数据
      child.stderr.on("data", (chunk) => {
        const data = chunk.toString();
        stderr += data;

        // 实时输出到控制台
        process.stderr.write(data);
      });

      // 处理进程错误
      child.on("error", (error) => {
        if (!isResolved) {
          isResolved = true;
          reject(new Error(`DevAgent 进程错误: ${error.message}`));
        }
      });

      // 处理超时
      child.on("timeout", () => {
        if (!isResolved) {
          isResolved = true;
          child.kill();
          reject(new Error(`DevAgent 执行超时 (${this.timeout}ms)`));
        }
      });

      // 处理进程关闭
      child.on("close", (exitCode) => {
        if (!isResolved) {
          isResolved = true;
          this.handleProcessClose(exitCode, stdout, stderr, resolve);
        }
      });

      // 写入 prompt 并结束输入
      child.stdin.write(prompt);
      child.stdin.end();
    });
  }

  /**
   * 构建 devagent prompt
   */
  private buildPrompt(input: RalphExecutionInput): string {
    const { changeName, instructions, task, policy } = input;

    // 基础 prompt
    let prompt = `## PhSpec Apply 任务\n`;
    prompt += `\n`;
    prompt += `**变更名称**: ${changeName}\n`;
    prompt += `**执行策略**: ${policy}\n`;
    prompt += `\n`;
    prompt += `### 任务指令\n`;
    prompt += `${instructions.instruction}\n`;

    // 添加任务信息
    if (task) {
      prompt += `\n`;
      prompt += `### 当前任务\n`;
      prompt += `**任务ID**: ${task.id}\n`;
      prompt += `**任务描述**: ${task.description}\n`;
    }

    // 添加上下文文件
    if (instructions.contextFiles && Object.keys(instructions.contextFiles).length > 0) {
      prompt += `\n`;
      prompt += `### 上下文文件\n`;
      for (const [fileName, content] of Object.entries(instructions.contextFiles)) {
        prompt += `\n\`\`\`${fileName}\n`;
        prompt += content.substring(0, 1000) + (content.length > 1000 ? "...(截断)" : "");
        prompt += `\n\`\`\`\n`;
      }
    }

    // 添加进度信息
    if (instructions.progress) {
      prompt += `\n`;
      prompt += `### 进度信息\n`;
      prompt += `已完成: ${instructions.progress.complete}/${instructions.progress.total}\n`;
    }

    prompt += `\n`;
    prompt += `请执行上述任务并返回结果。如果需要更多信息，请明确询问。`;

    return prompt;
  }

  /**
   * 检查是否需要人工干预
   */
  private checkForNeedsInput(data: string, resolve: (result: RalphExecutionResult) => void): void {
    const needsInputPatterns = [
      "need user input",
      "needs clarification",
      "manual decision",
      "human input",
      "请确认",
      "需要确认",
      "需要用户输入",
      "请提供",
      "需要更多信息",
    ];

    const lowerData = data.toLowerCase();
    for (const pattern of needsInputPatterns) {
      if (lowerData.includes(pattern)) {
        this.logger.info("检测到需要人工干预", {
          pattern,
          data: data.substring(0, 200),
        });

        resolve({
          kind: "needs_input",
          message: `需要人工干预: ${data.trim()}`,
          rawOutput: data,
        });
        return;
      }
    }
  }

  /**
   * 处理进程关闭
   */
  private handleProcessClose(
    exitCode: number | null,
    stdout: string,
    stderr: string,
    resolve: (result: RalphExecutionResult) => void
  ): void {
    const combined = [stdout, stderr].filter(Boolean).join("\n").trim();

    this.logger.debug("进程执行完成", {
      exitCode,
      stdoutLength: stdout.length,
      stderrLength: stderr.length,
    });

    // 分类错误类型
    const errorType = this.errorHandler.classifyError(combined, exitCode);

    switch (errorType.kind) {
      case "retryable_error":
        this.logger.warn("检测到可重试错误", {
          errorType: errorType.message,
          exitCode,
        });
        throw new Error(`可重试错误: ${errorType.message}`);

      case "needs_input":
        this.logger.info("需要人工输入", {
          errorType: errorType.message,
        });
        resolve({
          kind: "needs_input",
          message: errorType.message,
          rawOutput: combined,
        });
        break;

      case "fatal_error":
        this.logger.error("检测到致命错误", {
          errorType: errorType.message,
          exitCode,
        });
        resolve({
          kind: "fatal_error",
          message: errorType.message,
          rawOutput: combined,
        });
        break;

      case "success":
        this.logger.info("执行成功", { exitCode });
        resolve({
          kind: "success",
          message: "DevAgent 执行成功",
          rawOutput: combined,
        });
        break;
    }
  }

  /**
   * 生成执行 ID
   */
  private generateExecutionId(): string {
    return `devagent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 计算重试延迟
   */
  private calculateRetryDelay(attempt: number): number {
    // 指数退避: 1s, 2s, 4s, 8s...
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000); // 最大30秒
  }

  /**
   * 睡眠函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}