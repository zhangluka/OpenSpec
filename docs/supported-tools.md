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

每个工具会生成 10 个驱动 PHSX 工作流的技能文件，对应：探索、新建变更、继续、快进、实施、校验、同步规范、归档、批量归档、入门引导。通过 `/phsx:new`、`/phsx:apply` 等斜杠命令调用。完整列表见 [命令](commands.md)。

## 工具差异：每步暂停与 AskUserQuestion

部分 AI 助手（如 Cline、或使用 DeepSeek 等模型时）执行 `/phsx:new` 可能会**一口气跑完** proposal、design 并产出所有制品，而不是在「展示第一个制品模板」后暂停、等用户确认再继续。

**原因简述：**

1. **用户确认工具**：PhSpec 指令里要求在需要时使用用户确认类工具询问用户。各环境等效工具为：**Cursor 等** 使用 `AskUserQuestion`，**DevAgent** 使用 `ask_followup_question`。若当前助手没有此类工具，模型可能忽略询问、直接继续执行。
2. **「在此暂停」是自然语言约束**：没有强制技术阻断时，模型可能把「完成用户想要的变更」理解为继续创建后续制品，从而自动做完 proposal → design → …。
3. **助手执行模式**：若助手配置为「自动执行到完成」、或单次任务不区分「等用户一轮」的边界，也会出现一步到底的现象。

**可通过修改 PhSpec 做的纠正：**

- **强化模板**：在技能/命令模板中已加强「执行完步骤 5 后必须停止、不要在本命令中创建任何制品」的表述；若你本地已改过模板，运行 `phspec update` 会覆盖，可考虑在项目级规则中再次强调（见下）。
- **项目级规则（推荐）**：在 Cline 的 `.clinerules/` 或 Cursor 的 `.cursor/rules` 中加一条规则，例如：
  - 「执行 `/phsx:new` 时：只做到创建变更目录并展示第一个制品的指令与模板即停止；不要在本轮中创建 proposal.md、design.md、specs 或 tasks。用户说『继续』或调用 `/phsx:continue` 后再创建制品。」
- **无用户确认工具时的退路**：若环境既无 `AskUserQuestion` 也无 `ask_followup_question`（如 Cline + 部分模型），指令中已补充：需要用户输入时**直接输出问题并写明「请回复后再继续」**，不要自行假设或继续执行。这样至少会停在一句问话而不是静默跑完。

这不是 PhSpec 的 bug，而是不同助手/模型对「步骤边界」和「用户确认工具」的支持差异；通过上述方式可以在不换模型的前提下改善行为。

## 添加新工具

希望支持更多 AI 编程助手？可参考仓库中的 command adapter 实现或提交 GitHub issue。

---

## 相关

- [CLI 参考](cli.md) - 终端命令
- [命令](commands.md) - 斜杠命令与技能
- [入门](getting-started.md) - 首次配置
