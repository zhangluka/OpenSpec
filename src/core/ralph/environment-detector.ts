import path from "node:path";
import { promises as fs } from "node:fs";
import { platform } from "node:os";

export interface DevAgentConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
}

export interface EnvironmentConfig {
  devagent: DevAgentConfig;
  node: {
    executable: string;
    version?: string;
  };
}

/**
 * 环境检测器，自动发现和配置 devagent
 */
export class EnvironmentDetector {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger("EnvironmentDetector");
  }

  /**
   * 检测 devagent 环境配置
   */
  detectDevAgent(): DevAgentConfig {
    this.logger.debug("开始检测 devagent 环境");

    // 1. 检查环境变量
    const envConfig = this.detectFromEnvironment();
    if (envConfig) {
      this.logger.info("从环境变量检测到 devagent 配置");
      return envConfig;
    }

    // 2. 检查配置文件
    const configConfig = this.detectFromConfigFiles();
    if (configConfig) {
      this.logger.info("从配置文件检测到 devagent 配置");
      return configConfig;
    }

    // 3. 检查 PATH 中的可执行文件
    const pathConfig = this.detectFromPath();
    if (pathConfig) {
      this.logger.info("从 PATH 检测到 devagent 可执行文件");
      return pathConfig;
    }

    // 4. 检查常见安装目录
    const commonConfig = this.detectFromCommonPaths();
    if (commonConfig) {
      this.logger.info("从常见路径检测到 devagent 可执行文件");
      return commonConfig;
    }

    // 5. 使用默认配置
    this.logger.warn("未检测到 devagent，使用默认配置");
    return this.getDefaultConfig();
  }

  /**
   * 从环境变量检测配置
   */
  private detectFromEnvironment(): DevAgentConfig | null {
    const command = process.env.DEVAGENT_COMMAND?.trim();
    const args = process.env.DEVAGENT_ARGS?.trim();

    if (command) {
      return {
        command,
        args: args ? args.split(" ").filter(Boolean) : ["--yolo"],
        env: {
          ...this.getDevAgentEnvVars(),
        },
      };
    }

    return null;
  }

  /**
   * 从配置文件检测配置
   */
  private detectFromConfigFiles(): DevAgentConfig | null {
    const configFiles = this.getConfigFilePaths();

    for (const configFile of configFiles) {
      try {
        if (this.fileExists(configFile)) {
          const config = this.parseConfigFile(configFile);
          if (config && config.devagent) {
            this.logger.debug(`从配置文件 ${configFile} 读取配置`);
            return {
              command: config.devagent.command || "devagent",
              args: config.devagent.args || ["--yolo"],
              env: {
                ...config.devagent.env,
                ...this.getDevAgentEnvVars(),
              },
            };
          }
        }
      } catch (error) {
        this.logger.debug(`读取配置文件 ${configFile} 失败:`, error);
      }
    }

    return null;
  }

  /**
   * 从 PATH 检测可执行文件
   */
  private detectFromPath(): DevAgentConfig | null {
    const pathDirs = process.env.PATH?.split(path.delimiter) || [];
    const executableNames = this.getDevAgentExecutableNames();

    for (const dir of pathDirs) {
      for (const name of executableNames) {
        const fullPath = path.join(dir, name);
        if (this.fileExists(fullPath) && this.isExecutable(fullPath)) {
          this.logger.debug(`在 PATH 中找到 devagent: ${fullPath}`);
          return {
            command: fullPath,
            args: ["--yolo"],
            env: this.getDevAgentEnvVars(),
          };
        }
      }
    }

    return null;
  }

  /**
   * 从常见路径检测可执行文件
   */
  private detectFromCommonPaths(): DevAgentConfig | null {
    const commonPaths = this.getCommonDevAgentPaths();

    for (const fullPath of commonPaths) {
      if (this.fileExists(fullPath) && this.isExecutable(fullPath)) {
        this.logger.debug(`在常见路径中找到 devagent: ${fullPath}`);
        return {
          command: fullPath,
          args: ["--yolo"],
          env: this.getDevAgentEnvVars(),
        };
      }
    }

    return null;
  }

  /**
   * 获取默认配置
   */
  private getDefaultConfig(): DevAgentConfig {
    return {
      command: "devagent",
      args: ["--yolo"],
      env: {
        ...this.getDevAgentEnvVars(),
      },
    };
  }

  /**
   * 获取 devagent 相关的环境变量
   */
  private getDevAgentEnvVars(): Record<string, string> {
    const envVars: Record<string, string> = {};

    // API 密钥
    const apiKey = process.env.DEVAGENT_API_KEY || process.env.DEV_AGENT_API_KEY;
    if (apiKey) {
      envVars.DEVAGENT_API_KEY = apiKey;
    }

    // 代理设置
    const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
    if (proxy) {
      envVars.HTTPS_PROXY = proxy;
    }

    // 其他常见环境变量
    const commonVars = [
      "DEVAGENT_ORG_ID",
      "DEVAGENT_PROJECT_ID",
      "DEVAGENT_MODEL",
      "DEVAGENT_TEMPERATURE",
      "DEVAGENT_MAX_TOKENS",
    ];

    for (const varName of commonVars) {
      const value = process.env[varName];
      if (value) {
        envVars[varName] = value;
      }
    }

    return envVars;
  }

  /**
   * 获取配置文件路径
   */
  private getConfigFilePaths(): string[] {
    const paths: string[] = [];

    // 当前目录
    paths.push(path.join(process.cwd(), ".devagentrc"));
    paths.push(path.join(process.cwd(), "devagent.config.json"));

    // 用户目录
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (homeDir) {
      paths.push(path.join(homeDir, ".devagentrc"));
      paths.push(path.join(homeDir, ".config", "devagent", "config.json"));
    }

    // 全局配置目录
    if (process.platform === "darwin") {
      paths.push(path.join(process.env.HOME || "", "Library", "Application Support", "devagent", "config.json"));
    } else if (process.platform === "win32") {
      const appData = process.env.APPDATA;
      if (appData) {
        paths.push(path.join(appData, "devagent", "config.json"));
      }
    } else {
      paths.push("/etc/devagent/config.json");
    }

    return paths;
  }

  /**
   * 解析配置文件
   */
  private parseConfigFile(filePath: string): any {
    const content = fs.readFileSync(filePath, "utf-8");

    // 尝试解析为 JSON
    try {
      return JSON.parse(content);
    } catch {
      // 尝试解析为 shell 配置文件
      return this.parseShellConfig(content);
    }
  }

  /**
   * 解析 shell 配置文件
   */
  private parseShellConfig(content: string): any {
    const config: any = {};

    // 简单的 shell 变量解析
    const lines = content.split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+?)\s*$/);
      if (match) {
        const key = match[1];
        const value = match[2].replace(/^["']|["']$/g, ""); // 去掉引号
        config[key] = value;
      }
    }

    return config;
  }

  /**
   * 获取 devagent 可执行文件名称
   */
  private getDevAgentExecutableNames(): string[] {
    const baseNames = ["devagent", "dev-agent"];

    if (process.platform === "win32") {
      return [...baseNames, ...baseNames.map(name => name + ".exe")];
    }

    return baseNames;
  }

  /**
   * 获取常见 devagent 安装路径
   */
  private getCommonDevAgentPaths(): string[] {
    const paths: string[] = [];

    if (process.platform === "darwin") {
      paths.push("/usr/local/bin/devagent");
      paths.push("/opt/homebrew/bin/devagent");
      paths.push("/Applications/devagent");
    } else if (process.platform === "win32") {
      paths.push("C:\\Program Files\\DevAgent\\devagent.exe");
      paths.push("C:\\Program Files (x86)\\DevAgent\\devagent.exe");
      paths.push("C:\\DevAgent\\devagent.exe");
    } else {
      paths.push("/usr/bin/devagent");
      paths.push("/usr/local/bin/devagent");
      paths.push("/opt/devagent/bin/devagent");
    }

    return paths;
  }

  /**
   * 检查文件是否存在
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 检查文件是否可执行
   */
  private isExecutable(filePath: string): boolean {
    try {
      const stats = fs.statSync(filePath);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  /**
   * 获取完整的环境配置
   */
  async getFullEnvironment(): Promise<EnvironmentConfig> {
    const devagentConfig = this.detectDevAgent();
    const nodeConfig = await this.detectNode();

    return {
      devagent: devagentConfig,
      node: nodeConfig,
    };
  }

  /**
   * 检测 Node.js 环境
   */
  private async detectNode(): Promise<{ executable: string; version?: string }> {
    try {
      const version = await this.executeCommand("node", ["--version"]);
      return {
        executable: "node",
        version: version.trim(),
      };
    } catch {
      return {
        executable: "node",
        version: undefined,
      };
    }
  }

  /**
   * 执行命令获取输出
   */
  private async executeCommand(command: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = require("child_process").spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
      child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
      child.on("close", () => {
        if (child.exitCode === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Command failed: ${stderr || stdout}`));
        }
      });
    });
  }
}

// 简单的 Logger 类（为了自包含）
class Logger {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  debug(message: string, meta?: any): void {
    console.debug(`[DEBUG][${this.name}] ${message}`, meta);
  }

  info(message: string, meta?: any): void {
    console.info(`[INFO][${this.name}] ${message}`, meta);
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN][${this.name}] ${message}`, meta);
  }

  error(message: string, meta?: any): void {
    console.error(`[ERROR][${this.name}] ${message}`, meta);
  }
}