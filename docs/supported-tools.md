# 支持的工具

OpenSpec 支持 20+ AI 编程助手。运行 `openspec init` 时会提示选择要配置的工具，并写入对应集成。

## 工作原理

对每个选中的工具，OpenSpec 会安装：

1. **技能（Skills）** — 供 `/opsx:*` 工作流命令使用的可复用指令文件
2. **命令（Commands）** — 各工具自己的斜杠命令绑定

## 工具目录对照

| 工具                 | 技能目录             | 命令目录                              |
| -------------------- | -------------------- | ------------------------------------- |
| Amazon Q Developer   | `.amazonq/skills/`   | `.amazonq/prompts/`                   |
| Antigravity          | `.agent/skills/`     | `.agent/workflows/`                   |
| Auggie (Augment CLI) | `.augment/skills/`   | `.augment/commands/`                  |
| Claude Code          | `.claude/skills/`    | `.claude/commands/opsx/`              |
| Cline                | `.cline/skills/`     | `.clinerules/workflows/`              |
| DevAgent             | `.devagent/skills/`  | `.devagentrules/workflows/`           |
| CodeBuddy            | `.codebuddy/skills/` | `.codebuddy/commands/opsx/`           |
| Codex                | `.codex/skills/`     | `~/.codex/prompts/`\*                 |
| Continue             | `.continue/skills/`  | `.continue/prompts/`                  |
| CoStrict             | `.cospec/skills/`    | `.cospec/openspec/commands/`          |
| Crush                | `.crush/skills/`     | `.crush/commands/opsx/`               |
| Cursor               | `.cursor/skills/`    | `.cursor/commands/`                   |
| Factory Droid        | `.factory/skills/`   | `.factory/commands/`                  |
| Gemini CLI           | `.gemini/skills/`    | `.gemini/commands/opsx/`              |
| GitHub Copilot       | `.github/skills/`    | `.github/prompts/`\*\*                |
| iFlow                | `.iflow/skills/`     | `.iflow/commands/`                    |
| Kilo Code            | `.kilocode/skills/`  | `.kilocode/workflows/`                |
| OpenCode             | `.opencode/skills/`  | `.opencode/command/`                  |
| Qoder                | `.qoder/skills/`     | `.qoder/commands/opsx/`               |
| Qwen Code            | `.qwen/skills/`      | `.qwen/commands/`                     |
| RooCode              | `.roo/skills/`       | `.roo/commands/`                      |
| Trae                 | `.trae/skills/`      | `.trae/skills/`（通过 `/openspec-*`） |
| Windsurf             | `.windsurf/skills/`  | `.windsurf/workflows/`                |

\* Codex 命令安装到全局主目录（`~/.codex/prompts/` 或 `$CODEX_HOME/prompts/`），不在项目目录。

\*\* GitHub Copilot 的 `.github/prompts/*.prompt.md` 仅在 **IDE 扩展**（VS Code、JetBrains、Visual Studio）中作为自定义斜杠命令生效。GitHub Copilot CLI 目前不支持从该目录读取自定义 prompt，参见 [github/copilot-cli#618](https://github.com/github/copilot-cli/issues/618)。使用 Copilot CLI 时可在 `.github/agents/` 中手动配置 [custom agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents) 作为替代。

## 非交互式配置

在 CI/CD 或脚本中可使用 `--tools`：

```bash
# 指定工具
openspec init --tools claude,cursor

# 配置所有支持的工具
openspec init --tools all

# 不配置任何工具
openspec init --tools none
```

**可用工具 ID：** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codebuddy`, `codex`, `continue`, `costrict`, `crush`, `cursor`, `devagent`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `opencode`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## 会安装哪些技能

每个工具会生成 10 个驱动 OPSX 工作流的技能文件，对应：探索、新建变更、继续、快进、实施、校验、同步规范、归档、批量归档、入门引导。通过 `/opsx:new`、`/opsx:apply` 等斜杠命令调用。完整列表见 [命令](commands.md)。

## 添加新工具

希望支持更多 AI 编程助手？可参考仓库中的 command adapter 实现或提交 GitHub issue。

---

## 相关

- [CLI 参考](cli.md) - 终端命令
- [命令](commands.md) - 斜杠命令与技能
- [入门](getting-started.md) - 首次配置
