# cc-spex 项目总结

## 项目定位

cc-spex 是一个 **Claude Code 插件**，用于扩展 Spec-Kit，实现 **规范驱动开发（Specification-Driven Development）**。

---

## 核心理念

**"规格是唯一真实来源"（Specs as Single Source of Truth）**

传统开发模式：
```
代码优先 → 文档后补（或根本不写）→ 文档漂移 → 意图丢失
```

cc-spex 模式：
```
规格优先 → 代码验证规格 → 规格随现实演进 → 意图保留
```

---

## 解决的问题

| 问题 | 传统方式 | cc-spex 方式 |
|------|----------|--------------|
| 需求表达不清 | 口头沟通/零散注释 | 结构化规格文档 |
| 文档与代码脱节 | 文档写一次后过期 | 规格/代码漂移检测与进化 |
| 实现随意性大 | 缺乏约束 | 合规性评分与质量门控 |
| 审查流程混乱 | 依赖人工记忆 | 自动化审查流程 |
| 代码隔离不足 | 单一工作区易污染 | Git worktree 隔离 |

---

## 构建基础

1. **Superpowers** (by Jesse Vincent)
   - 流程纪律：TDD、验证门控、反合理化模式
   - 系统化调试、并行代理调度

2. **Spec-Kit** (by GitHub)
   - 规范工作流：模板、结构化产物
   - `specify` CLI 用于项目设置

3. **cc-spex 创新**
   - 规格优先执行
   - 合规性评分
   - 规格/代码漂移检测
   - 进化工作流

---

## 核心创新：Traits 系统

**可组合的横向功能注入**（类似面向切面编程）

每个 Trait 通过 `.append.md` 文件向 Spec-Kit 命令注入行为，使用 HTML 注释标记防止重复应用。

| Trait | 功能 | 注入的命令 |
|-------|------|------------|
| `superpowers` | 质量门控 | `/speckit-specify`, `/speckit-plan`, `/speckit-implement` |
| `deep-review` | 5 角度代码审查 + 自动修复 | `/spex:review-code` |
| `teams` | 并行执行（实验性） | `/speckit-implement` |
| `worktrees` | Git worktree 隔离 | `/speckit-specify` |

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
              │ REVIEW   │          │ IMPLEMENT│
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

## 关键命令

| 类别 | 命令 |
|------|------|
| **规格创建** | `/spex:brainstorm`, `/speckit-specify` |
| **验证** | `/spex:review-spec`, `/spex:review-code`, `/spex:review-plan` |
| **实现** | `/speckit-implement` |
| **进化** | `/spex:evolve` |
| **管理** | `/spex:init`, `/spex:traits`, `/spex:worktree`, `/spex:ship` |

---

## 设计原则

1. **规格优先** - 没有规格就不写代码
2. **关注 WHAT，不是 HOW** - 规格定义需求，而非实现细节
3. **演进是正常的** - 规格随着学习而变化
4. **质量门控** - 验证检查测试和规格合规性

---

## 适合的使用场景

✅ 多人协作项目
✅ 长期维护的代码库
✅ 需要清晰需求追溯的场景
✅ 有审查流程要求的团队
✅ 希望提升代码质量的团队

---

## 项目结构

```
spex/
  commands/        # 斜杠命令定义
  skills/          # Skill 提示文件
  overlays/        # Trait 覆盖文件
  scripts/         # Shell/Python 脚本和钩子
  docs/            # 教程和帮助

.specify/          # 项目配置
specs/             # 功能规格历史记录
```
