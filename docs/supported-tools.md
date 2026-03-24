# 支持的工具

PhSpec 支持 20+ AI 编程助手。运行 `phspec init` 时会提示选择要配置的工具，并写入对应集成。

## 工作原理

对每个选中的工具，PhSpec 会安装：

1. **技能（Skills）** — 供 `/phsx:*` 工作流命令使用的可复用指令文件
2. **命令（Commands）** — 各工具自己的斜杠命令绑定

## 工具目录对照

| 工具                 | 技能目录             | 命令目录                          |
| -------------------- | -------------------- | --------------------------------- |
| Amazon Q Developer   | `.amazonq/skills/`   | `.amazonq/prompts/`               |
| Antigravity          | `.agent/skills/`     | `.agent/workflows/`               |
| Auggie (Augment CLI) | `.augment/skills/`   | `.augment/commands/`              |
| Claude Code          | `.claude/skills/`    | `.claude/commands/phsx/`          |
| Cline                | `.cline/skills/`     | `.clinerules/workflows/`          |
| DevAgent             | `.devagent/skills/`  | `.devagentrules/workflows/`       |
| CodeBuddy            | `.codebuddy/skills/` | `.codebuddy/commands/phsx/`       |
| Codex                | `.codex/skills/`     | `~/.codex/prompts/`\*             |
| Continue             | `.continue/skills/`  | `.continue/prompts/`              |
| CoStrict             | `.cospec/skills/`    | `.cospec/phspec/commands/`        |
| Crush                | `.crush/skills/`     | `.crush/commands/phsx/`           |
| Cursor               | `.cursor/skills/`    | `.cursor/commands/`               |
| Factory Droid        | `.factory/skills/`   | `.factory/commands/`              |
| Gemini CLI           | `.gemini/skills/`    | `.gemini/commands/phsx/`          |
| GitHub Copilot       | `.github/skills/`    | `.github/prompts/`\*\*            |
| iFlow                | `.iflow/skills/`     | `.iflow/commands/`                |
| Kilo Code            | `.kilocode/skills/`  | `.kilocode/workflows/`            |
| OpenCode             | `.opencode/skills/`  | `.opencode/command/`              |
| Qoder                | `.qoder/skills/`     | `.qoder/commands/phsx/`           |
| Qwen Code            | `.qwen/skills/`      | `.qwen/commands/`                 |
| RooCode              | `.roo/skills/`       | `.roo/commands/`                  |
| Trae                 | `.trae/skills/`      | `.trae/skills/`（通过 `/phsx-*`） |
| Windsurf             | `.windsurf/skills/`  | `.windsurf/workflows/`            |

\* Codex 命令安装到全局主目录（`~/.codex/prompts/` 或 `$CODEX_HOME/prompts/`），不在项目目录。

\*\* GitHub Copilot 的 `.github/prompts/*.prompt.md` 仅在 **IDE 扩展**（VS Code、JetBrains、Visual Studio）中作为自定义斜杠命令生效。GitHub Copilot CLI 目前不支持从该目录读取自定义 prompt，参见 [github/copilot-cli#618](https://github.com/github/copilot-cli/issues/618)。使用 Copilot CLI 时可在 `.github/agents/` 中手动配置 [custom agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents) 作为替代。

## 非交互式配置

在 CI/CD 或脚本中可使用 `--tools`：

```bash
# 指定工具
phspec init --tools claude,cursor

# 配置所有支持的工具
phspec init --tools all

# 不配置任何工具
phspec init --tools none
```

**可用工具 ID：** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codebuddy`, `codex`, `continue`, `costrict`, `crush`, `cursor`, `devagent`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `opencode`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## 会安装哪些技能

每个工具会生成 11 个驱动 PHSX 工作流的技能文件，对应：探索、新建变更、继续、快进、实施、Ralph 稳健实施、校验、同步规范、归档、批量归档、入门引导。通过 `/phsx:new`、`/phsx:apply`、`/phsx:apply-ralph` 等斜杠命令调用。完整列表见 [命令](commands.md)。

## 工具差异：每步暂停与用户确认工具

部分 AI 助手（如 Cline、DevAgent + 部分模型）执行 `/phsx:new` 或 `/phsx:continue` 可能会**一口气跑完** proposal、design、tasks，而不是每步暂停让用户选择「修改或继续」。

**原因简述：**

1. **必须显式调用工具才会暂停**：在 DevAgent 等以 workflow 方式执行的环境中，只有**真正调用了** `ask_followup_question`（DevAgent）或 `AskUserQuestion`（Cursor）并结束当次执行，界面才会暂停等用户回复。仅用自然语言写「在此暂停」而不调用工具，模型常会继续执行。
2. **「在此暂停」是自然语言约束**：没有「先调用工具再结束」的强制表述时，模型容易把「完成用户想要的变更」理解为继续创建后续制品。
3. **用错 workflow**：若希望每步暂停，应使用 **`/phsx:new`**（只做到展示第一个制品模板即停）和 **`/phsx:continue`**（每次只创建一个制品然后停）。**`/phsx:ff`**（快进）设计上就是一次性生成全部制品，不会每步暂停。

**PhSpec 已做的强化（技能/命令模板）：**

- **执行约定**：在 `/phsx:new` 与 `/phsx:continue` 的 workflow 开头增加了「执行约定」，明确：步骤 6（new）或创建完一个制品后（continue）**必须先调用**用户确认工具并**立即结束**，不得在本轮中继续创建制品。
- **DevAgent 显式步骤**：在暂停点写明「在 DevAgent 中必须先调用 `ask_followup_question`，……，调用后立即结束本次 workflow 执行」，减少模型跳过工具直接写文件的情况。
- **无用户确认工具时的退路**：若环境既无 `AskUserQuestion` 也无 `ask_followup_question`，指令要求直接输出问题并写明「请回复后再继续」然后结束。

**你本地可做的：**

- 运行 `phspec update` 刷新 `.devagentrules/workflows/` 与 `.devagent/skills/`，使上述强化生效。
- 确认使用的是 **`/phsx:new`** + 多次 **`/phsx:continue`**，而不是 `/phsx:ff`。
- 若仍会一口气跑完，在 DevAgent 项目规则中加一条：执行 phsx-new 时在步骤 6 必须调用 ask_followup_question 并结束；执行 phsx-continue 时每创建完一个制品必须调用 ask_followup_question 并结束。

这是技能/规则设计问题（需显式「调用工具并结束」），不是模型能力问题；通过模板强化和上述约定可在多数环境下实现每步暂停。

## 添加新工具

希望支持更多 AI 编程助手？可参考仓库中的 command adapter 实现或提交 GitHub issue。

---

## 相关

- [CLI 参考](cli.md) - 终端命令
- [命令](commands.md) - 斜杠命令与技能
- [入门](getting-started.md) - 首次配置
