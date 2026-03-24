import { CommandDefinition, FlagDefinition } from "./types.js";

/**
 * Common flags used across multiple commands
 */
const COMMON_FLAGS = {
  json: {
    name: "json",
    description: "以 JSON 输出",
  } as FlagDefinition,
  jsonValidation: {
    name: "json",
    description: "以 JSON 输出校验结果",
  } as FlagDefinition,
  strict: {
    name: "strict",
    description: "启用严格校验模式",
  } as FlagDefinition,
  noInteractive: {
    name: "no-interactive",
    description: "关闭交互提示",
  } as FlagDefinition,
  type: {
    name: "type",
    description: "名称歧义时指定项类型",
    takesValue: true,
    values: ["change", "spec"],
  } as FlagDefinition,
} as const;

/**
 * Registry of all PhSpec CLI commands with their flags and metadata.
 * This registry is used to generate shell completion scripts.
 */
export const COMMAND_REGISTRY: CommandDefinition[] = [
  {
    name: "init",
    description: "在项目中初始化 PhSpec",
    acceptsPositional: true,
    positionalType: "path",
    flags: [
      {
        name: "tools",
        description:
          '非交互配置 AI 工具（如 "all"、"none" 或逗号分隔的工具 ID）',
        takesValue: true,
      },
    ],
  },
  {
    name: "update",
    description: "更新 PhSpec 指令文件",
    acceptsPositional: true,
    positionalType: "path",
    flags: [],
  },
  {
    name: "list",
    description: "列出项（默认变更，加 --specs 为规范）",
    flags: [
      {
        name: "specs",
        description: "列出规范而非变更",
      },
      {
        name: "changes",
        description: "明确列出变更（默认）",
      },
    ],
  },
  {
    name: "view",
    description: "显示规范与变更的交互式总览",
    flags: [],
  },
  {
    name: "validate",
    description: "校验变更与规范",
    acceptsPositional: true,
    positionalType: "change-or-spec-id",
    flags: [
      {
        name: "all",
        description: "校验所有变更与规范",
      },
      {
        name: "changes",
        description: "校验所有变更",
      },
      {
        name: "specs",
        description: "校验所有规范",
      },
      COMMON_FLAGS.type,
      COMMON_FLAGS.strict,
      COMMON_FLAGS.jsonValidation,
      {
        name: "concurrency",
        description: "最大并发校验数（默认取 PHSPEC_CONCURRENCY 或 6）",
        takesValue: true,
      },
      COMMON_FLAGS.noInteractive,
    ],
  },
  {
    name: "show",
    description: "显示变更或规范",
    acceptsPositional: true,
    positionalType: "change-or-spec-id",
    flags: [
      COMMON_FLAGS.json,
      COMMON_FLAGS.type,
      COMMON_FLAGS.noInteractive,
      {
        name: "deltas-only",
        description: "仅显示增量（仅 JSON，变更）",
      },
      {
        name: "requirements-only",
        description: "同 --deltas-only（已弃用，变更）",
      },
      {
        name: "requirements",
        description: "仅显示需求，不含场景（仅 JSON，规范）",
      },
      {
        name: "no-scenarios",
        description: "不含场景内容（仅 JSON，规范）",
      },
      {
        name: "requirement",
        short: "r",
        description: "按 ID 显示指定需求（仅 JSON，规范）",
        takesValue: true,
      },
    ],
  },
  {
    name: "archive",
    description: "归档已完成的变更并更新主规范",
    acceptsPositional: true,
    positionalType: "change-id",
    flags: [
      {
        name: "yes",
        short: "y",
        description: "跳过确认提示",
      },
      {
        name: "skip-specs",
        description: "跳过规范更新",
      },
      {
        name: "no-validate",
        description: "跳过校验（不推荐）",
      },
    ],
  },
  {
    name: "apply-ralph",
    description: "使用 Ralph 稳健执行 apply 循环",
    flags: [
      {
        name: "change",
        description: "变更名",
        takesValue: true,
      },
      {
        name: "schema",
        description: "工作流模式覆盖",
        takesValue: true,
      },
      {
        name: "snapshot",
        description: "Ralph 快照文件路径",
        takesValue: true,
      },
      {
        name: "policy",
        description: "执行策略（conservative|relentless）",
        takesValue: true,
        values: ["conservative", "relentless"],
      },
      {
        name: "max-retries",
        description: "可恢复错误最大重试次数",
        takesValue: true,
      },
      {
        name: "backoff-ms",
        description: "初始退避毫秒",
        takesValue: true,
      },
      {
        name: "max-backoff-ms",
        description: "最大退避毫秒",
        takesValue: true,
      },
      {
        name: "max-attempts",
        description: "最大循环尝试次数",
        takesValue: true,
      },
      {
        name: "max-stagnant-rounds",
        description: "允许连续无进展轮次",
        takesValue: true,
      },
      {
        name: "max-runtime-minutes",
        description: "最长运行分钟数（0 表示不限制）",
        takesValue: true,
      },
      COMMON_FLAGS.json,
    ],
  },
  {
    name: "feedback",
    description: "提交 PhSpec 相关反馈",
    acceptsPositional: true,
    flags: [
      {
        name: "body",
        description: "反馈的详细说明",
        takesValue: true,
      },
    ],
  },
  {
    name: "change",
    description: "管理 PhSpec 变更提案（已弃用）",
    flags: [],
    subcommands: [
      {
        name: "show",
        description: "显示变更提案",
        acceptsPositional: true,
        positionalType: "change-id",
        flags: [
          COMMON_FLAGS.json,
          {
            name: "deltas-only",
            description: "仅显示增量（仅 JSON）",
          },
          {
            name: "requirements-only",
            description: "同 --deltas-only（已弃用）",
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: "list",
        description: "列出所有进行中变更（已弃用）",
        flags: [
          COMMON_FLAGS.json,
          {
            name: "long",
            description: "显示 id 与标题及数量",
          },
        ],
      },
      {
        name: "validate",
        description: "校验变更提案",
        acceptsPositional: true,
        positionalType: "change-id",
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: "spec",
    description: "管理 PhSpec 规范",
    flags: [],
    subcommands: [
      {
        name: "show",
        description: "显示规范",
        acceptsPositional: true,
        positionalType: "spec-id",
        flags: [
          COMMON_FLAGS.json,
          {
            name: "requirements",
            description: "仅显示需求，不含场景（仅 JSON）",
          },
          {
            name: "no-scenarios",
            description: "不含场景内容（仅 JSON）",
          },
          {
            name: "requirement",
            short: "r",
            description: "按 ID 显示指定需求（仅 JSON）",
            takesValue: true,
          },
          COMMON_FLAGS.noInteractive,
        ],
      },
      {
        name: "list",
        description: "列出所有规范",
        flags: [
          COMMON_FLAGS.json,
          {
            name: "long",
            description: "显示 id 与标题及数量",
          },
        ],
      },
      {
        name: "validate",
        description: "校验规范",
        acceptsPositional: true,
        positionalType: "spec-id",
        flags: [
          COMMON_FLAGS.strict,
          COMMON_FLAGS.jsonValidation,
          COMMON_FLAGS.noInteractive,
        ],
      },
    ],
  },
  {
    name: "completion",
    description: "管理 PhSpec CLI 的 Shell 补全",
    flags: [],
    subcommands: [
      {
        name: "generate",
        description: "生成某 Shell 的补全脚本（输出到 stdout）",
        acceptsPositional: true,
        positionalType: "shell",
        flags: [],
      },
      {
        name: "install",
        description: "为某 Shell 安装补全脚本",
        acceptsPositional: true,
        positionalType: "shell",
        flags: [
          {
            name: "verbose",
            description: "显示详细安装输出",
          },
        ],
      },
      {
        name: "uninstall",
        description: "卸载某 Shell 的补全脚本",
        acceptsPositional: true,
        positionalType: "shell",
        flags: [
          {
            name: "yes",
            short: "y",
            description: "跳过确认提示",
          },
        ],
      },
    ],
  },
  {
    name: "config",
    description: "查看与修改全局 PhSpec 配置",
    flags: [
      {
        name: "scope",
        description: '配置范围（当前仅支持 "global"）',
        takesValue: true,
        values: ["global"],
      },
    ],
    subcommands: [
      {
        name: "path",
        description: "显示配置文件路径",
        flags: [],
      },
      {
        name: "list",
        description: "显示当前所有设置",
        flags: [COMMON_FLAGS.json],
      },
      {
        name: "get",
        description: "获取某值（原始、可脚本）",
        acceptsPositional: true,
        flags: [],
      },
      {
        name: "set",
        description: "设置某值（自动类型转换）",
        acceptsPositional: true,
        flags: [
          {
            name: "string",
            description: "强制按字符串存储",
          },
          {
            name: "allow-unknown",
            description: "允许设置未知键",
          },
        ],
      },
      {
        name: "unset",
        description: "删除某键（恢复默认）",
        acceptsPositional: true,
        flags: [],
      },
      {
        name: "reset",
        description: "将配置恢复为默认",
        flags: [
          {
            name: "all",
            description: "重置全部配置（必填）",
          },
          {
            name: "yes",
            short: "y",
            description: "跳过确认提示",
          },
        ],
      },
      {
        name: "edit",
        description: "用 $EDITOR 打开配置",
        flags: [],
      },
    ],
  },
  {
    name: "schema",
    description: "管理工作流模式",
    flags: [],
    subcommands: [
      {
        name: "which",
        description: "显示某模式解析自何处",
        acceptsPositional: true,
        positionalType: "schema-name",
        flags: [
          COMMON_FLAGS.json,
          {
            name: "all",
            description: "列出所有模式及其解析来源",
          },
        ],
      },
      {
        name: "validate",
        description: "校验工作流模式结构与模板",
        acceptsPositional: true,
        positionalType: "schema-name",
        flags: [
          COMMON_FLAGS.json,
          {
            name: "verbose",
            description: "显示详细校验步骤",
          },
        ],
      },
      {
        name: "fork",
        description: "将已有模式复制到项目以便自定义",
        acceptsPositional: true,
        positionalType: "schema-name",
        flags: [
          COMMON_FLAGS.json,
          {
            name: "force",
            description: "覆盖已有目标",
          },
        ],
      },
      {
        name: "init",
        description: "创建新的项目本地工作流模式",
        acceptsPositional: true,
        flags: [
          COMMON_FLAGS.json,
          {
            name: "description",
            description: "模式说明",
            takesValue: true,
          },
          {
            name: "artifacts",
            description: "逗号分隔的制品 ID",
            takesValue: true,
          },
          {
            name: "default",
            description: "设为项目默认模式",
          },
          {
            name: "no-default",
            description: "不提示设为默认",
          },
          {
            name: "force",
            description: "覆盖已有模式",
          },
        ],
      },
    ],
  },
];
