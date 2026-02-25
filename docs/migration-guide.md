# 迁移到 PHSX

本指南帮助从旧版 PhSpec 工作流迁移到 PHSX。迁移以保留现有工作为前提，新系统提供更灵活的操作方式。

## 变化概览

PHSX 用基于动作的灵活流程替代旧的阶段锁定流程：

| 方面         | 旧版                                                         | PHSX                                            |
| ------------ | ------------------------------------------------------------ | ----------------------------------------------- |
| **命令**     | `/openspec:proposal`、`/openspec:apply`、`/openspec:archive` | `/phsx:new`、`/phsx:continue`、`/phsx:apply` 等 |
| **工作流**   | 一次性创建全部制品                                           | 可逐步创建或一次性创建                          |
| **回头修改** | 阶段门控不自然                                               | 随时可更新任意制品                              |
| **自定义**   | 结构固定                                                     | 由模式驱动，可完全自定义                        |
| **配置**     | `CLAUDE.md` 标记 + `project.md`                              | 统一的 `phspec/config.yaml`                     |

**理念变化：** 工作不是线性的，PHSX 不再假装它是。

---

## 开始前

### 现有工作会保留

- **`phspec/changes/` 下的进行中变更** — 完整保留，可用 PHSX 命令继续。
- **已归档变更** — 不动，历史完整保留。
- **`phspec/specs/` 主规范** — 不动，仍是单一事实来源。
- **你在 CLAUDE.md、AGENTS.md 等中的内容** — 保留；仅移除 PhSpec 管理的标记块。

### 会被移除的内容

仅限由 PhSpec 创建且被新方案替代的文件：

- 旧版斜杠命令目录/文件（由新技能体系替代）
- `phspec/AGENTS.md`（旧工作流触发）
- `CLAUDE.md`、`AGENTS.md` 等中的 PhSpec 标记块

迁移会检测你已配置的工具并清理其旧版文件。你的自有内容不会被删除。

### 需要你手动处理的一项

**`phspec/project.md`** — 不会自动删除，因为可能包含你写的项目说明。建议：

1. 查看内容
2. 将有用部分迁移到 `phspec/config.yaml`（见项目文档中的配置说明）
3. 确认无误后删除该文件

新配置中的 context 会在每次规划请求中**主动注入**，因此项目约定、技术栈和规则会稳定出现在 AI 创建制品时，可靠性更高。因会注入到每次请求，建议内容精简：技术栈与关键约定、AI 需要知道的非显然约束、以往容易被忽略的规则。

---

## 迁移步骤

1. 备份或提交当前仓库状态
2. 升级 PhSpec：`npm install -g @bobby_z/phspec@latest`（或你使用的包名）
3. 在项目根目录执行：`phspec init`（会检测并清理旧文件，并生成新技能/命令）
4. 按上文处理 `phspec/project.md`，将上下文迁入 `phspec/config.yaml`
5. 用 `/phsx:new` 或既有变更目录测试：`phspec status`、`/phsx:continue` 等

旧版变更的制品结构与 PHSX 兼容，可直接用 PHSX 命令继续推进。

### 若项目仍为旧目录名 `openspec/`

当前版本使用项目数据目录 `phspec/` 与变更元数据文件 `.phspec.yaml`。若你是在更早版本下创建的 `openspec/` 目录，升级后请手动重命名：

- 将项目根下的 `openspec/` 目录重命名为 `phspec/`
- 将各变更目录下的 `.openspec.yaml` 重命名为 `.phspec.yaml`

完成后执行 `phspec init` 或 `phspec update` 即可。

## 相关文档

- [入门](getting-started.md) - 首次使用
- [自定义](customization.md) - 项目配置与模式
- [命令](commands.md) - PHSX 斜杠命令
