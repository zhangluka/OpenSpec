import type { ProjectConfig } from "./project-config.js";

/**
 * Serialize config to YAML string with helpful comments.
 *
 * @param config - Partial config object (schema required, context/rules optional)
 * @returns YAML string ready to write to file
 */
export function serializeConfig(config: Partial<ProjectConfig>): string {
  const lines: string[] = [];

  // Schema (required)
  lines.push(`schema: ${config.schema}`);
  lines.push("");

  // Context section with comments
  lines.push("# 项目上下文（可选）");
  lines.push("# 创建制品时会展示给 AI。");
  lines.push("# 可填写技术栈、约定、风格指南、领域知识等。");
  lines.push("# 示例：");
  lines.push("#   context: |");
  lines.push("#     技术栈：TypeScript, React, Node.js");
  lines.push("#     使用 conventional commits");
  lines.push("#     领域：电商平台");
  lines.push("");

  // Rules section with comments
  lines.push("# 按制品配置的规则（可选）");
  lines.push("# 为指定制品添加自定义规则。");
  lines.push("# 示例：");
  lines.push("#   rules:");
  lines.push("#     proposal:");
  lines.push("#       - 提案控制在 500 字以内");
  lines.push('#       - 始终包含 "Non-goals" 节');
  lines.push("#     tasks:");
  lines.push("#       - 将任务拆分为最多 2 小时一块");

  return lines.join("\n") + "\n";
}
