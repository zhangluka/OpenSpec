# cc-spex 项目完整理解

## 项目定位

cc-spex 是一个 **Claude Code 插件**，用于扩展 Spec-Kit，实现 **规范驱动开发（Specification-Driven Development）**。

---

## 核心理念

**"规格是唯一真实来源"（Specs as Single Source of Truth）**

- 传统开发：代码优先 → 文档后补（或根本不写）→ 文档漂移 → 意图丢失
- cc-spex 模式：规格优先 → 代码验证规格 → 规格随现实演进 → 意图保留

---

## 构建基础

| 基础 | 来源 | 作用 |
|------|------|------|
| **Superpowers** | Jesse Vincent 的独立插件 | TDD 纪律、系统化调试、反合理化模式 |
| **Spec-Kit** | GitHub | 规范工作流：模板、结构化产物、`specify` CLI |
| **cc-spex 创新** | 项目作者 | 规格优先执行、合规性评分、漂移检测、进化工作流 |

---

## 项目作者使用的工具

**猜想：作者很可能是通过 Superpowers + AI 编程工具完成这个项目**

证据：
1. `brainstorm/` 目录包含完整的思考过程记录
2. `spex/.superpowers-sync` 记录了与上游 superpowers 的集成过程
3. `.superpowers-sync` 和 `update-superpowers` 命令设计为 AI 辅助同步

---

## 核心创新：Traits 系统

### 定义

**可组合的横向功能注入**（类似面向切面编程 AOP）

每个 Trait 通过 `.append.md` 文件向 Spec-Kit 命令注入行为，使用 HTML 注释标记防止重复应用。

### 可用 Traits

| Trait | 功能 | 依赖 |
|-------|------|------|
| `superpowers` | 质量门控（自动规格审查、计划审查、代码审查）| - |
| `deep-review` | 5 角度代码审查 + 自动修复 | `superpowers` |
| `teams` | 并行执行（实验性） | `superpowers` |
| `worktrees` | Git worktree 隔离开发 | - |

### 工作原理

```
启用 trait
   ↓
查找 overlays/<trait>/
   ↓
将 overlay 内容追加到目标文件（.claude/skills/...）
   ↓
标记：<!-- SPEX-TRAIT:<trait> -->
   ↓
幂等性：下次应用前检测标记，防止重复
```

### 标记类型

| 标记类型 | 用途 |
|----------|--------|
| `<!-- SPEX-TRAIT:${trait} -->` | 用户可配置的 trait 覆盖（append）|
| `<!-- SPEX-PREPEND:${trait} -->` | prepend 类型覆盖（插入到 YAML 后）|
| `<!-- SPEX-GUARD:ship -->` | 内部 guard 覆盖（无条件应用）|

---

## 与外部 Superpowers 的关系

### 两个独立的 "superpowers"

| | cc-spex 的 `superpowers` trait | 外部 Superpowers 插件 |
|------|-------------------------------|----------------------|
| **来源** | cc-spex 内置 | Jesse Vincent 的独立插件 |
| **安装** | `/spex:traits enable superpowers` | `/plugin install superpowers@claude-plugins-official` |
| **依赖关系** | 不依赖外部插件 | 不依赖 cc-spex |

### 关系说明

从 README.md 关键说明：

> "spex absorbs superpowers' quality gates and anti-rationalization patterns, but does not bundle these standalone skills"

**翻译：** cc-spex **吸收**（absorbs）了外部 Superpowers 的质量门控理念，但**没有打包**那些独立的 skills。

### 各自提供什么

| | 提供 |
|------|------|
| **cc-spex 的 `superpowers` trait** | - 自动规格审查（`/speckit-specify` 后）<br>- 自动计划审查（`/speckit-plan` 前/后）<br>- 代码审查 + 验证门控（`/speckit-implement` 后）|
| **外部 Superpowers 插件** | - `test-driven-development` - 严格的 RED-GREEN-REFACTOR<br>- `systematic-debugging` - 4 阶段根因分析<br>- `brainstorming`, `writing-plans` 等 |

### 协同作用

它们可以一起使用：
- cc-spex 提供规范驱动的质量门控
- 外部 Superpowers 提供 TDD 纪律和调试技能
- 两者互补，不冲突

---

## spex/.superpowers-sync 文件

### 核心目的

**同步记录文档 - 记录 cc-spex 如何吸收和改造外部 Superpowers 插件的内容**

这是一个**"改造日志"**或**"集成追踪"**文件，说明 cc-spex 不是直接使用外部 superpowers 插件，而是**选择性吸收**其技能和模式。

### 文件结构

```json
{
  "upstream_repo": "https://github.com/obra/superpowers",
  "last_sync_commit": "eafe962b18f6c5dc70fb7c8cc7e83e61f4cdde06",
  "last_sync_date": "2026-03-30",
  "note": "Synced via /update-superpowers",
  "modified_skills": {
    "writing-plans": { "sync_mode": "reference-only" },
    "review-code": { "upstream_file": null, "local_file": "..." },
    "verification-before-completion": { ... },
    "brainstorm": { ... }
  },
  "new_spex_skills": [...],
  "companion_skills": ["test-driven-development", "systematic-debugging"]
}
```

### 使用者

**cc-spex 插件维护者（Plugin Maintainers）**

当外部 superpowers 更新时，维护者运行 `/update-superpowers` 命令来同步变更。

---

## spex-init.sh 核心功能

### 主要入口

```bash
spex-init.sh           # 检查 + 如需要则初始化
spex-init.sh --refresh # 重新下载模板并刷新项目
spex-init.sh --update  # 更新 specify-cli 并刷新项目
spex-init.sh --clear   # 删除 flow/ship 状态文件
```

### 核心函数

| 函数 | 作用 |
|------|------|
| `check_version()` | 检查 specify CLI 版本 ≥ 0.5.0 |
| `check_ready()` | 快速检查：specify 是否已安装、项目是否已初始化 |
| `do_init()` | 完整初始化流程 |
| `apply_traits()` | 应用已配置的 traits |

---

## spex-traits.sh 核心功能

### 主要入口

```bash
spex-traits.sh list                      # 显示当前 trait 状态
spex-traits.sh enable <trait>            # 启用 trait 并应用覆盖
spex-traits.sh disable <trait>           # 禁用 trait（仅配置更新）
spex-traits.sh init [--enable t1,t2]     # 创建配置
spex-traits.sh apply                     # 应用所有启用 traits 的覆盖
spex-traits.sh permissions [level]       # 显示或设置自动审批级别
```

### 核心机制

| 机制 | 说明 |
|------|------|
| **配置管理** | `.specify/spex-traits.json` |
| **依赖解析** | `teams` 依赖 `superpowers` |
| **覆盖应用** | 将 overlay 文件映射并注入到目标文件 |
| **幂等性保证** | 通过 HTML 注释标记防止重复 |
| **权限配置** | 管理工具的自动审批 |

---

## 工作流程

### 分阶段模式

```
┌──────────┐      ┌──────────┐      ┌──────────┐
│  IDEA    │ ──▶ │  SPEC    │ ──▶ │  PLAN    │
└──────────┘      └──────────┘      └──────────┘
                      │                   │
                      ▼                   ▼
              ┌──────────┐          ┌──────────┐
              │ REVIEW   │          │ IMPLEMENT │
              └──────────┘          └──────────┘
                      │                   │
                      ▼                   ▼
              ┌──────────┐          ┌──────────┐
              │ COMPLETE │ ◀──────── │  VERIFY  │
              └──────────┘          └──────────┘
                                           ▲
                                    ┌──────┴─────┐
                                    │   EVOLVE   │
                                    └────────────┘
```

### 一键式模式

`/spex:ship` 自动运行 9 个阶段：
1. specify → 2. clarify → 3. review-spec → 4. plan → 5. tasks → 6. review-plan → 7. implement → 8. review-code → 9. stamp

---

## 命令参考

### Spec-Kit 命令（被 cc-spex 增强）

| 命令 | 增强（启用 superpowers trait 时）|
|------|-----------------------------------|
| `/speckit-specify` | 自动规格审查 |
| `/speckit-plan` | 计划前后验证、自动创建 PR |
| `/speckit-implement` | 代码审查、验证门控 |

### cc-spex 新增命令

| 命令 | 功能 |
|------|------|
| `/spex:init` | 项目初始化 |
| `/spex:brainstorm` | 头脑风暴（想法 → 规格）|
| `/spex:evolve` | 规格/代码漂移处理 |
| `/spex:review-spec` | 规格审查 |
| `/spex:review-plan` | 计划审查 |
| `/spex:review-code` | 代码审查 |
| `/spex:ship` | 一键式完整流程（9 阶段）|
| `/spex:stamp` | 最终门控 |
| `/spex:deep-review` | 5 角度深度审查 |
| `/spex:worktree` | worktree 管理 |
| `/spex:traits` | traits 管理 |
| `/spex:help` | 帮助 |

---

## 目录结构

```
cc-spex/
├── .claude-plugin/              # 插件市场配置
├── .specify/                   # Spec-Kit 集成脚本和模板
│   ├── integrations/claude/scripts/
│   └── scripts/bash/
├── spex/                       # 核心插件代码
│   ├── .claude/commands/         # spex 命令定义
│   ├── commands/                 # 用户可见命令（.md 格式）
│   ├── docs/                    # 文档
│   ├── overlays/                 # Traits 覆盖文件
│   │   ├── superpowers/
│   │   ├── deep-review/
│   │   ├── teams/
│   │   ├── worktrees/
│   │   └── _ship-guard/
│   ├── scripts/                 # 核心 Shell 脚本
│   │   ├── spex-init.sh      # 项目初始化
│   │   ├── spex-traits.sh    # Traits 系统实现
│   │   ├── spex-ship-state.sh    # ship 管道状态管理
│   │   └── spex-ship-statusline.sh # 状态显示
│   └── skills/                  # Skills 实现
│       ├── ship/                # 一键式自动化流程
│       ├── review-code/          # 代码审查
│       ├── review-spec/          # 规格审查
│       ├── review-plan/          # 计划审查
│       ├── deep-review/           # 5 角度审查
│       ├── brainstorm/            # 头脑风暴
│       ├── evolve/               # 漂移处理
│       └── ...                   # 其他 skills
├── specs/                       # 功能规格历史记录
├── brainstorm/                   # 项目开发历史和决策记录（作者用）
└── tests/                       # 测试
```

---

## 核心总结

1. **在 Spec-Kit 基础上扩展** - 不修改 Spec-Kit 源代码，通过 traits 注入功能
2. **Traits 控制扩展** - 通过 `.specify/spex-traits.json` 配置哪些节点被扩展
3. **Overlay 机制** - 通过追加方式注入内容，使用 HTML 注释标记保证幂等性
4. **Skills 实现** - 扩展的具体实现来自 cc-spex 原创或从 superpowers 同步
5. **选择性吸收** - 参考外部 superpowers 的设计理念，但有自己的实现路径
6. **规范化验证** - 强制规格优先，代码必须符合规格才能通过审查
