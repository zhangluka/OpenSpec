# PhSpec 棕地接入与 SDD 最佳实践

本文档面向**在公司现有项目中接入 PhSpec** 的团队，提供一套规范的最佳实践，用于：

1. **接入阶段** — 在既有代码库中安全、一致地接入 PhSpec
2. **文档组织** — 如何组织与维护 SDD 过程中的各类文档
3. **流程规范** — 后续业务需求从提出到上线的标准开发流程

PhSpec 采用「棕地优先」设计：多数工作是在改既有系统，增量规范与灵活动作让现有项目可以平滑接入并持续演进。

---

## 文档导航

| 章节                                              | 内容                                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| [一、现有项目接入 PhSpec](#一现有项目接入-phspec) | 前置条件、接入步骤、项目配置                                          |
| [二、目录与文档组织](#二目录与文档组织)           | 标准结构、主规范、变更命名、文档维护原则                              |
| [三、业务需求开发流程](#三业务需求开发流程)       | 标准流程、典型场景（已有功能优化 / 多模块）、流程决策、与现有流程衔接 |
| [四、制品书写约定](#四制品书写约定)               | 提案、增量规范、设计、任务的格式与规则                                |
| [五、团队协作](#五团队协作)                       | 命名与分支、Code Review、新成员上手                                   |
| [六、检查清单](#六检查清单)                       | 接入完成清单、新需求开发清单                                          |
| [相关文档](#相关文档)                             | 概念、入门、工作流、命令等链接                                        |

---

## 一、现有项目接入 PhSpec

### 1.1 前置条件

| 条件         | 说明                                                        |
| ------------ | ----------------------------------------------------------- |
| **Node.js**  | ≥ 20.19.0（phspec 运行要求）                                |
| **包来源**   | 内网 npm 已发布 phspec，可全局安装并执行 `phspec --version` |
| **版本控制** | 项目在 Git 下，便于接入前后对比与回滚                       |
| **团队共识** | 至少一名负责人熟悉 PhSpec 概念与命令，能辅导他人            |

### 1.2 接入步骤（推荐顺序）

1. **备份或提交当前仓库**  
   确保工作区干净或已提交，便于接入后对比 `phspec/` 与工具配置变更。

2. **安装 PhSpec**

   ```bash
   npm install -g @your-registry/phspec@latest
   ```

   使用内网实际包名与 registry。安装后执行 `phspec --version` 确认。

3. **在项目根目录执行初始化**

   ```bash
   cd /path/to/your-existing-project
   phspec init
   ```

   - 创建 `phspec/` 目录结构（`specs/`、`changes/`、`changes/archive/`）
   - 为当前 AI 工具（如 Cursor、Claude Code）生成技能与斜杠命令
   - 若检测到旧版 PhSpec/OpenSpec 产物，会提示是否清理并升级

4. **创建或完善项目配置（强烈推荐）**  
   在 `phspec init` 时选择创建，或手动创建 `phspec/config.yaml`。配置说明见 [1.3 项目配置](#13-项目配置)。这是棕地接入的关键：把**现有技术栈与约定**写进 `context`，AI 生成提案/规范/设计时会自动注入。

5. **迁移旧项目说明（若存在）**  
   若有 `phspec/project.md` 或类似文档，将有用内容精简后迁入 `phspec/config.yaml` 的 `context:`，然后可删除原文件。详见 [迁移指南](migration-guide.md)。

6. **验证接入**  
   在 AI 助手中试运行 `/phsx:onboard` 或 `/phsx:new test-change`；CLI 执行 `phspec list`、`phspec status`（无变更时列表为空属正常）。

### 1.3 项目配置

`phspec/config.yaml` 是棕地项目的「单点配置」，建议所有接入项目都维护一份。

```yaml
# phspec/config.yaml
schema: spec-driven

context: |
  技术栈：TypeScript 20.x, React 19, Node 22
  API：RESTful，文档在 docs/api.md，错误码见 docs/errors.md
  测试：单元 Vitest，E2E Playwright，覆盖率要求 80%
  规范：ESLint + Prettier，TypeScript 严格模式
  部署：K8s，配置在 deploy/，发布流程见 docs/release.md

rules:
  proposal:
    - 必须包含回滚方案与影响团队
    - 破坏性变更用 BREAKING 标出
  specs:
    - 使用 Given/When/Then 场景，每条需求至少一个场景
    - 先查阅 phspec/specs/ 已有规范再写增量
  design:
    - 跨服务变更需序列图或架构图
    - 列出风险与缓解措施
```

| 字段        | 说明                                                                               |
| ----------- | ---------------------------------------------------------------------------------- |
| **schema**  | 新建变更时默认工作流模式，一般用 `spec-driven`                                     |
| **context** | 注入到**所有**制品生成时的上下文（技术栈、关键约定、常被忽略的约束），保持精简稳定 |
| **rules**   | 按制品 ID（`proposal`、`specs`、`design`、`tasks`）附加规则，统一团队书写习惯      |

模式解析顺序：CLI 参数 `--schema` → 变更目录 `.phspec.yaml` → `phspec/config.yaml` → 默认 `spec-driven`。

---

## 二、目录与文档组织

### 2.1 标准目录结构

```
项目根/
├── phspec/
│   ├── config.yaml          # 项目配置（推荐必选）
│   ├── specs/               # 主规范（单一事实来源）
│   │   └── <领域>/
│   │       └── spec.md
│   ├── changes/             # 进行中的变更
│   │   ├── <变更名>/
│   │   │   ├── .phspec.yaml # 变更元数据（模式、创建日）
│   │   │   ├── proposal.md
│   │   │   ├── design.md
│   │   │   ├── tasks.md
│   │   │   └── specs/       # 本变更的增量规范
│   │   │       └── <领域>/
│   │   │           └── spec.md
│   │   └── ...
│   └── changes/archive/     # 已归档变更（只读追溯）
│       └── YYYY-MM-DD-<变更名>/
└── .claude/ 或 .cursor/ 等   # 由 phspec init 写入的技能/命令
```

- **不要**把业务代码、测试或构建产物放进 `phspec/`。
- **务必**将 `phspec/` 纳入版本控制，与代码一同提交、审阅。

### 2.2 主规范（phspec/specs/）组织

- **按领域划分子目录**：如 `auth/`、`payments/`、`api/`、`ui/`，每个领域一个 `spec.md`。可与现有模块或限界上下文对齐。
- **命名**：目录名使用 kebab-case，与提案中「能力」名称一致，便于增量规范路径对应（`phspec/changes/<name>/specs/<领域>/spec.md`）。
- **单一事实来源**：主规范描述**系统当前已达成一致的行为**。仅通过「变更 → 实施 → 归档」更新主规范；不要在主规范里直接手改与变更无关的段落。

### 2.3 变更目录与命名

- **变更名**：kebab-case，语义清晰（如 `add-export-csv`、`fix-auth-timeout`、`refactor-order-service`）。避免纯日期或纯编号。
- **元数据**：变更目录下的 `.phspec.yaml` 由 phspec 自动维护（schema、created），一般无需手改。
- **归档目录**：归档后变为 `changes/archive/YYYY-MM-DD-<变更名>/`，保留完整制品与增量，仅用于追溯与审计。

### 2.4 文档维护原则

- **提案**：回答「为什么做、做哪些能力、影响面」。范围或意图变化时更新提案，而不是重开变更。
- **规范**：增量只写 ADDED/MODIFIED/REMOVED（及 RENAMED），不重复未改动的需求。MODIFIED 必须贴完整更新后的需求块，避免归档时丢失细节。
- **设计**：技术方案与关键决策。实现过程中发现方案不可行或更优方案时，先更新设计再继续实施。
- **任务**：必须使用 `- [ ]` / `- [x]` 勾选格式；任务粒度以单次会话可完成为宜。

---

## 三、业务需求开发流程

### 3.1 标准流程概览

```
需求/想法
    │
    ▼  /phsx:explore（可选，需求不清、需调研或方案对比时）
    │
    ▼  /phsx:new <name>  →  创建 phspec/changes/<name>/
    │
    ▼  /phsx:ff 或 /phsx:continue  →  提案 → 规范 → 设计 → 任务
    │
    ▼  /phsx:apply  →  按 tasks.md 推进，完成即勾选
    │
    ▼  /phsx:verify（推荐）  →  检查实现与制品一致性
    │
    ▼  /phsx:archive  →  合并增量到主规范，移入 archive
```

- **探索**：不创建制品，只梳理想法、查代码、澄清需求。
- **新建变更**：每个业务需求或独立改进对应一个变更名。
- **创建制品**：需求清晰用 `/phsx:ff` 一次性生成；需逐步审阅用 `/phsx:continue`。
- **实施**：可随时回头更新 proposal/design/specs/tasks，再继续 `/phsx:apply`。
- **归档**：确认任务完成且（建议）通过 verify 后执行，使主规范与代码库状态一致。

### 3.2 典型场景：对已有功能做优化

**场景**：项目中已有功能模块 A，新需求是「对 A 做优化」（行为微调、性能改进、体验增强等），希望 AI 遵守现有代码规范、按 SDD 流程开发。

**结论：建议先为模块 A 建立主规范，再开「优化 A」的变更。**

| 目的                       | 手段                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 让 AI 遵守现有代码规范     | 在 `phspec/config.yaml` 的 `context` 中写清技术栈、编码风格、目录约定、测试要求等                                                                 |
| 让 AI 理解「A 当前做什么」 | 在 `phspec/specs/` 下为 A 建立主规范（如 `phspec/specs/module-a/spec.md`）                                                                        |
| 让优化变更有清晰基线       | 提案写「修改的能力：module-a」，增量用 **MODIFIED**；归档时工具会把增量合并进主规范。无主规范时 MODIFIED 无处合并，只能全写 ADDED，不利于后续维护 |

**不必一次性梳理整个项目**，只梳理**即将被改动的模块**即可。

**推荐流程：**

1. **（可选）用探索摸清现状**  
   执行 `/phsx:explore`，说明：「我们要对现有模块 A 做优化，请先分析 A 的代码与行为，梳理出当前能力与主要场景。」

2. **为 A 建立主规范**
   - **方式 A**：手动创建 `phspec/specs/module-a/spec.md`，根据对 A 的理解（或探索结果）写出当前需求与场景。
   - **方式 B**：新建仅用于建档的变更（如 `doc-module-a-baseline`），在提案中写「能力：module-a」，规范里全部用 ADDED 描述 A 的当前行为，然后归档或同步到主规范。

3. **按 SDD 做「优化 A」变更**  
   `/phsx:new optimize-module-a` → 提案写清动机、变更要点、**修改的能力：module-a** → `/phsx:ff` 或 `/phsx:continue` 生成制品 → `/phsx:apply` → `/phsx:verify` → `/phsx:archive`。

**若暂时不建主规范**：可直接开「优化 A」变更，在提案与设计中用自然语言描述「A 当前如何、将如何改」，增量里只写 ADDED。仅适合一次性小改；计划多次迭代 A 时仍建议先补主规范。

### 3.3 典型场景：一次优化涉及多个模块

当一次功能优化**同时改动多个模块**（如 A、B、C）时，PhSpec 通过「一个变更、多份增量规范」支持，并依赖主规范 + 项目配置让 AI 遵守各模块原有规范。

**结构**：在提案「能力」中列出所有受影响模块（如 **修改的能力**：`module-a`、`module-b`、`module-c`），在变更目录下为每个能力各建一份增量规范：

- `phspec/changes/<变更名>/specs/module-a/spec.md`
- `phspec/changes/<变更名>/specs/module-b/spec.md`
- `phspec/changes/<变更名>/specs/module-c/spec.md`

设计与任务可跨模块写在同一份 `design.md`、`tasks.md` 中；各模块的「行为契约」分别写在上述增量规范里。

**创建制品时**：模式指令要求**修改的能力**必须先查 `phspec/specs/<capability>/spec.md` 再写增量；`config.yaml` 的 context/rules 注入全局约定。因此 AI 会读各模块主规范，按「在现有规范基础上做增量」生成多份增量。

**实施时**：`phspec instructions apply` 会返回本变更的 proposal、specs（多份）、design、tasks。增量只有「变更部分」，没有该模块当前完整行为。**推荐做法**：对每个在变更中出现的能力，**同时读主规范** `phspec/specs/<能力>/spec.md` 与变更内 `specs/<能力>/spec.md`，只实现增量中的变更，其余行为按主规范保留。可在提示中明确要求 AI 这样做。

**小结**：创建制品时模式要求先查主规范再写增量；实施时对每个涉及的能力同时读主规范 + 变更内增量；归档将各增量合并回对应主规范。

### 3.4 流程决策：更新既有变更 vs 新建变更

| 倾向更新既有变更             | 倾向新建变更                           |
| ---------------------------- | -------------------------------------- |
| 范围收窄（先 MVP）或小幅扩展 | 意图或范围根本变化                     |
| 对代码库的新认识导致方案微调 | 原变更可独立「完成」，新需求是另一条线 |
| 设计小改、实现细节修正       | 在原有上打补丁会令结构混乱             |

原则：**更新保留上下文，新建提供清晰。**

### 3.5 多变更并行与归档

- 可同时存在多个进行中变更，互不阻塞。
- 若多个变更修改同一主规范文件，归档时会有合并顺序问题；建议按依赖或业务优先级归档，必要时先归档被依赖的变更。
- 多变更都完成后可使用 `/phsx:bulk-archive` 一次性归档；工具会检测冲突并提示。

### 3.6 与现有研发流程的衔接

- **需求评审**：以「提案 + 增量规范（及可选设计）」作为评审材料，通过后再 `/phsx:apply`。
- **Code Review**：除代码外，要求变更目录下的 proposal/specs/design/tasks 与实现一致；归档前执行 `/phsx:verify` 并处理提示问题。
- **发布/上线**：「归档」视为该需求在规范层面闭环；发布流程仍按现有 CI/CD 与发布规范执行。

---

## 四、制品书写约定

### 4.1 提案（proposal.md）

- **必含**：动机（1～2 句）、变更内容要点、**能力**（新增/修改的规范能力，与 `specs/<领域>/spec.md` 对应）、影响面。
- **能力列表**：与增量规范一一对应。新增能力用 kebab-case；修改的能力必须指向 `phspec/specs/` 下已有领域名。填写前先查阅现有主规范。
- 破坏性变更用 **BREAKING** 标出；可约定必须包含回滚方案与影响团队（在 `config.yaml` 的 `rules.proposal` 中体现）。

### 4.2 增量规范（changes/<name>/specs/）

- **ADDED**：新增需求与场景，格式与主规范一致（`### Requirement:`、`#### Scenario:`、WHEN/THEN 等）。
- **MODIFIED**：必须粘贴**完整**更新后的需求块（从 `### Requirement:` 到其下所有场景），标题与主规范中完全一致（忽略首尾空白），否则归档时可能丢失内容。
- **REMOVED**：必须包含 **Reason** 与 **Migration**。
- **RENAMED**：使用 FROM: / TO: 格式。
- 场景必须使用恰好 4 个井号（`#### Scenario:`），避免解析静默失败。

### 4.3 设计（design.md）

- 建议章节：背景、目标/非目标、决策（含替代方案简述）、风险与权衡、迁移计划（若适用）、待决问题。
- 仅当存在跨模块/跨服务、新依赖、安全或性能复杂度、或需在编码前统一技术决策时创建；简单实现可依赖任务列表即可。

### 4.4 任务（tasks.md）

- 使用 `## 编号` 分组，每条任务为 `- [ ] X.Y 描述`；完成即改为 `- [x]`。
- 粒度以单次会话能完成为宜；顺序按依赖排列。未使用 `- [ ]` 的任务不会被跟踪。

---

## 五、团队协作

### 5.1 变更命名与分支（可选）

可约定变更名与功能分支对应（如变更 `add-export-csv` 对应分支 `feature/add-export-csv`），便于 CR 时快速定位制品。不强制；若采用，在团队文档中写清即可。

### 5.2 Code Review 关注点

- 变更目录是否完整（proposal、specs、design、tasks 按需存在）。
- 增量规范中 MODIFIED 是否包含完整需求块，REMOVED 是否含 Reason/Migration。
- 归档前是否已运行 `/phsx:verify` 并处理了关键提示。

### 5.3 新成员上手

- 阅读 [概念](concepts.md)、[入门](getting-started.md)、[工作流](workflows.md)。
- 在测试项目或分支中跑通：`/phsx:new` → `/phsx:ff` → `/phsx:apply` → `/phsx:archive`。
- 熟悉 `phspec/config.yaml` 中的 context 与 rules。

---

## 六、检查清单

### 6.1 接入完成检查清单

- [ ] Node ≥ 20.19.0，phspec 已全局安装且 `phspec --version` 正常
- [ ] 项目根目录已执行 `phspec init`，存在 `phspec/specs/`、`phspec/changes/`、`phspec/changes/archive/`
- [ ] 已创建并填写 `phspec/config.yaml`（至少包含 `schema` 与 `context`）
- [ ] 若有旧版 project.md 或 OpenSpec 产物，已按 [迁移指南](migration-guide.md) 处理
- [ ] AI 助手中可调用 `/phsx:new`、`/phsx:ff` 等命令并成功创建制品
- [ ] `phspec/` 已纳入 Git 并随代码一起提交

### 6.2 新需求开发检查清单

- [ ] 需求不清时先 `/phsx:explore`，再 `/phsx:new <name>`
- [ ] **若为对已有模块的优化/修改**：该模块是否已有主规范？若无，建议先按 [3.2 典型场景：对已有功能做优化](#32-典型场景对已有功能做优化) 建立基线再开变更
- [ ] 提案中「能力」与主规范/增量规范路径一致，MODIFIED 已查阅现有 `phspec/specs/`
- [ ] 增量规范中 MODIFIED 为完整需求块，REMOVED 含 Reason 与 Migration
- [ ] 实施中若有方案变更，先更新 design/proposal 再继续 apply
- [ ] 实施完成后执行 `/phsx:verify`，处理重要不一致提示
- [ ] 归档前确认任务已勾选、规范与实现一致，再 `/phsx:archive`

---

## 相关文档

- [概念](concepts.md) — 规范、变更、工作流模式与术语
- [入门](getting-started.md) — 第一次使用与示例
- [工作流](workflows.md) — 常用模式与命令组合
- [命令](commands.md) — 斜杠命令完整说明
- [自定义](customization.md) — 项目配置与自定义工作流模式
- [迁移指南](migration-guide.md) — 从旧版 PhSpec 或 openspec 目录迁移
