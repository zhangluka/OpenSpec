# Tasks: 内化 OpenSpec（中文汉化）

本任务清单供 AI 或人工按序执行，完成 OpenSpec 的汉化。执行时请遵守：

- **不修改**：核心概念设计；CLI 命令名（如 `openspec init`）；斜杠命令 ID（如 `/opsx:new`）；代码逻辑、文件名、配置键名。
- **术语一致**：先完成 1.1 术语表，后续所有翻译与该表一致。
- **仅汉化用户可见文案**：界面提示、文档正文、模板内容、命令/选项描述、错误与成功信息。

---

## 1. 术语与约定

- [x] 1.1 在 `openspec/changes/internalize-zh-i18n/TERMINOLOGY.md` 中建立中英术语表，至少包含：spec、change、proposal、design、tasks、artifact、delta spec、archive、requirement、scenario、schema、capability、workflow。全文汉化时仅使用表中确定的中文译法。
- [x] 1.2 约定：命令名、选项名、路径、文件名、YAML/JSON 键名不翻译；代码块与示例中的命令保持原样，仅在周围说明文字使用中文。

---

## 2. Schema 模板汉化

- [x] 2.1 汉化 `schemas/spec-driven/templates/proposal.md`：标题（如 Why → 动机）、注释与占位说明改为中文，保持文档结构不变。
- [x] 2.2 汉化 `schemas/spec-driven/templates/design.md`：各节标题与注释改为中文。
- [x] 2.3 汉化 `schemas/spec-driven/templates/tasks.md`：标题与示例说明改为中文。
- [x] 2.4 汉化 `schemas/spec-driven/templates/spec.md`：标题与占位说明改为中文。

---

## 3. Schema 定义中的说明与指令汉化

- [x] 3.1 汉化 `schemas/spec-driven/schema.yaml` 中所有 `description` 字段（artifact 描述）。
- [x] 3.2 汉化 `schemas/spec-driven/schema.yaml` 中所有 `instruction` 字段（各 artifact 的创建指引长文本），保持 YAML 结构与缩进，仅替换英文字符串为中文。
- [x] 3.3 汉化 `schemas/spec-driven/schema.yaml` 中 `apply.instruction` 段。

---

## 4. 用户文档汉化（docs/）

- [x] 4.1 汉化 `docs/commands.md`：斜杠命令说明、示例、表格与提示，命令名与代码块内命令保持英文。
- [x] 4.2 汉化 `docs/concepts.md`：概念说明、图表旁注、术语与 Glossary 表。
- [x] 4.3 汉化 `docs/cli.md`：CLI 命令说明、选项表、示例说明。
- [x] 4.4 汉化 `docs/getting-started.md`。
- [x] 4.5 汉化 `docs/workflows.md`。
- [x] 4.6 汉化 `docs/installation.md`。
- [x] 4.7 汉化 `docs/customization.md`。
- [x] 4.8 汉化 `docs/opsx.md`。
- [x] 4.9 汉化 `docs/supported-tools.md`。
- [x] 4.10 汉化 `docs/multi-language.md`。
- [x] 4.11 汉化 `docs/migration-guide.md`（若存在）。

---

## 5. 项目内 OpenSpec 说明汉化

- [x] 5.1 汉化 `openspec/project.md`：技术栈、目录结构、约定、错误处理与测试策略等说明改为中文。

---

## 6. CLI 命令与选项描述汉化

- [x] 6.1 汉化 `src/cli/index.ts` 中所有 `.description()` 及用户可见的 `console.log`/`console.error` 字符串（含 init、update、list、view、change、archive、validate、show、feedback、completion、status、instructions、templates、schemas、new 等）。
- [ ] 6.2 汉化 `src/commands/change.ts` 中命令与子命令的 description 及输出文案。
- [ ] 6.3 汉化 `src/commands/config.ts` 中命令与选项描述及提示文案。
- [ ] 6.4 汉化 `src/commands/spec.ts` 中命令与选项描述。
- [ ] 6.5 汉化 `src/commands/schema.ts` 中命令与选项描述及交互提示（如 "Schema description:"）。
- [ ] 6.6 汉化 `src/commands/validate.ts`、`show.ts`、`feedback.ts`、`completion.ts` 中用户可见字符串。
- [ ] 6.7 汉化 `src/commands/workflow/` 下各文件中的命令描述与输出文案（status、instructions、templates、schemas、new-change）。
- [x] 6.8 汉化 `src/core/completions/command-registry.ts` 中所有选项与命令的 `description` 字段。

---

## 7. 核心模块中的用户可见文案汉化

- [x] 7.1 汉化 `src/core/init.ts` 中提示、成功/失败信息、工具选择与进度文案。
- [x] 7.2 汉化 `src/core/archive.ts` 中确认提示、成功/错误信息。
- [ ] 7.3 汉化 `src/core/list.ts`、`view.ts`、`update.ts` 中输出与错误信息。
- [ ] 7.4 汉化 `src/core/validation/` 中校验结果消息（如 validator 输出的警告/错误文本），若存在常量文件（如 `constants.ts`）一并汉化。
- [ ] 7.5 汉化 `src/core/config-prompts.ts`、`project-config.ts` 中与用户交互相关的提示与说明。
- [ ] 7.6 汉化 `src/core/artifact-graph/instruction-loader.ts` 中返回给前端的 `description` 等用户可见字段时，若来源为 schema 则已在 3 中处理；若有硬编码英文提示在此处汉化。
- [ ] 7.7 汉化 `src/utils/` 下与用户直接相关的提示或错误信息（如 `interactive.ts`、`task-progress.ts` 等若有可读字符串）。

---

## 8. 斜杠命令技能文案汉化

- [x] 8.1 汉化 `src/core/templates/skill-templates.ts` 中所有技能的 `description`（简短描述，会出现在各 AI 工具的指令列表中）。
- [ ] 8.2 汉化 `src/core/templates/skill-templates.ts` 中所有技能的 `instructions`（完整指令正文，供 AI 执行斜杠命令时使用），包括 explore、new、continue、ff、apply、sync、archive、verify、onboard 等；保持 Markdown 结构、代码块与命令名不翻译。
- [ ] 8.3 汉化同文件中所有 `CommandTemplate` 的 `description` 与 `body`（与 skills 对应处保持一致）。

---

## 9. 校验与收尾

- [x] 9.1 运行 `pnpm run build`，确认无 TypeScript 与语法错误。
- [ ] 9.2 在临时目录执行 `openspec init --tools cursor`（或任一带 skills/commands 的工具），检查生成到 `.cursor/commands/`（或对应目录）的 Markdown 文件内容为中文。
- [ ] 9.3 执行若干 CLI 命令（如 `openspec list`、`openspec status --help`、`openspec validate --help`），确认描述与帮助输出为中文。
- [ ] 9.4 通读 `docs/` 中已汉化文件，检查术语与 1.1 术语表一致，且无遗漏的英文句子（代码块与命令名除外）。

---

## 可选（不阻塞完成）

- [ ] 在 `README.md` 中增加简短说明或链接，指向中文文档入口（例如「中文文档见 `docs/`」或「Documentation (中文): docs/」），或根据需要新增 `README_zh.md`。
- [ ] 若希望保留英文文档副本，可将汉化前的 `docs/*.md` 备份到 `docs/en/` 并在汉化前完成备份。
