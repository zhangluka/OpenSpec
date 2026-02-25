# 斜杠命令

本文档是 PhSpec 斜杠命令的参考。这些命令在 AI 编程助手的对话界面中调用（如 Claude Code、Cursor、Windsurf）。

工作流模式及各命令的使用时机见 [工作流](workflows.md)。CLI 命令见 [CLI](cli.md)。

## 速查

| 命令                 | 用途                         |
| -------------------- | ---------------------------- |
| `/phsx:explore`      | 在确定变更前梳理思路         |
| `/phsx:new`          | 新建一个变更                 |
| `/phsx:continue`     | 按依赖创建下一个制品         |
| `/phsx:ff`           | 快进：一次性创建所有规划制品 |
| `/phsx:apply`        | 按变更实施任务               |
| `/phsx:verify`       | 校验实现与变更制品是否一致   |
| `/phsx:sync`         | 将增量规范合并到主规范       |
| `/phsx:archive`      | 归档已完成的变更             |
| `/phsx:bulk-archive` | 一次性归档多个变更           |
| `/phsx:onboard`      | 完整工作流引导教程           |

---

## 命令说明

### `/phsx:explore`

在确定变更前梳理想法、排查问题、澄清需求。

**语法：**

```
/phsx:explore [topic]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `topic` | 否 | 你想探索或调查的主题 |

**作用：**

- 开启无需固定结构的探索式对话
- 通过查阅代码库回答问题
- 比较不同方案与做法
- 用图示厘清思路
- 思路清晰后可转向 `/phsx:new`

**示例：**

```text
You: /phsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /phsx:new add-jwt-auth to begin.
```

**提示：**

- 需求尚不清晰或需要调研时使用
- 探索过程中不会创建制品
- 适合在决策前对比多种方案
- 可读取文件并搜索代码库

---

### `/phsx:new`

新建一个变更。创建变更目录结构并按所选工作流模式搭建脚手架。

**语法：**

```
/phsx:new [change-name] [--schema <schema-name>]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-name` | 否 | 变更目录名称（未提供时会提示输入） |
| `--schema` | 否 | 使用的工作流模式（默认来自配置或 `spec-driven`） |

**作用：**

- 创建 `phspec/changes/<change-name>/` 目录
- 在变更目录下创建 `.phspec.yaml` 元数据文件
- 显示第一个可创建的制品模板
- 未提供变更名或模式时会提示输入

**会创建：**

```
phspec/changes/<change-name>/
└── .phspec.yaml    # 变更元数据（模式、创建日期）
```

**示例：**

```
You: /phsx:new add-dark-mode

AI:  Created phspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /phsx:continue to create it, or /phsx:ff to create all artifacts.
```

**提示：**

- 使用有辨识度的名称：`add-feature`、`fix-bug`、`refactor-module`
- 避免泛用名：`update`、`changes`、`wip`
- 工作流模式也可在项目配置（`phspec/config.yaml`）中设置

---

### `/phsx:continue`

在依赖链中创建下一个制品。每次创建一个，便于逐步推进。

**语法：**

```
/phsx:continue [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-name` | 否 | 要继续的变更（未提供时从上下文推断） |

**作用：**

- 查询制品依赖图
- 显示哪些制品已就绪、哪些被阻塞
- 创建第一个就绪的制品
- 读取依赖文件作为上下文
- 显示创建后可用的下一步

**示例：**

```
You: /phsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created phspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /phsx:continue to create the next artifact.
```

**提示：**

- 希望逐个审阅制品再继续时使用
- 适合复杂变更、需要更多控制时
- 可能同时有多个制品就绪
- 可在继续前编辑已创建的制品

---

### `/phsx:ff`

快进式创建制品。一次性创建所有规划制品。

**语法：**

```
/phsx:ff [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-name` | 否 | 要快进的变更（未提供时从上下文推断） |

**作用：**

- 按依赖顺序创建全部制品
- 通过待办列表跟踪进度
- 在全部「需应用」制品完成时停止
- 创建下一制品前会先读取其依赖

**示例：**

```
You: /phsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /phsx:apply to begin.
```

**提示：**

- 对要做的内容已有清晰认识时使用
- 对简单变更比 `/phsx:continue` 更快
- 创建后仍可编辑制品
- 适合中小型功能

---

### `/phsx:apply`

按变更实施任务。按任务列表推进，写代码并勾选完成项。

**语法：**

```
/phsx:apply [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-name` | 否 | 要实施的变更（未提供时从上下文推断） |

**作用：**

- 读取 `tasks.md` 并找出未完成任务
- 逐项执行任务
- 按需写代码、创建文件、运行测试
- 用勾选 `[x]` 标记任务完成

**示例：**

```
You: /phsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**提示：**

- 中断后可从上次位置继续
- 指定变更名可处理并行变更
- 完成状态由 `tasks.md` 中的勾选记录

---

### `/phsx:verify`

校验实现是否与变更制品一致。检查完整性、正确性与一致性。

**语法：**

```
/phsx:verify [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-name` | 否 | 要校验的变更（未提供时从上下文推断） |

**作用：**

- 从三个维度检查实现质量
- 在代码库中搜索实现依据
- 按 CRITICAL、WARNING、SUGGESTION 分类报告问题
- 不阻止归档，但会暴露问题

**校验维度：**

| 维度       | 校验内容                                         |
| ---------- | ------------------------------------------------ |
| **完整性** | 任务是否全部完成，需求是否都有实现，场景是否覆盖 |
| **正确性** | 实现是否符合规范意图，边界情况是否处理           |
| **一致性** | 设计决策是否体现在代码中，模式是否统一           |

**示例：**

```
You: /phsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**提示：**

- 归档前运行可尽早发现偏差
- 警告不会阻止归档，但提示潜在问题
- 适合在提交前审阅 AI 产出
- 可发现制品与实现之间的漂移

---

### `/phsx:sync`

**可选命令。** 将变更中的增量规范合并到主规范。归档时如需会提示是否执行 sync，一般无需手动执行。

**语法：**

```
/phsx:sync [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-name` | 否 | 要同步的变更（未提供时从上下文推断） |

**作用：**

- 读取变更目录中的增量规范
- 解析 ADDED/MODIFIED/REMOVED/RENAMED 段落
- 将变更合并到主目录 `phspec/specs/`
- 保留增量中未提及的既有内容
- 不归档变更（变更仍为进行中）

**示例：**

```text
You: /phsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: phspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  phspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ phspec/specs/ui/spec.md updated

     Change remains active. Run /phsx:archive when ready to complete.
```

**何时需手动执行：**

| 场景                               | 是否用 sync        |
| ---------------------------------- | ------------------ |
| 长期变更，希望先合并到主规范再归档 | 是                 |
| 多个并行变更需要更新后的主规范     | 是                 |
| 想单独预览/审阅合并结果            | 是                 |
| 小变更、直接归档                   | 否（归档时会处理） |

**提示：**

- sync 是智能合并，不是简单复制粘贴
- 可为既有需求追加场景而不重复
- 同步后变更仍为进行中（未归档）
- 多数用户无需直接调用——需要时归档会提示

---

### `/phsx:archive`

归档已完成的变更。收尾变更并将其移入归档目录。

**语法：**

```
/phsx:archive [change-name]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-name` | 否 | 要归档的变更（未提供时从上下文推断） |

**作用：**

- 检查制品完成情况
- 检查任务完成情况（未完成会警告）
- 若尚未同步则询问是否同步增量规范
- 将变更目录移至 `phspec/changes/archive/YYYY-MM-DD-<name>/`
- 保留全部制品便于追溯

**示例：**

```text
You: /phsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to phspec/specs/ui/spec.md
     ✓ Moved to phspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**提示：**

- 任务未完成时仍可归档，但会给出警告
- 增量规范可在归档时或之前同步
- 已归档变更会保留用于历史
- 建议先执行 `/phsx:verify` 再归档

---

### `/phsx:bulk-archive`

一次性归档多个已完成的变更。会处理变更之间的规范冲突。

**语法：**

```
/phsx:bulk-archive [change-names...]
```

**参数：**
| 参数 | 必填 | 说明 |
|------|------|------|
| `change-names` | 否 | 要归档的变更名（未提供时会提示选择） |

**作用：**

- 列出所有已完成的变更
- 归档前校验每个变更
- 检测变更之间的规范冲突
- 通过检查实际实现来化解冲突
- 按时间顺序归档

**示例：**

```
You: /phsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**提示：**

- 适合多条线并行收尾
- 冲突化解由代理完成（会查代码库）
- 按创建顺序归档
- 覆盖规范内容前会提示

---

### `/phsx:onboard`

完整 PhSpec 工作流引导。基于你真实代码库的交互式教程。

**语法：**

```
/phsx:onboard
```

**作用：**

- 带讲解地走完一整轮工作流
- 扫描代码库寻找可改进点
- 创建一个真实变更及制品
- 实施真实改动（小而安全的修改）
- 归档该变更
- 每步都有说明

**阶段：**

1. 欢迎与代码库分析
2. 寻找改进点
3. 创建变更（`/phsx:new`）
4. 撰写提案
5. 创建规范
6. 撰写设计
7. 创建任务
8. 实施任务（`/phsx:apply`）
9. 校验实现
10. 归档变更
11. 总结与下一步

**示例：**

```
You: /phsx:onboard

AI:  Welcome to PhSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**提示：**

- 最适合刚接触工作流的新用户
- 使用真实代码，非示例项目
- 会创建一个可保留或丢弃的真实变更
- 约 15～30 分钟完成

---

## 各 AI 工具的命令写法

不同 AI 工具的斜杠命令格式略有差异，请按你使用的工具书写：

| 工具          | 写法示例                                 |
| ------------- | ---------------------------------------- |
| Claude Code   | `/phsx:new`、`/phsx:apply`               |
| Cursor        | `/phsx-new`、`/phsx-apply`               |
| Windsurf      | `/phsx-new`、`/phsx-apply`               |
| Copilot (IDE) | `/phsx-new`、`/phsx-apply`               |
| Trae          | `/phsx-new-change`、`/phsx-apply-change` |

功能一致，仅写法不同。

> **说明：** GitHub Copilot 的命令（`.github/prompts/*.prompt.md`）仅在 IDE 扩展（VS Code、JetBrains、Visual Studio）中可用。GitHub Copilot CLI 目前不支持自定义 prompt 文件，详见 [支持的工具](supported-tools.md) 及替代方式。

---

## 旧版命令

以下命令属于较早的「一次性」工作流，仍可使用，但推荐使用 PHSX 命令。

| 命令                 | 作用                                         |
| -------------------- | -------------------------------------------- |
| `/openspec:proposal` | 一次性创建全部制品（提案、规范、设计、任务） |
| `/openspec:apply`    | 实施变更                                     |
| `/openspec:archive`  | 归档变更                                     |

**何时用旧版命令：**

- 已在用旧工作流的项目
- 简单变更、不需要逐步创建制品
- 偏好一次性完成的方式

**迁移到 PHSX：**
旧版变更可用 PHSX 命令继续推进，制品结构兼容。

---

## 常见问题

### 「变更未找到」

命令无法确定要操作的变更。

**处理：**

- 显式指定变更名：`/phsx:apply add-dark-mode`
- 确认变更目录存在：`phspec list`
- 确认当前在正确项目目录

### 「没有就绪的制品」

所有制品要么已完成，要么被缺失依赖阻塞。

**处理：**

- 运行 `phspec status --change <name>` 查看阻塞原因
- 检查依赖制品是否存在
- 先创建缺失的依赖制品

### 「工作流模式未找到」

指定的模式不存在。

**处理：**

- 列出可用模式：`phspec schemas`
- 检查模式名拼写
- 若为自定义模式，先创建：`phspec schema init <name>`

### 命令不被识别

AI 工具无法识别 PhSpec 命令。

**处理：**

- 确认已初始化：`phspec init`
- 重新生成技能：`phspec update`
- 检查 `.claude/skills/` 等目录是否存在（Claude Code）
- 重启 AI 工具以加载新技能

### 制品生成异常

AI 生成的制品不完整或不符合预期。

**处理：**

- 在 `phspec/config.yaml` 中补充项目上下文
- 为特定制品添加规则以细化指引
- 在变更描述中提供更多信息
- 需要更多控制时用 `/phsx:continue` 代替 `/phsx:ff`

---

## 延伸阅读

- [工作流](workflows.md) - 常用模式及各命令使用时机
- [CLI](cli.md) - 管理与校验用终端命令
- [自定义](customization.md) - 自定义工作流模式与流程
