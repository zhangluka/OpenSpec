# 概念

本文介绍 OpenSpec 的核心概念及其关系。实践步骤见 [入门](getting-started.md) 与 [工作流](workflows.md)。

## 理念

OpenSpec 围绕四条原则构建：

```
灵活而非僵化     — 无阶段门控，按需推进
迭代而非瀑布     — 边做边学、边学边改
简单而非复杂     — 轻量配置、最少仪式
棕地优先         — 面向既有代码库，不限于绿地项目
```

### 为何重要

**灵活而非僵化。** 传统规范体系把人锁在阶段里：先规划、再实现、然后结束。OpenSpec 更灵活——你可以按对工作有利的顺序创建制品。

**迭代而非瀑布。** 需求会变、理解会加深。一开始看起来不错的方案，在看到代码库后可能不再成立。OpenSpec 接受这一点。

**简单而非复杂。** 有些规范框架需要大量配置、固定格式或重型流程。OpenSpec 尽量不挡路：几秒完成初始化，立刻开始工作，只在需要时再做定制。

**棕地优先。** 多数软件工作不是在从零搭建，而是在改既有系统。OpenSpec 的增量式规范让「对既有行为的修改」成为一等公民，而不只是描述新系统。

## 整体结构

OpenSpec 把工作组织成两大块：

```
┌─────────────────────────────────────────────────────────────────┐
│                        openspec/                                 │
│                                                                  │
│   ┌─────────────────────┐      ┌──────────────────────────────┐ │
│   │       specs/        │      │         changes/              │ │
│   │                     │      │                               │ │
│   │  单一事实来源       │◄─────│  拟议的修改                    │ │
│   │  系统当前如何工作   │ 合并 │  每个变更 = 一个目录           │ │
│   │                     │      │  含制品与增量规范              │ │
│   │                     │      │                               │ │
│   └─────────────────────┘      └──────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**规范（specs）** 是单一事实来源——描述系统当前的行为。

**变更（changes）** 是拟议的修改——在合并前各自待在独立目录中。

这种分离很重要：可以并行推进多个变更而不冲突；可以在影响主规范前审阅变更；归档时增量会干净地合并进单一事实来源。

## 规范（Specs）

规范用结构化的需求与场景描述系统行为。

### 目录结构

```
openspec/specs/
├── auth/
│   └── spec.md           # 认证相关行为
├── payments/
│   └── spec.md           # 支付处理
├── notifications/
│   └── spec.md           # 通知系统
└── ui/
    └── spec.md           # UI 行为与主题
```

按领域组织规范——对系统有意义的逻辑分组。常见方式：

- **按功能**：`auth/`、`payments/`、`search/`
- **按组件**：`api/`、`frontend/`、`workers/`
- **按限界上下文**：`ordering/`、`fulfillment/`、`inventory/`

### 规范格式

规范包含需求，每条需求下有场景：

```markdown
# Auth Specification

## Purpose

Authentication and session management for the application.

## Requirements

### Requirement: User Authentication

The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials

- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials

- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration

The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout

- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**主要元素：**

| 元素               | 用途                          |
| ------------------ | ----------------------------- |
| `## Purpose`       | 本规范领域的高层描述          |
| `### Requirement:` | 系统必须满足的具体行为        |
| `#### Scenario:`   | 该需求的具体示例              |
| SHALL/MUST/SHOULD  | RFC 2119 关键词，表示需求强度 |

### 为何这样组织规范

**需求是「做什么」**——说明系统应做什么，而不规定实现。

**场景是「何时/如何」**——提供可验证的具体示例。好的场景：

- 可测试（能为之写自动化测试）
- 覆盖主流程与边界情况
- 使用 Given/When/Then 等结构化格式

**RFC 2119 关键词**（SHALL、MUST、SHOULD、MAY）表达意图：

- **MUST/SHALL** — 必须满足
- **SHOULD** — 建议，允许例外
- **MAY** — 可选

## 变更（Changes）

变更是对系统的一次拟议修改，打包成一个目录，包含理解与实现所需的一切。

### 变更结构

```
openspec/changes/add-dark-mode/
├── proposal.md           # 为什么、做什么
├── design.md             # 怎么做（技术方案）
├── tasks.md              # 实施清单
├── .openspec.yaml        # 变更元数据（可选）
└── specs/                # 增量规范
    └── ui/
        └── spec.md       # 对 ui/spec.md 的变更
```

每个变更自包含，包括：

- **制品** — 承载意图、设计与任务的文档
- **增量规范** — 描述新增、修改或移除的内容
- **元数据** — 该变更的可选配置

### 为何用目录表示变更

1. **集中** — 提案、设计、任务、规范在一处，不用到处找。
2. **并行** — 多个变更可同时存在且不冲突。可以同时推进 `add-dark-mode` 和 `fix-auth-bug`。
3. **历史清晰** — 归档后变更移入 `changes/archive/` 并保留完整上下文，日后既能看改了什么也能看为什么。
4. **便于审阅** — 打开目录即可读提案、看设计、看规范增量。

## 制品（Artifacts）

制品是变更目录内指导工作的文档。

### 制品流

```
提案 ──────► 规范 ──────► 设计 ──────► 任务 ──────► 实施
   │            │            │            │
  为什么       改什么       怎么做       具体步骤
 + 范围       变更内容     方案         待办
```

制品彼此依赖，每个制品为下一个提供上下文。

### 制品类型

#### 提案（`proposal.md`）

提案在高层抓住**意图**、**范围**和**思路**。

**何时更新提案：**

- 范围变化（收窄或扩大）
- 意图更清晰（对问题理解更深）
- 思路发生根本转变

#### 规范（`specs/` 中的增量规范）

增量规范描述**相对当前规范的变更**。详见下文 [增量规范](#增量规范)。

#### 设计（`design.md`）

设计抓住**技术方案**与**架构决策**。

**何时更新设计：**

- 实现表明方案不可行
- 发现更好方案
- 依赖或约束发生变化

#### 任务（`tasks.md`）

任务是**实施清单**——带勾选的具体步骤。

**任务实践：**

- 在标题下分组相关任务
- 使用层级编号（1.1、1.2 等）
- 任务粒度以单次会话能完成为宜
- 完成即勾选

## 增量规范（Delta Specs）

增量规范是 OpenSpec 面向棕地开发的核心：描述**在改什么**，而不是重写整份规范。

### 格式

增量规范使用段落标题表示变更类型：

- **ADDED Requirements** — 新增行为，归档时追加到主规范
- **MODIFIED Requirements** — 行为变更，归档时替换对应需求
- **REMOVED Requirements** — 废弃行为，归档时从主规范删除
- **RENAMED Requirements** — 仅名称变更

（示例格式与代码解析依赖的英文标题 `## ADDED Requirements` 等保持一致，此处不重复贴完整示例。）

### 为何用增量而非整份规范

**清晰** — 增量只展示在改什么；整份规范需要和当前版本做心智 diff。

**减少冲突** — 两个变更可以改同一规范文件，只要改的是不同需求。

**审阅高效** — 审阅者只看变更，不看未改的上下文。

**贴合棕地** — 多数工作是在改既有行为，增量让「修改」成为一等公民。

## 工作流模式（Schemas）

工作流模式定义制品种类及其依赖关系。

### 依赖是「可做」而非「必须」

依赖图表示**可以**创建什么，而不是**必须**下一步创建什么。可以不要设计就跳过；可以先写规范再写设计——两者都只依赖提案。

### 内置模式

**spec-driven**（默认）

规范驱动的标准流程：

```
提案 → 规范 → 设计 → 任务 → 实施
```

适合：希望在实现前先对齐规范的大部分功能工作。

### 自定义模式

为团队创建自定义工作流模式：

```bash
# 从零创建
openspec schema init research-first

# 或基于已有模式
openspec schema fork spec-driven research-first
```

详见 [自定义](customization.md)。

## 归档（Archive）

归档通过将变更的增量规范合并到主规范并保留变更目录，完成一次变更。

### 归档时发生什么

1. **合并增量** — 每个增量规范的 ADDED/MODIFIED/REMOVED 段落应用到对应主规范。
2. **移入归档** — 变更目录移至 `changes/archive/`，并加日期前缀便于按时间排序。
3. **保留上下文** — 所有制品完整保留在归档中，便于日后理解为何做该变更。

### 为何要归档

**状态干净** — 进行中的变更（`changes/`）只显示未完成工作，已完成工作移出视野。

**可追溯** — 归档保留每次变更的完整上下文：不仅有改了什么，还有提案中的为什么、设计中的怎么做、任务中的做了哪些。

**规范演进** — 规范随变更归档而有机增长，每次归档合并其增量，逐步形成完整规格。

## 整体流程

1. 规范描述当前行为
2. 变更以增量形式提出修改
3. 实现把变更落地
4. 归档将增量合并进规范
5. 规范描述新的行为
6. 下一轮变更基于更新后的规范

## 术语表

| 术语                       | 定义                                                 |
| -------------------------- | ---------------------------------------------------- |
| **制品（Artifact）**       | 变更内的文档（提案、设计、任务或增量规范）           |
| **归档（Archive）**        | 完成变更并将其增量合并到主规范的过程                 |
| **变更（Change）**         | 对系统的拟议修改，以带制品的目录形式组织             |
| **增量规范（Delta spec）** | 相对当前规范描述变更（ADDED/MODIFIED/REMOVED）的规范 |
| **领域（Domain）**         | 规范逻辑分组（如 `auth/`、`payments/`）              |
| **需求（Requirement）**    | 系统必须满足的具体行为                               |
| **场景（Scenario）**       | 需求的具体示例，通常为 Given/When/Then 格式          |
| **工作流模式（Schema）**   | 制品种类及其依赖的定义                               |
| **规范（Spec）**           | 描述系统行为的规格说明，含需求与场景                 |
| **单一事实来源**           | `openspec/specs/` 目录，当前达成一致的行为           |

## 下一步

- [入门](getting-started.md) - 实践第一步
- [工作流](workflows.md) - 常用模式与使用时机
- [命令](commands.md) - 完整命令参考
- [自定义](customization.md) - 创建自定义模式与配置项目
