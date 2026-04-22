# cc-spex 项目阅读路径

项目本地路径：/Users/bobby/Projects/Github/open-sources/cc-spex

## 第一层：理解架构和入口点

```
项目根目录
├── .claude-plugin/marketplace.json  ← 插件定义
├── spex/.claude-plugin/plugin.json  ← 插件元数据
└── README.md                      ← 项目概览和文档
```

**先看：**
1. `.claude-plugin/marketplace.json` - 了解插件如何定义
2. `spex/.claude-plugin/plugin.json` - 了解插件元数据

---

## 第二层：核心基础设施（最关键）

```
spex/
├── scripts/
│   ├── spex-init.sh      ← [核心] 项目初始化逻辑
│   ├── spex-traits.sh    ← [核心] Traits 系统实现
│   ├── spex-ship-state.sh    ← ship 管道状态管理
│   └── spex-ship-statusline.sh ← 状态显示
└── commands/
    └── init.md               ← [核心] /spex:init 命令入口
```

**必看的核心代码：**
1. **`spex-init.sh`** - 理解项目如何初始化、如何调用 Spec-Kit CLI
2. **`spex-traits.sh`** - 理解 Traits 系统（配置管理、覆盖应用）
3. **`commands/init.md`** - 理解用户交互流程

---

## 第三层：Traits Overlay 机制

```
spex/overlays/
├── superpowers/              ← superpowers trait 覆盖
│   └── skills/
│       ├── speckit-specify/SKILL.append.md
│       ├── speckit-plan/SKILL.append.md
│       └── speckit-implement/SKILL.append.md
├── deep-review/             ← deep-review trait 覆盖
├── teams/                   ← teams trait 覆盖
└── worktrees/               ← worktrees trait 覆盖
```

**学习点：**
- 看一个 append.md 文件，理解如何向 Spec-Kit 命令注入内容
- 理解 HTML 注释标记 `<!-- SPEX-TRAIT:xxx -->` 如何防止重复应用

---

## 第四层：Skills 实现

```
spex/skills/
├── ship/SKILL.md            ← [核心] 一键式自动化流程
├── review-code/SKILL.md     ← 代码审查逻辑
├── review-spec/SKILL.md     ← 规格审查逻辑
├── review-plan/SKILL.md     ← 计划审查逻辑
├── brainstorm/SKILL.md       ← 头脑风暴
├── evolve/SKILL.md          ← 规格/代码漂移处理
└── stamp/SKILL.md           ← 最终门控
```

**推荐阅读顺序：**
1. `ship/SKILL.md` - 理解完整自动化流程（最复杂，最有价值）
2. `review-code/SKILL.md` - 理解深度深度审查逻辑
3. `review-spec/SKILL.md` - 理解规格审查

---

## 第五层：配置和状态管理

```
.specify/
├── spex-traits.json         ← Traits 配置（运行时）
├── .spex-state              ← ship 管道状态
└── integrations/
    └── claude/
        └── scripts/
            └── update-context.sh ← 更新 CLAUDE.md
```

---

## 建议学习顺序

### 阶段 1：快速理解（30分钟）
1. 读 `README.md` 获取概览
2. 看 `.claude-plugin/marketplace.json`
3. 看一个 overlay 文件（如 `overlays/superpowers/skills/speckit-specify/SKILL.append.md`）

### 阶段 2：深入核心（1-2小时）
1. **`spex-init.sh`** - 追踪初始化流程
2. **`spex-traits.sh`** - 理解 Traits 机制（重点：`do_apply()` 函数）
3. **`commands/init.md`** - 理解用户交互

### 阶段 3：掌握核心功能（2-3小时）
1. **`skills/ship/SKILL.md`** - 理解 9 阶段自动化流程
2. **`skills/review-code/SKILL.md`** - 理解深度深度审查
3. **`skills/deep-review/SKILL.md`** - 理解 5 角度审查

---

## 关键函数速查

| 文件 | 函数 | 作用 |
|------|:------|------|
| `spex-init.sh` | `do_init()` | 初始化 Spec-Kit 项目 |
| `spex-init.sh` | `check_ready()` | 快速检查是否已初始化 |
| `spex-init.sh` | `fix_constitution()` | 迁移 constitution 位置 |
| `spex-traits.sh` | `do_apply()` | 应用所有启用 traits 的覆盖 |
| `spex-traits.sh` | `resolve_overlay_target()` | 将覆盖路径映射到目标文件 |
| `spex-traits.sh` | `apply_prepend()` | 在 YAML frontmatter 后插入内容 |
| `spex-traits.sh` | `apply_internal_overlays()` | 应用内部 _ship-guard 覆盖 |
| `spex-traits.sh` | `ensure_agent_teams_env()` | 设置 agent teams 环境变量 |

---

## 目录结构参考

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
│   └── skills/                  # Skills 实现
├── specs/                       # 功能规格历史记录
├── brainstorm/                   # 头脑风暴文档
└── tests/                       # 测试
```
