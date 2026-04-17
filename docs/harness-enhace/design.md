# PhSpec Harness 改造方案

## 背景

PhSpec 是一个规范驱动的 AI 原生开发 CLI 工具，当前主要功能是管理规范（specs）和变更（changes）。参考 cc-spex 项目，通过引入 harness 模式，可以在不改变现有使用方式的前提下，为 PhSpec 添加质量门控、流程规范、环境隔离等横向功能。

## 目标

在不改变现有 PhSpec CLI 使用方式的前提下，增加以下能力：

1. **质量门控（Quality Gates）** - 在关键操作前后进行校验
2. **流程规范（Process Discipline）** - 强制执行 TDD、验证流程
3. **环境隔离（Worktree Isolation）** - 使用 git worktree 创建隔离开发环境
4. **特性开关（Traits）** - 可配置启用/禁用各项功能
5. **代码审查辅助（Code Review Helpers）** - 提供规范合规性检查

## 设计原则

### 1. 非侵入式集成
- 作为 PhSpec 的可选增强层，不影响核心功能
- 通过配置开关控制，默认关闭
- 现有命令行为可完全保持不变

### 2. CLI 适配
- 适配 Claude Code 插件能力到 CLI 环境
- 命令式交互，而非对话式引导
- 充分利用 `phspec config` 现有配置机制

### 3. 渐进式实现
- 模块化设计，可独立开发和测试
- 优先实现高价值功能
- 支持未来扩展

## 架构设计

```
phspec/
├── src/
│   ├── core/
│   │   ├── harness/              # 新增：harness 核心模块
│   │   │   ├── index.ts         # 统一导出
│   │   │   ├── registry.ts      # 门控和钩子注册表
│   │   │   ├── context.ts       # 执行上下文
│   │   │   ├── executor.ts      # 钩子执行器
│   │   │   ├── gates/          # 质量门控
│   │   │   │   ├── index.ts
│   │   │   │   ├── spec-existence.ts    # 规范存在检查
│   │   │   │   ├── test-coverage.ts     # 测试覆盖率检查
│   │   │   │   ├── lint-check.ts       # Lint 检查
│   │   │   │   ├── compliance.ts       # 规范合规性检查
│   │   │   │   └── drift-detection.ts  #规范漂移检测
│   │   │   ├── hooks/          # 命令钩子
│   │   │   │   ├── index.ts
│   │   │   │   ├── pre-archive.ts      # 归档前钩子
│   │   │   │   ├── post-archive.ts     # 归档后钩子
│   │   │   │   └── pre-validate.ts     # 校验前钩子
│   │   │   ├── worktree/       # Worktree 隔离
│   │   │   │   ├── index.ts
│   │   │   │   ├── manager.ts         # Worktree 管理器
│   │   │   │   └── executor.ts        # 在 worktree 中执行命令
│   │   │   ├── traits/         # 特性管理
│   │   │   │   ├── index.ts
│   │   │   │   ├── trait.ts           # 特性基类
│   │   │   │   ├── tdd-trait.ts       # TDD 特性
│   │   │   │   ├── worktree-trait.ts  # Worktree 特性
│   │   │   │   └── gates-trait.ts     # 质量门控特性
│   │   │   └── ai-integration/  # AI 集成（可选）
│   │   │       ├── index.ts
│   │   │       └── claude-executor.ts # Claude Code 集成
│   │   └── config.ts              # 扩展：harness 配置
│   ├── commands/
│   │   └── harness/              # 新增：harness 相关命令
│   │       ├── index.ts
│   │       ├── enable.ts          # phspec harness enable
│   │       ├── disable.ts         # phspec harness disable
│   │       ├── worktree.ts       # phspec harness worktree
│   │       ├── gates.ts          # phspec harness gates
│   │       └── traits.ts         # phspec harness traits
│   └── cli/
│       └── index.ts             # 修改：注册 harness 命令
├── schemas/
│   └── harness-config.json       # 新增：harness 配置 schema
└── docs/
    └── harness/
        ├── design.md              # 本文档
        ├── implementation.md       # 实现指南
        └── migration.md          # 迁移指南
```

## 模块详细设计

### 1. 执行上下文（ExecutionContext）

```typescript
interface ExecutionContext {
  projectRoot: string;
  changeName?: string;
  schemaName?: string;
  command: string;
  dryRun: boolean;
  metadata: Record<string, unknown>;
}
```

作用：在钩子和门控之间共享执行状态。

### 2. 门控系统（Gates）

#### 门控接口
```typescript
interface QualityGate {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'error' | 'warning';
  check(ctx: ExecutionContext): Promise<GateResult>;
}

interface GateResult {
  passed: boolean;
  message: string;
  suggestions?: string[];
}
```

#### 内置门控

| 门控 ID | 名称 | 说明 | 配置项 |
|---------|------|------|---------|
| `spec-existence` | 规范存在检查 | 确保变更中有 spec 文件 | `gates.spec-existence.required` |
| `test-coverage` | 测试覆盖率检查 | 确保测试覆盖率达标 | `gates.test-coverage.min` |
| `lint-check` | Lint 检查 | 确保代码通过 lint | `gates.lint-check.command` |
| `compliance` | 规范合规性检查 | 检查实现与规范的一致性 | `gates.compliance.strict` |
| `drift-detection` | 规范漂移检测 | 检查规范与代码的漂移 | `gates.drift-detection.enabled` |

### 3. 钩子系统（Hooks）

#### 钩子接口
```typescript
interface Hook {
  id: string;
  phase: 'pre' | 'post';
  command: string;
  execute(ctx: ExecutionContext): Promise<HookResult>;
}

interface HookResult {
  success: boolean;
  shouldContinue: boolean;
  message?: string;
}
```

#### 内置钩子

| 钩子 ID | 阶段 | 命令 | 说明 |
|---------|------|------|------|
| `pre-archive-gates` | pre | archive | 执行质量门控检查 |
| `post-archive-cleanup` | post | archive | 清理临时文件 |
| `pre-validate-context` | pre | validate | 加载执行上下文 |

### 4. 特性系统（Traits）

特性是相关门控和钩子的组合，便于批量启用/禁用。

#### 内置特性

| 特性 ID | 名称 | 说明 | 包含门控 | 包含钩子 |
|---------|------|------|-----------|----------|
| `tdd` | 测试驱动开发 | 强制 TDD 流程 | test-coverage | pre-archive-gates |
| `worktree` | Worktree 隔离 | 使用 git worktree | - | - |
| `gates` | 质量门控 | 启用所有门控 | * | pre-archive-gates |
| `all` | 全部功能 | 启用所有特性 | * | * |

### 5. Worktree 管理器

```typescript
interface WorktreeManager {
  create(changeName: string, baseBranch?: string): Promise<string>;
  remove(changeName: string): Promise<void>;
  executeInWorktree(changeName: string, command: string): Promise<ExecResult>;
  list(): Promise<WorktreeInfo[]>;
}

interface WorktreeInfo {
  name: string;
  path: string;
  branch: string;
  createdAt: Date;
}
```

工作目录：`.phspec/worktrees/`

### 6. AI 集成（可选）

用于代码审查等需要 AI 能力的场景，支持多种后端：

- Claude Code（通过插件 API 或 MCP）
- OpenAI / Anthropic API
- 其他兼容的 LLM 提供商

## 配置设计

### 扩展现有配置

在 `phspec/config.yaml` 中新增 `harness` 段：

```yaml
# PhSpec 全局配置
schema: lean-sdd

# Harness 配置
harness:
  # 全局启用状态
  enabled: true

  # 默认特性
  traits:
    enabled:
      - tdd
      - gates

  # 门控配置
  gates:
    # 规范存在检查
    spec-existence:
      required: true
      paths:
        - spec.md
        - tasks.md

    # 测试覆盖率
    test-coverage:
      enabled: true
      min: 80  # 百分比
      command: npm run test:coverage  # 覆盖率命令

    # Lint 检查
    lint-check:
      enabled: true
      command: npm run lint
      fix-command: npm run lint:fix

    # 规范合规性检查
    compliance:
      enabled: true
      strict: false  # 是否严格模式

    # 规范漂移检测
    drift-detection:
      enabled: false
      tolerance: 0.1  # 允许的漂移比例

  # Worktree 配置
  worktree:
    base-path: .phspec/worktrees
    cleanup-after: 7days
    auto-create: false  # 是否自动创建 worktree

  # AI 集成配置
  ai:
    provider: claude-code  # claude-code | openai | anthropic
    claude-code:
      enabled: true
    openai:
      apiKey: ${OPENAI_API_KEY}
      model: gpt-4
```

## 集成点

### 1. 在 `phspec archive` 命令中集成

```typescript
// src/core/archive.ts 修改
export class ArchiveCommand {
  async execute(changeName?: string, options?: ArchiveOptions) {
    // ... 现有逻辑 ...

    // Harness 集成：执行 pre hooks
    await HarnessExecutor.runPreHooks('archive', context);

    // 现有归档逻辑
    const result = await this.performArchive(...);

    // Harness 集成：执行 post hooks
    await HarnessExecutor.runPostHooks('archive', context);

    return result;
  }
}
```

### 2. 新增 CLI 命令

```bash
# 启用/禁用 harness
phspec harness enable
phspec harness disable

# 特性管理
phspec harness traits list
phspec harness traits enable tdd
phspec harness traits disable tdd

# 手动触发门控
phspec harness gates run --change <name>
phspec harness gates check <gate-id>

# Worktree 管理
phspec harness worktree create <change> [--base <branch>]
phspec harness worktree remove <change>
phspec harness worktree list
phspec harness worktree exec <change> -- <command>
```

## 实现步骤

### 阶段 1：核心框架（P0）

1. 创建 `src/core/harness/` 目录结构
2. 实现 `registry.ts` - 门控和钩子注册表
3. 实现 `context.ts` - 执行上下文
4. 实现 `executor.ts` - 钩子执行器
5. 扩展配置 schema，支持 `harness` 段
6. 编写单元测试

### 阶段 2：质量门控（P0）

1. 实现门控基类和接口
2. 实现内置门控（spec-existence, test-coverage, lint-check）
3. 实现 `gates/` 模块
4. 集成到 `archive` 命令
5. 编写集成测试

### 阶段 3：特性系统（P1）

1. 实现 `traits/` 模块
2. 实现特性开关命令
3. 实现配置持久化
4. 文档和使用示例

### 阶段 4：Worktree 隔离（P1）

1. 实现 `worktree/manager.ts`
2. 实现 Worktree 命令
3. 实现自动创建/清理逻辑
4. 文档和使用示例

### 阶段 5：高级功能（P2）

1. 实现 compliance 门控（规范合规性检查）
2. 实现 drift-detection 门控
3. AI 集成模块设计
4. 代码审查辅助命令

### 阶段 6：完善和优化（P2）

1. 性能优化
2. 错误处理和用户反馈优化
3. 完整文档
4. 迁移指南

## 与 cc-spex 的对应关系

| cc-spex 功能 | PhSpec Harness 实现 | 适配说明 |
|-------------|------------------|----------|
| Superpowers 技能库 | 内置门控和钩子 | 固化为可配置模块 |
| Trait 开关系统 | 特性系统 | 通过 config.yaml 配置 |
| Git worktree 隔离 | Worktree 管理器 | CLI 命令式操作 |
| 质量门控 | Gates 模块 | 预定义 + 可扩展 |
| TDD 强制 | TDD 特性 | 检查测试存在和覆盖 |
| 验证门控 | Pre-archive hooks | 集成到 archive 命令 |
| 代码审查 | Compliance 门控 | 规范合规性检查 |
| Skill 系统 | CLI 命令 + 配置 | 从技能固化为命令 |

## 使用示例

### 基础使用

```bash
# 1. 启用 harness
phspec harness enable

# 2. 启用质量门控特性
phspec harness traits enable gates

# 3. 配置测试覆盖率要求
phspec config set harness.gates.test-coverage.min 80

# 4. 正常使用 phspec，自动执行门控
phspec new change add-auth
phspec archive add-auth  # 会自动运行质量门控
```

### Worktree 隔离使用

```bash
# 1. 为变更创建隔离环境
phspec harness worktree create add-auth

# 2. 在 worktree 中执行命令
phspec harness worktree exec add-auth -- npm run dev
phspec harness worktree exec add-auth -- npm test

# 3. 完成后清理
phspec harness worktree remove add-auth
```

### 手动触发门控

```bash
# 运行所有门控
phspec harness gates run --change add-auth

# 检查特定门控
phspec harness gates check test-coverage --change add-auth
```

## 注意事项

1. **向后兼容**：Harness 功能默认禁用，不影响现有用户
2. **性能考虑**：门控执行应该快速，避免阻塞正常流程
3. **可扩展性**：支持用户自定义门控和钩子（未来）
4. **错误处理**：门控失败时提供清晰的错误信息和修复建议
5. **配置灵活性**：支持项目级和全局级配置

## 后续扩展方向

1. 支持自定义门控脚本
2. 与 CI/CD 集成
3. 集成更多 AI 提供商
4. 可视化门控执行结果
5. 历史记录和趋势分析
