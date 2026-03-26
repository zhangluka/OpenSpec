import path from "node:path";
import { promises as fs, statSync, accessSync, readFileSync, appendFileSync, renameSync, unlinkSync, mkdirSync, readdirSync } from "node:fs";

export interface LoggerOptions {
  name: string;
  level?: "debug" | "info" | "warn" | "error";
  console?: boolean;
  file?: {
    enabled: boolean;
    path?: string;
    maxSize?: number;
    rotate?: boolean;
  };
}

export interface LogEntry {
  timestamp: string;
  level: string;
  name: string;
  message: string;
  meta?: any;
}

/**
 * 多级别日志记录器，支持控制台和文件输出
 */
export class Logger {
  private readonly name: string;
  private level: "debug" | "info" | "warn" | "error";
  private consoleEnabled: boolean;
  private fileEnabled: boolean;
  private readonly filePath?: string;
  private readonly maxSize?: number;
  private readonly rotateEnabled: boolean;

  private static readonly LEVEL_ORDER = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(options: LoggerOptions) {
    this.name = options.name;
    this.level = options.level || "info";
    this.consoleEnabled = options.console !== false;
    this.fileEnabled = options.file?.enabled ?? false;
    this.filePath = options.file?.path;
    this.maxSize = options.file?.maxSize;
    this.rotateEnabled = options.file?.rotate ?? true;
  }

  /**
   * 记录 debug 级别日志
   */
  debug(message: string, meta?: any): void {
    this.log("debug", message, meta);
  }

  /**
   * 记录 info 级别日志
   */
  info(message: string, meta?: any): void {
    this.log("info", message, meta);
  }

  /**
   * 记录 warn 级别日志
   */
  warn(message: string, meta?: any): void {
    this.log("warn", message, meta);
  }

  /**
   * 记录 error 级别日志
   */
  error(message: string, meta?: any): void {
    this.log("error", message, meta);
  }

  /**
   * 记录结构化日志
   */
  log(level: string, message: string, meta?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      name: this.name,
      message,
      meta,
    };

    // 控制台输出
    if (this.consoleEnabled) {
      this.outputToConsole(entry);
    }

    // 文件输出
    if (this.fileEnabled && this.filePath) {
      this.outputToFile(entry);
    }
  }

  /**
   * 检查是否应该记录该级别的日志
   */
  private shouldLog(level: string): boolean {
    const currentLevel = Logger.LEVEL_ORDER[this.level as keyof typeof Logger.LEVEL_ORDER];
    const targetLevel = Logger.LEVEL_ORDER[level as keyof typeof Logger.LEVEL_ORDER];
    return targetLevel >= (currentLevel ?? 0);
  }

  /**
   * 输出到控制台
   */
  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const name = entry.name.padEnd(20);
    const message = entry.message;

    const logLine = `[${timestamp}] [${level}] [${name}] ${message}`;

    switch (entry.level) {
      case "debug":
        console.debug(logLine, entry.meta);
        break;
      case "info":
        console.info(logLine, entry.meta);
        break;
      case "warn":
        console.warn(logLine, entry.meta);
        break;
      case "error":
        console.error(logLine, entry.meta);
        break;
    }
  }

  /**
   * 输出到文件
   */
  private async outputToFile(entry: LogEntry): Promise<void> {
    try {
      // 检查文件大小并轮转
      if (this.shouldRotateFile()) {
        await this.rotateLogFile();
      }

      const logLine = this.formatLogEntry(entry);
      await fs.appendFile(this.filePath!, logLine + "\n");
    } catch (error) {
      // 日志写入失败不应该影响主程序
      console.error(`[ERROR][Logger] Failed to write to log file:`, error);
    }
  }

  /**
   * 格式化日志条目
   */
  private formatLogEntry(entry: LogEntry): string {
    let formatted = `${entry.timestamp} [${entry.level.toUpperCase()}] [${entry.name}] ${entry.message}`;

    if (entry.meta && Object.keys(entry.meta).length > 0) {
      formatted += ` ${JSON.stringify(entry.meta)}`;
    }

    return formatted;
  }

  /**
   * 检查是否应该轮转日志文件
   */
  private shouldRotateFile(): boolean {
    if (!this.rotateEnabled || !this.maxSize) {
      return false;
    }

    try {
      if (this.fileExists()) {
        const stats = statSync(this.filePath!);
        return stats.size >= this.maxSize;
      }
    } catch {
      // 文件不存在或无法访问，不需要轮转
    }

    return false;
  }

  /**
   * 轮转日志文件
   */
  private async rotateLogFile(): Promise<void> {
    if (!this.filePath) {
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = `${this.filePath}.${timestamp}`;

    try {
      // 重命名当前日志文件
      renameSync(this.filePath, backupPath);
      this.info("日志文件已轮转", { from: this.filePath, to: backupPath });
    } catch (error) {
      console.error(`[ERROR][Logger] Failed to rotate log file:`, error);
    }
  }

  /**
   * 检查文件是否存在
   */
  private fileExists(): boolean {
    try {
      accessSync(this.filePath!);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 创建日志目录
   */
  async ensureLogDirectory(): Promise<void> {
    if (this.filePath) {
      const dir = path.dirname(this.filePath);
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.error(`[ERROR][Logger] Failed to create log directory:`, error);
      }
    }
  }

  /**
   * 清理旧日志文件
   */
  async cleanupOldLogs(maxFiles: number = 10): Promise<void> {
    if (!this.filePath) {
      return;
    }

    try {
      const dir = path.dirname(this.filePath!);
      const files = await fs.readdir(dir);
      const logFiles = files
        .filter(file => file.startsWith(path.basename(this.filePath!)) && file !== path.basename(this.filePath!))
        .sort()
        .reverse();

      if (logFiles.length > maxFiles) {
        const filesToDelete = logFiles.slice(maxFiles);
        for (const file of filesToDelete) {
          await fs.unlink(path.join(dir, file));
        }
        this.info(`清理了 ${filesToDelete.length} 个旧日志文件`, { maxFiles });
      }
    } catch (error) {
      console.error(`[ERROR][Logger] Failed to cleanup old logs:`, error);
    }
  }

  /**
   * 获取日志统计信息
   */
  async getLogStats(): Promise<{
    fileSize?: number;
    fileModified?: string;
    entryCount?: number;
  }> {
    if (!this.filePath || !this.fileExists()) {
      return {};
    }

    try {
      const stats = statSync(this.filePath);
      const fileSize = stats.size;
      const fileModified = stats.mtime.toISOString();

      // 尝试计算条目数量（性能考虑，只在文件不大时计算）
      if (fileSize < 10 * 1024 * 1024) { // 10MB 以下
        const content = await fs.readFile(this.filePath, "utf-8");
        const entryCount = content.split("\n").filter(line => line.trim()).length;
        return { fileSize, fileModified, entryCount };
      }

      return { fileSize, fileModified };
    } catch (error) {
      console.error(`[ERROR][Logger] Failed to get log stats:`, error);
      return {};
    }
  }

  /**
   * 创建子日志器
   */
  child(name: string, options?: Partial<LoggerOptions>): Logger {
    return new Logger({
      name: `${this.name}.${name}`,
      level: options?.level || this.level,
      console: options?.console ?? this.consoleEnabled,
      file: options?.file ?? (this.fileEnabled ? { enabled: true, path: this.filePath, maxSize: this.maxSize, rotate: this.rotateEnabled } : undefined),
    });
  }

  /**
   * 设置日志级别
   */
  setLevel(level: "debug" | "info" | "warn" | "error"): void {
    this.level = level;
  }

  /**
   * 启用/禁用控制台输出
   */
  setConsoleEnabled(enabled: boolean): void {
    this.consoleEnabled = enabled;
  }

  /**
   * 启用/禁用文件输出
   */
  setFileEnabled(enabled: boolean): void {
    this.fileEnabled = enabled;
  }

  /**
   * 获取当前配置
   */
  getConfig(): LoggerOptions {
    return {
      name: this.name,
      level: this.level,
      console: this.consoleEnabled,
      file: this.fileEnabled ? {
        enabled: true,
        path: this.filePath,
        maxSize: this.maxSize,
        rotate: this.rotateEnabled,
      } : undefined,
    };
  }
}

/**
 * 全局日志器工厂
 */
export class LoggerFactory {
  private static loggers: Map<string, Logger> = new Map();

  /**
   * 获取或创建日志器
   */
  static getLogger(name: string, options?: Partial<LoggerOptions>): Logger {
    const key = `${name}:${JSON.stringify(options || {})}`;
    if (!this.loggers.has(key)) {
      this.loggers.set(key, new Logger({
        name,
        ...options,
      }));
    }
    return this.loggers.get(key)!;
  }

  /**
   * 获取所有日志器
   */
  static getAllLoggers(): Map<string, Logger> {
    return new Map(this.loggers);
  }

  /**
   * 清理所有日志器
   */
  static clear(): void {
    this.loggers.clear();
  }
}