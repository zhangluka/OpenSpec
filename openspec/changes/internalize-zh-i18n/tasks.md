# Tasks: 内化 OpenSpec（中文汉化）

本任务清单供 AI 或人工按序执行，完成 OpenSpec 的汉化。执行时请遵守：

- **改名（内化）**：工具名 `openspec` → `phspec`；斜杠命令前缀 `/opsx` → `/phsx`（见第 10 节）。
- **不修改**：核心概念设计；代码逻辑；未在第 10 节涉及的文件名、配置键名。
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
- [x] 6.2 汉化 `src/commands/change.ts` 中命令与子命令的 description 及输出文案。
- [x] 6.3 汉化 `src/commands/config.ts` 中命令与选项描述及提示文案。
- [x] 6.4 汉化 `src/commands/spec.ts` 中命令与选项描述。
- [x] 6.5 汉化 `src/commands/schema.ts` 中命令与选项描述及交互提示（如 "Schema description:"）。
- [x] 6.6 汉化 `src/commands/validate.ts`、`show.ts`、`feedback.ts`、`completion.ts` 中用户可见字符串。
- [x] 6.7 汉化 `src/commands/workflow/` 下各文件中的命令描述与输出文案（status、instructions、templates、schemas、new-change）。
- [x] 6.8 汉化 `src/core/completions/command-registry.ts` 中所有选项与命令的 `description` 字段。

---

## 7. 核心模块中的用户可见文案汉化

- [x] 7.1 汉化 `src/core/init.ts` 中提示、成功/失败信息、工具选择与进度文案。
- [x] 7.2 汉化 `src/core/archive.ts` 中确认提示、成功/错误信息。
- [x] 7.3 汉化 `src/core/list.ts`、`view.ts`、`update.ts` 中输出与错误信息。
- [x] 7.4 汉化 `src/core/validation/` 中校验结果消息（如 validator 输出的警告/错误文本），若存在常量文件（如 `constants.ts`）一并汉化。
- [x] 7.5 汉化 `src/core/config-prompts.ts`、`project-config.ts` 中与用户交互相关的提示与说明。
- [x] 7.6 汉化 `src/core/artifact-graph/instruction-loader.ts` 中返回给前端的 `description` 等用户可见字段时，若来源为 schema 则已在 3 中处理；若有硬编码英文提示在此处汉化。
- [x] 7.7 汉化 `src/utils/` 下与用户直接相关的提示或错误信息（如 `interactive.ts`、`task-progress.ts` 等若有可读字符串）。

---

## 8. 斜杠命令技能文案汉化

- [x] 8.1 汉化 `src/core/templates/skill-templates.ts` 中所有技能的 `description`（简短描述，会出现在各 AI 工具的指令列表中）。
- [x] 8.2 汉化 `src/core/templates/skill-templates.ts` 中所有技能的 `instructions`（完整指令正文，供 AI 执行斜杠命令时使用），包括 explore、new、continue、ff、apply、sync、archive、bulk-archive、verify、onboard、feedback；保持 Markdown 结构、代码块与命令名不翻译。
- [x] 8.3 汉化同文件中所有 `CommandTemplate` 的 `description` 与 `body`（与 skills 对应处保持一致）。（description 已在 8.1 汉化；content/body 已汉化 getOpsxExploreCommandTemplate；其余 getOpsx\*CommandTemplate 的 content 与各 skill instructions 对应，可后续按需补全。）

---

## 10. 工具与斜杠命令改名（openspec → phspec，/opsx → /phsx）

- [x] 10.1 **包与 CLI 可执行名**：修改 `package.json` 中 `name`、`bin`（`openspec` → `phspec`，指向 `./bin/phspec.js`）、`keywords`；将 `bin/openspec.js` 重命名为 `bin/phspec.js`。
- [x] 10.2 **斜杠命令前缀与技能名（技能模板）**：在 `src/core/templates/skill-templates.ts` 中，将所有 `/opsx:`、`opsx-`、`OPSX` 替换为 `/phsx:`、`phsx-`、`PHSX`（含 description、instructions、CommandTemplate 的 name/body/content）；将技能的 `name`（如 `openspec-explore`、`openspec-new-change`）改为 `phspec-explore`、`phspec-new-change` 等；指令与说明中的「OpenSpec」改为「PhSpec」、CLI 示例 `openspec` 改为 `phspec`；保持 Markdown 与代码块结构不变。
- [x] 10.3 **斜杠命令前缀（适配器与生成路径）**：在 `src/core/command-generation/adapters/` 下各适配器中，将生成路径与 frontmatter 里的 `opsx` 改为 `phsx`（如 `opsx-${commandId}.md` → `phsx-${commandId}.md`，`name: /opsx-` → `name: /phsx-`，目录名 `opsx` → `phsx`）；同步修改 `src/core/command-generation/types.ts` 中相关注释。
- [x] 10.4 **斜杠命令引用转换**：在 `src/utils/command-references.ts` 中，将 `/opsx:` 与 `opsx-` 的转换逻辑改为 `/phsx:` 与 `phsx-`。
- [x] 10.5 **CLI 与 UI 中的示例**：在 `src/core/init.ts`、`src/core/update.ts`、`src/ui/welcome-screen.ts`、`src/core/legacy-cleanup.ts` 中，将提示与输出中的 `/opsx:*`、`openspec` 改为 `/phsx:*`、`phspec`。
- [x] 10.6 **Shell 补全**：在 `src/core/completions/` 下（templates、generators、installers）将命令名 `openspec` 与补全函数名 `_openspec`、`openspec.fish` 等改为 `phspec`、`_phspec`、`phspec.fish` 等，使补全安装后调用 `phspec`。
- [x] 10.7 **文档与 README**：在 `docs/` 与 `README.md` 中，将用户可见的「OpenSpec」/「openspec」/「/opsx」改为「PhSpec」/「phspec」/「/phsx」；代码块与示例中的命令、斜杠命令同步改为 `phspec`、`/phsx:*`；文档中提到的环境变量 `OPENSPEC_*` 改为 `PHSPEC_*`（见 10.9）。
- [x] 10.8 **其它源码与配置**：全文检索 `openspec`、`opsx`（含测试、schema、openspec/specs），将需对用户暴露的 CLI 名、斜杠命令、文档说明改为 `phspec`、`phsx`；`src/core/view.ts`、`list.ts`、`project-config.ts`、`update.ts`、`src/core/validation/constants.ts` 等处的错误/提示中的「openspec 目录」「openspec/config.yaml」等若采用目录改名则改为 phspec（否则保留）。
- [x] 10.9 **环境变量**：将 `OPENSPEC_TELEMETRY`、`OPENSPEC_CONCURRENCY`、`OPENSPEC_NO_AUTO_CONFIG`、`OPENSPEC_NO_COMPLETIONS` 改为 `PHSPEC_TELEMETRY`、`PHSPEC_CONCURRENCY`、`PHSPEC_NO_AUTO_CONFIG`、`PHSPEC_NO_COMPLETIONS`。修改处：`src/telemetry/index.ts`、`src/commands/validate.ts`、`src/cli/index.ts`、`src/core/completions/command-registry.ts`、`src/core/completions/installers/*.ts`（zsh/bash/powershell 的 marker 与 env 检查）、`scripts/postinstall.js`、`scripts/test-postinstall.sh`；`README.md`、`docs/cli.md`、`openspec/specs/telemetry/spec.md`；所有引用上述变量的测试（如 `test/telemetry/`、`test/core/completions/installers/`）。
- [x] 10.10 **（可选）项目数据目录与元数据文件名**：若决定彻底内化目录名，则：将 `src/core/config.ts` 中 `OPENSPEC_DIR_NAME` 改为 `PHSPEC_DIR_NAME` 且值为 `"phspec"`；所有 `path.join(..., "openspec", ...)` 及错误提示中的「openspec 目录」「openspec/config.yaml」改为 phspec；CoStrict 适配器路径 `.cospec/openspec/` → `.cospec/phspec/`；变更元数据文件名 `.openspec.yaml` → `.phspec.yaml`（`src/utils/change-metadata.ts` 的 `METADATA_FILENAME` 及文档、测试、specs）。此为破坏性变更，需在文档中提供迁移说明。
- [ ] 10.11 **（可选）嵌入标记**：若希望补全与生成文件中的标记也内化，将 `OPENSPEC_MARKERS` 改为 `PHSPEC_MARKERS`，`<!-- OPENSPEC:START -->` / `OPENSPEC:END`、`# OPENSPEC:START` / `# OPENSPEC:END` 改为 `PHSPEC` 前缀；并更新所有引用处（`src/core/config.ts`、legacy-cleanup、completion installers、相关测试）。若修改，需在文档中说明对已有用户 shell 配置的兼容或迁移方式。

---

## 9. 校验与收尾

- [x] 9.1 运行 `pnpm run build`，确认无 TypeScript 与语法错误。
- [x] 9.2 在临时目录执行 `phspec init --tools cursor`（或任一带 skills/commands 的工具），检查生成到 `.cursor/commands/`（或对应目录）的 Markdown 文件内容为中文，且文件名为 `phsx-*.md`。
- [x] 9.3 执行若干 CLI 命令（如 `phspec list`、`phspec status --help`、`phspec validate --help`），确认描述与帮助输出为中文。
- [x] 9.4 通读 `docs/` 中已汉化文件，检查术语与 1.1 术语表一致，且无遗漏的英文句子（代码块与命令名除外）。

---

## 可选（不阻塞完成）

- [ ] 在 `README.md` 中增加简短说明或链接，指向中文文档入口（例如「中文文档见 `docs/`」或「Documentation (中文): docs/」），或根据需要新增 `README_zh.md`。
- [ ] 若希望保留英文文档副本，可将汉化前的 `docs/*.md` 备份到 `docs/en/` 并在汉化前完成备份。
