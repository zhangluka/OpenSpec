# OPSX 工作流

> 欢迎在 [Discord](https://discord.gg/YctCnvvshC) 反馈。

## 是什么？

OPSX 是 PhSpec 的当前标准工作流。

它是一个**灵活、可迭代**的变更流程：没有固定阶段，只有可随时执行的动作。

## 为何存在

旧版 PhSpec 工作流能用，但**封闭**：

- **指令写死在代码里** — 无法修改
- **要么全做要么不做** — 一条命令生成全部，无法单独验证
- **结构固定** — 人人相同，无法定制
- **黑盒** — AI 产出不好时没法调 prompt

**OPSX 打开这些限制**：可以改模板试效果、按制品单独验证、自定义工作流、改完即测无需发版。

适合团队（按真实工作方式定制）、高级用户（针对代码库调 prompt）、贡献者（无需发版即可试验）。

## 使用体验

**线性工作流的问题：** 先「规划阶段」再「实现阶段」再「完成」，但真实工作往往不是这样——实现到一半发现设计不对，需要更新规范再继续。线性阶段和实际工作方式冲突。

**OPSX 的做法：**

- **动作而非阶段** — 创建、实施、更新、归档，随时可做
- **依赖是「可做」** — 表示能创建什么，而不是必须下一步做什么

```
  提案 ──→ 规范 ──→ 设计 ──→ 任务 ──→ 实施
```

## 配置

```bash
phspec init
```

会在 `.claude/skills/`（或对应工具目录）生成技能，供 AI 编程助手自动加载。过程中会提示是否创建**项目配置**（`phspec/config.yaml`），可选但推荐。

## 项目配置

项目配置用于设置默认值，并把项目专属上下文注入到所有制品。

### 创建配置

在 `phspec init` 时创建，或手动在项目根目录创建：

```yaml
# phspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### 配置字段

| 字段      | 类型   | 说明                                         |
| --------- | ------ | -------------------------------------------- |
| `schema`  | string | 新建变更的默认工作流模式（如 `spec-driven`） |
| `context` | string | 注入到所有制品指引中的项目上下文             |
| `rules`   | object | 按制品 ID 的规则                             |

### 模式解析顺序（从高到低）

1. CLI 参数（`--schema <name>`）
2. 变更元数据（变更目录下的 `.phspec.yaml`）
3. 项目配置（`phspec/config.yaml`）
4. 默认（`spec-driven`）

上下文会包在 `<context>...</context>` 中注入；规则仅对匹配的制品注入，包在 `<rules>...</rules>` 中。

### spec-driven 的制品 ID

- `proposal` — 变更提案
- `specs` — 规范
- `design` — 技术设计
- `tasks` — 实施任务

## 命令速查

| 命令             | 作用                                         |
| ---------------- | -------------------------------------------- |
| `/phsx:explore`  | 梳理想法、排查问题、澄清需求                 |
| `/phsx:new`      | 新建变更                                     |
| `/phsx:continue` | 创建下一个就绪的制品                         |
| `/phsx:ff`       | 快进 — 一次性创建全部规划制品                |
| `/phsx:apply`    | 实施任务，按需更新制品                       |
| `/phsx:sync`     | 将增量规范同步到主规范（可选，归档时会提示） |
| `/phsx:archive`  | 完成后归档                                   |

## 使用要点

- **探索**：`/phsx:explore`，无结构要求，思路清晰后可 `/phsx:new` 或 `/phsx:ff`
- **新建变更**：`/phsx:new`，会询问要做什么以及使用哪个工作流模式
- **创建制品**：`/phsx:continue` 按依赖逐个创建；`/phsx:ff <name>` 一次性创建全部规划制品
- **实施**：`/phsx:apply`，按任务推进并勾选；多变更时可用 `/phsx:apply <name>`
- **收尾**：`/phsx:archive`，会提示是否同步规范

## 更新既有变更 vs 新建变更

- **在既有变更上更新**：意图相同、执行更精炼；范围收窄（先 MVP）；因对代码库的新认识做修正；设计小改。
- **新建变更**：意图根本改变；范围扩大到完全不同工作；原变更可独立「完成」；在原有上打补丁会更乱。

原则：**更新保留上下文，新建提供清晰。** 思考历程有价值时更新；重新开一条线更清晰时新建。

## 与旧版的区别

|            | 旧版（`/openspec:proposal`） | PHSX（`/phsx:*`）      |
| ---------- | ---------------------------- | ---------------------- |
| **结构**   | 一份大提案文档               | 离散制品 + 依赖        |
| **流程**   | 线性阶段：规划 → 实现 → 归档 | 灵活动作，随时可做     |
| **迭代**   | 回头改不自然                 | 随时更新制品           |
| **自定义** | 结构固定                     | 模式驱动，可自定义制品 |

核心点：工作不是线性的，OPSX 不再假装它是。

## 相关文档

- [概念](concepts.md) - 规范、制品与工作流模式
- [棕地接入与 SDD 最佳实践](brownfield-sdd-best-practices.md) - 现有项目接入与业务开发流程规范
- [自定义](customization.md) - 项目配置与自定义模式
- [命令](commands.md) - 斜杠命令完整说明
