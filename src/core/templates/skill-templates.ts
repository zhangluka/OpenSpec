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
- **不自动记录** - 提议保存洞察，不要擅自写入；若环境无 AskUserQuestion 或 ask_followup_question 等用户确认工具，需要用户选择或确认时直接输出选项并写明「请回复后再继续」，不要擅自写入或继续。
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

   使用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent）（开放问题，无预设选项）询问：
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

   向用户提问：「变更 <name> 已创建，第一个待建制品是 proposal。要创建第一个制品了吗？直接说说这个变更要做什么，我来起草；或回复继续让我创建。」

   **禁止**：在本轮中创建或写入 proposal.md、design.md、specs/*、tasks.md；禁止在未向用户提问并等待回复的情况下继续执行后续步骤。

**输出**

完成上述步骤后总结：
- 变更名与路径
- 所用工作流模式及其制品顺序
- 当前状态（0/N 个制品已完成）
- 第一个制品的模板
- 通过用户确认工具或文字提示询问："要创建第一个制品了吗？直接说说这个变更要做什么，我来起草；或让我继续。"

**边界**
- 本技能职责仅到「展示第一个制品模板并询问用户」；**不得**在本技能中创建任何制品（proposal、specs、design、tasks 等）；步骤 6 必须通过工具或文字询问后**结束**，由用户下次运行 \`/phsx:continue\` 再创建制品。
- 先不要创建任何制品，只展示指令；不要越过「展示第一个制品模板」这一步。
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

   运行 \`phspec list --json\` 获取按最近修改排序的变更列表，再用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择要继续的变更。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出 3～4 个变更选项并写明「请回复后再继续」，不要猜测或自动选变更。

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
   - 说明创建了什么、接下来可做哪些，然后询问用户：「已创建 <artifact-id>。要修改刚写的内容，还是继续创建下一个制品？回复继续或说明要改的地方。」等待用户回复后再继续。

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
- **proposal.md**：若不清楚可先问用户，填写 Why、What Changes、Capabilities、Impact。Capabilities 很关键，每项能力对应一个 spec 文件。若环境无 AskUserQuestion 或 ask_followup_question，直接输出问题并写明「请回复后再继续」，不要自行假设后继续。
- **specs/<capability>/spec.md**：按提案 Capabilities 每项建一个规范（用能力名，不是变更名）。
- **design.md**：记录技术决策、架构与实现思路。
- **tasks.md**：把实现拆成可勾选任务。

其他模式以 CLI 输出的 \`instruction\` 为准。

**边界**
- 每次调用**仅**创建一个制品；创建完一个制品后必须停止，等用户说「继续」或再次调用本技能后再创建下一个；不得在本轮中连续创建多个制品。
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
   - 有歧义时运行 \`phspec list --json\` 获取列表，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。若环境无 AskUserQuestion 或 ask_followup_question，直接输出变更选项并写明「请回复后再继续」，不要自行假设。

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

   **以下情况必须暂停**（不要自行假设或继续下一项任务）：
   - 任务不清晰 → 先澄清；若环境无 AskUserQuestion 或 ask_followup_question，直接输出问题并写明「请回复后再继续」
   - 实施暴露出设计问题 → 建议更新制品并等待指示
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
- 按任务顺序做到完成或受阻；遇需暂停的情形必须停止，等用户回复后再继续。
- 开始前先读 apply 指令中的上下文文件
- 任务不明确时先暂停询问再实施；若环境无用户确认工具，直接输出问题并写明「请回复后再继续」
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

   使用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent）（开放问题）询问：
   > "你想做哪个变更？描述你想做或要修的内容。"

   若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出该问题并写明「请回复后再继续」，不要自行假设名称后继续。

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

   c. **若某制品需要用户输入**（上下文不清）：用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 澄清后继续；若环境无该工具，直接输出问题并写明「请回复后再继续」，不要自行假设后继续。

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

   运行 \`phspec list --json\` 获取变更列表，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。只展示在 \`specs/\` 下有增量规范的变更。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出变更选项并写明「请回复后再继续」，不要猜测或自动选择。

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

- **在关键节点遵循「说明 → 执行 → 展示 → 暂停」**（探索后、提案草案后、任务后、归档后）；在标记的「暂停」处必须停止，等用户回复后再继续。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，直接输出说明或选项并写明「请回复后再继续」，不要自行继续下一阶段。
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
- **不自动记录** - 提议保存洞察，不要擅自写入；若环境无 AskUserQuestion 或 ask_followup_question 等用户确认工具，需要用户选择或确认时直接输出选项并写明「请回复后再继续」，不要擅自写入或继续。
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
    content: `使用实验性制品驱动工作流新建变更。

**输入**：\`/phsx:new\` 后的参数为变更名（kebab-case），或用户想做什么的描述。

**步骤**

1. **若未提供输入，先问用户要做什么**

   使用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent）（开放问题，无预设选项）询问：
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

   向用户提问：「变更 <name> 已创建，第一个待建制品是 proposal。要创建第一个制品了吗？直接说说这个变更要做什么，我来起草；或回复继续让我创建。」

   **禁止**：在本轮中创建或写入 proposal.md、design.md、specs/*、tasks.md；禁止在未向用户提问并等待回复的情况下继续执行后续步骤。

**输出**

完成上述步骤后总结：
- 变更名与路径
- 所用工作流模式及其制品顺序
- 当前状态（0/N 个制品已完成）
- 第一个制品的模板
- 通过用户确认工具或文字提示询问："要创建第一个制品了吗？直接说说这个变更要做什么，我来起草；或让我继续。"

**边界**
- 本命令职责仅到「展示第一个制品模板并询问用户」；**不得**在本命令中创建任何制品（proposal、specs、design、tasks 等）；步骤 6 必须通过工具或文字询问后**结束**，由用户下次运行 \`/phsx:continue\` 再创建制品。
- 先不要创建任何制品，只展示指令；不要越过「展示第一个制品模板」这一步。
- 若名称无效（非 kebab-case），请用户给出合法名称
- 若该名称的变更已存在，建议改为继续该变更
- 使用非默认工作流时传入 --schema`,
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
    content: `继续当前变更：创建下一个制品。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**

   运行 \`phspec list --json\` 获取按最近修改排序的变更列表，再用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择要继续的变更。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出 3～4 个变更选项并写明「请回复后再继续」，不要猜测或自动选变更。

   将最近修改的 3～4 个变更作为选项展示，包含：变更名、工作流模式（有 \`schema\` 字段则用其值，否则为 "spec-driven"）、状态（如 "0/5 tasks"、"complete"、"no tasks"）、最近修改时间（来自 \`lastModified\` 字段）。将最近修改的变更标为「推荐」。

   **重要**：不要猜测或自动选变更，始终让用户选择。

2. **查看当前状态**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   解析 JSON 了解当前状态。响应包含：\`schemaName\`、\`artifacts\`（"done"/"ready"/"blocked"）、\`isComplete\`。

3. **按状态行动**：

   **若全部制品已完成（\`isComplete: true\`）**：祝贺用户，展示最终状态，建议「全部制品已就绪！可以用 \`/phsx:apply\` 实施或归档。」并停止。

   **若有制品可创建**（存在 \`status: "ready"\`）：选第一个 ready 制品，运行 \`phspec instructions <artifact-id> --change "<name>" --json\`，解析 \`context\`、\`rules\`、\`template\`、\`instruction\`、\`outputPath\`、\`dependencies\`；先读依赖制品，按 template 填写，遵守 context/rules 但不抄入文件，写入 outputPath。

   **自动调用 Review 检查**：制品创建完成后，根据制品类型自动调用对应的 review 技能进行质量检查：

   - **requirement** 或 **specs** → 调用 **phspec-review-spec**（规格质量审查）
   - **plan**、**design** 或 **tasks** → 调用 **phspec-review-design**（设计一致性审查）

   使用 Skill 工具调用对应的 review 技能，对刚创建的制品进行质量检查。review 技能会输出审查报告，包含评分、问题分类和可执行建议。展示审查结果，若发现严重问题（如关键指标不达标），建议用户先修复问题再继续。

   然后询问用户：「已创建 <artifact-id> 并完成 review 检查。要修改刚写的内容，还是继续创建下一个制品？回复继续或说明要改的地方。」等待用户回复后再继续。

   **若没有可创建制品（全部 blocked）**：展示状态并建议检查问题。

4. **创建制品后展示进度**（若已按上一步结束，本步在用户下次运行本 workflow 时适用）
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`

**输出**：每次调用后展示创建了哪个制品、review 检查结果、所用工作流、当前进度（N/M 已完成）、当前可创建的制品，并通过用户确认工具或文字提示「要继续吗？要修改刚创建的内容吗？说继续或告诉我下一步即可。」

**边界**：本命令每次调用**仅**创建一个制品；制品创建后自动进行 review 检查；review 完成后询问用户并等待回复，再由用户决定是否继续创建下一个。不得在本轮中连续创建多个制品。

**制品创建指引**：制品类型与用途由模式决定，以指令输出中的 \`instruction\` 为准。常见模式（spec-driven）：requirement → specs → plan → tasks；制品创建后会自动调用对应的 review 技能：requirement/specs 用 review-spec，plan/tasks 用 review-design。**重要**：\`context\` 与 \`rules\` 是给你的约束，不要将 \`<context>\`、\`<rules>\`、\`<project_context>\` 抄进制品。`,
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
    content: `按 PhSpec 变更实施任务。

**输入**：可指定变更名。未指定时从对话推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **选定变更**

   若提供了名称则用该名称。否则：从上下文推断、仅有一个进行中变更则自动选中、有歧义时用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。若环境无该工具，直接输出变更选项并写明「请回复后再继续」，不要自行假设。

   始终说明：「当前变更：<name>」，以及如何切换（如 \`/phsx:apply <其他>\`）。

2. **查看状态以确认工作流模式**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   解析 JSON 了解 \`schemaName\`、任务所在制品（spec-driven 多为 "tasks"）。

3. **获取 apply 指令**
   \`\`\`bash
   phspec instructions apply --change "<name>" --json
   \`\`\`
   返回：上下文文件路径、进度、任务列表及状态、根据当前状态的动态。

   **状态处理**：\`state: "blocked"\` 时建议先用 \`/phsx:continue\`；\`state: "all_done"\` 时祝贺并建议归档；否则进入实施。

4. **阅读上下文文件**

   按 apply 指令输出中的 \`contextFiles\` 读取对应文件。
   具体文件因模式而异：**spec-driven** 为 proposal、specs、design、tasks
   - 其他模式以 CLI 的 contextFiles 为准

5. **展示当前进度**

   展示：所用模式、进度「N/M 任务已完成」、剩余任务概览、CLI 返回的动态指令。

6. **实施任务（循环至完成或受阻）**

   对每个未完成任务：说明正在做哪项任务、完成所需代码改动、改动保持最小紧扣该任务、在任务文件中勾选完成 \`- [ ]\` → \`- [x]\`、继续下一项。

   **以下情况必须暂停**（不要自行假设或继续下一项任务）：任务不清晰 → 先澄清（若环境无 AskUserQuestion 或 ask_followup_question，直接输出问题并写明「请回复后再继续」）；实施暴露出设计问题 → 建议更新制品并等待指示；报错或受阻 → 说明并等待指示；用户打断。

7. **全部任务完成后进行代码 review 检查**

   当所有任务都标记为已完成时，使用 Skill 工具调用 **phspec-review-code**（代码规范合规性审查），对本次实施的代码进行质量检查。

   review-code 会检查：
   - 功能正确性：代码实现是否与规格一致
   - 错误处理：异常情况是否正确处理
   - 边界情况：边界条件和异常路径是否考虑
   - 非功能需求：性能、安全等非功能需求是否满足
   - 规格漂移：代码实现是否偏离原始规格

   展示审查报告，包含评分、问题分类和可执行建议。若发现严重问题（如关键指标不达标），建议用户先修复问题再进行验收和归档。

8. **完成或暂停时展示状态**

   展示：本轮完成的任务、总进度「N/M 任务已完成」；review-code 检查结果（若已进行）；若全部完成且 review 通过则建议归档；若暂停则说明原因并等待指示。

**实施过程输出示例**：见技能指令中的「实施过程输出示例」「全部完成时输出」「暂停时输出」。

**边界**：始终先读上下文文件；任务不明确时暂停并询问（若环境无用户确认工具，直接输出问题并写明「请回复后再继续」）；改动最小化并紧扣任务；完成每项后立即勾选；遇错或受阻时暂停不猜测；以 CLI 的 contextFiles 为准。全部任务完成后自动调用 review-code 进行代码质量检查。本技能可随时调用（制品未全完成时若已有任务、部分实施后、与其他操作交替），实施中若发现设计问题可建议更新制品。`,
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
    content: `快进式创建制品——一次性生成实施所需全部制品。

**输入**：\`/phsx:ff\` 后为变更名（kebab-case）或用户想做什么的描述。

**步骤**

1. **若未提供明确输入，先问用户要做什么**

   用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 询问并推导 kebab-case 名称。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出问题并写明「请回复后再继续」，不要自行假设后继续。**重要**：未弄清用户要做什么前不要继续。

2. **创建变更目录**
   \`\`\`bash
   phspec new change "<name>"
   \`\`\`
   会在 \`phspec/changes/<name>/\` 下创建脚手架。

3. **获取制品构建顺序**
   \`\`\`bash
   phspec status --change "<name>" --json
   \`\`\`
   解析 \`applyRequires\`（实施前需要的制品 ID）、\`artifacts\`（所有制品及状态与依赖）。

4. **按顺序创建制品直至可实施**

   用 **TodoWrite 工具** 跟踪进度。按依赖顺序遍历：对每个 \`ready\` 制品运行 \`phspec instructions <artifact-id> --change "<name>" --json\`，解析 context/rules/template/instruction/outputPath/dependencies；先读依赖制品，按 template 创建文件，遵守 context 与 rules 但不抄入文件；简要提示「✓ 已创建 <artifact-id>」。

   **自动调用 Review 检查**：制品创建完成后，根据制品类型自动调用对应的 review 技能进行质量检查：
   - **requirement** 或 **specs** → 调用 **phspec-review-spec**（规格质量审查）
   - **plan**、**design** 或 **tasks** → 调用 **phspec-review-design**（设计一致性审查）

   使用 Skill 工具调用对应的 review 技能，对刚创建的制品进行质量检查。展示简要的审查结果，若发现严重问题（如关键指标不达标），提示用户后继续创建下一个制品。

   每创建一个制品后重跑 status，当 \`applyRequires\` 中制品均为 \`done\` 时停止。若某制品需用户输入则用 AskUserQuestion 或 ask_followup_question 澄清后继续；若环境无该工具，直接输出问题并写明「请回复后再继续」，不要自行假设后继续。

5. **展示最终状态和 review 摘要**
   \`\`\`bash
   phspec status --change "<name>"
   \`\`\`

   展示各制品的 review 检查结果摘要，包含每个制品的评分和主要问题。

**输出**：总结变更名与路径、已创建制品列表、各制品 review 检查结果、「全部制品已就绪，可以开始实施。」、提示「运行 \`/phsx:apply\` 或让我实施即可开始任务。」

**制品创建**：按 \`phspec instructions\` 的 \`instruction\` 与模式定义。**边界**：创建模式 \`apply.requires\` 所需的全部制品；先读依赖再创建；每个制品创建后自动进行 review 检查；名称已存在时建议继续该变更；写入后确认文件存在再继续。`,
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

   运行 \`phspec list --json\` 获取变更列表，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。只展示进行中的变更（未归档的），若有则展示每个变更所用工作流模式。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出变更选项并写明「请回复后再继续」，不要猜测或自动选择。

   **重要**：不要猜测或自动选择，始终让用户选择。

2. **检查制品完成状态**

   运行 \`phspec status --change "<name>" --json\` 查看制品完成情况。解析 JSON：\`schemaName\`、\`artifacts\` 及各状态（\`done\` 或其他）。若有制品未 \`done\`：列出未完成制品并警告，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 确认是否继续，用户确认后继续。若环境无该工具，直接输出警告与「是否继续？」并写明「请回复后再继续」，不要自行假设。

3. **检查任务完成状态**

   阅读任务文件（通常为 \`tasks.md\`），统计 \`- [ ]\`（未完成）与 \`- [x]\`（已完成）。若有未完成任务：展示未完成数量并警告，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 确认是否继续，用户确认后继续。若环境无该工具，直接输出问题并写明「请回复后再继续」。若无任务文件：不提示任务相关警告，继续。

4. **评估增量规范同步状态**

   检查 \`phspec/changes/<name>/specs/\` 是否有增量规范。若无则不必提示同步。若有：将各增量规范与主规范 \`phspec/specs/<capability>/spec.md\` 对比，说明会应用哪些变更（增/改/删/重命名），在提示前展示合并摘要。选项：若需同步则「立即同步（推荐）」「不同步直接归档」；若已同步则「立即归档」「仍同步一次」「取消」。若用户选同步，用 Task 工具（subagent_type: "general-purpose", prompt: "用 Skill 工具调用 phspec-sync-specs 处理变更 '<name>'。增量分析：<上述摘要>"）。若环境无 AskUserQuestion 或 ask_followup_question，直接输出选项并写明「请回复后再继续」，不要自行选择并执行。无论是否同步，最终执行归档。

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

   用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 多选：展示每个变更及其工作流模式，提供「全部变更」选项，允许选任意数量（1+ 即可，通常 2+）。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出选项并写明「请回复后再继续」，不要自动选择。

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

   用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 一次确认：「归档 N 个变更？」选项可包括「全部归档」「仅归档 N 个就绪的（跳过未完成）」「取消」。若有未完成变更，明确说明将带警告归档。若环境无该工具，直接输出选项并写明「请回复后再继续」，不要自行执行归档。

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
    content: `将变更中的增量规范同步到主规范。

此为**由 agent 执行**的操作：你读取增量规范并直接编辑主规范以应用变更，从而可智能合并（例如只加场景而不整条复制需求）。

**输入**：可指定变更名。未指定时从对话推断；含糊或有歧义时必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**：运行 \`phspec list --json\`，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。只展示在 \`specs/\` 下有增量规范的变更。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出变更选项并写明「请回复后再继续」，不要猜测或自动选择。**重要**：不要猜测或自动选择。

2. **定位增量规范**：在 \`phspec/changes/<name>/specs/*/spec.md\` 查找增量规范文件。若未找到则告知用户并停止。

3. **对每个增量规范，将变更应用到主规范**：对 \`phspec/changes/<name>/specs/<capability>/spec.md\` 存在的每个能力：a) 读增量规范理解要做的变更；b) 读主规范 \`phspec/specs/<capability>/spec.md\`（可能尚不存在）；c) 按意图合并：ADDED 若主规范无则添加、有则按 MODIFIED 更新；MODIFIED 在主规范中找到对应需求后增/改场景或描述，保留增量未提及的内容；REMOVED 从主规范删除整条需求；RENAMED 将 FROM 改为 TO；d) 若能力尚无主规范则创建 \`phspec/specs/<capability>/spec.md\`，含目的（可 TBD）与 ADDED 需求。

4. **展示摘要**：说明更新了哪些能力、做了哪些增/改/删/重命名。

**原则：智能合并**——可做部分更新（例如在 MODIFIED 下只加场景、不复制整条）；增量表示*意图*而非整份替换。**成功时输出**：摘要「## Specs 已同步：<change-name>」、更新了哪些能力与需求、说明主规范已更新、变更仍进行中，实施完成后再归档。**边界**：先读增量与主规范再改；保留增量未提及的既有内容；操作应幂等。`,
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

   运行 \`phspec list --json\` 获取变更列表，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。展示有实施任务（存在 tasks 制品）的变更、各变更所用工作流模式，未完成任务标为「进行中」。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，请直接输出变更选项并写明「请回复后再继续」，不要猜测或自动选择。**重要**：不要猜测或自动选择，始终让用户选择。

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

   按四个维度建报告：**完整性**（任务与规范覆盖）、**正确性**（需求实现与场景覆盖）、**一致性**（设计遵循与模式一致）、**代码卫生**（代码质量与规范合规性）。每个维度可有 CRITICAL、WARNING、SUGGESTION 级别问题。

5. **校验完整性**

   **任务**：若有 tasks.md，解析 \`- [ ]\` / \`- [x]\`，统计完成数/总数。未完成任务记 CRITICAL，建议「完成任务：<描述>」或「若已实现请勾选」。**规范覆盖**：若有 \`phspec/changes/<name>/specs/\` 增量规范，提取 \`### Requirement:\` 需求，逐条在代码库中搜索关键词评估是否已实现；若明显未实现则记 CRITICAL「未发现需求：<需求名>」，建议「实现需求 X：<描述>」。

6. **校验正确性**

   **需求实现**：对增量规范中每条需求搜索实现证据，记录与行号，评估是否与需求意图一致；若偏离则记 WARNING「实现可能与规范偏离：<详情>」，建议「对照需求 X 审查 <file>:<lines>」。**场景覆盖**：对 \`#### Scenario:\` 场景检查代码是否处理条件、是否有测试；若明显未覆盖则记 WARNING「未覆盖场景：<场景名>」，建议「为场景补充测试或实现」。**规范合规性矩阵**：检查规范中所有关键字（SHALL、MUST、REQUIRED、WILL）在代码中是否有对应实现；如有缺失则记 WARNING「规范约束未实现：<关键字约束>」，建议「在代码中实现规范中定义的：<约束内容>」。

7. **校验一致性**

   **设计遵循**：若有 design.md，提取关键决策（Decision/Approach/Architecture 等），核对实现是否遵循；若矛盾则记 WARNING「未遵循设计决策：<决策>」，建议「更新实现或修订 design.md」。无 design.md 则跳过并注明。**代码模式**：检查新代码与项目模式是否一致（命名、目录、风格）；明显偏离记 SUGGESTION「代码模式偏离：<详情>」，建议「考虑遵循项目模式：<示例>」。

8. **校验代码卫生**

   **重复代码**：检查变更的代码中是否存在明显重复逻辑（超过 3 行的相似代码块）；若发现则记 SUGGESTION「发现重复代码：<位置>」，建议「考虑抽取为共用函数」。**错误处理**：检查关键函数是否有适当的错误处理（try/catch、错误返回）；若缺失则记 WARNING「缺少错误处理：<函数名>」，建议「为 <file>:<line> 添加错误处理」。**注释质量**：检查复杂逻辑是否有注释说明；若缺失则记 SUGGESTION「复杂逻辑缺少注释：<位置>」，建议「为 <file>:<line> 添加注释说明意图」。**命名规范**：检查变量和函数命名是否符合项目约定（如 camelCase）；若明显偏离则记 SUGGESTION「命名不符合约定：<名称>」，建议「重命名 <名称> 以符合项目规范」。

9. **生成校验报告**

   **摘要表**：## 校验报告：<change-name>；Summary 表（Dimension: Completeness/Correctness/Coherence/CodeHygiene，Status）。**按优先级列问题**：CRITICAL（归档前必须修）、WARNING（建议修）、SUGGESTION（可选）；每条带可执行建议及文件/行引用。**结论**：有 CRITICAL 则「发现 X 个严重问题，归档前请修复」；仅 WARNING 则「无严重问题，Y 条警告可考虑，可归档（并改进）」；全部通过则「全部通过，可归档」。

**校验启发**
- 完整性：关注客观清单（勾选、需求列表）
- 正确性：关键词搜索、路径分析、合理推断，不要求绝对确定
- 一致性：关注明显不一致，不抠风格
- 代码卫生：关注质量改进，不影响归档决策
- 不确定时优先 SUGGESTION 再 WARNING 再 CRITICAL
- 每条问题须有具体建议，尽量带 \`file.ts:123\` 引用
- **重要**：本命令为建议式校验，不强制阻塞归档。即使发现 CRITICAL 问题，也仅提示建议，不阻止用户归档。

**降级**：仅 tasks.md 时只校验任务；有 tasks+specs 时校验完整性与正确性；全量制品时校验四维。始终注明跳过了哪些检查及原因。**输出格式**：清晰 Markdown、摘要表、按 CRITICAL/WARNING/SUGGESTION 分组、代码引用 \`file.ts:123\`、具体可执行建议，避免「考虑审查」等空泛表述。`,
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
    content: `在实验性工作流中归档已完成的变更。

**输入**：可指定变更名。未指定时从对话推断；含糊或有歧义时必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**：运行 \`phspec list --json\`，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。只展示进行中的变更，若有则展示每个变更所用工作流模式。若环境无该工具，直接输出变更选项并写明「请回复后再继续」，不要猜测或自动选择。**重要**：不要猜测或自动选择。

2. **检查制品完成状态**：运行 \`phspec status --change "<name>" --json\`，解析 \`schemaName\`、\`artifacts\` 及各状态。若有制品未 \`done\`：列出未完成制品并警告，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 确认是否继续，用户确认后继续。若环境无该工具，直接输出问题并写明「请回复后再继续」，不要自行假设。

3. **检查任务完成状态**：阅读任务文件（通常为 \`tasks.md\`），统计 \`- [ ]\` 与 \`- [x]\`。若有未完成任务：展示未完成数量并警告并确认后继续。若无任务文件：不提示任务相关警告，继续。

4. **评估增量规范同步状态**：检查 \`phspec/changes/<name>/specs/\` 是否有增量规范。若无则不必提示同步。若有：将各增量规范与主规范对比，说明会应用哪些变更，在提示前展示合并摘要。选项：若需同步则「立即同步（推荐）」「不同步直接归档」；若已同步则「立即归档」「仍同步一次」「取消」。若用户选同步，用 Task 工具调用 phspec-sync-specs 处理变更。无论是否同步，最终执行归档。

5. **执行归档**

   若不存在则创建 \`phspec/changes/archive\`。目标名用当前日期 \`YYYY-MM-DD-<change-name>\`。若目标已存在则报错并建议重命名或换日期；否则执行 \`mv phspec/changes/<name> phspec/changes/archive/YYYY-MM-DD-<name>\`。

6. **展示摘要**：包含变更名、所用工作流模式、归档路径、规范是否已同步（若适用）、任何警告。成功时输出「## 归档完成」及规范状态；目标已存在时输出「## 归档失败」并说明选项。**边界**：未提供变更时始终让用户选择；有警告时仅提示并确认不阻止归档；移动目录时保留 .phspec.yaml；若需同步则用 phspec-sync-specs；有增量规范时先做同步评估并展示合并摘要再提示；需用户选择或确认时若环境无 AskUserQuestion 或 ask_followup_question，直接输出选项并写明「请回复后再继续」，不要自行执行。`,
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
    content: `一次性归档多个已完成的变更。

本技能支持批量归档，通过检查代码库判断实际实现情况，智能处理规范冲突。

**输入**：无必填（会提示选择变更）

**步骤**

1. **获取进行中的变更**：运行 \`phspec list --json\` 获取所有进行中的变更。若无则告知用户并结束。

2. **让用户选择要归档的变更**：用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 多选，展示每个变更及其工作流模式，提供「全部变更」选项，允许选任意数量（1+ 即可，通常 2+）。若环境无该工具，直接输出选项并写明「请回复后再继续」，不要自动选择。**重要**：不要自动选择，始终让用户选择。

3. **批量校验 - 收集所选变更的状态**

   对每个所选变更收集：a) **制品状态**：\`phspec status --change "<name>" --json\`，解析 \`schemaName\` 与 \`artifacts\`，记录 \`done\` 与非 done；b) **任务完成**：读 \`phspec/changes/<name>/tasks.md\`，统计 \`- [ ]\` / \`- [x]\`，无任务文件则记为「无任务」；c) **增量规范**：检查 \`phspec/changes/<name>/specs/\`，列出能力及 \`### Requirement: <name>\` 需求名。

4. **检测规范冲突**：构建 \`capability -> [涉及该能力的变更]\` 映射。当 2+ 所选变更对同一能力有增量规范时即存在冲突。

5. **由 agent 解决冲突**：对每个冲突：读各冲突变更的增量规范；在代码库中搜索实现证据；决定方案（仅一个变更有实现则只同步该变更的规范；两个都有实现则按时间顺序应用；都无实现则跳过规范同步并警告）；记录每个冲突的解决（应用哪几个变更的规范、顺序及依据）。

6. **展示汇总状态表**：表格汇总各变更（制品、任务、增量规范、冲突、状态）；有冲突时展示解决结果；有不完整变更时展示警告。

7. **确认批量操作**：用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 单次确认（如「归档 N 个变更？」），选项可含「归档全部」「仅归档就绪的」「取消」。有不完整变更时说明将带警告归档。若环境无该工具，直接输出选项并写明「请回复后再继续」，不要自行执行归档。

8. **按确认执行归档**：按既定顺序（含冲突解决顺序）：若有增量规范则先同步（phspec-sync-specs，冲突按解决顺序应用）；执行 \`mkdir -p phspec/changes/archive\` 与 \`mv phspec/changes/<name> phspec/changes/archive/YYYY-MM-DD-<name>\`；记录每项结果（成功/失败/跳过）。

9. **展示摘要**：最终结果（已归档列表、跳过列表、规范同步摘要、若有失败则列出）。无进行中变更时输出「无变更可归档，使用 \`/phsx:new\` 创建新变更」。

**边界**：始终让用户选择不自动选；尽早检测规范冲突并通过代码库解决；两变更都实现时按时间顺序应用规范；仅当实现缺失时跳过规范同步并警告；单次确认整批；保留 .phspec.yaml；目标已存在时该变更失败但继续其他。`,
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
    content: `校验实现是否与变更制品（规范、任务、设计）一致。

**输入**：可指定变更名。未指定时从对话推断；含糊或有歧义时必须让用户从可用变更中选择。

**步骤**

1. **若未提供变更名，让用户选择**：运行 \`phspec list --json\`，用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent） 让用户选择。展示有实施任务（存在 tasks 制品）的变更、各变更所用工作流模式，未完成任务标为「进行中」。若环境无该工具，直接输出变更选项并写明「请回复后再继续」，不要猜测或自动选择。**重要**：不要猜测或自动选择。

2. **查看状态以了解工作流**：\`phspec status --change "<name>" --json\`，解析 \`schemaName\` 及该变更有哪些制品。

3. **获取变更目录并加载制品**：\`phspec instructions apply --change "<name>" --json\`，从返回的 \`contextFiles\` 中读取所有可用制品。

4. **初始化校验报告结构**：按四个维度建报告——**完整性**（任务与规范覆盖）、**正确性**（需求实现与场景覆盖）、**一致性**（设计遵循与模式一致）、**代码卫生**（代码质量与规范合规性）。每个维度可有 CRITICAL、WARNING、SUGGESTION 级别问题。

5. **校验完整性**：若有 tasks.md，解析 \`- [ ]\` / \`- [x]\`，未完成任务记 CRITICAL。若有 \`phspec/changes/<name>/specs/\` 增量规范，提取 \`### Requirement:\` 需求，逐条在代码库中搜索评估是否已实现；明显未实现则记 CRITICAL。

6. **校验正确性**：对每条需求搜索实现证据，评估是否与需求意图一致；对 \`#### Scenario:\` 场景检查代码与测试覆盖；检查规范关键字（SHALL、MUST、REQUIRED、WILL）的实现。偏离或未覆盖记 WARNING。

7. **校验一致性**：若有 design.md，提取关键决策并核对实现是否遵循；检查新代码与项目模式是否一致。矛盾记 WARNING，明显偏离记。

8. **校验代码卫生**：检查重复代码、错误处理、注释质量、命名规范。重复代码记 SUGGESTION，缺少错误处理记 WARNING，命名偏离记 SUGGESTION。

9. **生成校验报告**：摘要表（## 校验报告：<change-name>；Completeness/Correctness/Coherence/CodeHygiene 状态）；按 CRITICAL/WARNING/SUGGESTION 列问题，每条带可执行建议及文件/行引用；结论（有 CRITICAL 则「归档前请修复」；仅 WARNING 则「可归档并改进」；全部通过则「可归档」）。

**校验启发**：完整性关注客观清单；正确性用关键词与合理推断；一致性关注明显不一致；代码卫生关注质量改进。不确定时优先 SUGGESTION 再 WARNING 再 CRITICAL。**重要**：本命令为建议式校验，不强制阻塞归档。**降级**：仅 tasks.md 时只校验任务；有 tasks+specs 时校验完整性与正确性；全量制品时校验四维。**输出格式**：清晰 Markdown、摘要表、按优先级分组、\`file.ts:123\` 引用、具体建议。`,
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
   - 命令会自动附加元数据（版本、平台时间戳）

**示例草稿**（标题 + 正文：在做什么、遇到什么问题、建议、上下文；使用 spec-driven 与 <path> 等占位）。

**匿名化示例**：Before 中具体路径、API key、公司名 → After 中 <path>、<redacted>、<company>。

**边界**
- 提交前必须展示完整草稿并征得明确同意
- 必须对敏感信息做匿名化
- 允许用户修改草稿后再提交
- 未经用户确认不得提交
- 保留相关技术上下文与对话中的洞察

**用户确认话术**：展示标题与正文后询问「这样可以吗？需要改哪里可以说，或按原样提交。」仅在用户确认后再执行提交。若所在环境没有 AskUserQuestion 或 ask_followup_question 等用户确认工具，直接输出该询问并写明「请回复后再继续」，不要未经确认即提交。`,
  };
}

/**
 * Template for phspec-review-spec skill
 * Review specification quality: completeness, clarity, implementability, testability
 */
export function getReviewSpecSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-review-spec",
    description: "规格质量审查 - 检查规格的完整性、清晰度、可实施性和可测试性",
    instructions: getReviewSpecSkillInstructions(),
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

// -----------------------------------------------------------------------------
// Review Command Helpers
// -----------------------------------------------------------------------------

/**
 * Helper function for review-spec skill instructions
 */
function getReviewSpecSkillInstructions(): string {
  return `审查规格质量，检查规格的完整性、清晰度、可实施性、可测试性、非功能性需求清晰度和可追溯性。

**核心原则**：规格是 AI 执行任务的合同——每条需求必须清晰到 AI 能直接据此写代码。

---

## 审查维度

| 维度 | 核心问题 |
|------|---------|
| 完整性 | 规格是否包含所有必要部分？需求是否有足够的场景？ |
| 清晰度 | 需求语言是否具体、无歧义？术语是否一致？ |
| 可实施性 | 技术方案是否可行？是否依赖不存在的系统？ |
| 可测试性 | 每个需求是否至少有一个可验证的场景？ |
| 非功能性需求 | 性能、安全、可扩展性要求是否明确？ |
| 可追溯性 | 每条需求是否能追溯到 capability？ADDED/MODIFIED 标记是否一致？ |

---

## 步骤

**1. 获取规格位置**

a. 若提供了变更名：
\`\`\`bash
phspec status --change "<name>" --json
\`\`\`

b. 若未提供变更名，让用户选择：
- 运行 \`phspec list --json\` 获取变更列表
- 用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent）让用户选择
- 若环境无上述工具，直接输出选项并写明「请回复后再继续」

**2. 查找规格文件**

规格文件位于：
- 主规范：\`phspec/specs/<capability>/spec.md\`
- 增量规范：\`phspec/changes/<name>/specs/<capability>/spec.md\`

优先审查增量规范；若无则审查主规范。若未找到规格，告知用户并停止。

**3. 审查完整性**

检查规格是否包含所有必要部分：

**必备部分：**
- **Purpose**：规格的目的和范围
- **需求结构**：\`### Requirement:\` 格式的需求描述
- **场景覆盖**：每个需求有 \`#### Scenario:\` 测试场景
- **增量操作类型**：ADDED/MODIFIED/REMOVED/RENAMED

**检查项：**
- [ ] Purpose 是否清晰定义了能力目的
- [ ] 需求是否使用标准格式（\`### Requirement: <Name>\`）
- [ ] 每个需求是否有场景描述
- [ ] 场景是否使用 WHEN/THEN/AND 格式
- [ ] 增量规范是否有正确的操作类型

**缺失部分记为：** CRITICAL - 「缺失必备部分：<部分名>」，建议补充。

**4. 审查清晰度**

评估规格语言是否清晰无歧义：

**检查项：**
- [ ] 需求描述是否具体、可测量（避免"用户友好"、"快速响应"等模糊词）
- [ ] 避免模糊词汇（「也许」、「可能」、「视情况」、「必要时」）
- [ ] 技术术语是否一致（同一个概念全程使用同一术语）
- [ ] 场景是否明确描述触发条件（WHEN）和预期结果（THEN）
- [ ] 是否有未定义的缩写或术语（若是，首次出现处应有解释）

**发现歧义则记为：** WARNING - 「需求描述存在歧义：<详情>」，建议重述为可测量的表述。

**5. 审查可实施性**

评估规格是否可被实施：

**检查项：**
- [ ] 技术方案是否可行
- [ ] 是否依赖不存在的系统或技术
- [ ] 性能要求是否现实（"100ms 内响应" vs "尽可能快"）
- [ ] 安全要求是否可实现
- [ ] 是否与现有架构兼容

**可行性问题记为：** CRITICAL - 「实施可行性问题：<详情>」，建议调整。

**6. 审查可测试性**

评估规格是否可被验证：

**检查项：**
- [ ] 每个需求是否有至少一个场景
- [ ] 场景的 WHEN 条件是否可触发（不是"用户开心时"这种不可控条件）
- [ ] 场景的 THEN 结果是否可验证（不是"系统表现良好"这种主观描述）
- [ ] 边界条件是否有场景覆盖（最大/最小/空值/临界值）
- [ ] 错误路径是否有场景描述

**测试性问题记为：** WARNING - 「可测试性问题：<详情>」，建议补充场景。

**7. 审查非功能性需求清晰度**

评估规格是否明确包含性能、安全、可扩展性等非功能性要求：

**检查项：**
- [ ] 性能要求是否有明确数值（响应时间、吞吐量、并发数）
- [ ] 安全要求是否具体（认证方式、加密算法、数据保护要求）
- [ ] 可扩展性期望是否说明（支持用户量级、支持数据量级）
- [ ] 可用性要求是否明确（SLA、正常运行时间要求）

**非功能性缺失记为：** WARNING - 「非功能性需求不明确：<详情>」，建议补充具体指标。

**8. 审查可追溯性**

评估规格是否满足可追溯性要求：

**检查项：**
- [ ] 每条 \`### Requirement:\` 是否在增量规范中有明确操作类型（ADDED/MODIFIED/REMOVED）
- [ ] 每个 Requirement 名称是否与需求文档中 capability 列表对应（spec-driven 为 proposal.md，lean-sdd 为 requirement.md）
- [ ] 同一需求在不同文件中名称是否一致
- [ ] 增量规范与主规范之间是否有明确的关联标记

**可追溯性问题记为：** WARNING - 「可追溯性问题：<详情>」，建议使用规范化的 Requirement 命名。

**9. 生成审查报告**

\`\`\`markdown
# Review Spec: <Change Name or Capability Name>
**Artifact:** spec.md
**Date:** YYYY-MM-DD
**Status:** ✅ SOUND / ⚠️ NEEDS WORK / ❌ MAJOR ISSUES

## Overall Assessment
[1-2 句话总结整体评估]

## Review Scope
- 规范类型：<增量规范/主规范>
- Capability：<capability 名称>
- 需求数量：<N 个 Requirement>

## Completeness Checklist
| 检查项 | 状态 |
|--------|------|
| Purpose 定义 | ✓/✗ |
| 需求结构 | ✓/✗ |
| 场景覆盖 | ✓/✗ |
| 操作类型标记 | ✓/✗ |

## Dimensions
### Completeness: <评分>/5
**评估：** [评估说明]
**结果：** [通过/需改进]

### Clarity: <评分>/5
**评估：** [评估说明]
**结果：** [通过/需改进]

### Implementability: <评分>/5
**评估：** [评估说明]
**结果：** [通过/需改进]

### Testability: <评分>/5
**评估：** [评估说明]
**结果：** [通过/需改进]

### Non-Functional Clarity: <评分>/5
**评估：** [评估说明]
**结果：** [通过/需改进]

### Traceability: <评分>/5
**评估：** [评估说明]
**结果：** [通过/需改进]

## Recommendations
### Critical (Must Fix)
- [问题 1]
  - **位置**：<spec.md 中的引用>
  - **建议**：<具体修复建议>

### Important (Should Fix)
- [问题 1]
  - **位置**：<spec.md 中的引用>
  - **建议**：<具体修复建议>

### Optional (Nice to Have)
- [问题 1]
  - **位置**：<spec.md 中的引用>
  - **建议**：<优化建议>

## Conclusion
**规格质量**：[整体评价]
**可归档/继续**：Yes/No
**下一步**：<建议行动>
\`\`\`

**10. 保存审查报告（如用户请求）**

报告默认在聊天窗口显示。如用户请求，可保存为本地 markdown 文件：

\`\`\`bash
mkdir -p phspec/changes/<name>/reviews
cat > phspec/changes/<name>/reviews/review-spec-$(date +%Y%m%d-%H%M%S).md << 'EOF'
<将上方生成的报告内容粘贴至此>
EOF
\`\`\`

保存路径：\`phspec/changes/<name>/reviews/review-spec-<timestamp>.md\`

---

## 评分标准

| 维度 | 5 分 | 4 分 | 3 分 | 2 分 | 1 分 |
|------|------|------|------|------|------|
| 完整性 | 所有必备部分齐全且详细 | 缺少部分非关键信息 | 缺少一些细节信息 | 缺少重要部分 | 缺少必备部分 |
| 清晰度 | 完全清晰无歧义 | 基本清晰，极少歧义 | 有些模糊但不影响理解 | 多处模糊影响理解 | 大量歧义难以理解 |
| 可实施性 | 完全可行 | 小调整后可行 | 需要一些调整 | 需要重大调整 | 不可实施 |
| 可测试性 | 完全覆盖场景 | 覆盖主要场景 | 部分覆盖场景 | 场景不足 | 无场景描述 |
| 非功能性清晰度 | 所有非功能性需求有明确指标 | 大部分有明确指标 | 部分有明确指标 | 少量有明确指标 | 完全不明确 |
| 可追溯性 | 完全可追溯 | 大部分可追溯 | 部分可追溯 | 少量可追溯 | 完全不可追溯 |

---

## 边界

- 未提供变更时始终让用户选择，不猜测
- 优先审查增量规范，若无则审查主规范
- 未找到规格时告知用户并停止
- 评估基于现有信息，不要求绝对确定
- 不确定时优先 WARNING 再 CRITICAL
- 报告使用标准格式，含评分、问题分类和可执行建议
- 每个建议必须带 spec.md 中的具体位置引用`;
}




/**
 * Get review-spec command content for slash command generation
 */
export function getReviewSpecCommandContent(): string {
  return `审查规格质量，检查规格的完整性、清晰度、可实施性和可测试性。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **获取规格位置**

   a. 若提供了变更名：
      \`\`\`bash
      phspec status --change "<name>" --json
      \`\`\`

   b. 若未提供变更名，让用户选择：
      - 运行 \`phspec list --json\` 获取变更列表
      - 用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent）让用户选择
      - 若环境无上述工具，直接输出选项并写明「请回复后再继续」

2. **查找规格文件**

   规格文件位于：
   - 主规范：\`phspec/specs/<capability>/spec.md\`
   - 增量规范：\`phspec/changes/<name>/specs/<capability>/spec.md\`

   优先审查增量规范；若无则审查主规范。若未找到规格，告知用户并停止。

3. **审查完整性**

   检查必备部分：Purpose、需求结构、场景覆盖、增量规范格式。

4. **审查清晰度**

   评估需求是否具体无歧义、技术术语一致性、场景明确性。

5. **审查可实施性**

   评估技术可行性、依赖合理性、性能现实性、安全性、架构兼容性。

6. **审查可测试性**

   评估场景覆盖度、可触发性、可验证性、边界条件、错误路径。

7. **生成并输出审查报告**

   使用标准报告格式：Overall Assessment、Dimensions (Completeness/Clarity/Implementability/Testability)、Recommendations (Critical/Important/Optional)、Conclusion。

**边界**

- 未提供变更时始终让用户选择，不猜测
- 优先审查增量规范，若无则审查主规范
- 未找到规格时告知用户并停止
- 评估基于现有信息，不确定时优先 WARNING 再 CRITICAL
- 报告使用标准格式，含评分、问题分类和可执行建议`;
}

// -----------------------------------------------------------------------------
// Review Command Helpers
// -----------------------------------------------------------------------------

/**
 * Template for /phsx:review-spec slash command
 */
export function getOpsxReviewSpecCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Review Spec",
    description: "规格质量审查 - 检查规格的完整性、清晰度、可实施性和可测试性",
    category: "Review",
    tags: ["review", "spec", "experimental"],
    content: `审查规格质量，检查规格的完整性、清晰度、可实施性和可测试性。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **获取规格位置**

   a. 若提供了变更名：
      \`\`\`bash
      phspec status --change "<name>" --json
      \`\`\`

   b. 若未提供变更名，让用户选择：
      - 运行 \`phspec list --json\` 获取变更列表
      - 用 **AskUserQuestion**（Cursor 等）或 **ask_followup_question**（DevAgent）让用户选择
      - 若环境无上述工具，直接输出选项并写明「请回复后再继续」

2. **查找规格文件**

   规格文件位于：
   - 主规范：\`phspec/specs/<capability>/spec.md\`
   - 增量规范：\`phspec/changes/<name>/specs/<capability>/spec.md\`

   优先审查增量规范；若无则审查主规范。若未找到规格，告知用户并停止。

3. **审查完整性**

   检查必备部分：Purpose、需求结构、场景覆盖、增量规范格式。

4. **审查清晰度**

   评估需求是否具体无歧义、技术术语一致性、场景明确性。

5. **审查可实施性**

   评估技术可行性、依赖合理性、性能现实性、安全性、架构兼容性。

6. **审查可测试性**

   评估场景覆盖度、可触发性、可验证性、边界条件、错误路径。

7. **生成并输出审查报告**

   使用标准报告格式：Overall Assessment、Dimensions (Completeness/Clarity/Implementability/Testability)、Recommendations (Critical/Important/Optional)、Conclusion。

**边界**

- 未提供变更时始终让用户选择，不猜测
- 优先审查增量规范，若无则审查主规范
- 未找到规格时告知用户并停止
- 评估基于现有信息，不确定时优先 WARNING 再 CRITICAL
- 报告使用标准格式，含评分、问题分类和可执行建议`,
  };
}

/**
 * Get review-code command content for slash command generation
 */
export function getReviewCodeCommandContent(): string {
  return `审查代码质量，验证实现与规格的一致性，检查安全性、架构合规性和死代码。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**严重级别**：P0（必须阻断合并）/ P1（合并前应修）/ P2（修或创建 follow-up）/ P3（可选改进）

**步骤**

1. **Preflight — 获取变更范围**

   - 运行 \`phspec status --change "<name>" --json\` 了解工作流和制品状态
   - 若在 git 仓库中，运行 \`git diff --stat HEAD\` 获取变更文件列表
   - 大 diff（500+ 行）警告用户建议分批审查

2. **定位规格文件**

   查找增量规范或主规范，提取所有 Requirement 及 Scenario、MUST/SHALL/SHOULD 关键字。

3. **Layer 1 — 快速扫描（必须全部检查）**

   - [ ] 增量规范中提到的每个文件是否存在
   - [ ] MUST/SHALL 关键字在代码中是否有对应实现
   - [ ] 是否有删除/重命名既有接口的 breaking change

4. **Layer 2 — 深度检查（每个需求逐条验证）**

   - [ ] 场景覆盖：每个 Scenario 的 WHEN 条件是否被代码覆盖
   - [ ] 错误处理：关键路径是否有 try/catch、错误返回或 fallback
   - [ ] 边界情况：null/undefined、边界值、数组边界、除零/越界

5. **Layer 2.5 — 安全与架构检查**

   **安全扫描（P0-P1）：**
   - [ ] XSS：dangerouslySetInnerHTML、未转义模板、innerHTML 赋值
   - [ ] 注入：SQL/NoSQL/命令注入（字符串拼接或模板字面量）
   - [ ] SSRF：用户可控 URL 未做 allowlist 校验
   - [ ] 路径穿越：用户输入进入文件路径未消毒
   - [ ] 认证/授权：缺失 tenant/ownership 检查、新端点无 auth guard、IDOR
   - [ ] JWT：算法混淆、弱/硬编码密钥、缺失 exp 验证、payload 含敏感数据
   - [ ] 密钥泄露：API key/token/凭据出现在代码/配置/日志中
   - [ ] 供应链：未锁定依赖、依赖混淆、CDN 引用无完整性校验
   - [ ] 竞态条件：TOCTOU 模式、check-then-act、read-modify-write 无原子操作、并发写入无锁

   **架构检查（P1-P2）：**
   - [ ] SRP：单个函数/模块承担过多职责
   - [ ] 依赖方向：高层模块直接依赖低层实现（无抽象）
   - [ ] 副作用隔离：纯逻辑与 I/O 操作混合

6. **Layer 3 — 质量检查（有则报告，不阻塞）**

   - [ ] 可测试性：依赖是否可注入、是否有 mock 路径
   - [ ] 可观测性：新逻辑是否有日志、metrics 或 tracing
   - [ ] API 契约：改动是否向后兼容
   - [ ] 死代码：未引用的函数/变量、注释掉的代码块、TODO/FIXME 临时代码

7. **检测规格漂移**

   - [ ] 代码是否超出规格范围
   - [ ] 是否有未在规格中记录的功能
   - [ ] 实现是否偏离规格意图

8. **生成并输出审查报告**

   报告包含：Overall Assessment、Review Scope、Layer 1 Quick Scan、Layer 2 Scenario Coverage、Layer 2.5 Security Scan + Architecture Check、Layer 3 Quality Checks、Dead Code Candidates、Recommendations (P0/P1/P2-P3)、Conclusion。

**边界**

- 未提供变更时始终让用户选择，不猜测
- 未找到规格时告知用户并停止
- 每条发现必须有代码证据（文件:行号），无法给出证据时降级为 SUGGESTION
- 不确定时降级为 P1 而非 P0
- 默认只读，不实施修复，除非用户明确要求`;
}

/**
 * Template for phspec-review-code skill
 * Review code compliance: functional correctness, error handling, edge cases, non-functional requirements, spec drift
 */
export function getReviewCodeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-review-code",
    description: "代码规范合规性审查 - 验证代码实现与规格的一致性",
    instructions: getReviewCodeSkillInstructions(),
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Helper function for review-code skill instructions
 */
function getReviewCodeSkillInstructions(): string {
  return `审查代码质量，验证实现与规格的一致性，并检查安全性、架构合规性、可测试性、可观测性和死代码。

**核心原则**：每条发现必须有代码证据（文件:行号），空洞的"建议增强错误处理"没有价值。

**严重级别**：
- **P0 — Critical**：安全漏洞、数据丢失风险、正确性 bug、spec 不合规。必须阻断合并。
- **P1 — High**：错误处理缺失、边界条件未覆盖、架构违规。合并前应修。
- **P2 — Medium**：可测试性、可观测性问题。修或创建 follow-up。
- **P3 — Low**：死代码、风格建议。可选改进。

---

## 分层检查策略

**Layer 1 — 快速扫描（必须全部检查）**
- 文件存在性：增量规范中提到的每个文件是否都存在
- 关键字覆盖：增量规范中的 MUST/SHALL/SHOULD 关键字在代码中是否有对应实现
- Breaking change 检测：是否有删除或重命名既有接口/函数/类型

**Layer 2 — 深度检查（每个需求逐条验证）**
- 场景覆盖：spec 中每个 Scenario 的 WHEN 条件是否被代码覆盖
- 错误处理：关键路径是否有 try/catch、错误返回或 fallback
- 边界情况：spec 中的边界条件在代码中是否处理

**Layer 2.5 — 安全与架构检查（逐项扫描）**
- 安全漏洞：XSS、注入、SSRF、路径穿越、认证/授权、JWT、密钥泄露、供应链、竞态条件
- 架构违规：SRP 违反、依赖方向错误、副作用隔离不当

**Layer 3 — 质量检查（有则报告，不阻塞）**
- 可测试性：依赖是否可注入、是否有 mock 路径
- 可观测性：新逻辑是否有日志、metrics 或 tracing
- API 契约：改动是否向后兼容、是否有 breaking change
- 死代码：未引用的函数/变量、注释掉的代码、TODO/FIXME 临时代码

---

## 步骤

**1. Preflight — 获取变更范围**

- 若在 git 仓库中，运行 \`git diff --stat HEAD\` 获取变更文件列表和行数
- 大 diff（500+ 行）：警告用户"变更较大（N 行），建议分批审查以提高准确性"
- 混合关注点：若变更涉及多个不相关模块，提示用户考虑拆分审查

**2. 扫描项目配置（并行）**

扫描以下配置文件获取审查依据：
- ESLint/Prettier 配置：\`.eslintrc\`, \`eslint.config.js\`, \`.prettierrc\`
- TypeScript 配置：\`tsconfig.json\`
- 后端规范：\`checkstyle.xml\`, \`pmd.xml\`, \`spotbugs.xml\`（若存在 Java 项目）
- 项目根目录的 \`CONTRIBUTING.md\` 或 \`CODE_STANDARDS.md\`（若存在）

将扫描到的规范摘要加入上下文。

**若未扫描到任何规范**：
- **暂停审查**，告知用户："未找到项目规范文档（ESLint/Prettier/tsconfig.json/CODE_STANDARDS.md 等）。使用通用编程规范作为底线进行审查，但审查结果的针对性可能有限。"
- 询问用户是否要补充项目规范文档，或选择继续使用通用规范进行底线审查
- 若用户选择补充规范，等待用户完成补充后重新扫描
- 若用户选择继续，使用通用编程规范作为底线继续审查

**3. 获取变更上下文**

\`\`\`bash
phspec status --change "<name>" --json
\`\`\`

解析变更的工作流模式、制品状态，确认是否有增量规范和任务列表。

**4. 读取增量规范**

读取所有 \`phspec/changes/<name>/specs/*/spec.md\` 文件，对每个 capability：
- 提取所有 \`### Requirement: <name>\` 及其 \`#### Scenario:\` 列表
- 提取 \`SHALL\`/\`MUST\`/\`SHOULD\` 关键字及约束
- 记录 ADDED/MODIFIED/REMOVED 操作类型

**5. 读取任务列表（如有）**

读取 \`phspec/changes/<name>/tasks.md\`，获取本次实施涉及的具体文件和改动范围。

**6. 执行 Layer 1 快速扫描**

对每个增量规范中提到的文件路径：
- 检查文件是否存在（若不存在 → P0）
- 用 grep 搜索 SHALL/MUST 关键字对应的实现（若找不到 → P0）
- 检查是否有删除既有函数/类型/接口的痕迹（若有 → P0，标记为 breaking change）

**7. 执行 Layer 2 深度检查**

对每个 Requirement 和其每个 Scenario：

a) **搜索实现证据**
\`\`\`bash
grep -rn "capability_keyword" --include="*.ts" --include="*.js" src/
\`\`\`

b) **读取相关代码段**
找到文件后，读取相关函数/模块的完整代码段（不只是匹配行）。

c) **对照 WHEN/THEN 判断覆盖**
- Scenario 的 WHEN 条件是否在代码中有对应逻辑？
- Scenario 的 THEN 结果是否在代码中有对应输出？
- 记录覆盖状态：✓ 完全覆盖 / ⚠️ 部分覆盖 / ✗ 未覆盖

d) **检查错误处理**
- 关键函数是否有 try/catch？
- 异步操作是否有错误回调？
- 是否有静默吞错误的情况（catch 空块）？
- 错误消息是否清晰、是否包含足够上下文？

e) **检查边界情况**
- 空输入、null/undefined 是否有防御性检查？
- 数组边界、除零、索引越界是否有保护？
- 数值极限（Number.MAX_SAFE_INTEGER、负数、NaN）是否考虑？

**8. 执行 Layer 2.5 安全与架构检查**

**8a. 安全扫描**（逐项检查，每项用 grep + 代码阅读验证）

**XSS（跨站脚本）：**
- [ ] React: \`dangerouslySetInnerHTML\` 使用是否经过消毒
- [ ] 模板引擎: 是否有未转义的 \`{{{ }}}\` 或 \`!=\` 输出
- [ ] DOM: \`innerHTML\`、\`outerHTML\`、\`document.write\` 赋值
- [ ] URL: \`javascript:\`、\`data:\` 协议的用户输入拼接

**注入攻击：**
- [ ] SQL: 字符串拼接构建查询（而非参数化查询）
- [ ] NoSQL: MongoDB 操作符注入（\`$gt\`、\`$ne\` 等来自用户输入）
- [ ] 命令注入: \`exec()\`、\`spawn()\`、\`system()\` 中拼接用户输入
- [ ] GraphQL: 查询中的字符串插值

**SSRF（服务端请求伪造）：**
- [ ] 用户可控的 URL 是否经过 allowlist 校验
- [ ] 是否有 \`fetch()\`、\`axios()\`、\`http.request()\` 使用用户提供的 URL
- [ ] 内网地址（\`127.0.0.1\`、\`169.254.*\`、\`10.*\`）是否被过滤

**路径穿越：**
- [ ] 用户输入是否直接用于文件路径（\`fs.readFile(userInput)\`）
- [ ] 是否有 \`../\` 检测和消毒
- [ ] 是否限制在预期目录内（chroot/sandbox）

**认证与授权：**
- [ ] 新端点是否有 auth 中间件/guard
- [ ] 是否有 tenant 或 ownership 检查（防止 IDOR）
- [ ] 是否信任客户端提供的角色/标志/ID
- [ ] Session 管理是否安全（固定 session、过期策略）

**JWT 与 Token 安全：**
- [ ] 算法混淆：是否接受 \`none\` 或错误的算法（如期望 RS256 却接受 HS256）
- [ ] 密钥强度：是否使用硬编码或弱密钥
- [ ] 过期验证：是否校验 \`exp\` 字段
- [ ] 敏感数据：JWT payload 是否包含不应暴露的信息（token 是 base64 非加密）
- [ ] 签发者/受众：是否校验 \`iss\` 和 \`aud\`

**密钥与 PII 泄露：**
- [ ] API key、token、凭据是否出现在代码/配置/日志中
- [ ] 环境变量是否暴露给客户端
- [ ] 错误消息是否包含敏感数据或堆栈信息
- [ ] 日志是否过度记录 PII

**供应链安全：**
- [ ] 依赖是否锁定版本（lock file 存在且最新）
- [ ] 是否有依赖混淆风险（私有包名冲突）
- [ ] CDN 引用是否有 integrity 校验（SRI）
- [ ] 是否存在已知 CVE 的过期依赖

**竞态条件：**
- [ ] TOCTOU: \`if (exists(key)) { create(key) }\` 类非原子检查-执行模式
- [ ] Check-then-act: 余额检查与扣款之间是否有并发窗口
- [ ] Read-modify-write: 计数器递增是否使用原子操作
- [ ] 数据库并发: 是否缺少乐观锁/悲观锁、事务隔离级别是否足够
- [ ] 分布式锁: 缓存失效、leader 选举是否有竞态风险
- 关键提问："两个请求同时命中这段代码会怎样？这个操作是原子的吗？"

**8b. 架构检查**

**单一职责（SRP）：**
- [ ] 单个函数是否承担过多职责（超过 3 个独立关注点）
- [ ] 模块是否混合了业务逻辑、数据访问和外部调用
- [ ] 是否有"上帝函数"（超过 100 行的函数）

**依赖方向：**
- [ ] 高层模块是否直接 \`new\` 低层实现（而非通过抽象/接口）
- [ ] 是否有循环依赖
- [ ] 配置/常量是否硬编码在业务逻辑中

**副作用隔离：**
- [ ] 纯计算函数是否混入了 I/O 操作
- [ ] 是否有隐藏的全局状态修改
- [ ] 异步操作是否在预期的位置完成

**9. 执行 Layer 3 质量检查**

a) **可测试性检查**
- 关键依赖是否通过构造函数注入（而非硬编码 new）？
- 是否有 private 方法直接实例化外部服务（难以 mock）？
- 数据库/文件系统操作是否有抽象层？

b) **可观测性检查**
- 新增的业务逻辑是否有结构化日志（不只是 console.log）？
- 重要的状态变化是否有 metrics 埋点？
- 跨服务调用是否传递了 tracing context？

c) **API 契约稳定性检查**（若改动涉及 API）
- 新增字段是否为 optional 或有默认值？
- 删除字段是否先 deprecated 再删除？
- 类型变更是否兼容（string → number 是 breaking）？

d) **死代码检测**
- 新增代码中是否存在未被引用的函数/变量？
- 是否有注释掉的代码块？（应删除，由版本控制保留历史）
- 是否有 TODO/FIXME 标记的临时代码？
- 是否有永远不会执行的分支（if false、return 后的代码）？

**10. 检测规格漂移**

- 代码是否超出规格范围（实现了 spec 中未要求的功能）？
- 是否有未在规格中记录的功能？
- 实现是否偏离规格意图？

**11. 生成审查报告**

\`\`\`markdown
# Review Code: <Change Name>
**Artifact:** Implementation
**Date:** YYYY-MM-DD
**Status:** ✅ SOUND / ⚠️ NEEDS WORK / ❌ MAJOR ISSUES

## Overall Assessment
[1-2 句话总结整体评估，涵盖 spec 合规性、安全性、架构质量]

## Review Scope
- 增量规范：<capability-1>, <capability-2>
- 实施文件：<列出本次改动涉及的文件>
- 审查依据：<扫描到的配置文件列表>

## Layer 1: Quick Scan
| 检查项 | 状态 | 证据 |
|--------|------|------|
| 文件存在性 | ✓/✗ | <文件路径> |
| 关键字覆盖 | ✓/✗ | <关键字> → <文件:行号> |
| Breaking Change | ✓/✗ | <详情> |

## Layer 2: Scenario Coverage
| Requirement | Scenario | 覆盖状态 | 证据 |
|-------------|----------|----------|------|
| <req-name> | <scenario-name> | ✓/⚠️/✗ | <文件:行号> |

## Layer 2.5: Security Scan
| 漏洞类型 | 严重级别 | 状态 | 证据 |
|----------|----------|------|------|
| XSS | P0 | ✓/✗ | <详情> |
| 注入 | P0 | ✓/✗ | <详情> |
| SSRF | P0 | ✓/✗ | <详情> |
| 路径穿越 | P0 | ✓/✗ | <详情> |
| 认证/授权 | P0 | ✓/✗ | <详情> |
| JWT | P0-P1 | ✓/✗ | <详情> |
| 密钥泄露 | P0 | ✓/✗ | <详情> |
| 供应链 | P1 | ✓/✗ | <详情> |
| 竞态条件 | P0-P1 | ✓/✗ | <详情> |

## Layer 2.5: Architecture Check
| 检查项 | 状态 | 证据 |
|--------|------|------|
| 单一职责 | ✓/⚠️/✗ | <详情> |
| 依赖方向 | ✓/⚠️/✗ | <详情> |
| 副作用隔离 | ✓/⚠️/✗ | <详情> |

## Layer 3: Quality Checks
| 维度 | 评分/5 | 发现 |
|------|--------|------|
| 可测试性 | X | <问题或"无问题"> |
| 可观测性 | X | <问题或"无问题"> |
| API 契约 | X | <问题或"无问题"> |
| 规格漂移 | X | <问题或"无问题"> |

## Dead Code Candidates
| 位置 | 类型 | 建议处理 |
|------|------|----------|
| <文件:行号> | 未引用函数/注释代码/TODO | 安全删除 / 需评估 / 延迟处理 |

## Recommendations
### P0 — Critical (Must Fix)
- [<问题描述>]
  - **证据**：<文件:行号>
  - **建议**：<具体修复方案>

### P1 — High (Should Fix)
- [<问题描述>]
  - **证据**：<文件:行号>
  - **建议**：<具体修复方案>

### P2 — Medium (Fix or Follow-up)
- [<问题描述>]
  - **证据**：<文件:行号>
  - **建议**：<具体修复方案>

### P3 — Low (Optional)
- [<问题描述>]
  - **证据**：<文件:行号>
  - **建议**：<优化建议>

## Conclusion
**代码质量**：[整体评价]
**可继续/需修复**：Yes/No
**下一步**：<建议行动>
\`\`\`

**12. 下一步确认**

统计问题数量后向用户呈现选项：
1. 修复所有 P0 和 P1 问题
2. 仅修复 P0 问题
3. 修复指定的问题（列出编号）
4. 不修复，仅记录

**不实施任何修改，除非用户明确确认。**

**13. 保存审查报告（如用户请求）**

报告默认在聊天窗口显示。如用户请求，可保存为本地 markdown 文件：

\`\`\`bash
mkdir -p phspec/changes/<name>/reviews
cat > phspec/changes/<name>/reviews/review-code-$(date +%Y%m%d-%H%M%S).md << 'EOF'
<将上方生成的报告内容粘贴至此>
EOF
\`\`\`

保存路径：\`phspec/changes/<name>/reviews/review-code-<timestamp>.md\`

---

## 评分标准

| 维度 | 5 分 | 4 分 | 3 分 | 2 分 | 1 分 |
|------|------|------|------|------|------|
| 场景覆盖 | 全部覆盖且证据充分 | 覆盖主要场景 | 部分覆盖 | 少量覆盖 | 无覆盖 |
| 错误处理 | 所有路径都有处理 | 大部分有处理 | 部分有处理 | 关键路径缺失 | 几乎没有 |
| 边界情况 | 全面覆盖 | 大部分覆盖 | 部分覆盖 | 少量覆盖 | 无覆盖 |
| 可测试性 | 完全可测试 | 基本可测试 | 需要小调整 | 需要大调整 | 几乎不可测试 |
| 可观测性 | 完整埋点 | 基本埋点 | 部分埋点 | 少量埋点 | 无埋点 |
| API 契约 | 完全向后兼容 | 向后兼容 | 小调整后可兼容 | 需要迁移 | breaking change |
| 规格漂移 | 完全一致 | 轻微偏离 | 部分偏离 | 明显偏离 | 严重偏离 |

---

## 边界

- 未提供变更时始终让用户选择，不猜测
- 未找到增量规范时使用主规范；主规范也不存在时告知用户并停止
- 每个发现必须有证据（文件:行号），无法给出证据时降级为 SUGGESTION 或不报告
- 不确定时降级为 P1 而非 P0
- Layer 3 发现不影响整体 status（除非发现 breaking change）
- 默认只读，不实施修复，除非用户明确确认
- 安全检查宁可误报也不漏报：不确定时标记为 P1 并注明"需人工确认"`;
}


/**
 * Template for phspec-review-design skill
 * Review design consistency: design adherence, coherence, architecture alignment, traceability, completeness
 */
export function getReviewDesignSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-review-design",
    description: "设计一致性审查 - 检查设计方案与规格的关联性",
    instructions: getReviewDesignSkillInstructions(),
    license: "MIT",
    compatibility: "Requires phspec CLI.",
    metadata: { author: "phspec", version: "1.0" },
  };
}

/**
 * Helper function for review-design skill instructions
 */
function getReviewDesignSkillInstructions(): string {
  return `审查设计一致性，检查设计方案与规格的关联性、决策可追溯性、操作准备度和技术债务。

**核心原则**：每条发现必须有设计证据，决策必须能追溯到具体需求，避免空洞的"设计不够好"式建议。

---

## 决策追溯：设计的核心价值

设计的核心不是"写一份好文档"，而是确保每个代码决策都有据可查。审查时重点检查：

1. **每条设计决策是否对应一个规格需求**
2. **每条规格需求是否在代码中有对应实现**
3. **每个 Non-Goals 是否有代码证据证明确实没做**

---

## 步骤

**1. 获取变更上下文**

\`\`\`bash
phspec status --change "<name>" --json
\`\`\`

解析工作流模式和制品状态，确认是否有设计文件和增量规范。

**2. 读取设计文件**

根据工作流模式读取对应的设计文件：
- **spec-driven** 模式：读取 \`phspec/changes/<name>/design.md\`
- **lean-sdd** 模式：读取 \`phspec/changes/<name>/plan.md\`

若对应的设计文件不存在，告知用户并停止。

**3. 读取关联规格（如有）**

读取 \`phspec/changes/<name>/specs/*/spec.md\`（增量规范）或 \`phspec/specs/<capability>/spec.md\`（主规范），理解设计要解决的需求背景。

**4. 执行决策追溯检查**

对设计文件中每条 \`### Decision:\` 或 \`### Approach:\`：

a) **追溯到需求**
- 该决策解决了哪个/哪些规格需求？
- 在增量规范中搜索对应关键字，确认决策有需求支撑

b) **追溯到实现**
- 在代码库中搜索决策涉及的关键字（如"使用 Redis 缓存" → 搜索 "redis" 或 "cache"）
- 确认决策被实际执行了
- 若决策未被执行 → CRITICAL：设计决策未被遵循

c) **检查 Non-Goals**
- 设计中声明不做的内容，在代码中是否确实没做？
- 若代码中存在 Non-Goals 中明确排除的模式 → WARNING

**5. 执行设计连贯性检查**

- 设计决策之间是否一致？（不能同时说"用微服务"又说"所有模块放单一进程"）
- 设计模式是否统一？（不能混用 REST 和 GraphQL 做同一类 API）
- 命名约定是否与项目一致？

**6. 执行架构对齐检查**

- 设计是否遵循项目既有的架构分层（若项目是 MVC，新设计不应把所有逻辑放在一起）？
- 引入的新依赖是否与现有技术栈一致？
- 组件边界划分是否合理？

**7. 执行操作准备度检查**

检查设计是否包含足够的可操作性内容：

a) **日志与监控策略**
- 新增的关键业务路径是否有日志设计？
- 重要指标是否有埋点设计？
- 错误是否有追踪设计？

b) **错误处理与恢复**
- 关键故障场景是否有 fallback 设计？
- 是否有超时、重试、熔断设计？

c) **部署与回滚**
- 改动是否可独立部署？
- 是否有回滚方案？

**8. 执行技术债务评估**

- 设计是否引入了不必要的复杂性（为未来可能的需求做预留）？
- 是否有意无意复制了项目中已知有问题的模式？
- 是否有明显的重构机会但被跳过了？
- Trade-off 是否被显式记录？（"我们选择 X 而非 Y，因为 Z"）

**9. 生成审查报告**

\`\`\`markdown
# Review Design: <Change Name>
**Artifact:** design.md 或 plan.md（根据工作流模式）
**Date:** YYYY-MM-DD
**Status:** ✅ SOUND / ⚠️ NEEDS WORK / ❌ MAJOR ISSUES

## Overall Assessment
[1-2 句话总结整体评估]

## Decision Traceability
| 设计决策 | 对应需求 | 实现状态 | 证据 |
|----------|----------|----------|------|
| <决策摘要> | <需求引用> | ✓ 已实现 / ✗ 未实现 | <文件:行号> |

## Design Coherence Issues
| 问题 | 位置 | 描述 |
|------|------|------|
| <问题> | <引用位置> | <描述> |

## Architecture Alignment
| 检查项 | 状态 | 说明 |
|--------|------|------|
| 分层遵守 | ✓/✗ | <说明> |
| 技术栈一致 | ✓/✗ | <说明> |
| 组件边界 | ✓/✗ | <说明> |

## Operational Readiness
| 维度 | 评分/5 | 发现 |
|------|--------|------|
| 日志与监控 | X | <问题或"无问题"> |
| 错误处理 | X | <问题或"无问题"> |
| 部署回滚 | X | <问题或"无问题"> |

## Technical Debt
| 发现 | 严重程度 | 建议 |
|------|----------|------|
| <债务描述> | 高/中/低 | <建议> |

## Recommendations
### Critical (Must Fix)
- [<问题描述>]
  - **证据**：<设计引用>
  - **建议**：<具体修复方案>

### Important (Should Fix)
- [<问题描述>]
  - **证据**：<设计引用>
  - **建议**：<具体修复方案>

### Optional (Nice to Have)
- [<问题描述>]
  - **证据**：<设计引用>
  - **建议**：<优化建议>

## Conclusion
**设计质量**：[整体评价]
**可继续/需修改**：Yes/No
**下一步**：<建议行动>
\`\`\`

**10. 保存审查报告（如用户请求）**

报告默认在聊天窗口显示。如用户请求，可保存为本地 markdown 文件：

\`\`\`bash
mkdir -p phspec/changes/<name>/reviews
cat > phspec/changes/<name>/reviews/review-design-$(date +%Y%m%d-%H%M%S).md << 'EOF'
<将上方生成的报告内容粘贴至此>
EOF
\`\`\`

保存路径：\`phspec/changes/<name>/reviews/review-design-<timestamp>.md\`

---

## 评分标准

| 维度 | 5 分 | 4 分 | 3 分 | 2 分 | 1 分 |
|------|------|------|------|------|------|
| 决策追溯 | 每条决策都可追溯 | 大部分可追溯 | 部分追溯 | 少量追溯 | 不可追溯 |
| 设计连贯性 | 完全一致 | 基本一致 | 有minor矛盾 | 多处矛盾 | 严重矛盾 |
| 架构对齐 | 完全对齐 | 基本对齐 | 小偏差 | 需要调整 | 严重偏离 |
| 操作准备度 | 完整可操作 | 基本可操作 | 部分可操作 | 缺乏关键操作设计 | 几乎无可操作性 |
| 技术债务 | 零债务 | 最小化债务 | 有债务但合理 | 债务积累 | 严重债务 |

---

## 边界

- 未提供变更时始终让用户选择，不猜测
- 未找到设计文件时告知用户并停止（spec-driven 为 design.md，lean-sdd 为 plan.md）
- 决策追溯是最核心的检查，优先执行
- 每个发现必须有设计证据引用（"design.md 第 23 行提到"或"plan.md 第 23 行提到"）
- 无法追溯的决策降级为 WARNING
- 操作准备度和技术债务是增强检查，不要求满分
- 报告使用标准格式，Critical/Important/Optional 分组，每条带证据和具体建议`;
}

/**
 * Template for /phsx:review-code slash command
 */
export function getOpsxReviewCodeCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Review Code",
    description: "代码规范合规性审查 - 验证代码实现与规格的一致性",
    category: "Review",
    tags: ["review", "code", "experimental"],
    content: `审查代码规范合规性，验证代码实现与规格的一致性。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **获取变更信息**：运行 \`phspec status --change "<name>" --json\`。

2. **定位规格文件**：查找增量规范或主规范。

3. **审查功能正确性**：检查代码是否正确实现需求、输入输出是否一致、业务逻辑是否正确。

4. **审查错误处理**：检查是否处理所有预期错误、错误消息是否清晰、是否有适当的错误恢复机制。

5. **审查边界情况**：检查是否处理空输入、边界值、数组边界、除零等边界情况。

6. **审查非功能需求**：检查性能、安全性、可维护性、日志和监控是否满足要求。

7. **检测规格漂移**：检查代码是否超出规格范围、是否有未记录的功能、实现是否偏离规格意图。

8. **生成并输出审查报告**：使用标准报告格式，含各维度评分和问题分类。

**边界**

- 未提供变更时始终让用户选择，不猜测
- 未找到规格时告知用户并停止
- 评估基于现有代码和规格信息
- 不确定时优先 WARNING 再 CRITICAL
- 报告使用标准格式，含评分、问题分类和可执行建议`,
  };
}

/**
 * Get review-design command content for slash command generation
 */
export function getReviewDesignCommandContent(): string {
  return `审查设计一致性，检查设计方案与规格的关联性。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **获取变更信息**

   运行 \`phspec status --change "<name>" --json\` 了解工作流和制品状态。

2. **定位设计文件**

   根据工作流模式读取对应的设计文件：
   - **spec-driven** 模式：读取 \`phspec/changes/<name>/design.md\`
   - **lean-sdd** 模式：读取 \`phspec/changes/<name>/plan.md\`

   若对应的设计文件不存在，告知用户并停止。

3. **审查设计遵循度**

   **检查项：**
   - [ ] 实现是否遵循设计决策
   - [ ] 架构选择是否与设计一致
   - [ ] 技术栈是否符合设计
   - [ ] 数据结构是否按设计实现

   **发现问题记为：** CRITICAL - 「未遵循设计：<详情>」，建议调整实现或更新设计。

4. **审查设计连贯性**

   **检查项：**
   - [ ] 设计决策是否内部一致
   - [ ] 是否有相互冲突的设计
   - [ ] 设计模式是否一致使用
   - [ ] 命名约定是否统一

   **发现问题记为：** WARNING - 「设计不一致：<详情>」，建议统一设计。

5. **审查架构对齐**

   **检查项：**
   - [ ] 设计是否与系统架构对齐
   - [ ] 是否遵循项目架构模式
   - [ ] 组件交互是否符合架构设计
   - [ ] 是否引入架构不一致的方案

   **发现问题记为：** WARNING - 「架构不对齐：<详情>」，建议调整设计以对齐架构。

6. **审查可追溯性**

   **检查项：**
   - [ ] 设计决策是否能追溯到规格需求
   - [ ] 每个设计选择是否有明确理由
   - [ ] 是否记录了技术决策依据
   - [ ] 设计是否覆盖所有关键需求

   **发现问题记为：** WARNING - 「可追溯性问题：<详情>」，建议补充设计依据。

7. **审查设计完整性**

   **检查项：**
   - [ ] 设计是否覆盖所有规格需求
   - [ ] 关键组件是否都有设计
   - [ ] 接口设计是否完整
   - [ ] 数据模型是否充分定义

   **发现问题记为：** CRITICAL - 「设计不完整：<详情>」，建议补充设计。

8. **生成并输出审查报告**

   使用标准报告格式：Overall Assessment、Dimensions (Design Adherence/Design Coherence/Architecture Alignment/Traceability/Design Completeness)、Recommendations (Critical/Important/Optional)、Conclusion。

**边界**

- 未提供变更时始终让用户选择，不猜测
- 未找到设计时告知用户并停止
- 评估基于现有设计和规格信息
- 不确定时优先 WARNING 再 CRITICAL
- 报告使用标准格式，含评分、问题分类和可执行建议`;
}

/**
 * Template for /phsx:review-design slash command
 */
export function getOpsxReviewDesignCommandTemplate(): CommandTemplate {
  return {
    name: "PHSX: Review Design",
    description: "设计一致性审查 - 检查设计方案与规格的关联性",
    category: "Review",
    tags: ["review", "design", "experimental"],
    content: `审查设计一致性，检查设计方案与规格的关联性。

**输入**：可指定变更名。未指定时从对话上下文推断；若含糊或有歧义，必须让用户从可用变更中选择。

**步骤**

1. **获取变更信息**：运行 \`phspec status --change "<name>" --json\`。

2. **定位设计文件**：根据工作流模式读取对应的设计文件（spec-driven 为 design.md，lean-sdd 为 plan.md）。若不存在则告知用户并停止。

3. **审查设计遵循度**：检查实现是否遵循设计决策、架构选择是否与设计一致、技术栈是否符合设计。

4. **审查设计连贯性**：检查设计决策是否内部一致、是否有相互冲突的设计、设计模式是否一致使用。

5. **审查架构对齐**：检查设计是否与系统架构对齐、是否遵循项目架构模式、组件交互是否符合架构设计。

6. **审查可追溯性**：检查设计决策是否能追溯到规格需求、每个设计选择是否有明确理由、是否记录了技术决策依据。

7. **审查设计完整性**：检查设计是否覆盖所有规格需求、关键组件是否都有设计、接口设计是否完整。

8. **生成并输出审查报告**：使用标准报告格式，含各维度评分和问题分类。

**边界**

- 未提供变更时始终让用户选择，不猜测
- 未找到设计时告知用户并停止
- 评估基于现有设计和规格信息
- 不确定时优先 WARNING 再 CRITICAL
- 报告使用标准格式，含评分、问题分类和可执行建议`,
  };
}

/**
 * 统一报告模板
 * 确保 review-spec、review-code、review-design 三个审查命令的报告格式一致
 */
export interface ReviewReportTemplate {
  artifactName: string;
  date: string;
  status: '✅ 良好' | '⚠️ 需改进' | '❌ 严重问题';
  overallAssessment: string;
  dimensions: Array<{
    name: string;
    score: number;
    assessment: string;
  }>;
  recommendations: {
    critical: string[];
    important: string[];
    optional: string[];
  };
  conclusion: string;
  qualityLabel: string;
  nextStepActionable: string;
}

/**
 * 生成标准化的审查报告格式
 */
export function getReviewReportTemplate(params: ReviewReportTemplate): string {
  const dimensionsSection = params.dimensions
    .map((dim) => `### ${dim.name}：${dim.score}/5
**评估：** ${dim.assessment}`)
    .join('\n\n');

  const recommendationsSection = [
    `### 严重问题（必须修复）
${params.recommendations.critical.length > 0 ? params.recommendations.critical.map((r) => `- ${r}`).join('\n') : '无'}`,
    `### 重要问题（应该修复）
${params.recommendations.important.length > 0 ? params.recommendations.important.map((r) => `- ${r}`).join('\n') : '无'}`,
    `### 可选优化（建议改进）
${params.recommendations.optional.length > 0 ? params.recommendations.optional.map((r) => `- ${r}`).join('\n') : '无'}`,
  ].join('\n\n');

  return `# ${params.artifactName}
**制品：** ${params.artifactName}.md
**日期：** ${params.date}
**状态：** ${params.status}

## 整体评估
${params.overallAssessment}

## 审查维度

${dimensionsSection}

## 建议

${recommendationsSection}

## 结论
**${params.qualityLabel}：** ${params.conclusion}
**下一步：** ${params.nextStepActionable}`;
}

