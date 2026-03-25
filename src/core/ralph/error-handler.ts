import { EventEmitter } from "node:events";

export interface ErrorClassification {
  kind: "retryable_error" | "needs_input" | "fatal_error" | "success";
  message: string;
}

/**
 * 错误处理器，专门处理 devagent 相关的错误
 */
export class ErrorHandler extends EventEmitter {
  private readonly retryableErrorPatterns: RegExp[];
  private readonly needsInputPatterns: RegExp[];
  private readonly fatalErrorPatterns: RegExp[];

  constructor() {
    super();

    // 可重试的错误模式
    this.retryableErrorPatterns = [
      /429|rate limit|too many requests/i,
      /timed out|timeout|connection timeout/i,
      /econnreset|socket hang up|connection reset/i,
      /5\d\d server error/i,
      /network error|network timeout/i,
      /api error|api failed/i,
      /streaming error/i,
      /temporar/i,
      /service unavailable/i,
    ];

    // 需要人工输入的错误模式
    this.needsInputPatterns = [
      /need(s)? user input|needs clarification|manual decision|human input/i,
      /please clarify|please specify|please provide/i,
      /ambiguous|unclear|confusing/i,
      /need more information|need additional info/i,
      /请确认|需要确认|需要用户输入|请提供|需要更多信息/i,
      /clarify|specify|provide/i,
    ];

    // 致命错误模式
    this.fatalErrorPatterns = [
      /permission denied|access denied/i,
      /file not found|command not found/i,
      /invalid syntax|syntax error/i,
      /out of memory|memory error/i,
      /disk full|storage full/i,
      /configuration error|config error/i,
      /internal error|system error/i,
      /unauthorized|authentication failed/i,
    ];
  }

  /**
   * 分类错误
   */
  classifyError(output: string, exitCode?: number): ErrorClassification {
    const normalizedOutput = output.trim().toLowerCase();

    // 成功情况
    if (exitCode === 0 || this.isSuccessOutput(normalizedOutput)) {
      return {
        kind: "success",
        message: "执行成功",
      };
    }

    // 检查致命错误
    for (const pattern of this.fatalErrorPatterns) {
      if (pattern.test(normalizedOutput)) {
        return {
          kind: "fatal_error",
          message: this.extractErrorMessage(normalizedOutput, pattern),
        };
      }
    }

    // 检查需要人工输入的情况
    for (const pattern of this.needsInputPatterns) {
      if (pattern.test(normalizedOutput)) {
        return {
          kind: "needs_input",
          message: this.extractErrorMessage(normalizedOutput, pattern),
        };
      }
    }

    // 检查可重试的错误
    for (const pattern of this.retryableErrorPatterns) {
      if (pattern.test(normalizedOutput)) {
        return {
          kind: "retryable_error",
          message: this.extractErrorMessage(normalizedOutput, pattern),
        };
      }
    }

    // 默认为致命错误
    return {
      kind: "fatal_error",
      message: `未知错误: ${normalizedOutput.substring(0, 200)}${normalizedOutput.length > 200 ? "..." : ""}`,
    };
  }

  /**
   * 检查是否为成功输出
   */
  private isSuccessOutput(output: string): boolean {
    const successIndicators = [
      /success|completed|done|finished/i,
      /result:|output:/i,
      /^\s*.*\n\s*$/m, // 只有结果内容，没有错误信息
    ];

    return successIndicators.some(pattern => pattern.test(output));
  }

  /**
   * 提取错误消息
   */
  private extractErrorMessage(output: string, pattern: RegExp): string {
    // 尝试找到更具体的错误信息
    const errorPatterns = [
      /error:\s*(.+)/i,
      /exception:\s*(.+)/i,
      /failed:\s*(.+)/i,
      /problem:\s*(.+)/i,
      /issue:\s*(.+)/i,
    ];

    for (const errorPattern of errorPatterns) {
      const match = output.match(errorPattern);
      if (match) {
        return match[1].trim();
      }
    }

    // 如果没有找到具体的错误信息，返回模式匹配的部分
    const matchedText = output.match(pattern);
    if (matchedText) {
      return matchedText[0];
    }

    return pattern.source;
  }

  /**
   * 获取所有可重试的错误模式
   */
  getRetryableErrorPatterns(): RegExp[] {
    return [...this.retryableErrorPatterns];
  }

  /**
   * 获取所有需要人工输入的错误模式
   */
  getNeedsInputPatterns(): RegExp[] {
    return [...this.needsInputPatterns];
  }

  /**
   * 获取所有致命错误模式
   */
  getFatalErrorPatterns(): RegExp[] {
    return [...this.fatalErrorPatterns];
  }

  /**
   * 添加自定义错误模式
   */
  addCustomPatterns(options: {
    retryable?: RegExp[];
    needsInput?: RegExp[];
    fatal?: RegExp[];
  }): void {
    if (options.retryable) {
      this.retryableErrorPatterns.push(...options.retryable);
    }
    if (options.needsInput) {
      this.needsInputPatterns.push(...options.needsInput);
    }
    if (options.fatal) {
      this.fatalErrorPatterns.push(...options.fatal);
    }
  }

  /**
   * 检查输出是否包含特定类型的错误
   */
  hasErrorType(output: string, errorType: "retryable" | "needs_input" | "fatal"): boolean {
    const patterns = this.getPatternsByType(errorType);
    return patterns.some(pattern => pattern.test(output.toLowerCase()));
  }

  /**
   * 根据错误类型获取模式
   */
  private getPatternsByType(type: "retryable" | "needs_input" | "fatal"): RegExp[] {
    switch (type) {
      case "retryable":
        return this.retryableErrorPatterns;
      case "needs_input":
        return this.needsInputPatterns;
      case "fatal":
        return this.fatalErrorPatterns;
      default:
        return [];
    }
  }

  /**
   * 获取错误类型的描述
   */
  getErrorTypeDescription(kind: ErrorClassification["kind"]): string {
    switch (kind) {
      case "retryable_error":
        return "可重试错误 - 网络问题、速率限制等，可以重试";
      case "needs_input":
        return "需要人工输入 - 需要用户提供更多信息";
      case "fatal_error":
        return "致命错误 - 系统错误，无法自动恢复";
      case "success":
        return "执行成功";
    }
  }

  /**
   * 验证错误分类的准确性
   */
  validateClassification(output: string, expectedKind: ErrorClassification["kind"]): boolean {
    const classification = this.classifyError(output);
    return classification.kind === expectedKind;
  }

  /**
   * 获取错误统计信息
   */
  getErrorStats(output: string): {
    retryableCount: number;
    needsInputCount: number;
    fatalCount: number;
    totalCount: number;
  } {
    const text = output.toLowerCase();
    const retryableMatches = this.retryableErrorPatterns.filter(pattern => pattern.test(text)).length;
    const needsInputMatches = this.needsInputPatterns.filter(pattern => pattern.test(text)).length;
    const fatalMatches = this.fatalErrorPatterns.filter(pattern => pattern.test(text)).length;

    return {
      retryableCount: retryableMatches,
      needsInputCount: needsInputMatches,
      fatalCount: fatalMatches,
      totalCount: retryableMatches + needsInputMatches + fatalMatches,
    };
  }

  /**
   * 获取建议的重试策略
   */
  getSuggestedRetryStrategy(output: string): {
    shouldRetry: boolean;
    maxRetries?: number;
    backoffMultiplier?: number;
    message: string;
  } {
    const classification = this.classifyError(output);

    switch (classification.kind) {
      case "retryable_error":
        return {
          shouldRetry: true,
          maxRetries: 5,
          backoffMultiplier: 2,
          message: "建议重试，指数退避",
        };

      case "needs_input":
        return {
          shouldRetry: false,
          message: "需要人工输入，不应自动重试",
        };

      case "fatal_error":
        return {
          shouldRetry: false,
          message: "致命错误，不应重试",
        };

      case "success":
        return {
          shouldRetry: false,
          message: "执行成功，无需重试",
        };
    }
  }
}