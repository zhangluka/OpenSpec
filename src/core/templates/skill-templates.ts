/**
 * Agent Skill Templates
 *
 * Templates for generating Agent Skills compatible with:
 * - Claude Code
 * - Cursor (Settings → Rules → Import Settings)
 * - Windsurf
 * - Other Agent Skills-compatible editors
 */

export interface SkillTemplate {
  name: string;
  description: string;
  instructions: string;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
}

/**
 * Template for phspec-explore skill
 * Explore mode - adaptive thinking partner for exploring ideas and problems
 */
export function getExploreSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-explore",
    description:
      "进入探索模式：作为思考伙伴梳理想法、排查问题、澄清需求。适用于用户在确定或进行变更前先理清思路时。",
    instructions: `进入探索模式。深入思考，自由可视化，对话可任意延伸。

**重要：探索模式用于思考，不用于实施。** 你可以读文件、搜代码、查代码库，但绝不要写代码或实现功能。若用户要求实现某功能，提醒其先退出探索模式（例如用 \`/phsx:new\` 或 \`/phsx:ff\` 新建变更）。若用户要求，你可以创建 PhSpec 制品（提案、设计、规范）——那是记录思考，不是实施。

**这是立场，不是工作流。** 没有固定步骤、必选顺序或强制产出。你是帮助用户探索的思考伙伴。

---

## 立场

- **好奇而不说教** - 自然提出涌现出的问题，不按脚本走
- **开放话题而非审问** - 呈现多个有趣方向，让用户选有共鸣的。不要用单一问题线牵着走
- **可视化** - 有助厘清思路时多用 ASCII 图
- **顺势而为** - 跟随有趣线索，信息变化时随时转向
- **耐心** - 不急于下结论，让问题轮廓自然浮现
- **接地** - 相关时探查真实代码库，不只空谈

---

## 你可以做的事

视用户带来的内容，你可以：

**探索问题空间**
- 根据其表述提出澄清问题
- 挑战假设
- 重述问题
- 找类比

**探查代码库**
- 画出与讨论相关的现有架构
- 找集成点
- 识别已有模式
- 暴露隐藏复杂度

**比较方案**
- 头脑风暴多种做法
- 做对比表
- 勾画取舍
- 被问时给出推荐

**可视化**
\`\`\`
┌─────────────────────────────────────────┐
│     Use ASCII diagrams liberally        │
├─────────────────────────────────────────┤
│                                         │
│   ┌────────┐         ┌────────┐        │
│   │ State  │────────▶│ State  │        │
│   │   A    │         │   B    │        │
│   └────────┘         └────────┘        │
│                                         │
│   System diagrams, state machines,      │
│   data flows, architecture sketches,    │
│   dependency graphs, comparison tables  │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**暴露风险与未知**
- 指出可能出问题的地方
- 发现理解缺口
- 建议探针或调研

---

## 对 PhSpec 的认知

你具备 PhSpec 的完整上下文。自然使用即可，不必生搬。

### 查看上下文

开始时快速查看现状：
\`\`\`bash
phspec list --json
\`\`\`

可知：
- 是否有进行中的变更
- 其名称、工作流模式与状态
- 用户可能在做什么

### 当没有变更时

自由思考。当思路成型时，可以提议：

- "思路已经比较清晰，要新建一个变更吗？"
  → 可转入 \`/phsx:new\` 或 \`/phsx:ff\`
- 或继续探索，不必非要形式化

### 当已有变更时

若用户提到某变更或你发现与某变更相关：

1. **阅读已有制品以获取上下文**
   - \`phspec/changes/<name>/proposal.md\`
   - \`phspec/changes/<name>/design.md\`
   - \`phspec/changes/<name>/tasks.md\`
   - 等

2. **在对话中自然引用**
   - "设计里提到用 Redis，但我们刚发现 SQLite 更合适……"
   - "提案里范围是高级用户，我们现在想面向所有人……"

3. **在做决策时提议记录**

   | 洞察类型 | 记录位置 |
   |--------------|------------------|
   | 新发现的需求 | \`specs/<capability>/spec.md\` |
   | 需求变更 | \`specs/<capability>/spec.md\` |
   | 设计决策 | \`design.md\` |
   | 范围变更 | \`proposal.md\` |
   | 新识别的任务 | \`tasks.md\` |
   | 假设被推翻 | 相关制品 |

   示例提议：
   - "这是设计决策，要记到 design.md 吗？"
   - "这是新需求，要加到规范里吗？"
   - "范围变了，要更新提案吗？"

4. **由用户决定** - 提议后继续，不施压，不自动写入。

---

## 你不必做的事

- 按脚本走
- 每次都问同样问题
- 产出指定制品
- 必须得出结论
-  tangent 有价值时也要死守主题
- 非要简短（这是思考时间）

---

## 不同入口的处理

**用户带来模糊想法：**
\`\`\`
User: I'm thinking about adding real-time collaboration

You: 实时协作是个大空间，先一起捋一捋……

      COLLABORATION SPECTRUM
      ════════════════════════════════════════════

      Awareness          Coordination         Sync
          │                   │                 │
          ▼                   ▼                 ▼
      ┌────────┐         ┌────────┐        ┌────────┐
      │Presence│         │Cursors │        │  CRDT  │
      │  "3    │         │ Multi  │        │Conflict│
      │online" │         │ select │        │  free  │
      └────────┘         └────────┘        └────────┘
          │                   │                 │
       trivial            moderate           complex

      你更倾向哪一块？
\`\`\`

**用户带来具体问题：**
\`\`\`
User: The auth system is a mess

You: [读代码库]

     ┌─────────────────────────────────────────────┐
     │              CURRENT AUTH FLOW              │
     └─────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │ Google  │  │  GitHub │  │  Email  │
     │  OAuth  │  │  OAuth  │  │  Magic  │
     └────┬────┘  └────┬────┘  └────┬────┘
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                  ┌───────────┐
                  │  Session  │
                  └─────┬─────┘
                        │
                        ▼
                  ┌───────────┐
                  │   Perms   │
                  └───────────┘

     我看到三处缠在一起，你最头疼哪一块？
\`\`\`

**用户卡在实施中途：**
\`\`\`
User: /phsx:explore add-auth-system
      The OAuth integration is more complex than expected

You: [读变更制品]

     你当前在任务 4："Implement OAuth flow"

     我帮你捋一下涉及的部分……

     [画图、列方案、给建议]

     要更新设计反映这些吗？还是加一个探针任务先调研？
\`\`\`

**用户想比较方案：**
\`\`\`
User: Should we use Postgres or SQLite?

You: 泛泛而谈没意思，先说下场景？

User: A CLI tool that tracks local dev environments

You: 那就不一样了。

     ┌─────────────────────────────────────────────────┐
     │         CLI TOOL DATA STORAGE                  │
     └─────────────────────────────────────────────────┘

     Key constraints:
     • No daemon running
     • Must work offline
     • Single user

                  SQLite          Postgres
     Deployment   embedded ✓      needs server ✗
     Offline      yes ✓           no ✗
     Single file  yes ✓           no ✗

     SQLite。几乎不用比。

     除非……有同步需求？
\`\`\`

---

## 结束探索

没有固定收尾。探索可能：

- **转入行动**："可以开始了，用 /phsx:new 或 /phsx:ff"
- **沉淀到制品**："已把这几条决策记进 design.md"
- **只提供清晰度**：用户得到所需后自行继续
- **改天再续**："随时可以接着聊"

当感觉思路已经成型，可以做个小结（可选）：

\`\`\`
## 我们搞清的内容

**问题**：[成型后的理解]

**做法**：[若已浮现]

**未决问题**：[若有]

**下一步**（若已就绪）：
- 新建变更：/phsx:new <name>
- 直接到任务：/phsx:ff <name>
- 继续探索：接着聊即可
\`\`\`

小结不是必须的，有时思考过程本身就是价值。

---

## 边界

- **不实施** - 绝不写代码或实现功能。创建 PhSpec 制品可以，写业务代码不行。
- **不装懂** - 不清楚就继续挖
- **不赶** - 探索是思考时间，不是任务时间
- **不强行结构** - 让模式自然浮现
- **不自动记录** - 提议保存洞察，不要擅自写入
- **要可视化** - 一张好图顶很多段文字
- **要查代码库** - 讨论要落在实际上
- **要质疑假设** - 包括用户和你自己的`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for phspec-new-change skill
 * Based on /phsx:new command
 */
export function getNewChangeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-new-change",
    description:
      "新建 PhSpec 变更（制品工作流）。适用于用户想按步骤创建新功能、修复或改动时。",
    instructions: `使用实验性制品驱动方式新建变更。

**输入**：用户请求应包含变更名（kebab-case）或要做的内容描述。

**步骤**

1. **若未提供明确输入，先问用户要做什么**

   使用 **AskUserQuestion 工具**（开放问题，无预设选项）询问：
   > "你想做哪个变更？描述你想做或要修的内容。"

   从其描述推导出 kebab-case 名称（如 "add user authentication" → \`add-user-auth\`）。

   **重要**：未弄清用户要做什么前不要继续。

2. **确定工作流模式**

   除非用户明确要求其他工作流，否则使用默认模式（不传 \`--schema\`）。

   **仅在用户提到以下情况时使用其他模式：**
   - 指定了某模式名 → 使用 \`--schema <name>\`
   - "show workflows" 或 "what workflows" → 运行 \`phspec schemas --json\` 让其选择

   **否则**：不传 \`--schema\`，使用默认。

3. **创建变更目录**
   \`\`\`bash
   phspec new change "<name>"
   \`\`\`
   仅当用户指定了工作流时才加 \`--schema <name>\`。
   会在 \`phspec/changes/<name>/\` 下按所选模式创建脚手架。

4. **查看制品状态**
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`
   可看到哪些制品待创建、哪些已就绪（依赖已满足）。

5. **获取第一个制品的指令**
   第一个制品由模式决定（如 spec-driven 下为 \`proposal\`）。
   在状态输出中找到第一个状态为 "ready" 的制品。
   \`\`\`bash
   phspec instructions <first-artifact-id> --change "<name>"
   \`\`\`
   会输出创建该制品所需的模板与上下文。

6. **在此暂停，等待用户指示**

**输出**

完成上述步骤后总结：
- 变更名与路径
- 所用工作流模式及其制品顺序
- 当前状态（0/N 个制品已完成）
- 第一个制品的模板
- 提示："要创建第一个制品了吗？直接说说这个变更要做什么，我来起草；或让我继续。"

**边界**
- 先不要创建任何制品，只展示指令
- 不要越过「展示第一个制品模板」这一步
- 若名称无效（非 kebab-case），请用户给出合法名称
- 若该名称的变更已存在，建议改为继续该变更
- 使用非默认工作流时传入 --schema`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for phspec-continue-change skill
 * Based on /phsx:continue command
 */
export function getContinueChangeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-continue-change",
    description:
      "继续当前变更：创建下一个制品。适用于用户想推进变更、创建下一份制品或继续工作流时。",
    instructions: `继续当前变更：创建下一个制品。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**

   运行 \`phspec list --json\` 获取按最近修改排序的变更列表，再用 **AskUserQuestion 工具** 让用户选择要继续的变更。

   将最近修改的 3～4 个变更作为选项展示，包含：
   - 变更名
   - 工作流模式（有 \`schema\` 字段则用其值，否则为 "spec-driven")
   - 状态（如 "0/5 tasks"、"complete"、"no tasks"）
   - 最近修改时间（来自 \`lastModified\` 字段）

   将最近修改的变更标为「推荐」，因为用户多半会选它。

   **重要**：不要猜测或自动选变更，始终让用户选择。

2. **查看当前状态**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   解析 JSON 了解当前状态。响应包含：
   - \`schemaName\`：所用工作流模式（如 "spec-driven"）
   - \`artifacts\`：制品数组及状态（"done"、"ready"、"blocked"）
   - \`isComplete\`：是否全部制品已完成

3. **按状态行动**：

   ---

   **若全部制品已完成（\`isComplete: true\`）**：
   - 祝贺用户
   - 展示最终状态（含所用模式）
   - 建议："全部制品已就绪！可以用 \`/phsx:apply\` 实施或归档。"
   - 停止

   ---

   **若有制品可创建**（状态中存在 \`status: "ready"\` 的制品）：
   - 从状态输出中选第一个 \`status: "ready"\` 的制品
   - 获取其指令：
     \`\`\`bash
     phspec instructions <artifact-id> --change "<name>" --json
     \`\`\`
   - 解析 JSON。关键字段：
     - \`context\`：项目背景（给你的约束，不要写入产出）
     - \`rules\`：制品级规则（给你的约束，不要写入产出）
     - \`template\`：产出文件结构
     - \`instruction\`：模式相关指引
     - \`outputPath\`：制品写入路径
     - \`dependencies\`：需先阅读的已完成制品
   - **创建制品文件**：
     - 先读依赖制品以获取上下文
     - 按 \`template\` 填好各节
     - 写作时遵守 \`context\` 与 \`rules\`，但不要原样抄进文件
     - 写入指令中的 outputPath
   - 说明创建了什么、接下来可做哪些
   - 创建完一个制品后即停止

   ---

   **若没有可创建制品（全部 blocked）**：
   - 在合法模式下不应出现
   - 展示状态并建议检查问题

4. **创建制品后展示进度**
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`

**输出**

每次调用后展示：
- 创建了哪个制品
- 所用工作流模式
- 当前进度（N/M 已完成）
- 当前可创建的制品
- 提示："要继续吗？说继续或告诉我下一步即可。"

**制品创建指引**

制品类型与用途由模式决定。以指令输出中的 \`instruction\` 为准。

常见模式（spec-driven）：proposal → specs → design → tasks
- **proposal.md**：若不清楚可先问用户，填写 Why、What Changes、Capabilities、Impact。Capabilities 很关键，每项能力对应一个 spec 文件。
- **specs/<capability>/spec.md**：按提案 Capabilities 每项建一个规范（用能力名，不是变更名）。
- **design.md**：记录技术决策、架构与实现思路。
- **tasks.md**：把实现拆成可勾选任务。

其他模式以 CLI 输出的 \`instruction\` 为准。

**边界**
- 每次调用只创建一个制品
- 创建新制品前先读依赖制品
- 不跳过、不乱序
- 上下文不清时先问用户
- 写入后确认文件存在再标记进度
- 按模式的制品顺序来，不假设具体名称
- **重要**：\`context\` 与 \`rules\` 是给你的约束，不是文件内容；不要将 \`<context>\`、\`<rules>\`、\`<project_context>\` 抄进制品，它们只指导写作，不得出现在产出中`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for phspec-apply-change skill
 * For implementing tasks from a completed (or in-progress) change
 */
export function getApplyChangeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-apply-change",
    description:
      "按变更实施任务。适用于用户要开始实现、继续实现或逐项完成任务时。",
    instructions: `按 PhSpec 变更实施任务。

**输入**：可指定变更名。未指定时从对话推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **选定变更**

   若提供了名称则用该名称。否则：
   - 用户提到过某变更则从上下文推断
   - 仅有一个进行中变更则自动选中
   - 有歧义时运行 \`phspec list --json\` 获取列表，用 **AskUserQuestion 工具** 让用户选择

   始终说明：「当前变更：<name>」，以及如何切换（如 \`/phsx:apply <其他>\`）。

2. **查看状态以确认工作流模式**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   解析 JSON 了解：
   - \`schemaName\`：所用工作流（如 "spec-driven"）
   - 任务所在制品（spec-driven 多为 "tasks"，其他看 status）

3. **获取 apply 指令**

   \`\`\`bash
   phspec instructions apply --change "<name>" --json
   \`\`\`

   返回内容包含：
   - 上下文文件路径（因模式而异，可能为 proposal/specs/design/tasks 等）
   - 进度（总数、已完成、剩余）
   - 任务列表及状态
   - 根据当前状态的动态指令

   **状态处理：**
   - \`state: "blocked"\`（缺制品）：提示并建议先用 phspec-continue-change
   - \`state: "all_done"\`：祝贺并建议归档
   - 否则：进入实施

4. **阅读上下文文件**

   按 apply 指令输出中的 \`contextFiles\` 读取对应文件。
   具体文件因模式而异：**spec-driven** 为 proposal、specs、design、tasks；其他模式以 CLI 的 contextFiles 为准。

5. **展示当前进度**

   展示：所用模式、进度「N/M 任务已完成」、剩余任务概览、CLI 返回的动态指令。

6. **实施任务（循环至完成或受阻）**

   对每个未完成任务：
   - 说明正在做哪项任务
   - 完成所需代码改动
   - 改动保持最小、紧扣该任务
   - 在任务文件中勾选完成：\`- [ ]\` → \`- [x]\`
   - 继续下一项

   **以下情况暂停：**
   - 任务不清晰 → 先澄清
   - 实施暴露出设计问题 → 建议更新制品
   - 报错或受阻 → 说明并等待指示
   - 用户打断

7. **完成或暂停时展示状态**

   展示：本轮完成的任务、总进度「N/M 任务已完成」；若全部完成则建议归档；若暂停则说明原因并等待指示。

**实施过程输出示例**

\`\`\`
## 正在实施：<change-name>（工作流模式：<schema-name>）

正在处理任务 3/7：<任务描述>
[...实施中...]
✓ 任务完成

正在处理任务 4/7：<任务描述>
[...实施中...]
✓ 任务完成
\`\`\`

**全部完成时输出**

\`\`\`
## 实施完成

**变更：** <change-name>
**工作流模式：** <schema-name>
**进度：** 7/7 任务已完成 ✓

### 本轮完成
- [x] 任务 1
- [x] 任务 2
...

全部任务已完成！可以归档该变更。
\`\`\`

**暂停时输出（遇到问题）**

\`\`\`
## 实施暂停

**变更：** <change-name>
**工作流模式：** <schema-name>
**进度：** 4/7 任务已完成

### 遇到的问题
<问题描述>

**可选：**
1. <选项 1>
2. <选项 2>
3. 其他做法

你想怎么处理？
\`\`\`

**边界**
- 按任务顺序做到完成或受阻
- 开始前先读 apply 指令中的上下文文件
- 任务不明确时先暂停询问再实施
- 实施暴露出问题时暂停并建议更新制品
- 代码改动保持最小、限定在当前任务
- 每完成一项立即勾选
- 遇错误、受阻或需求不清时暂停，不猜测
- 以 CLI 的 contextFiles 为准，不假设具体文件名

**与工作流的衔接**

本技能支持「对变更执行动作」：

- **可随时调用**：制品未全完成（但有任务）时、部分实施后、与其他动作穿插
- **允许更新制品**：实施暴露出设计问题时，可建议更新制品，不必锁阶段，灵活推进`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for phspec-ff-change skill
 * Fast-forward through artifact creation
 */
export function getFfChangeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-ff-change",
    description:
      "快进式创建 PhSpec 制品。适用于用户想一次性生成实施所需全部制品时。",
    instructions: `快进式创建制品——一次性生成实施所需全部制品。

**输入**：用户请求应包含变更名（kebab-case）或要做的内容描述。

**步骤**

1. **若未提供明确输入，先问用户要做什么**

   使用 **AskUserQuestion 工具**（开放问题）询问：
   > "你想做哪个变更？描述你想做或要修的内容。"

   从其描述推导 kebab-case 名称（如 "add user authentication" → \`add-user-auth\`）。

   **重要**：未弄清用户要做什么前不要继续。

2. **创建变更目录**
   \`\`\`bash
   phspec new change "<name>"
   \`\`\`
   会在 \`phspec/changes/<name>/\` 下创建脚手架。

3. **获取制品构建顺序**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   解析 JSON 得到：
   - \`applyRequires\`：实施前需要的制品 ID 列表（如 \`["tasks"]\`）
   - \`artifacts\`：所有制品及其状态与依赖

4. **按顺序创建制品直至可实施**

   用 **TodoWrite 工具** 跟踪进度。

   按依赖顺序遍历（无未满足依赖的制品先做）：

   a. **对每个 \`ready\`（依赖已满足）的制品**：
      - 获取指令：
        \`\`\`bash
        phspec instructions <artifact-id> --change "<name>" --json
        \`\`\`
      - 指令 JSON 含：\`context\`（项目背景，勿写入产出）、\`rules\`（制品规则，勿写入产出）、\`template\`（产出结构）、\`instruction\`（该类型指引）、\`outputPath\`、\`dependencies\`（需先读的制品）
      - 先读依赖制品，再按 \`template\` 创建文件，遵守 \`context\` 与 \`rules\` 但不抄入文件
      - 简要提示："✓ 已创建 <artifact-id>"

   b. **直到 \`applyRequires\` 中制品全部完成**
      - 每创建一个制品后重跑 \`phspec status --change "<name>" --json\`
      - 当 \`applyRequires\` 中每个 ID 在 artifacts 中均为 \`status: "done"\` 时停止

   c. **若某制品需要用户输入**（上下文不清）：用 **AskUserQuestion 工具** 澄清后继续

5. **展示最终状态**
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`

**输出**：总结变更名与路径、已创建制品列表、"全部制品已就绪，可以开始实施。"、提示 "运行 \`/phsx:apply\` 或让我实施即可开始任务。"

**制品创建**：按 \`phspec instructions\` 的 \`instruction\` 与模式定义；先读依赖再创建；\`context\` 与 \`rules\` 仅作约束不写入文件。

**边界**：创建模式 \`apply.requires\` 所需的全部制品；先读依赖再创建；名称已存在时建议继续该变更；写入后确认文件存在再继续。`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for phspec-sync-specs skill
 * For syncing delta specs from a change to main specs (agent-driven)
 */
export function getSyncSpecsSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-sync-specs",
    description:
      "将变更中的增量规范同步到主规范。适用于用户想更新主规范但暂不归档变更时。",
    instructions: `将变更中的增量规范同步到主规范。

此为**由 agent 执行**的操作：你读取增量规范并直接编辑主规范以应用变更，从而可智能合并（例如只加场景而不整条复制需求）。

**输入**：可指定变更名。未指定时从对话推断；含糊或有歧义时必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**

   运行 \`phspec list --json\` 获取变更列表，用 **AskUserQuestion 工具** 让用户选择。只展示在 \`specs/\` 下有增量规范的变更。

   **重要**：不要猜测或自动选择，始终让用户选择。

2. **定位增量规范**

   在 \`phspec/changes/<name>/specs/*/spec.md\` 查找增量规范文件。

   每个增量规范文件包含如：\`## ADDED Requirements\`（新增需求）、\`## MODIFIED Requirements\`（修改现有需求）、\`## REMOVED Requirements\`（删除需求）、\`## RENAMED Requirements\`（重命名，FROM:/TO: 格式）。

   若未找到增量规范，告知用户并停止。

3. **对每个增量规范，将变更应用到主规范**

   对 \`phspec/changes/<name>/specs/<capability>/spec.md\` 存在的每个能力：

   a. **读增量规范**，理解要做的变更  
   b. **读主规范** \`phspec/specs/<capability>/spec.md\`（可能尚不存在）  
   c. **按意图合并**：ADDED 若主规范无则添加、有则按 MODIFIED 更新；MODIFIED 在主规范中找到对应需求后增/改场景或描述，保留增量未提及的内容；REMOVED 从主规范删除整条需求；RENAMED 将 FROM 改为 TO  
   d. **若能力尚无主规范**：创建 \`phspec/specs/<capability>/spec.md\`，含 Purpose（可简写为 TBD）与 ADDED 需求

4. **展示摘要**：说明更新了哪些能力、做了哪些增/改/删/重命名。

**增量规范格式参考**

\`\`\`markdown
## ADDED Requirements

### Requirement: New Feature
The system SHALL do something new.

#### Scenario: Basic case
- **WHEN** user does X
- **THEN** system does Y

## MODIFIED Requirements

### Requirement: Existing Feature
#### Scenario: New scenario to add
- **WHEN** user does A
- **THEN** system does B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: \`### Requirement: Old Name\`
- TO: \`### Requirement: New Name\`
\`\`\`

**原则：智能合并**——可做部分更新（例如在 MODIFIED 下只加场景、不复制整条）；增量表示*意图*而非整份替换；合理判断合并。

**成功时输出**：摘要「## Specs 已同步：<change-name>」、更新了哪些能力与需求（Added/Modified/Removed/Renamed）、说明主规范已更新、变更仍进行中，实施完成后再归档。

**边界**：先读增量与主规范再改；保留增量未提及的既有内容；不清处先澄清；边改边说明；操作应幂等（执行两次结果一致）。`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for phspec-onboard skill
 * Guided onboarding through the complete PhSpec workflow
 */
export function getOnboardSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-onboard",
    description:
      "PhSpec 引导入门：带讲解走完一整轮工作流，并基于真实代码库操作。",
    instructions: getOnboardInstructions(),
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Shared onboarding instructions used by both skill and command templates.
 */
function getOnboardInstructions(): string {
  return `引导用户完成第一次完整的 PhSpec 工作流循环。这是一次教学式体验——你会在其代码库中做真实操作，并逐步讲解。

---

## 前置检查

开始前确认 PhSpec CLI 是否已安装：

\`\`\`bash
# Unix/macOS
phspec --version 2>&1 || echo "CLI_NOT_INSTALLED"
# Windows (PowerShell)
# if (Get-Command phspec -ErrorAction SilentlyContinue) { phspec --version } else { echo "CLI_NOT_INSTALLED" }
\`\`\`

**若未安装 CLI：**
> PhSpec CLI 未安装。请先安装，再回来执行 \`/phsx:onboard\`。

未安装则在此停止。

---

## 阶段 1：欢迎

展示：

\`\`\`
## 欢迎使用 PhSpec！

我会用你代码库里的一个真实任务，带你走完从想法到实现的一整轮变更。一边做一边熟悉工作流。

**我们将要做的事：**
1. 在代码库中选一个小而实的任务
2. 简短探索问题
3. 创建一个变更（作为工作的容器）
4. 搭建制品：提案 → 规范 → 设计 → 任务
5. 实施任务
6. 归档已完成的变更

**预计时间：** 约 15–20 分钟

先从找一件事开始吧。
\`\`\`

---

## 阶段 2：选择任务

### 代码库分析

扫描代码库，寻找可做的小改进。关注：

1. **TODO/FIXME 注释** - 在代码中搜索 \`TODO\`、\`FIXME\`、\`HACK\`、\`XXX\`
2. **缺失错误处理** - 吞掉错误的 \`catch\`、无 try-catch 的风险操作
3. **无测试的函数** - 对照 \`src/\` 与测试目录
4. **类型问题** - TypeScript 中的 \`any\`（\`: any\`、\`as any\`）
5. **调试残留** - 非调试代码中的 \`console.log\`、\`console.debug\`、\`debugger\`
6. **缺失校验** - 用户输入处无校验

并查看近期 git 记录：
\`\`\`bash
# Unix/macOS
git log --oneline -10 2>/dev/null || echo "No git history"
# Windows (PowerShell)
# git log --oneline -10 2>$null; if ($LASTEXITCODE -ne 0) { echo "No git history" }
\`\`\`

### 呈现建议

根据分析给出 3–4 条具体建议：

\`\`\`
## 任务建议

根据对代码库的扫描，以下是不错的入门任务：

**1. [最推荐的一条]**
   位置：\`src/path/to/file.ts:42\`
   范围：约 1–2 个文件，约 20–30 行
   推荐理由：[简短说明]

**2. [第二条]**
   位置：\`src/another/file.ts\`
   范围：约 1 个文件，约 15 行
   推荐理由：[简短说明]

**3. [第三条]**
   位置：[位置]
   范围：[估计]
   推荐理由：[简短说明]

**4. 其他？**
   说说你想做哪类事情。

你对哪条感兴趣？（选编号或描述自己的任务）
\`\`\`

**若未找到合适任务**：改为询问用户想做什么：
> 在代码库中没发现明显可快速改进的点。有没有你一直想加或想修的小功能？

### 范围边界

若用户选或描述的任务过大（大功能、多日工作量）：

\`\`\`
这个任务很有价值，但对第一次跑通 PhSpec 来说可能偏大。

学工作流时越小越好，能完整走完一轮而不卡在实现细节里。

**可选：**
1. **再切小一点** - [他们的任务] 里最小可用的那块是什么？比如只做 [具体一块]？
2. **换一条** - 选上面其他建议，或换一个小任务？
3. **仍做这条** - 若你坚持，我们可以做，只是会花更久。

你更倾向哪种？
\`\`\`

用户坚持时可尊重其选择——这是软性边界。

---

## 阶段 3：探索演示

任务选定后，简短演示探索模式：

\`\`\`
在创建变更之前，先快速展示一下**探索模式**——在确定方向前用来把问题想清楚。
\`\`\`

花 1–2 分钟查看相关代码：
- 阅读涉及的文件
- 必要时画简单位 ASCII 图
- 记下注意点

\`\`\`
## 快速探索

[你的简短分析：发现了什么、有何注意点]

┌─────────────────────────────────────────┐
│   [可选：有帮助的 ASCII 图]              │
└─────────────────────────────────────────┘

探索模式（\`/phsx:explore\`）就是用来做这种「先想再做」的。需要理清问题时随时可用。

接下来我们创建一个变更来承载这次工作。
\`\`\`

**暂停** - 等用户表示认可后再继续。

---

## 阶段 4：创建变更

**说明：**
\`\`\`
## 创建变更

PhSpec 里的「变更」是一次工作相关的思考与计划的容器，位于 \`phspec/changes/<name>/\`，里面放提案、规范、设计、任务等制品。

我为这次任务创建一个。
\`\`\`

**执行：** 用推导出的 kebab-case 名称创建变更：
\`\`\`bash
phspec new change "<derived-name>"
\`\`\`

**展示：**
\`\`\`
已创建：\`phspec/changes/<name>/\`

目录结构：
\`\`\`
phspec/changes/<name>/
├── proposal.md    ← 为什么做（空，待填写）
├── design.md      ← 怎么做（空）
├── specs/         ← 详细需求（空）
└── tasks.md       ← 实施清单（空）
\`\`\`

接下来填写第一个制品——提案。
\`\`\`

---

## 阶段 5：提案

**说明：**
\`\`\`
## 提案

提案记录**为什么**做这次变更、**做什么**（高层概括），相当于这次工作的「电梯演讲」。

我按当前任务起草一份。
\`\`\`

**执行：** 起草提案内容（先不保存）：

\`\`\`
这是草案：

---

## 动机

[1–2 句说明问题/机会]

## 变更内容

[要改变什么的要点]

## 能力

### 新增能力
- \`<capability-name>\`: [简短描述]

### 修改能力
<!-- 若为修改现有行为 -->

## 影响

- \`src/path/to/file.ts\`: [会改什么]
- [其他涉及文件]

---

是否表达清楚了？保存前可以再改。
\`\`\`

**暂停** - 等用户同意或反馈。

同意后保存提案：
\`\`\`bash
phspec instructions proposal --change "<name>" --json
\`\`\`
再将内容写入 \`phspec/changes/<name>/proposal.md\`。

\`\`\`
提案已保存。这是你的「为什么」文档，理解深化后随时可回来改。

下一步：规范。
\`\`\`

---

## 阶段 6：规范

**说明：**
\`\`\`
## 规范

规范用可测试的精确语言定义**做什么**，采用需求/场景格式，让预期行为一目了然。

像这样的小任务，可能只需要一个规范文件。
\`\`\`

**执行：** 创建规范目录与文件：
\`\`\`bash
# Unix/macOS
mkdir -p phspec/changes/<name>/specs/<capability-name>
# Windows (PowerShell)
# New-Item -ItemType Directory -Force -Path "phspec/changes/<name>/specs/<capability-name>"
\`\`\`

起草规范内容：

\`\`\`
规范草案：

---

## ADDED Requirements

### Requirement: <Name>

<系统应做什么的描述>

#### Scenario: <Scenario name>

- **WHEN** <触发条件>
- **THEN** <预期结果>
- **AND** <若有附加结果>

---

WHEN/THEN/AND 格式让需求可测试，可直接当测试用例读。
\`\`\`

保存到 \`phspec/changes/<name>/specs/<capability>/spec.md\`。

---

## 阶段 7：设计

**说明：**
\`\`\`
## 设计

设计记录**怎么做**——技术决策、取舍、实现思路。

小变更可以写得很短，不必每个变更都做长篇设计讨论。
\`\`\`

**执行：** 起草 design.md：

\`\`\`
设计草案：

---

## Context

[当前状态的简短上下文]

## Goals / Non-Goals

**目标：**
- [要达成的结果]

**非目标：**
- [明确不做的范围]

## Decisions

### Decision 1: [关键决策]

[做法与理由]

---

小任务这样就能抓住关键决策，不必过度设计。
\`\`\`

保存到 \`phspec/changes/<name>/design.md\`。

---

## 阶段 8：任务

**说明：**
\`\`\`
## 任务

最后把工作拆成实施任务——勾选清单，驱动 apply 阶段。

任务应小而清晰，顺序合理。
\`\`\`

**执行：** 根据规范与设计生成任务：

\`\`\`
实施任务草案：

---

## 1. [类别或文件]

- [ ] 1.1 [具体任务]
- [ ] 1.2 [具体任务]

## 2. Verify

- [ ] 2.1 [验证步骤]

---

每个勾选对应 apply 阶段的一个工作单元。准备好实施了吗？
\`\`\`

**暂停** - 等用户确认可以开始实施。

保存到 \`phspec/changes/<name>/tasks.md\`。

---

## 阶段 9：实施（Apply）

**说明：**
\`\`\`
## 实施

现在逐项实施任务，边做边勾选。我会说明当前在做哪条，偶尔点出规范/设计如何影响做法。
\`\`\`

**执行：** 对每条任务：

1. 说明：「正在做任务 N：[描述]」
2. 在代码库中完成修改
3. 自然引用规范/设计：「规范里要求 X，所以这里做 Y」
4. 在 tasks.md 中勾选：\`- [ ]\` → \`- [x]\`
5. 简短状态：「✓ 任务 N 完成」

叙述保持简洁，不必逐行解释代码。

全部完成后：

\`\`\`
## 实施完成

任务已全部完成：
- [x] Task 1
- [x] Task 2
- [x] ...

变更已落地！最后一步——归档。
\`\`\`

---

## 阶段 10：归档

**说明：**
\`\`\`
## 归档

变更完成后进行归档，会从 \`phspec/changes/\` 移动到 \`phspec/changes/archive/YYYY-MM-DD-<name>/\`。

归档后的变更成为项目的决策历史，日后可随时查看当时为何这样实现。
\`\`\`

**执行：**
\`\`\`bash
phspec archive "<name>"
\`\`\`

**展示：**
\`\`\`
已归档至：\`phspec/changes/archive/YYYY-MM-DD-<name>/\`

变更已进入项目历史，代码在代码库中，决策记录已保留。
\`\`\`

---

## 阶段 11：回顾与下一步

\`\`\`
## 完成

你已经跑完一整轮 PhSpec：

1. **探索** - 把问题想清楚
2. **新建** - 创建变更容器
3. **提案** - 记录为什么
4. **规范** - 明确做什么
5. **设计** - 决定怎么做
6. **任务** - 拆成步骤
7. **实施** - 完成实现
8. **归档** - 保留记录

同样的节奏适用于任何规模的变更——小修小补或大功能都适用。

---

## 命令速查

| 命令 | 用途 |
|---------|--------------|
| \`/phsx:explore\` | 工作前后理清问题 |
| \`/phsx:new\` | 新建变更，按步骤建制品 |
| \`/phsx:ff\` | 快进：一次性建齐制品 |
| \`/phsx:continue\` | 继续已有变更 |
| \`/phsx:apply\` | 按变更实施任务 |
| \`/phsx:verify\` | 校验实现与制品是否一致 |
| \`/phsx:archive\` | 归档已完成的变更 |

---

## 下一步

用 \`/phsx:new\` 或 \`/phsx:ff\` 在你真正想做的功能上试一次，节奏你已经有了。
\`\`\`

---

## 从容退出

### 用户中途想停

若用户表示要停、要暂停或显得不投入：

\`\`\`
没问题！当前变更已保存在 \`phspec/changes/<name>/\`。

之后想接着做可以：
- \`/phsx:continue <name>\` - 继续创建制品
- \`/phsx:apply <name>\` - 直接进入实施（若已有任务）

工作不会丢，随时回来即可。
\`\`\`

从容结束，不施压。

### 用户只要命令速查

若用户说只想看命令或跳过教程：

\`\`\`
## PhSpec 速查

| 命令 | 用途 |
|---------|--------------|
| \`/phsx:explore\` | 理清问题（不写代码） |
| \`/phsx:new <name>\` | 新建变更，逐步建制品 |
| \`/phsx:ff <name>\` | 快进：一次性建齐制品 |
| \`/phsx:continue <name>\` | 继续已有变更 |
| \`/phsx:apply <name>\` | 实施任务 |
| \`/phsx:verify <name>\` | 校验实现 |
| \`/phsx:archive <name>\` | 完成后归档 |

用 \`/phsx:new\` 开始你的第一个变更，或 \`/phsx:ff\` 快速推进。
\`\`\`

从容结束。

---

## 边界

- **在关键节点遵循「说明 → 执行 → 展示 → 暂停」**（探索后、提案草案后、任务后、归档后）
- **实施时叙述简洁**——教流程不教逐行
- **不跳过阶段**——即便变更很小，目标是学会工作流
- **在标记处暂停等确认**，但不要过度暂停
- **从容处理退出**——不催促用户继续
- **用真实代码库任务**——不模拟、不用假例子
- **温和引导范围**——倾向小任务，但尊重用户选择`;
}

// -----------------------------------------------------------------------------
// Slash Command Templates
// -----------------------------------------------------------------------------

export interface CommandTemplate {
  name: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

/**
 * Template for /phsx:explore slash command
 * Explore mode - adaptive thinking partner
 */
export function getOpsxExploreCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Explore",
    description: "进入探索模式：梳理想法、排查问题、澄清需求",
    category: "Workflow",
    tags: ["workflow", "explore", "experimental", "thinking"],
    content: `进入探索模式。深入思考，自由可视化，对话可任意延伸。

**重要：探索模式用于思考，不用于实施。** 你可以读文件、搜代码、查代码库，但绝不要写代码或实现功能。若用户要求实现某功能，提醒其先退出探索模式（例如用 \`/phsx:new\` 或 \`/phsx:ff\` 新建变更）。若用户要求，你可以创建 PhSpec 制品（提案、设计、规范）——那是记录思考，不是实施。

**这是立场，不是工作流。** 没有固定步骤、必选顺序或强制产出。你是帮助用户探索的思考伙伴。

**输入**：\`/phsx:explore\` 后的参数是用户想思考的内容，可以是：
- 模糊想法："real-time collaboration"
- 具体问题："the auth system is getting unwieldy"
- 变更名："add-dark-mode"（在该变更上下文中探索）
- 比较："postgres vs sqlite for this"
- 无（仅进入探索模式）

---

## 立场

- **好奇而不说教** - 自然提出涌现出的问题，不按脚本走
- **开放话题而非审问** - 呈现多个有趣方向，让用户选有共鸣的。不要用单一问题线牵着走
- **可视化** - 有助厘清思路时多用 ASCII 图
- **顺势而为** - 跟随有趣线索，信息变化时随时转向
- **耐心** - 不急于下结论，让问题轮廓自然浮现
- **接地** - 相关时探查真实代码库，不只空谈

---

## 你可以做的事

视用户带来的内容，你可以：

**探索问题空间**
- 根据其表述提出澄清问题
- 挑战假设
- 重述问题
- 找类比

**探查代码库**
- 画出与讨论相关的现有架构
- 找集成点
- 识别已有模式
- 暴露隐藏复杂度

**比较方案**
- 头脑风暴多种做法
- 做对比表
- 勾画取舍
- 被问时给出推荐

**可视化**
\`\`\`
┌─────────────────────────────────────────┐
│     Use ASCII diagrams liberally        │
├─────────────────────────────────────────┤
│                                         │
│   ┌────────┐         ┌────────┐        │
│   │ State  │────────▶│ State  │        │
│   │   A    │         │   B    │        │
│   └────────┘         └────────┘        │
│                                         │
│   System diagrams, state machines,      │
│   data flows, architecture sketches,    │
│   dependency graphs, comparison tables  │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**暴露风险与未知**
- 指出可能出问题的地方
- 发现理解缺口
- 建议探针或调研

---

## 对 PhSpec 的认知

你具备 PhSpec 的完整上下文。自然使用即可，不必生搬。

### 查看上下文

开始时快速查看现状：
\`\`\`bash
phspec list --json
\`\`\`

可知：是否有进行中的变更、其名称与工作流模式及状态、用户可能在做什么。若用户提到具体变更名，可读其制品获取上下文。

### 当没有变更时

自由思考。当思路成型时，可以提议："思路已经比较清晰，要新建一个变更吗？" → 可转入 \`/phsx:new\` 或 \`/phsx:ff\`；或继续探索，不必非要形式化。

### 当已有变更时

若用户提到某变更或你发现与某变更相关：阅读已有制品、在对话中自然引用、在做决策时提议记录（见下表）、由用户决定——提议后继续，不施压，不自动写入。

| 洞察类型 | 记录位置 |
|--------------|------------------|
| 新发现的需求 | \`specs/<capability>/spec.md\` |
| 需求变更 | \`specs/<capability>/spec.md\` |
| 设计决策 | \`design.md\` |
| 范围变更 | \`proposal.md\` |
| 新识别的任务 | \`tasks.md\` |
| 假设被推翻 | 相关制品 |

---

## 你不必做的事

- 按脚本走
- 每次都问同样问题
- 产出指定制品
- 必须得出结论
- tangent 有价值时也要死守主题
- 非要简短（这是思考时间）

---

## 结束探索

没有固定收尾。可转入行动、沉淀到制品、只提供清晰度或改天再续。当思路成型时可做小结，但可选；有时思考过程本身就是价值。

---

## 边界

- **不实施** - 绝不写代码或实现功能。创建 PhSpec 制品可以，写业务代码不行。
- **不装懂** - 不清楚就继续挖
- **不赶** - 探索是思考时间，不是任务时间
- **不强行结构** - 让模式自然浮现
- **不自动记录** - 提议保存洞察，不要擅自写入
- **要可视化** - 一张好图顶很多段文字
- **要查代码库** - 讨论要落在实际上
- **要质疑假设** - 包括用户和你自己的`,
  };
}

/**
 * Template for /phsx:new slash command
 */
export function getOpsxNewCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: New",
    description: "新建变更（PHSX 制品工作流）",
    category: "Workflow",
    tags: ["workflow", "artifacts", "experimental"],
    content: `Start a new change using the experimental artifact-driven approach.

**Input**: The argument after \`/phsx:new\` is the change name (kebab-case), OR a description of what the user wants to build.

**Steps**

1. **If no input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → \`add-user-auth\`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Determine the workflow schema**

   Use the default schema (omit \`--schema\`) unless the user explicitly requests a different workflow.

   **Use a different schema only if the user mentions:**
   - A specific schema name → use \`--schema <name>\`
   - "show workflows" or "what workflows" → run \`phspec schemas --json\` and let them choose

   **Otherwise**: Omit \`--schema\` to use the default.

3. **Create the change directory**
   \`\`\`bash
   phspec new change "<name>"
   \`\`\`
   Add \`--schema <name>\` only if the user requested a specific workflow.
   This creates a scaffolded change at \`phspec/changes/<name>/\` with the selected schema.

4. **Show the artifact status**
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`
   This shows which artifacts need to be created and which are ready (dependencies satisfied).

5. **Get instructions for the first artifact**
   The first artifact depends on the schema. Check the status output to find the first artifact with status "ready".
   \`\`\`bash
   phspec instructions <first-artifact-id> --change "<name>"
   \`\`\`
   This outputs the template and context for creating the first artifact.

6. **STOP and wait for user direction**

**Output**

After completing the steps, summarize:
- Change name and location
- Schema/workflow being used and its artifact sequence
- Current status (0/N artifacts complete)
- The template for the first artifact
- Prompt: "Ready to create the first artifact? Run \`/phsx:continue\` or just describe what this change is about and I'll draft it."

**Guardrails**
- Do NOT create any artifacts yet - just show the instructions
- Do NOT advance beyond showing the first artifact template
- If the name is invalid (not kebab-case), ask for a valid name
- If a change with that name already exists, suggest using \`/phsx:continue\` instead
- Pass --schema if using a non-default workflow`,
  };
}

/**
 * Template for /phsx:continue slash command
 */
export function getOpsxContinueCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Continue",
    description: "继续变更：创建下一个制品",
    category: "Workflow",
    tags: ["workflow", "artifacts", "experimental"],
    content: `Continue working on a change by creating the next artifact.

**Input**: Optionally specify a change name after \`/phsx:continue\` (e.g., \`/phsx:continue add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`phspec list --json\` to get available changes sorted by most recently modified. Then use the **AskUserQuestion tool** to let the user select which change to work on.

   Present the top 3-4 most recently modified changes as options, showing:
   - Change name
   - Schema (from \`schema\` field if present, otherwise "spec-driven")
   - Status (e.g., "0/5 tasks", "complete", "no tasks")
   - How recently it was modified (from \`lastModified\` field)

   Mark the most recently modified change as "(Recommended)" since it's likely what the user wants to continue.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check current status**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand current state. The response includes:
   - \`schemaName\`: The workflow schema being used (e.g., "spec-driven")
   - \`artifacts\`: Array of artifacts with their status ("done", "ready", "blocked")
   - \`isComplete\`: Boolean indicating if all artifacts are complete

3. **Act based on status**:

   ---

   **If all artifacts are complete (\`isComplete: true\`)**:
   - Congratulate the user
   - Show final status including the schema used
   - Suggest: "All artifacts created! You can now implement this change with \`/phsx:apply\` or archive it with \`/phsx:archive\`."
   - STOP

   ---

   **If artifacts are ready to create** (status shows artifacts with \`status: "ready"\`):
   - Pick the FIRST artifact with \`status: "ready"\` from the status output
   - Get its instructions:
     \`\`\`bash
     phspec instructions <artifact-id> --change "<name>" --json
     \`\`\`
   - Parse the JSON. The key fields are:
     - \`context\`: Project background (constraints for you - do NOT include in output)
     - \`rules\`: Artifact-specific rules (constraints for you - do NOT include in output)
     - \`template\`: The structure to use for your output file
     - \`instruction\`: Schema-specific guidance
     - \`outputPath\`: Where to write the artifact
     - \`dependencies\`: Completed artifacts to read for context
   - **Create the artifact file**:
     - Read any completed dependency files for context
     - Use \`template\` as the structure - fill in its sections
     - Apply \`context\` and \`rules\` as constraints when writing - but do NOT copy them into the file
     - Write to the output path specified in instructions
   - Show what was created and what's now unlocked
   - STOP after creating ONE artifact

   ---

   **If no artifacts are ready (all blocked)**:
   - This shouldn't happen with a valid schema
   - Show status and suggest checking for issues

4. **After creating an artifact, show progress**
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`

**Output**

After each invocation, show:
- Which artifact was created
- Schema workflow being used
- Current progress (N/M complete)
- What artifacts are now unlocked
- Prompt: "Run \`/phsx:continue\` to create the next artifact"

**Artifact Creation Guidelines**

The artifact types and their purpose depend on the schema. Use the \`instruction\` field from the instructions output to understand what to create.

Common artifact patterns:

**spec-driven schema** (proposal → specs → design → tasks):
- **proposal.md**: Ask user about the change if not clear. Fill in Why, What Changes, Capabilities, Impact.
  - The Capabilities section is critical - each capability listed will need a spec file.
- **specs/<capability>/spec.md**: Create one spec per capability listed in the proposal's Capabilities section (use the capability name, not the change name).
- **design.md**: Document technical decisions, architecture, and implementation approach.
- **tasks.md**: Break down implementation into checkboxed tasks.

For other schemas, follow the \`instruction\` field from the CLI output.

**Guardrails**
- Create ONE artifact per invocation
- Always read dependency artifacts before creating a new one
- Never skip artifacts or create out of order
- If context is unclear, ask the user before creating
- Verify the artifact file exists after writing before marking progress
- Use the schema's artifact sequence, don't assume specific artifact names
- **IMPORTANT**: \`context\` and \`rules\` are constraints for YOU, not content for the file
  - Do NOT copy \`<context>\`, \`<rules>\`, \`<project_context>\` blocks into the artifact
  - These guide what you write, but should never appear in the output`,
  };
}

/**
 * Template for /phsx:apply slash command
 */
export function getOpsxApplyCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Apply",
    description: "按 PhSpec 变更实施任务",
    category: "Workflow",
    tags: ["workflow", "artifacts", "experimental"],
    content: `Implement tasks from an PhSpec change.

**Input**: Optionally specify a change name (e.g., \`/phsx:apply add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run \`phspec list --json\` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., \`/phsx:apply <other>\`).

2. **Check status to understand the schema**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used (e.g., "spec-driven")
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   \`\`\`bash
   phspec instructions apply --change "<name>" --json
   \`\`\`

   This returns:
   - Context file paths (varies by schema)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If \`state: "blocked"\` (missing artifacts): show message, suggest using \`/phsx:continue\`
   - If \`state: "all_done"\`: congratulate, suggest archive
   - Otherwise: proceed to implementation

4. **Read context files**

   Read the files listed in \`contextFiles\` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Implement tasks (loop until done or blocked)**

   For each pending task:
   - Show which task is being worked on
   - Make the code changes required
   - Keep changes minimal and focused
   - Mark task complete in the tasks file: \`- [ ]\` → \`- [x]\`
   - Continue to next task

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

7. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - If all done: suggest archive
   - If paused: explain why and wait for guidance

**Output During Implementation**

\`\`\`
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
\`\`\`

**Output On Completion**

\`\`\`
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! You can archive this change with \`/phsx:archive\`.
\`\`\`

**Output On Pause (Issue Encountered)**

\`\`\`
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
\`\`\`

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly`,
  };
}

/**
 * Template for /phsx:ff slash command
 */
export function getOpsxFfCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Fast Forward",
    description: "创建变更并一次性生成实施所需全部制品",
    category: "Workflow",
    tags: ["workflow", "artifacts", "experimental"],
    content: `Fast-forward through artifact creation - generate everything needed to start implementation.

**Input**: The argument after \`/phsx:ff\` is the change name (kebab-case), OR a description of what the user wants to build.

**Steps**

1. **If no input provided, ask what they want to build**

   Use the **AskUserQuestion tool** (open-ended, no preset options) to ask:
   > "What change do you want to work on? Describe what you want to build or fix."

   From their description, derive a kebab-case name (e.g., "add user authentication" → \`add-user-auth\`).

   **IMPORTANT**: Do NOT proceed without understanding what the user wants to build.

2. **Create the change directory**
   \`\`\`bash
   phspec new change "<name>"
   \`\`\`
   This creates a scaffolded change at \`phspec/changes/<name>/\`.

3. **Get the artifact build order**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to get:
   - \`applyRequires\`: array of artifact IDs needed before implementation (e.g., \`["tasks"]\`)
   - \`artifacts\`: list of all artifacts with their status and dependencies

4. **Create artifacts in sequence until apply-ready**

   Use the **TodoWrite tool** to track progress through the artifacts.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is \`ready\` (dependencies satisfied)**:
      - Get instructions:
        \`\`\`bash
        phspec instructions <artifact-id> --change "<name>" --json
        \`\`\`
      - The instructions JSON includes:
        - \`context\`: Project background (constraints for you - do NOT include in output)
        - \`rules\`: Artifact-specific rules (constraints for you - do NOT include in output)
        - \`template\`: The structure to use for your output file
        - \`instruction\`: Schema-specific guidance for this artifact type
        - \`outputPath\`: Where to write the artifact
        - \`dependencies\`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using \`template\` as the structure
      - Apply \`context\` and \`rules\` as constraints - but do NOT copy them into the file
      - Show brief progress: "✓ Created <artifact-id>"

   b. **Continue until all \`applyRequires\` artifacts are complete**
      - After creating each artifact, re-run \`phspec status --change "<name>" --json\`
      - Check if every artifact ID in \`applyRequires\` has \`status: "done"\` in the artifacts array
      - Stop when all \`applyRequires\` artifacts are done

   c. **If an artifact requires user input** (unclear context):
      - Use **AskUserQuestion tool** to clarify
      - Then continue with creation

5. **Show final status**
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`

**Output**

After completing all artifacts, summarize:
- Change name and location
- List of artifacts created with brief descriptions
- What's ready: "All artifacts created! Ready for implementation."
- Prompt: "Run \`/phsx:apply\` to start implementing."

**Artifact Creation Guidelines**

- Follow the \`instruction\` field from \`phspec instructions\` for each artifact type
- The schema defines what each artifact should contain - follow it
- Read dependency artifacts for context before creating new ones
- Use the \`template\` as a starting point, filling in based on context

**Guardrails**
- Create ALL artifacts needed for implementation (as defined by schema's \`apply.requires\`)
- Always read dependency artifacts before creating a new one
- If context is critically unclear, ask the user - but prefer making reasonable decisions to keep momentum
- If a change with that name already exists, ask if user wants to continue it or create a new one
- Verify each artifact file exists after writing before proceeding to next`,
  };
}

/**
 * Template for phspec-archive-change skill
 * For archiving completed changes in the experimental workflow
 */
export function getArchiveChangeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-archive-change",
    description: "归档已完成的变更。适用于实施完成后要收尾并归档变更时。",
    instructions: `在实验性工作流中归档已完成的变更。

**输入**：可指定变更名。未指定时从对话推断；含糊或有歧义时必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**

   运行 \`phspec list --json\` 获取变更列表，用 **AskUserQuestion 工具** 让用户选择。只展示进行中的变更（未归档的），若有则展示每个变更所用工作流模式。

   **重要**：不要猜测或自动选择，始终让用户选择。

2. **检查制品完成状态**

   运行 \`phspec status --change "<name>" --json\` 查看制品完成情况。解析 JSON：\`schemaName\`、\`artifacts\` 及各状态（\`done\` 或其他）。若有制品未 \`done\`：列出未完成制品并警告，用 **AskUserQuestion 工具** 确认是否继续，用户确认后继续。

3. **检查任务完成状态**

   阅读任务文件（通常为 \`tasks.md\`），统计 \`- [ ]\`（未完成）与 \`- [x]\`（已完成）。若有未完成任务：展示未完成数量并警告，用 **AskUserQuestion 工具** 确认是否继续，用户确认后继续。若无任务文件：不提示任务相关警告，继续。

4. **评估增量规范同步状态**

   检查 \`phspec/changes/<name>/specs/\` 是否有增量规范。若无则不必提示同步。若有：将各增量规范与主规范 \`phspec/specs/<capability>/spec.md\` 对比，说明会应用哪些变更（增/改/删/重命名），在提示前展示合并摘要。选项：若需同步则「立即同步（推荐）」「不同步直接归档」；若已同步则「立即归档」「仍同步一次」「取消」。若用户选同步，用 Task 工具（subagent_type: "general-purpose", prompt: "用 Skill 工具调用 phspec-sync-specs 处理变更 '<name>'。增量分析：<上述摘要>"）。无论是否同步，最终执行归档。

5. **执行归档**

   若不存在则创建 \`phspec/changes/archive\`。目标名用当前日期：\`YYYY-MM-DD-<change-name>\`。若目标已存在：报错并建议重命名已有归档或换日期。否则执行 \`mv phspec/changes/<name> phspec/changes/archive/YYYY-MM-DD-<name>\`。

6. **展示摘要**

   包含：变更名、所用工作流模式、归档路径、是否已同步规范（若适用）、任何警告（未完成制品/任务）。

**成功时输出**

\`\`\`
## 归档完成

**变更：** <change-name>
**工作流模式：** <schema-name>
**归档至：** phspec/changes/archive/YYYY-MM-DD-<name>/
**规范：** ✓ 已同步到主规范（或「无增量规范」或「已跳过同步」）

全部制品已完成。全部任务已完成。
\`\`\`

**边界**
- 未提供变更时始终让用户选择
- 用 phspec status --json 检查完成度
- 有警告时仅提示并确认，不阻止归档
- 移动目录时保留 .phspec.yaml
- 若需同步则用 phspec-sync-specs（agent 驱动）
- 有增量规范时先做同步评估并展示合并摘要再提示`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for phspec-bulk-archive-change skill
 * For archiving multiple completed changes at once
 */
export function getBulkArchiveChangeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-bulk-archive-change",
    description: "一次性归档多个已完成的变更。适用于并行多个变更一起收尾时。",
    instructions: `一次性归档多个已完成的变更。

本技能支持批量归档，通过检查代码库判断实际实现情况，智能处理规范冲突。

**输入**：无必填（会提示选择变更）

**步骤**

1. **获取进行中的变更**

   运行 \`phspec list --json\` 获取所有进行中的变更。若无，告知用户并结束。

2. **让用户选择要归档的变更**

   用 **AskUserQuestion 工具** 多选：展示每个变更及其工作流模式，提供「全部变更」选项，允许选任意数量（1+ 即可，通常 2+）。

   **重要**：不要自动选择，始终让用户选择。

3. **批量校验 - 收集所选变更的状态**

   对每个所选变更收集：a) **制品状态**：\`phspec status --change "<name>" --json\`，解析 \`schemaName\` 与 \`artifacts\`，记录 \`done\` 与非 done；b) **任务完成**：读 \`phspec/changes/<name>/tasks.md\`，统计 \`- [ ]\` / \`- [x]\`，无任务文件则记为「无任务」；c) **增量规范**：检查 \`phspec/changes/<name>/specs/\`，列出能力及 \`### Requirement: <name>\` 需求名。

4. **检测规范冲突**

   构建 \`capability -> [涉及该能力的变更]\` 映射。当 2+ 所选变更对同一能力有增量规范时即存在冲突。

5. **由 agent 解决冲突**

   对每个冲突：a) 读各冲突变更的增量规范，理解各自声称的增/改；b) 在代码库中搜索实现证据（实现需求的代码、相关文件/函数/测试）；c) 决定方案：仅一个变更有实现则只同步该变更的规范；两个都有实现则按时间顺序应用（先旧后新）；都无实现则跳过规范同步并警告用户；d) 记录每个冲突的解决：应用哪（几）个变更的规范、顺序及依据。

6. **展示汇总状态表**

   用表格汇总所有变更（Change / Artifacts / Tasks / Specs / Conflicts / Status）。对冲突展示解决说明；对未完成变更展示警告。

7. **确认批量操作**

   用 **AskUserQuestion 工具** 一次确认：「归档 N 个变更？」选项可包括「全部归档」「仅归档 N 个就绪的（跳过未完成）」「取消」。若有未完成变更，明确说明将带警告归档。

8. **对每个确认的变更执行归档**

   按既定顺序（含冲突解决顺序）：a) 若有增量规范则先同步（phspec-sync-specs，agent 驱动智能合并；冲突按解决顺序应用）；b) 执行 \`mkdir -p phspec/changes/archive\` 与 \`mv phspec/changes/<name> phspec/changes/archive/YYYY-MM-DD-<name>\`；c) 记录每项结果：成功 / 失败（记录错误）/ 跳过。

9. **展示摘要**

   成功时：## 批量归档完成；列出已归档变更及路径；规范同步摘要（N 个增量已同步，无冲突或 M 个冲突已解决）。部分成功时：已归档 / 已跳过 / 失败列表。若有失败：Failed K changes: <name>: 原因。无进行中变更时：## 无变更可归档；提示用 \`/phsx:new\` 新建。

**冲突解决示例**（仅一个已实现：只同步已实现变更的规范；两个都已实现：按时间顺序先应用旧变更再新变更）。

**边界**
- 允许 1+ 变更（2+ 为常见用法）
- 始终提示选择，不自动选
- 尽早检测规范冲突并通过查代码库解决
- 两变更都已实现时按时间顺序应用规范
- 仅当实现缺失时跳过规范同步（并警告用户）
- 确认前展示清晰的每变更状态
- 整批一次确认
- 记录并汇报所有结果（成功/跳过/失败）
- 移动时保留 .phspec.yaml，归档目录名为当前日期 YYYY-MM-DD-<name>
- 若归档目标已存在，该变更报错但继续处理其余变更`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for /phsx:sync slash command
 */
export function getOpsxSyncCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Sync",
    description: "将变更的增量规范同步到主规范",
    category: "Workflow",
    tags: ["workflow", "specs", "experimental"],
    content: `Sync delta specs from a change to main specs.

This is an **agent-driven** operation - you will read delta specs and directly edit main specs to apply the changes. This allows intelligent merging (e.g., adding a scenario without copying the entire requirement).

**Input**: Optionally specify a change name after \`/phsx:sync\` (e.g., \`/phsx:sync add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`phspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have delta specs (under \`specs/\` directory).

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Find delta specs**

   Look for delta spec files in \`phspec/changes/<name>/specs/*/spec.md\`.

   Each delta spec file contains sections like:
   - \`## ADDED Requirements\` - New requirements to add
   - \`## MODIFIED Requirements\` - Changes to existing requirements
   - \`## REMOVED Requirements\` - Requirements to remove
   - \`## RENAMED Requirements\` - Requirements to rename (FROM:/TO: format)

   If no delta specs found, inform user and stop.

3. **For each delta spec, apply changes to main specs**

   For each capability with a delta spec at \`phspec/changes/<name>/specs/<capability>/spec.md\`:

   a. **Read the delta spec** to understand the intended changes

   b. **Read the main spec** at \`phspec/specs/<capability>/spec.md\` (may not exist yet)

   c. **Apply changes intelligently**:

      **ADDED Requirements:**
      - If requirement doesn't exist in main spec → add it
      - If requirement already exists → update it to match (treat as implicit MODIFIED)

      **MODIFIED Requirements:**
      - Find the requirement in main spec
      - Apply the changes - this can be:
        - Adding new scenarios (don't need to copy existing ones)
        - Modifying existing scenarios
        - Changing the requirement description
      - Preserve scenarios/content not mentioned in the delta

      **REMOVED Requirements:**
      - Remove the entire requirement block from main spec

      **RENAMED Requirements:**
      - Find the FROM requirement, rename to TO

   d. **Create new main spec** if capability doesn't exist yet:
      - Create \`phspec/specs/<capability>/spec.md\`
      - Add Purpose section (can be brief, mark as TBD)
      - Add Requirements section with the ADDED requirements

4. **Show summary**

   After applying all changes, summarize:
   - Which capabilities were updated
   - What changes were made (requirements added/modified/removed/renamed)

**Delta Spec Format Reference**

\`\`\`markdown
## ADDED Requirements

### Requirement: New Feature
The system SHALL do something new.

#### Scenario: Basic case
- **WHEN** user does X
- **THEN** system does Y

## MODIFIED Requirements

### Requirement: Existing Feature
#### Scenario: New scenario to add
- **WHEN** user does A
- **THEN** system does B

## REMOVED Requirements

### Requirement: Deprecated Feature

## RENAMED Requirements

- FROM: \`### Requirement: Old Name\`
- TO: \`### Requirement: New Name\`
\`\`\`

**Key Principle: Intelligent Merging**

Unlike programmatic merging, you can apply **partial updates**:
- To add a scenario, just include that scenario under MODIFIED - don't copy existing scenarios
- The delta represents *intent*, not a wholesale replacement
- Use your judgment to merge changes sensibly

**Output On Success**

\`\`\`
## Specs Synced: <change-name>

Updated main specs:

**<capability-1>**:
- Added requirement: "New Feature"
- Modified requirement: "Existing Feature" (added 1 scenario)

**<capability-2>**:
- Created new spec file
- Added requirement: "Another Feature"

Main specs are now updated. The change remains active - archive when implementation is complete.
\`\`\`

**Guardrails**
- Read both delta and main specs before making changes
- Preserve existing content not mentioned in delta
- If something is unclear, ask for clarification
- Show what you're changing as you go
- The operation should be idempotent - running twice should give same result`,
  };
}

/**
 * Template for phspec-verify-change skill
 * For verifying implementation matches change artifacts before archiving
 */
export function getVerifyChangeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-verify-change",
    description:
      "校验实现与变更制品是否一致。适用于归档前确认实现完整、正确且一致时。",
    instructions: `校验实现是否与变更制品（规范、任务、设计）一致。

**输入**：可指定变更名。未指定时从对话推断；含糊或有歧义时必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**

   运行 \`phspec list --json\` 获取变更列表，用 **AskUserQuestion 工具** 让用户选择。展示有实施任务（存在 tasks 制品）的变更、各变更所用工作流模式，未完成任务标为「进行中」。**重要**：不要猜测或自动选择，始终让用户选择。

2. **查看状态以了解工作流**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   解析 \`schemaName\`（所用工作流）及该变更有哪些制品。

3. **获取变更目录并加载制品**

   \`\`\`bash
   phspec instructions apply --change "<name>" --json
   \`\`\`
   从返回的 \`contextFiles\` 中读取所有可用制品。

4. **初始化校验报告结构**

   按三个维度建报告：**完整性**（任务与规范覆盖）、**正确性**（需求实现与场景覆盖）、**一致性**（设计遵循与模式一致）。每个维度可有 CRITICAL、WARNING、SUGGESTION 级别问题。

5. **校验完整性**

   **任务**：若有 tasks.md，解析 \`- [ ]\` / \`- [x]\`，统计完成数/总数。未完成任务记 CRITICAL，建议「完成任务：<描述>」或「若已实现请勾选」。**规范覆盖**：若有 \`phspec/changes/<name>/specs/\` 增量规范，提取 \`### Requirement:\` 需求，逐条在代码库中搜索关键词评估是否已实现；若明显未实现则记 CRITICAL「未发现需求：<需求名>」，建议「实现需求 X：<描述>」。

6. **校验正确性**

   **需求实现**：对增量规范中每条需求搜索实现证据，记录文件与行号，评估是否与需求意图一致；若偏离则记 WARNING「实现可能与规范偏离：<详情>」，建议「对照需求 X 审查 <file>:<lines>」。**场景覆盖**：对 \`#### Scenario:\` 场景检查代码是否处理条件、是否有测试；若明显未覆盖则记 WARNING「未覆盖场景：<场景名>」，建议「为场景补充测试或实现」。

7. **校验一致性**

   **设计遵循**：若有 design.md，提取关键决策（Decision/Approach/Architecture 等），核对实现是否遵循；若矛盾则记 WARNING「未遵循设计决策：<决策>」，建议「更新实现或修订 design.md」。无 design.md 则跳过并注明。**代码模式**：检查新代码与项目模式是否一致（命名、目录、风格）；明显偏离记 SUGGESTION「代码模式偏离：<详情>」，建议「考虑遵循项目模式：<示例>」。

8. **生成校验报告**

   **摘要表**：## 校验报告：<change-name>；Summary 表（Dimension: Completeness/Correctness/Coherence，Status）。**按优先级列问题**：CRITICAL（归档前必须修）、WARNING（建议修）、SUGGESTION（可选）；每条带可执行建议及文件/行引用。**结论**：有 CRITICAL 则「发现 X 个严重问题，归档前请修复」；仅 WARNING 则「无严重问题，Y 条警告可考虑，可归档（并改进）」；全部通过则「全部通过，可归档」。

**校验启发**
- 完整性：关注客观清单（勾选、需求列表）
- 正确性：关键词搜索、路径分析、合理推断，不要求绝对确定
- 一致性：关注明显不一致，不抠风格
- 不确定时优先 SUGGESTION 再 WARNING 再 CRITICAL
- 每条问题须有具体建议，尽量带 \`file.ts:123\` 引用

**降级**：仅 tasks.md 时只校验任务；有 tasks+specs 时校验完整性与正确性；全量制品时校验三维。始终注明跳过了哪些检查及原因。**输出格式**：清晰 Markdown、摘要表、按 CRITICAL/WARNING/SUGGESTION 分组、代码引用 \`file.ts:123\`、具体可执行建议，避免「考虑审查」等空泛表述。`,
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Template for /phsx:archive slash command
 */
export function getOpsxArchiveCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Archive",
    description: "归档已完成的变更",
    category: "Workflow",
    tags: ["workflow", "archive", "experimental"],
    content: `Archive a completed change in the experimental workflow.

**Input**: Optionally specify a change name after \`/phsx:archive\` (e.g., \`/phsx:archive add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`phspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show only active changes (not already archived).
   Include the schema used for each change if available.

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check artifact completion status**

   Run \`phspec status --change "<name>" --json\` to check artifact completion.

   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used
   - \`artifacts\`: List of artifacts with their status (\`done\` or other)

   **If any artifacts are not \`done\`:**
   - Display warning listing incomplete artifacts
   - Prompt user for confirmation to continue
   - Proceed if user confirms

3. **Check task completion status**

   Read the tasks file (typically \`tasks.md\`) to check for incomplete tasks.

   Count tasks marked with \`- [ ]\` (incomplete) vs \`- [x]\` (complete).

   **If incomplete tasks found:**
   - Display warning showing count of incomplete tasks
   - Prompt user for confirmation to continue
   - Proceed if user confirms

   **If no tasks file exists:** Proceed without task-related warning.

4. **Assess delta spec sync state**

   Check for delta specs at \`phspec/changes/<name>/specs/\`. If none exist, proceed without sync prompt.

   **If delta specs exist:**
   - Compare each delta spec with its corresponding main spec at \`phspec/specs/<capability>/spec.md\`
   - Determine what changes would be applied (adds, modifications, removals, renames)
   - Show a combined summary before prompting

   **Prompt options:**
   - If changes needed: "Sync now (recommended)", "Archive without syncing"
   - If already synced: "Archive now", "Sync anyway", "Cancel"

   If user chooses sync, use Task tool (subagent_type: "general-purpose", prompt: "Use Skill tool to invoke phspec-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>"). Proceed to archive regardless of choice.

5. **Perform the archive**

   Create the archive directory if it doesn't exist:
   \`\`\`bash
   mkdir -p phspec/changes/archive
   \`\`\`

   Generate target name using current date: \`YYYY-MM-DD-<change-name>\`

   **Check if target already exists:**
   - If yes: Fail with error, suggest renaming existing archive or using different date
   - If no: Move the change directory to archive

   \`\`\`bash
   mv phspec/changes/<name> phspec/changes/archive/YYYY-MM-DD-<name>
   \`\`\`

6. **Display summary**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location
   - Spec sync status (synced / sync skipped / no delta specs)
   - Note about any warnings (incomplete artifacts/tasks)

**Output On Success**

\`\`\`
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** phspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs

All artifacts complete. All tasks complete.
\`\`\`

**Output On Success (No Delta Specs)**

\`\`\`
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** phspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** No delta specs

All artifacts complete. All tasks complete.
\`\`\`

**Output On Success With Warnings**

\`\`\`
## Archive Complete (with warnings)

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** phspec/changes/archive/YYYY-MM-DD-<name>/
**Specs:** Sync skipped (user chose to skip)

**Warnings:**
- Archived with 2 incomplete artifacts
- Archived with 3 incomplete tasks
- Delta spec sync was skipped (user chose to skip)

Review the archive if this was not intentional.
\`\`\`

**Output On Error (Archive Exists)**

\`\`\`
## Archive Failed

**Change:** <change-name>
**Target:** phspec/changes/archive/YYYY-MM-DD-<name>/

Target archive directory already exists.

**Options:**
1. Rename the existing archive
2. Delete the existing archive if it's a duplicate
3. Wait until a different date to archive
\`\`\`

**Guardrails**
- Always prompt for change selection if not provided
- Use artifact graph (phspec status --json) for completion checking
- Don't block archive on warnings - just inform and confirm
- Preserve .phspec.yaml when moving to archive (it moves with the directory)
- Show clear summary of what happened
- If sync is requested, use the Skill tool to invoke \`phspec-sync-specs\` (agent-driven)
- If delta specs exist, always run the sync assessment and show the combined summary before prompting`,
  };
}

/**
 * Template for /phsx:onboard slash command
 * Guided onboarding through the complete PhSpec workflow
 */
export function getOpsxOnboardCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Onboard",
    description: "引导入门：带讲解走完完整 PhSpec 工作流",
    category: "Workflow",
    tags: ["workflow", "onboarding", "tutorial", "learning"],
    content: getOnboardInstructions(),
  };
}

/**
 * Template for /phsx:bulk-archive slash command
 */
export function getOpsxBulkArchiveCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Bulk Archive",
    description: "一次性归档多个已完成的变更",
    category: "Workflow",
    tags: ["workflow", "archive", "experimental", "bulk"],
    content: `Archive multiple completed changes in a single operation.

This skill allows you to batch-archive changes, handling spec conflicts intelligently by checking the codebase to determine what's actually implemented.

**Input**: None required (prompts for selection)

**Steps**

1. **Get active changes**

   Run \`phspec list --json\` to get all active changes.

   If no active changes exist, inform user and stop.

2. **Prompt for change selection**

   Use **AskUserQuestion tool** with multi-select to let user choose changes:
   - Show each change with its schema
   - Include an option for "All changes"
   - Allow any number of selections (1+ works, 2+ is the typical use case)

   **IMPORTANT**: Do NOT auto-select. Always let the user choose.

3. **Batch validation - gather status for all selected changes**

   For each selected change, collect:

   a. **Artifact status** - Run \`phspec status --change "<name>" --json\`
      - Parse \`schemaName\` and \`artifacts\` list
      - Note which artifacts are \`done\` vs other states

   b. **Task completion** - Read \`phspec/changes/<name>/tasks.md\`
      - Count \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
      - If no tasks file exists, note as "No tasks"

   c. **Delta specs** - Check \`phspec/changes/<name>/specs/\` directory
      - List which capability specs exist
      - For each, extract requirement names (lines matching \`### Requirement: <name>\`)

4. **Detect spec conflicts**

   Build a map of \`capability -> [changes that touch it]\`:

   \`\`\`
   auth -> [change-a, change-b]  <- CONFLICT (2+ changes)
   api  -> [change-c]            <- OK (only 1 change)
   \`\`\`

   A conflict exists when 2+ selected changes have delta specs for the same capability.

5. **Resolve conflicts agentically**

   **For each conflict**, investigate the codebase:

   a. **Read the delta specs** from each conflicting change to understand what each claims to add/modify

   b. **Search the codebase** for implementation evidence:
      - Look for code implementing requirements from each delta spec
      - Check for related files, functions, or tests

   c. **Determine resolution**:
      - If only one change is actually implemented -> sync that one's specs
      - If both implemented -> apply in chronological order (older first, newer overwrites)
      - If neither implemented -> skip spec sync, warn user

   d. **Record resolution** for each conflict:
      - Which change's specs to apply
      - In what order (if both)
      - Rationale (what was found in codebase)

6. **Show consolidated status table**

   Display a table summarizing all changes:

   \`\`\`
   | Change               | Artifacts | Tasks | Specs   | Conflicts | Status |
   |---------------------|-----------|-------|---------|-----------|--------|
   | schema-management   | Done      | 5/5   | 2 delta | None      | Ready  |
   | project-config      | Done      | 3/3   | 1 delta | None      | Ready  |
   | add-oauth           | Done      | 4/4   | 1 delta | auth (!)  | Ready* |
   | add-verify-skill    | 1 left    | 2/5   | None    | None      | Warn   |
   \`\`\`

   For conflicts, show the resolution:
   \`\`\`
   * Conflict resolution:
     - auth spec: Will apply add-oauth then add-jwt (both implemented, chronological order)
   \`\`\`

   For incomplete changes, show warnings:
   \`\`\`
   Warnings:
   - add-verify-skill: 1 incomplete artifact, 3 incomplete tasks
   \`\`\`

7. **Confirm batch operation**

   Use **AskUserQuestion tool** with a single confirmation:

   - "Archive N changes?" with options based on status
   - Options might include:
     - "Archive all N changes"
     - "Archive only N ready changes (skip incomplete)"
     - "Cancel"

   If there are incomplete changes, make clear they'll be archived with warnings.

8. **Execute archive for each confirmed change**

   Process changes in the determined order (respecting conflict resolution):

   a. **Sync specs** if delta specs exist:
      - Use the phspec-sync-specs approach (agent-driven intelligent merge)
      - For conflicts, apply in resolved order
      - Track if sync was done

   b. **Perform the archive**:
      \`\`\`bash
      mkdir -p phspec/changes/archive
      mv phspec/changes/<name> phspec/changes/archive/YYYY-MM-DD-<name>
      \`\`\`

   c. **Track outcome** for each change:
      - Success: archived successfully
      - Failed: error during archive (record error)
      - Skipped: user chose not to archive (if applicable)

9. **Display summary**

   Show final results:

   \`\`\`
   ## Bulk Archive Complete

   Archived 3 changes:
   - schema-management-cli -> archive/2026-01-19-schema-management-cli/
   - project-config -> archive/2026-01-19-project-config/
   - add-oauth -> archive/2026-01-19-add-oauth/

   Skipped 1 change:
   - add-verify-skill (user chose not to archive incomplete)

   Spec sync summary:
   - 4 delta specs synced to main specs
   - 1 conflict resolved (auth: applied both in chronological order)
   \`\`\`

   If any failures:
   \`\`\`
   Failed 1 change:
   - some-change: Archive directory already exists
   \`\`\`

**Conflict Resolution Examples**

Example 1: Only one implemented
\`\`\`
Conflict: specs/auth/spec.md touched by [add-oauth, add-jwt]

Checking add-oauth:
- Delta adds "OAuth Provider Integration" requirement
- Searching codebase... found src/auth/oauth.ts implementing OAuth flow

Checking add-jwt:
- Delta adds "JWT Token Handling" requirement
- Searching codebase... no JWT implementation found

Resolution: Only add-oauth is implemented. Will sync add-oauth specs only.
\`\`\`

Example 2: Both implemented
\`\`\`
Conflict: specs/api/spec.md touched by [add-rest-api, add-graphql]

Checking add-rest-api (created 2026-01-10):
- Delta adds "REST Endpoints" requirement
- Searching codebase... found src/api/rest.ts

Checking add-graphql (created 2026-01-15):
- Delta adds "GraphQL Schema" requirement
- Searching codebase... found src/api/graphql.ts

Resolution: Both implemented. Will apply add-rest-api specs first,
then add-graphql specs (chronological order, newer takes precedence).
\`\`\`

**Output On Success**

\`\`\`
## Bulk Archive Complete

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/
- <change-2> -> archive/YYYY-MM-DD-<change-2>/

Spec sync summary:
- N delta specs synced to main specs
- No conflicts (or: M conflicts resolved)
\`\`\`

**Output On Partial Success**

\`\`\`
## Bulk Archive Complete (partial)

Archived N changes:
- <change-1> -> archive/YYYY-MM-DD-<change-1>/

Skipped M changes:
- <change-2> (user chose not to archive incomplete)

Failed K changes:
- <change-3>: Archive directory already exists
\`\`\`

**Output When No Changes**

\`\`\`
## No Changes to Archive

No active changes found. Use \`/phsx:new\` to create a new change.
\`\`\`

**Guardrails**
- Allow any number of changes (1+ is fine, 2+ is the typical use case)
- Always prompt for selection, never auto-select
- Detect spec conflicts early and resolve by checking codebase
- When both changes are implemented, apply specs in chronological order
- Skip spec sync only when implementation is missing (warn user)
- Show clear per-change status before confirming
- Use single confirmation for entire batch
- Track and report all outcomes (success/skip/fail)
- Preserve .phspec.yaml when moving to archive
- Archive directory target uses current date: YYYY-MM-DD-<name>
- If archive target exists, fail that change but continue with others`,
  };
}

/**
 * Template for /phsx:verify slash command
 */
export function getOpsxVerifyCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Verify",
    description: "归档前校验实现是否与变更制品一致",
    category: "Workflow",
    tags: ["workflow", "verify", "experimental"],
    content: `Verify that an implementation matches the change artifacts (specs, tasks, design).

**Input**: Optionally specify a change name after \`/phsx:verify\` (e.g., \`/phsx:verify add-auth\`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run \`phspec list --json\` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have implementation tasks (tasks artifact exists).
   Include the schema used for each change if available.
   Mark changes with incomplete tasks as "(In Progress)".

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check status to understand the schema**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   Parse the JSON to understand:
   - \`schemaName\`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

3. **Get the change directory and load artifacts**

   \`\`\`bash
   phspec instructions apply --change "<name>" --json
   \`\`\`

   This returns the change directory and context files. Read all available artifacts from \`contextFiles\`.

4. **Initialize verification report structure**

   Create a report structure with three dimensions:
   - **Completeness**: Track tasks and spec coverage
   - **Correctness**: Track requirement implementation and scenario coverage
   - **Coherence**: Track design adherence and pattern consistency

   Each dimension can have CRITICAL, WARNING, or SUGGESTION issues.

5. **Verify Completeness**

   **Task Completion**:
   - If tasks.md exists in contextFiles, read it
   - Parse checkboxes: \`- [ ]\` (incomplete) vs \`- [x]\` (complete)
   - Count complete vs total tasks
   - If incomplete tasks exist:
     - Add CRITICAL issue for each incomplete task
     - Recommendation: "Complete task: <description>" or "Mark as done if already implemented"

   **Spec Coverage**:
   - If delta specs exist in \`phspec/changes/<name>/specs/\`:
     - Extract all requirements (marked with "### Requirement:")
     - For each requirement:
       - Search codebase for keywords related to the requirement
       - Assess if implementation likely exists
     - If requirements appear unimplemented:
       - Add CRITICAL issue: "Requirement not found: <requirement name>"
       - Recommendation: "Implement requirement X: <description>"

6. **Verify Correctness**

   **Requirement Implementation Mapping**:
   - For each requirement from delta specs:
     - Search codebase for implementation evidence
     - If found, note file paths and line ranges
     - Assess if implementation matches requirement intent
     - If divergence detected:
       - Add WARNING: "Implementation may diverge from spec: <details>"
       - Recommendation: "Review <file>:<lines> against requirement X"

   **Scenario Coverage**:
   - For each scenario in delta specs (marked with "#### Scenario:"):
     - Check if conditions are handled in code
     - Check if tests exist covering the scenario
     - If scenario appears uncovered:
       - Add WARNING: "Scenario not covered: <scenario name>"
       - Recommendation: "Add test or implementation for scenario: <description>"

7. **Verify Coherence**

   **Design Adherence**:
   - If design.md exists in contextFiles:
     - Extract key decisions (look for sections like "Decision:", "Approach:", "Architecture:")
     - Verify implementation follows those decisions
     - If contradiction detected:
       - Add WARNING: "Design decision not followed: <decision>"
       - Recommendation: "Update implementation or revise design.md to match reality"
   - If no design.md: Skip design adherence check, note "No design.md to verify against"

   **Code Pattern Consistency**:
   - Review new code for consistency with project patterns
   - Check file naming, directory structure, coding style
   - If significant deviations found:
     - Add SUGGESTION: "Code pattern deviation: <details>"
     - Recommendation: "Consider following project pattern: <example>"

8. **Generate Verification Report**

   **Summary Scorecard**:
   \`\`\`
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | Coherence    | Followed/Issues  |
   \`\`\`

   **Issues by Priority**:

   1. **CRITICAL** (Must fix before archive):
      - Incomplete tasks
      - Missing requirement implementations
      - Each with specific, actionable recommendation

   2. **WARNING** (Should fix):
      - Spec/design divergences
      - Missing scenario coverage
      - Each with specific recommendation

   3. **SUGGESTION** (Nice to fix):
      - Pattern inconsistencies
      - Minor improvements
      - Each with specific recommendation

   **Final Assessment**:
   - If CRITICAL issues: "X critical issue(s) found. Fix before archiving."
   - If only warnings: "No critical issues. Y warning(s) to consider. Ready for archive (with noted improvements)."
   - If all clear: "All checks passed. Ready for archive."

**Verification Heuristics**

- **Completeness**: Focus on objective checklist items (checkboxes, requirements list)
- **Correctness**: Use keyword search, file path analysis, reasonable inference - don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable

**Graceful Degradation**

- If only tasks.md exists: verify task completion only, skip spec/design checks
- If tasks + specs exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why

**Output Format**

Use clear markdown with:
- Table for summary scorecard
- Grouped lists for issues (CRITICAL/WARNING/SUGGESTION)
- Code references in format: \`file.ts:123\`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"`,
  };
}
/**
 * Template for feedback skill
 * For collecting and submitting user feedback with context enrichment
 */
export function getFeedbackSkillTemplate(): SkillTemplate {
  return {
    name: "feedback",
    description: "收集并提交 PhSpec 相关用户反馈（含上下文补充与匿名处理）。",
    instructions: `帮助用户提交关于 PhSpec 的反馈。

**目标**：引导用户完成收集、补充与提交反馈，并通过匿名化保护隐私。

**流程**

1. **从对话中收集上下文**
   - 回顾近期对话以获取上下文
   - 识别用户当时在执行的任务
   - 记录哪些做得好、哪些不好
   - 捕捉具体摩擦点或好评

2. **起草充实后的反馈**
   - 写一条清晰、有信息量的标题（单句，无需「反馈：」前缀）
   - 正文包含：用户当时想做什么、实际发生了什么（好或坏）、来自对话的相关上下文、任何具体建议或诉求

3. **匿名化敏感信息**
   - 文件路径替换为 \`<path>\` 或通用描述
   - API 密钥、令牌、密钥替换为 \`<redacted>\`
   - 公司/组织名替换为 \`<company>\`
   - 个人姓名替换为 \`<user>\`
   - 具体 URL 替换为 \`<url>\`（公开或与问题相关的可保留）
   - 保留有助于理解问题的技术细节

4. **展示草稿并征得同意**
   - 向用户展示完整草稿
   - 清晰展示标题与正文
   - 提交前明确征得同意
   - 允许用户要求修改

5. **确认后提交**
   - 使用 \`phspec feedback\` 命令提交
   - 格式：\`phspec feedback "title" --body "body content"\`
   - 命令会自动附加元数据（版本、平台、时间戳）

**示例草稿**（标题 + 正文：在做什么、遇到什么问题、建议、上下文；使用 spec-driven 与 <path> 等占位）。

**匿名化示例**：Before 中具体路径、API key、公司名 → After 中 <path>、<redacted>、<company>。

**边界**
- 提交前必须展示完整草稿并征得明确同意
- 必须对敏感信息做匿名化
- 允许用户修改草稿后再提交
- 未经用户确认不得提交
- 保留相关技术上下文与对话中的洞察

**用户确认话术**：展示标题与正文后询问「这样可以吗？需要改哪里可以说，或按原样提交。」仅在用户确认后再执行提交。`,
  };
}
