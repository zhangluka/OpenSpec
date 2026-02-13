# Design: 内化 OpenSpec（中文汉化）

## Context

汉化范围限定为用户可见内容：模板、文档、CLI 输出、斜杠命令描述与指令。不引入 i18n 框架，采用直接替换英文字符串为中文的方式，便于一次性交付且不改变运行时行为。

## Decisions

### 术语表先行

在实施前建立并维护一份中英术语表（可放在 `docs/glossary-zh.md` 或本 change 的 `TERMINOLOGY.md`），保证全文一致，例如：

- spec → 规范 / 规格说明（选定其一后全文统一）
- change → 变更
- proposal → 提案
- artifact → 制品
- delta spec → 增量规范
- archive → 归档
- requirement → 需求
- scenario → 场景
- schema → 工作流模式 / 模式（选定其一）

AI 执行 tasks.md 时优先参考术语表。

### 专有名词与代码不变

- 命令名、选项名、路径、文件名、键名（如 `openspec init`、`/opsx:new`、`--json`、`proposal.md`、`openspec/specs/`）保持英文。
- 代码中的变量名、类型名、注释可保持英文，仅用户可见字符串汉化。

### 文档与模板范围

- **Schema 模板**：`schemas/spec-driven/templates/*.md` 全文汉化；`schemas/spec-driven/schema.yaml` 中 `description`、`instruction` 字段汉化。
- **Docs**：`docs/*.md` 各文件正文汉化，代码块与命令示例中的命令/选项名不翻译。
- **CLI**：`src/cli/index.ts`、`src/commands/*.ts`、`src/core/completions/command-registry.ts` 等处的 `.description()`、选项说明、控制台输出字符串汉化。
- **技能模板**：`src/core/templates/skill-templates.ts` 中 `description` 与 `instructions` 汉化，使生成到 `.cursor/commands/` 等目录的文件为中文。

## Migration Plan

无数据迁移。完成后执行 `pnpm run build` 与 `openspec update` 在测试目录验证生成文件为中文即可。
