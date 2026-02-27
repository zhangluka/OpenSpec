# 入门

本文说明在安装并初始化 PhSpec 之后的基本用法。安装步骤见 [主 README](../README.md#quick-start)。

## 工作方式

PhSpec 帮助你和 AI 编程助手在写代码前就对「要做什么」达成一致。流程是一个简单循环：

```
┌────────────────────┐
│ 启动变更           │  /phsx:new
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 创建制品           │  /phsx:ff 或 /phsx:continue
│ （提案、规范、     │
│  设计、任务）      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 实施任务           │  /phsx:apply
│ （AI 写代码）      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 归档并合并规范     │  /phsx:archive
└────────────────────┘
```

## PhSpec 会创建什么

执行 `phspec init` 后，项目会有如下结构：

```
phspec/
├── specs/              # 单一事实来源（系统当前行为）
│   └── <domain>/
│       └── spec.md
├── changes/            # 拟议更新（每个变更一个目录）
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # 增量规范（在改什么）
│           └── <domain>/
│               └── spec.md
└── config.yaml         # 项目配置（可选）
```

**两个关键目录：**

- **`specs/`** — 单一事实来源。这些规范描述系统当前行为，按领域组织（如 `specs/auth/`、`specs/payments/`）。
- **`changes/`** — 拟议修改。每个变更有独立目录及全部相关制品。变更完成后，其规范会合并到主目录 `specs/`。

## 理解制品

每个变更目录包含指导工作的制品：

| 制品          | 用途                                       |
| ------------- | ------------------------------------------ |
| `proposal.md` | 「为什么」和「做什么」— 意图、范围与思路   |
| `specs/`      | 增量规范，展示 ADDED/MODIFIED/REMOVED 需求 |
| `design.md`   | 「怎么做」— 技术方案与架构决策             |
| `tasks.md`    | 带勾选框的实施清单                         |

**制品彼此依赖：**

```
提案 ──► 规范 ──► 设计 ──► 任务 ──► 实施
   ▲       ▲        ▲                    │
   └───────┴────────┴────────────────────┘
            随实施过程更新
```

实施过程中学到新信息时，可以随时回头修改前面的制品。

## 增量规范如何工作

增量规范是 PhSpec 的核心：它们展示**相对当前规范**的变更。

### 格式

增量规范用段落表示变更类型：

- **ADDED Requirements** — 新增需求
- **MODIFIED Requirements** — 修改的需求（需写完整更新后内容）
- **REMOVED Requirements** — 废弃需求（需注明原因与迁移）

### 归档时发生什么

归档一个变更时：

1. **ADDED** 需求会追加到主规范
2. **MODIFIED** 需求会替换主规范中的对应版本
3. **REMOVED** 需求会从主规范中删除

变更目录会移入 `phspec/changes/archive/` 以便追溯。

## 示例：你的第一个变更

以为应用添加深色模式为例。

### 1. 启动变更

```
You: /phsx:new add-dark-mode

AI:  Created phspec/changes/add-dark-mode/
     Ready to create: proposal
```

### 2. 创建制品

用 `/phsx:ff`（快进）一次性创建所有规划制品：

```
You: /phsx:ff

AI:  Creating artifacts for add-dark-mode...
     ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!
```

### 3. 实施

```
You: /phsx:apply

AI:  Working through tasks...
     ✓ 1.1 Created ThemeContext with light/dark state
     ...
     All tasks complete!
```

若实施中发现设计需要调整，直接更新对应制品后继续即可。

### 4. 归档

```
You: /phsx:archive

AI:  Archiving add-dark-mode...
     ✓ Merged specs into phspec/specs/ui/spec.md
     ✓ Moved to phspec/changes/archive/2025-01-24-add-dark-mode/
     Done! Ready for the next feature.
```

此时增量规范已成为主规范的一部分，记录了系统如何工作。

## 校验与查看

可用 CLI 查看变更状态：

```bash
# 列出进行中的变更
phspec list

# 查看变更详情
phspec show add-dark-mode

# 校验规范格式
phspec validate add-dark-mode

# 交互式总览
phspec view
```

## 下一步

- [工作流](workflows.md) - 常用模式及各命令使用时机
- [命令](commands.md) - 斜杠命令完整参考
- [概念](concepts.md) - 规范、变更与工作流模式的深入说明
- [棕地接入与 SDD 最佳实践](brownfield-sdd-best-practices.md) - 现有项目接入与业务开发流程规范（团队必读）
- [自定义](customization.md) - 按你的方式使用 PhSpec
