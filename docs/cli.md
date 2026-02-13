# CLI 参考

OpenSpec CLI（`openspec`）提供项目初始化、校验、状态查看与管理等终端命令，与 [命令](commands.md) 中的 AI 斜杠命令（如 `/opsx:new`）配合使用。

## 概览

| 类别           | 命令                                                            | 用途                          |
| -------------- | --------------------------------------------------------------- | ----------------------------- |
| **初始化**     | `init`、`update`                                                | 在项目中初始化与更新 OpenSpec |
| **浏览**       | `list`、`view`、`show`                                          | 查看变更与规范                |
| **校验**       | `validate`                                                      | 检查变更与规范问题            |
| **生命周期**   | `archive`                                                       | 收尾已完成的变更              |
| **工作流**     | `status`、`instructions`、`templates`、`schemas`                | 制品驱动工作流支持            |
| **工作流模式** | `schema init`、`schema fork`、`schema validate`、`schema which` | 创建与管理自定义工作流        |
| **配置**       | `config`                                                        | 查看与修改设置                |
| **工具**       | `feedback`、`completion`                                        | 反馈与 Shell 补全             |

---

## 面向人 vs 面向 Agent

多数 CLI 命令面向**人在终端使用**；部分命令支持通过 `--json` 输出供 **Agent/脚本** 使用。

### 仅面向人的命令

以下为交互式、适合终端使用：

| 命令                          | 用途                     |
| ----------------------------- | ------------------------ |
| `openspec init`               | 初始化项目（交互式提示） |
| `openspec view`               | 交互式总览               |
| `openspec config edit`        | 在编辑器中打开配置       |
| `openspec feedback`           | 通过 GitHub 提交反馈     |
| `openspec completion install` | 安装 Shell 补全          |

### 支持 Agent 的命令

以下支持 `--json` 输出，供 AI Agent 与脚本解析：

| 命令                    | 人工使用      | Agent 使用               |
| ----------------------- | ------------- | ------------------------ |
| `openspec list`         | 浏览变更/规范 | `--json` 获取结构化数据  |
| `openspec show <item>`  | 查看内容      | `--json` 便于解析        |
| `openspec validate`     | 检查问题      | `--all --json` 批量校验  |
| `openspec status`       | 查看制品进度  | `--json` 获取结构化状态  |
| `openspec instructions` | 获取下一步    | `--json` 获取 Agent 指引 |
| `openspec templates`    | 查看模板路径  | `--json` 解析路径        |
| `openspec schemas`      | 列出可用模式  | `--json` 发现模式        |

---

## 全局选项

以下选项对所有命令有效：

| 选项              | 说明         |
| ----------------- | ------------ |
| `--version`、`-V` | 显示版本号   |
| `--no-color`      | 关闭彩色输出 |
| `--help`、`-h`    | 显示命令帮助 |

---

## 初始化命令

### `openspec init`

在项目中初始化 OpenSpec，创建目录结构并配置 AI 工具集成。

```
openspec init [path] [options]
```

**参数：** `path`（可选）— 目标目录，默认当前目录。

**选项：** `--tools <list>` — 非交互配置 AI 工具，可选 `all`、`none` 或逗号分隔列表；`--force` — 自动清理旧文件且不提示。

**支持的工具 ID：** `amazon-q`、`antigravity`、`auggie`、`claude`、`cline`、`codex`、`codebuddy`、`continue`、`costrict`、`crush`、`cursor`、`devagent`、`factory`、`gemini`、`github-copilot`、`iflow`、`kilocode`、`opencode`、`qoder`、`qwen`、`roocode`、`windsurf`

**会创建：** `openspec/specs/`、`openspec/changes/`、`openspec/config.yaml`，以及所选工具的 skills/commands 目录（如 `.claude/skills/`、`.cursor/commands/` 等）。

---

### `openspec update`

升级 CLI 后更新 OpenSpec 指令文件，重新生成 AI 工具配置。

```
openspec update [path] [options]
```

**选项：** `--force` — 即使文件已是最新也强制更新。

---

## 浏览命令

### `openspec list`

列出项目中的变更或规范。

**选项：** `--specs` 列出规范；`--changes` 列出变更（默认）；`--sort <order>` 按 `recent` 或 `name` 排序；`--json` 输出 JSON。

---

### `openspec view`

打开交互式总览，浏览规范与变更。

---

### `openspec show`

显示某个变更或规范的详情。

**参数：** `item-name`（可选）— 变更或规范名称，省略时提示选择。

**选项：** `--type <type>` 指定 `change` 或 `spec`；`--json`；`--no-interactive` 关闭提示。变更专用：`--deltas-only` 仅显示增量规范（JSON）。规范专用：`--requirements`、`--no-scenarios`、`-r, --requirement <id>`。

---

## 校验命令

### `openspec validate`

校验变更与规范的结构问题。

**选项：** `--all` 校验全部；`--changes` 仅变更；`--specs` 仅规范；`--type <type>`；`--strict` 严格模式；`--json`；`--concurrency <n>` 最大并行数（默认 6 或 `OPENSPEC_CONCURRENCY`）；`--no-interactive`。

---

## 生命周期命令

### `openspec archive`

归档已完成的变更，并将增量规范合并到主规范。

**选项：** `-y, --yes` 跳过确认；`--skip-specs` 不更新规范（仅基础设施/文档类变更）；`--no-validate` 跳过校验（需确认）。

**流程：** 1）校验变更（除非 `--no-validate`）；2）确认（除非 `--yes`）；3）将增量合并到 `openspec/specs/`；4）将变更目录移至 `openspec/changes/archive/YYYY-MM-DD-<name>/`。

---

## 工作流命令

### `openspec status`

显示某变更的制品完成状态。

**选项：** `--change <id>`；`--schema <name>`；`--json`。

---

### `openspec instructions`

获取创建某制品或实施任务的增强指引，供 AI Agent 确定下一步。

**参数：** `artifact`（可选）— 制品 ID：`proposal`、`specs`、`design`、`tasks` 或 `apply`（获取实施任务指引）。

**选项：** `--change <id>`；`--schema <name>`；`--json`。

---

### `openspec templates`

显示某工作流模式中所有制品的模板路径。

**选项：** `--schema <name>`（默认 `spec-driven`）；`--json`。

---

### `openspec schemas`

列出可用工作流模式及其描述与制品流。

**选项：** `--json`。

---

## 工作流模式命令

### `openspec schema init`

创建新的项目本地工作流模式。

**参数：** `name`（必填）— 模式名（kebab-case）。

**选项：** `--description <text>`；`--artifacts <list>` 逗号分隔制品 ID（默认 `proposal,specs,design,tasks`）；`--default` 设为项目默认；`--no-default`；`--force` 覆盖已有；`--json`。

---

### `openspec schema fork`

将已有模式复制到项目以便自定义。

**参数：** `source`（必填）；`name`（可选，默认 `<source>-custom`）。

**选项：** `--force`；`--json`。

---

### `openspec schema validate`

校验工作流模式结构与模板。

**选项：** `--verbose`；`--json`。

---

### `openspec schema which`

显示某模式解析自何处（用于调试优先级）。

**选项：** `--all` 列出所有模式及来源；`--json`。

**解析优先级：** 1）项目 `openspec/schemas/<name>/`；2）用户 `~/.local/share/openspec/schemas/<name>/`；3）包内置。

---

## 配置命令

### `openspec config`

查看与修改全局 OpenSpec 配置。

**子命令：** `path` 显示配置文件路径；`list` 列出当前设置；`get <key>` 获取某值；`set <key> <value>` 设置；`unset <key>` 删除；`reset` 恢复默认；`edit` 用 `$EDITOR` 打开。

---

## 工具命令

### `openspec feedback`

提交 OpenSpec 相关反馈，会创建 GitHub issue。需安装并认证 GitHub CLI（`gh`）。**选项：** `--body <text>` 详细说明。

### `openspec completion`

管理 OpenSpec CLI 的 Shell 补全。

**子命令：** `generate [shell]` 输出补全脚本；`install [shell]` 安装；`uninstall [shell]` 卸载。

**支持 Shell：** `bash`、`zsh`、`fish`、`powershell`。

---

## 退出码

| 码  | 含义                         |
| --- | ---------------------------- |
| `0` | 成功                         |
| `1` | 错误（校验失败、缺少文件等） |

---

## 环境变量

| 变量                   | 说明                                |
| ---------------------- | ----------------------------------- |
| `OPENSPEC_CONCURRENCY` | 批量校验默认并发数（默认 6）        |
| `EDITOR` 或 `VISUAL`   | `openspec config edit` 使用的编辑器 |
| `NO_COLOR`             | 设为非空时关闭彩色输出              |

---

## 相关文档

- [命令](commands.md) - AI 斜杠命令（`/opsx:new`、`/opsx:apply` 等）
- [工作流](workflows.md) - 常用模式与使用时机
- [自定义](customization.md) - 自定义模式与模板
- [入门](getting-started.md) - 首次配置
