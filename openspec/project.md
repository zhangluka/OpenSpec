# OpenSpec 项目概览

一个轻量 CLI 工具，用于搭建 OpenSpec 目录结构并保持 AI 指令更新。变更管理的复杂性由各 AI 工具直接操作 Markdown 文件完成。

## 技术栈

- 语言：TypeScript
- 运行时：Node.js（≥20.19.0，ESM 模块）
- 包管理：pnpm
- CLI 框架：Commander.js
- 用户交互：@inquirer/prompts
- 分发：npm 包

## 项目结构

```
src/
├── cli/        # CLI 命令实现
├── core/       # OpenSpec 核心逻辑（模板、结构）
└── utils/      # 共享工具（文件操作、回滚）

dist/           # 编译输出（已 gitignore）
```

## 约定

- 启用 TypeScript 严格模式
- 异步一律使用 async/await
- 最少依赖原则
- CLI、核心逻辑与工具分层清晰
- 命名清晰、便于 AI 理解

## 错误处理

- 错误上抛到 CLI 层统一面向用户提示
- 使用原生 Error 并附带清晰信息
- 退出码：0（成功）、1（一般错误）、2（误用）
- 工具函数内不 try-catch，在命令层处理

## 日志

- 直接使用 console，不引入日志库
- console.log() 正常输出
- console.error() 错误输出（到 stderr）
- 暂不提供 verbose/debug 模式（保持简单）

## 测试策略

- 开发期通过 `pnpm link` 做人工测试
- 仅对关键路径做冒烟测试（init、help 等）
- 初期不做单元测试，复杂度上来再补
- 测试命令：`pnpm test:smoke`（若已添加）

## 开发流程

- 包管理统一使用 pnpm
- 运行 `pnpm run build` 编译 TypeScript
- 运行 `pnpm run dev` 进入开发模式
- 本地用 `pnpm link` 测试
- 遵循 OpenSpec 自身的变更驱动开发流程
