## Why

现有 `/phsx:verify` 命令的功能过于薄弱，无法提供深度的质量度检查和审查能力。cc-spex 项目展示了完整的审查体系，包括多维度规格审查、代码规范合规性检查、计划质量验证等。通过引入类似的审查命令，可以显著提升 OpenSpec 的质量控制能力，帮助用户在归档前发现并解决问题。

## What Changes

- **新增三个独立的审查命令**：
  - `/phsx:review-spec` - 规格质量审查
  - `/phsx:review-code` - 代码规范合规性审查
  - `/phsx:review-design` - 设计一致性审查

- **增强现有验证命令**：
  - 扩展 `/phsx:verify` 的检查维度和深度
  - 改进报告格式，提供更详细的问题分类和修复建议

- **集成到模板生成系统**：
  - 在 `src/core/templates/skill-templates.ts` 添加审查命令模板
  - 在 `src/core/shared/skill-generation.ts` 注册新的技能和命令
  - 支持动态生成到 `.claude/skills/` 和 `.claude/commands/`

## Capabilities

### New Capabilities

- `review-spec`: 规格质量审查功能，检查规格的完整性、清晰度、可实施性和可测试性
- `review-code`: 代码规范合规性审查功能，验证代码实现与规格的一致性
- `review-design`: 设计一致性审查功能，检查设计方案与规格的关联性

### Modified Capabilities

- `verify`: 增强现有验证命令的检查深度和报告质量

## Impact

**影响的代码**：
- `src/core/templates/skill-templates.ts` - 添加审查命令模板函数
- `src/core/shared/tool-detection.ts` - 添加核心命令标记
- `src/core/command-generation/generator.ts` - 修改命令生成逻辑
- `src/core/command-generation/adapters/` - 添加审查命令适配器（各工具）

**生成的技能**：
- `.claude/skills/phspec-review-spec/SKILL.md`
- `.claude/skills/phspec-review-code/SKILL.md`
- `.claude/skills/phspec-review-design/SKILL.md`

**生成的命令**：
- `.claude/commands/phsx/review-spec.md`
- `.claude/commands/phsx/review-code.md`
- `.claude/commands/phsx/review-design.md`

**文档更新**：
- `docs/workflows.md` - 更新工作流文档，加入审查命令的使用时机
- 可能新增 `docs/review-guide.md` - 详细的审查使用指南

## 技术决策

### 核心实现策略

**实现方式：参考 cc-spex 现成技能 + 适配 OpenSpec 架构**

## 为什么参考 cc-spex 现成实现

**cc-spex 已经有经过验证的审查技能**：

- `review-spec/SKILL.md` (500+ 行）- 完整的规格审查流程
- `review-code/SKILL.md` (500+ 行）- 完整的代码规范合规性审查
- `review-plan/SKILL.md` - 计划和任务质量验证

**直接参考的优势**：

1. **时间效率** - 避免重复造轮，直接利用经过验证的逻辑
2. **最佳实践** - cc-spex 的审查逻辑已经在生产环境验证过
3. **维护成本低** - 代码质量持续迭代，无需从头维护
4. **验证充分** - 多角度、多工具集成的完整审查系统

**但需要适配到 OpenSpec 架构**：

| cc-spex 特性 | OpenSpec 适配需求 |
|--------------|-------------------|
| 规范格式 | Spec-Kit spec.md | OpenSpec 增量规范（ADDED/MODIFIED/REMOVED） |
| 规范选择 | 分支自动解析 | 手动指定或从上下文推断 |
| 工作流模式 | 固定 9 阶段 | 灵活工作流 |
| 命令前缀 | `/spex:` | `/phsx:` |
| 项目路径 | `.specify/specs/` | `openspec/changes/` |

---

### 核心实现路径

**步骤 1：参考 cc-spex 审查逻辑**

- 阅读 cc-spex 的 `review-spec`、`review-code` 技能
- 提取核心检查维度和流程
- 适配到 OpenSpec 的增量规范格式
- 保留问题发现和报告生成逻辑

**步骤 2：创建 OpenSpec 审查技能**

- 在 `src/core/templates/skill-templates.ts` 中创建模板函数
- 使用 OpenSpec 的 `phspec-*` 命令前缀
- 支持 OpenSpec 的变化状态系统

**步骤 3：集成到命令生成系统**

- 注册新的审查命令到 `getCommandTemplates()`
- 支持动态生成到所有工具目录

**步骤 4：增强现有 verify 命令**

- 参考部分 review-code 逻辑
- 添加代码卫生检查
- 改进报告格式

**步骤 5：更新文档和工作流**

- 在 `docs/workflows.md` 中添加审查命令使用指南
- 提供最佳实践示例

**原因**：
- OpenSpec 的核心功能（如审查命令）应该对所有 AI 工具可用
- 与现有架构保持一致，参考 `openspec-explore`、`openspec-new-change` 等命令的实现方式
- DevAgent 等支持 skills 的工具可以正常使用
- 避免工具特定的逻辑耦合，保持代码简洁

**实现方式**：

在 `src/core/shared/tool-detection.ts` 中添加核心命令标记：

```typescript
/**
 * Core OpenSpec commands that should be available across all AI tools
 * These are tool-agnostic fundamental features, not Claude-specific
 */
export const CORE_COMMANDS = [
  'review-spec',
  'review-code',
  'review-design',
] as const;

export function isCoreCommand(command: string): boolean {
  return CORE_COMMANDS.includes(command);
}
```

在命令生成逻辑 `src/core/command-generation/generator.ts` 中处理核心命令：

```typescript
// 修改 generateCommands() 函数
export function generateCommands(
  contents: CommandContent[],
  adapter: ToolCommandAdapter
) {
  return contents.map((content) => {
    const isCore = isCoreCommand(content.id);
    
    if (isCore) {
      // 核心命令：生成到所有工具目录
      const tools = AI_TOOLS;
      for (const tool of tools) {
        generateSkill(tool, content);
        generateCommand(tool, content);
      }
    } else {
      // 工具特定命令：只生成到该工具目录
      const tool = getTool(content.id);
      generateSkill(tool, content);
      generateCommand(tool, content);
    }
  });
}
```

### 审查报告适配器

在 `src/core/command-generation/adapters/` 目录下为各工具添加审查命令适配器：

```typescript
// src/core/command-generation/adapters/claude.ts
export function getClaudeReviewCommands(): CommandContent[] {
  return [
    {
      id: 'review-spec',
      name: 'PHSX: Review Spec',
      description: '规格质量审查',
      category: 'Review',
      tags: ['review', 'spec'],
      content: getReviewSpecCommandContent(),
    },
    {
      id: 'review-code',
      name: 'PHSX: Review Code',
      description: '代码规范合规性审查',
      category: 'Review',
      tags: ['review', 'code'],
      content: getReviewCodeCommandContent(),
    },
    {
      id: 'review-design',
      name: 'PHSX: Review Design',
      description: '设计一致性审查',
      category: 'Review',
      tags: ['review', 'design'],
      content: getReviewDesignCommandContent(),
    },
  ];
}
```

### 审查命令模板

在 `src/core/templates/skill-templates.ts` 中添加三个审查命令的技能模板：

```typescript
export function getReviewSpecSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-review-spec",
    description: "规格质量审查 - 检查规格的完整性、清晰度、可实施性和可测试性",
    instructions: getReviewSpecSkillInstructions(),
  };
}

export function getReviewCodeSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-review-code",
    description: "代码规范合规性审查 - 验证代码实现与规格的一致性",
    instructions: getReviewCodeSkillInstructions(),
  };
}

export function getReviewDesignSkillTemplate(): SkillTemplate {
  return {
    name: "phspec-review-design",
    description: "设计一致性审查 - 检查设计方案与规格的关联性",
    instructions: getReviewDesignSkillInstructions(),
  };
}
```

### 审查报告格式统一化

所有审查命令使用统一的报告格式：

```markdown
# [Review Type]: [Feature Name]
**Artifact:** [artifact-name].md
**Date:** YYYY-MM-DD
**Status:** ✅ SOUND / ⚠️ NEEDS WORK / ❌ MAJOR ISSUES

## Overall Assessment
[1-2 sentence summary]

## Dimensions
### [Dimension 1]: [Score/5]
### [Dimension 2]: [Score/5]
### [Dimension 3]: [Score/5]

## Recommendations
### Critical (Must Fix)
### Important (Should Fix)
### Optional (Nice to Have)

## Conclusion
[Ready for next step: Yes/No]
**Next steps:** [What to do]
```

### 审查维度映射

| 审查类型 | cc-spex 维度 | OpenSpec verify 维度 | 合并策略 |
|-----------|--------------|---------------------|----------|
| review-spec | Completeness, Clarity, Implementability, Testability | Completeness | 保留原有，扩展检查项 |
| review-code | Functional, Error Handling, Edge Cases, Non-Functional | Correctness | 保留原有，扩展检查项 |
| review-design | Design Adherence | Coherence | 新增维度 |

## 最终验证门控决策

### 是否需要 cc-spex 式的 /spex:stamp 或 verification 的功能？

**cc-spex 的 stamp/verification 功能分析**：

cc-spex 提供了完整的最终验证门控系统，包括：
- 运行完整测试套件（Tests: 必须通过）
- 代码卫生检查（死代码、突变安全、清理一致性等）
- 规范合规性逐行验证（每条需求都检查）
- 规范漂移检测（spec vs code 一致性）
- 成功标准验证
- 严格的防合理化机制（Iron Law）
- 完整的验证报告生成

这是一个**系统级强制门控**，确保只有符合所有条件才能完成变更。

---

### OpenSpec 的约束与差异

**OpenSpec 的关键约束**：
- 通用 CLI 工具，适配任意项目类型和测试框架
- 灵活工作流理念，不强制固定的 9 阶段流程
- 跨平台支持（macOS、Linux、Windows）
- 必须保持低实现复杂度

**与 cc-spex 的差异**：

| 方面 | cc-spex | OpenSpec |
|------|---------|---------|
| 测试环境 | 内部固定环境 | 任意项目（多种测试框架） |
| 工作流模式 | 固定 9 阶段自动流程 | 灵活工作流，用户按需调用 |
| 集成方式 | Traits + Overlay 机制 | 模板生成系统 |
| 配置方式 | spex-traits.json | openspec config.yaml |
| 调用方式 | 自动触发 | 手动调用 |
| 复杂度目标 | 内部插件优化 | 通用 CLI 工具 |
| 强制门控 | 严格模式，阻塞完成 | 建议式，报告问题 |

---

### 推荐策略

**不立即实现完整的 stamp 门控**，原因：

1. **成本效益不匹配**
   - 实现完整 stamp 需要 500+ 行复杂代码
   - 需要维护 5 个审查代理
   - 需要外部工具集成（CodeRabbit、Copilot）
   - 估计开发周期：2-3 周
   - 对于通用 CLI 工具来说过于沉重

2. **灵活性与强制性的冲突**
   - cc-spex 是内部工具，可以为项目定制测试环境
   - OpenSpec 必须保持通用性，不能假设特定测试框架
   - OpenSpec 强调"灵活而非僵化"的工作流理念
   - 强制门控会破坏灵活性

3. **先建立基础审查能力**
   - 先实现基础审查命令（review-spec、review-code、review-design）
   - 验证用户是否真的需要深度验证
   - 基于实际使用反馈优化功能方向
   - 降低初期实现风险

4. **增强现有 verify 命令作为折中方案**
   - 参考 cc-spex 的优秀检查逻辑
   - 添加代码卫生检查（部分）
   - 添加规范合规性矩阵检查
   - 改进报告格式
   - 但不强制执行完整测试套件
   - 保持建议式，不阻塞工作流

---

### 分阶段实现路径

**阶段 1（P0 - 立即开始）**：
- 实现基础审查命令
- 增强 verify 命令
- 验证基础审查的价值
- 快速提供可用的质量检查能力

**阶段 2（P1 - 验证价值后）**：
- 基于基础审查命令使用反馈
- 评估是否需要更严格的门控
- 如果用户经常跳过验证，再考虑增强
- 可能在 verify 中添加部分 stamp 功能

**阶段（P2 - 长期规划）**：
- 如果基础审查被广泛使用
- 评估完整 deep-review 的需求
- 评估 worktree 功能的价值
- 作为可选功能提供

---

## 优先级排序

**本变更的实现优先级**：

1. **P0 - 立即开始**：实现基础审查命令（review-spec、review-code、review-design）
   - 价值高，实现相对独立
   - 可以快速验证设计模式
   - 为后续高级功能打好基础

2. **P1 - 验证后**：增强现有 verify 命令
   - 基于基础审查命令使用反馈
   - 评估是否需要更严格的门控
   - 如果用户经常跳过验证，再考虑增强
   - 可能在 verify 中添加部分 stamp 功能

3. **P2 - 长期规划**：评估高级门控需求
   - 基于实际使用反馈决定
   - 作为可选功能提供
