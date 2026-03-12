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

### 工具与斜杠命令改名（内化）

- **工具名**：`openspec` → `phspec`。涉及：npm 包名与 `package.json` 的 `bin` 键、可执行文件 `bin/openspec.js` → `bin/phspec.js`、Shell 补全中的命令名（如 `openspec` → `phspec`、`_openspec` → `_phspec`）。
- **斜杠命令前缀**：`/opsx` → `/phsx`。涉及：技能模板与指令中的 `/opsx:...`、各 AI 工具适配器生成的路径与 frontmatter（如 `.cursor/commands/opsx-<id>.md` → `phsx-<id>.md`、`name: /opsx-<id>` → `name: /phsx-<id>`）、`command-references.ts` 中的转换逻辑、CLI 输出与欢迎屏中的示例。
- **技能 ID/名称**：技能模板中的 `name`（如 `openspec-explore`、`openspec-new-change`）改为 `phspec-explore`、`phspec-new-change` 等，与斜杠命令品牌一致。
- **环境变量**：用户/运维可见的环境变量统一改为 `PHSPEC_*`：`OPENSPEC_TELEMETRY` → `PHSPEC_TELEMETRY`，`OPENSPEC_CONCURRENCY` → `PHSPEC_CONCURRENCY`，`OPENSPEC_NO_AUTO_CONFIG` → `PHSPEC_NO_AUTO_CONFIG`，`OPENSPEC_NO_COMPLETIONS` → `PHSPEC_NO_COMPLETIONS`。需同步修改源码、文档、README、测试与脚本（如 `scripts/postinstall.js`、`scripts/test-postinstall.sh`）。
- **项目数据目录与元数据文件名（可选，破坏性）**：若希望彻底内化品牌，可将项目内数据目录 `openspec/` 改为 `phspec/`（`OPENSPEC_DIR_NAME` 及所有路径引用，含 CoStrict 的 `.cospec/openspec/` → `.cospec/phspec/`），变更元数据文件 `.openspec.yaml` 改为 `.phspec.yaml`。此为破坏性变更，需在文档中说明迁移步骤。
- **嵌入标记（可选）**：Shell 补全与生成文件中使用的 `<!-- OPENSPEC:START -->` / `OPENSPEC:END`、`# OPENSPEC:START` / `# OPENSPEC:END` 可改为 `PHSPEC` 前缀；若修改，需考虑已安装补全用户的配置兼容或提供迁移说明。
- 选项名、路径、文件名、YAML/JSON 键名（如 `--json`、`proposal.md`）除上述改名外保持英文。代码中的变量名、类型名（如 `OpenSpecConfig`）可保留英文，仅用户可见字符串与上述命名点做汉化/改名。

### 文档与模板范围

- **Schema 模板**：`schemas/spec-driven/templates/*.md` 全文汉化；`schemas/spec-driven/schema.yaml` 中 `description`、`instruction` 字段汉化。
- **Docs**：`docs/*.md` 各文件正文汉化，代码块与命令示例中的命令/选项名不翻译。
- **CLI**：`src/cli/index.ts`、`src/commands/*.ts`、`src/core/completions/command-registry.ts` 等处的 `.description()`、选项说明、控制台输出字符串汉化。
- **技能模板**：`src/core/templates/skill-templates.ts` 中 `description` 与 `instructions` 汉化，使生成到 `.cursor/commands/` 等目录的文件为中文。

## Migration Plan

无数据迁移。完成后执行 `pnpm run build` 与 `phspec update` 在测试目录验证生成文件为中文且命令名为 phsx 即可。
