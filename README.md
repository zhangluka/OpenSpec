<p align="center">
  <a href="https://github.com/zhangluka/PhSpec">
    <picture>
      <source srcset="assets/phspec_bg.png">
      <img src="assets/phspec_bg.png" alt="PhSpec logo">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://github.com/zhangluka/PhSpec/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/zhangluka/PhSpec/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://www.npmjs.com/package/@bobby_z/phspec"><img alt="npm version" src="https://img.shields.io/npm/v/@bobby_z/phspec?style=flat-square" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://discord.gg/YctCnvvshC"><img alt="Discord" src="https://img.shields.io/discord/1411657095639601154?style=flat-square&logo=discord&logoColor=white&label=Discord&suffix=%20online" /></a>
</p>

<details>
<summary><strong>The most loved spec framework.</strong></summary>

[![Stars](https://img.shields.io/github/stars/zhangluka/PhSpec?style=flat-square&label=Stars)](https://github.com/zhangluka/PhSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@bobby_z/phspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@bobby_z/phspec)
[![Contributors](https://img.shields.io/github/contributors/zhangluka/PhSpec?style=flat-square&label=Contributors)](https://github.com/zhangluka/PhSpec/graphs/contributors)

</details>
<p></p>
Our philosophy:

```text
→ fluid not rigid
→ iterative not waterfall
→ easy not complex
→ built for brownfield not just greenfield
→ scalable from personal projects to enterprises
```

> [!TIP]
> **New workflow now available!** We've rebuilt PhSpec with a new artifact-guided workflow.
>
> Run `/phsx:onboard` to get started. → [Learn more here](docs/phsx.md)

<p align="center">
  Follow <a href="https://x.com/0xTab">@0xTab on X</a> for updates · Join the <a href="https://discord.gg/YctCnvvshC">PhSpec Discord</a> for help and questions.
</p>

### Teams

Using PhSpec in a team? [Email here](mailto:teams@phspec.dev) for access to our Slack channel.

<!-- TODO: Add GIF demo of /phsx:new → /phsx:archive workflow -->

## See it in action

```text
You: /phsx:new add-dark-mode
AI:  Created phspec/changes/add-dark-mode/
     Ready to create: proposal

You: /phsx:ff   # "fast-forward" - generate all planning docs
AI:  ✓ proposal.md — why we're doing this, what's changing
     ✓ specs/       — requirements and scenarios
     ✓ design.md    — technical approach
     ✓ tasks.md     — implementation checklist
     Ready for implementation!

You: /phsx:apply
AI:  Implementing tasks...
     ✓ 1.1 Add theme context provider
     ✓ 1.2 Create toggle component
     ✓ 2.1 Add CSS variables
     ✓ 2.2 Wire up localStorage
     All tasks complete!

You: /phsx:archive
AI:  Archived to phspec/changes/archive/2025-01-23-add-dark-mode/
     Specs updated. Ready for the next feature.
```

<details>
<summary><strong>PhSpec Dashboard</strong></summary>

<p align="center">
  <img src="assets/phspec_dashboard.png" alt="PhSpec dashboard preview" width="90%">
</p>

</details>

## Quick Start

**Requires Node.js 20.19.0 or higher.**

Install PhSpec globally:

```bash
npm install -g @bobby_z/phspec@latest
```

Then navigate to your project directory and initialize:

```bash
cd your-project
phspec init
```

Now tell your AI: `/phsx:new <what-you-want-to-build>`

> [!NOTE]
> Not sure if your tool is supported? [View the full list](docs/supported-tools.md) – we support 20+ tools and growing.
>
> Also works with pnpm, yarn, bun, and nix. [See installation options](docs/installation.md).

## Docs

→ **[Getting Started](docs/getting-started.md)**: first steps<br>
→ **[Workflows](docs/workflows.md)**: combos and patterns<br>
→ **[Commands](docs/commands.md)**: slash commands & skills<br>
→ **[CLI](docs/cli.md)**: terminal reference<br>
→ **[Supported Tools](docs/supported-tools.md)**: tool integrations & install paths<br>
→ **[Concepts](docs/concepts.md)**: how it all fits<br>

→ **[Brownfield & SDD Best Practices](docs/brownfield-sdd-best-practices.md)**: 棕地接入与业务开发流程规范（团队/公司接入必读）<br>
→ **[Multi-Language](docs/multi-language.md)**: multi-language support<br>
→ **[Customization](docs/customization.md)**: make it yours

## Why PhSpec?

AI coding assistants are powerful but unpredictable when requirements live only in chat history. PhSpec adds a lightweight spec layer so you agree on what to build before any code is written.

- **Agree before you build** — human and AI align on specs before code gets written
- **Stay organized** — each change gets its own folder with proposal, specs, design, and tasks
- **Work fluidly** — update any artifact anytime, no rigid phase gates
- **Use your tools** — works with 20+ AI assistants via slash commands

### How we compare

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Thorough but heavyweight. Rigid phase gates, lots of Markdown, Python setup. PhSpec is lighter and lets you iterate freely.

**vs. [Kiro](https://kiro.dev)** (AWS) — Powerful but you're locked into their IDE and limited to Claude models. PhSpec works with the tools you already use.

**vs. nothing** — AI coding without specs means vague prompts and unpredictable results. PhSpec brings predictability without the ceremony.

## Updating PhSpec

**Upgrade the package**

```bash
npm install -g @bobby_z/phspec@latest
```

**Refresh agent instructions**

Run this inside each project to regenerate AI guidance and ensure the latest slash commands are active:

```bash
phspec update
```

## Usage Notes

**Model selection**: PhSpec works best with high-reasoning models. We recommend Opus 4.5 and GPT 5.2 for both planning and implementation.

**Context hygiene**: PhSpec benefits from a clean context window. Clear your context before starting implementation and maintain good context hygiene throughout your session.

## Contributing

**Small fixes** — Bug fixes, typo corrections, and minor improvements can be submitted directly as PRs.

**Larger changes** — For new features, significant refactors, or architectural changes, please submit an PhSpec change proposal first so we can align on intent and goals before implementation begins.

When writing proposals, keep the PhSpec philosophy in mind: we serve a wide variety of users across different coding agents, models, and use cases. Changes should work well for everyone.

**AI-generated code is welcome** — as long as it's been tested and verified. PRs containing AI-generated code should mention the coding agent and model used (e.g., "Generated with Claude Code using claude-opus-4-5-20251101").

### Development

- Install dependencies: `pnpm install`
- Build: `pnpm run build`
- Test: `pnpm test`
- Develop CLI locally: `pnpm run dev` or `pnpm run dev:cli`
- Conventional commits (one-line): `type(scope): subject`

## Other

<details>
<summary><strong>Telemetry</strong></summary>

PhSpec collects anonymous usage stats.

We collect only command names and version to understand usage patterns. No arguments, paths, content, or PII. Automatically disabled in CI.

**Opt-out:** `export PHSPEC_TELEMETRY=0` or `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Maintainers & Advisors</strong></summary>

See [MAINTAINERS.md](MAINTAINERS.md) for the list of core maintainers and advisors who help guide the project.

</details>

## License

MIT
