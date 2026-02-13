# Proposal: 内化 OpenSpec（中文汉化）

## Why

面向母语为中文的使用者，将过程文档与使用文档汉化，降低理解与使用门槛，同时保持核心概念与现有 CLI/斜杠命令不变。

## What Changes

- **过程文档模板**：`proposal.md`、`design.md`、`tasks.md`、`spec.md` 的模板内容及 schema 内 `instruction` 字段汉化。
- **用户文档**：`docs/` 下全部 Markdown 文档汉化（commands、concepts、cli、workflows、getting-started 等）。
- **CLI 与斜杠命令文案**：命令描述、选项说明、错误与提示信息、技能指令正文汉化。
- **不修改**：核心概念设计；CLI 命令名（如 `openspec init`）；斜杠命令名（如 `/opsx:new`）；代码逻辑与数据结构。

## Capabilities

本变更为文档与文案汉化，不涉及规范能力变更，无需新增或修改 `openspec/specs/`。

## Impact

- 用户可见文案与文档统一为中文。
- 生成到各 AI 工具目录的技能/命令文件中的描述与指令为中文。
- 英文文档可保留为 `docs/en/` 或由后续决策是否保留。
