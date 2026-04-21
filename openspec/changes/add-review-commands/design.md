## Context

OpenSpec 目前仅有一个基础的 `/phsx:verify` 命令，用于检查规格与实现的一致性。该命令功能相对简单，主要关注基本的正确性验证，缺乏深度的审查能力。

cc-spex 项目（内部 Spec-Kit 变更管理工具）已经实现了成熟的审查体系，包括：
- `review-spec` - 规格质量审查，检查完整性、清晰度、可实施性
- `review-code` - 代码规范合规性审查，验证代码实现与规格的一致性
- `review-plan` - 计划和任务质量验证

通过将这些审查能力引入 OpenSpec，可以显著提升项目的质量控制能力。

**当前架构状态**：
- 命令通过 `src/core/templates/skill-templates.ts` 中的模板生成
- 技能和命令文件动态生成到 `.claude/skills/` 和 `.claude/commands/`
- 支持跨平台（macOS、Linux、Windows）

**约束条件**：
- OpenSpec 是通用 CLI 工具，必须适配任意项目类型
- 不能强制固定工作流（与 cc-spex 的 9 阶段流程不同）
- 保持低实现复杂度
- 跨平台支持（使用 Node.js path 模块处理路径）

## Goals / Non-Goals

**Goals:**
- 为 OpenSpec 添加三个独立审查命令：`review-spec`、`review-code`、`review-design`
- 参考 cc-spex 的成熟实现，提取核心审查逻辑
- 保持与现有架构的一致性（模板生成系统）
- 提供统一的审查报告格式
- 增强现有 `verify` 命令的检查深度

**Non-Goals:**
- 不实现完整的 cc-spex stamp 门控系统（强制测试运行等）
- 不强制固定工作流或 9 阶段流程
- 不假设特定的测试框架或构建工具
- 不实现深度集成的外部工具依赖（CodeRabbit、Copilot）

## Decisions

### 1. 审查命令架构：模板生成系统 vs 独立实现

**决策：使用现有模板生成系统**

**理由：**
- OpenSpec 已有成熟的模板生成系统（`skill-templates.ts`、`command-generation/`）
- 保持架构一致性，所有命令通过相同方式生成
- 支持动态生成到多个工具目录
- 降低维护成本

**替代方案：独立创建技能和命令文件**
- 需要手动维护多个文件
- 无法利用现有生成逻辑
- 违反 DRY 原则

### 2. 审查命令工具范围：核心命令 vs 工具特定

**决策：审查命令为核心命令，生成到所有 AI 工具**

**理由：**
- 审查是通用质量检查功能，不依赖特定 AI 工具
- 与 `openspec-explore`、`openspec-verify` 等命令保持一致
- DevAgent 等 AI 工具也能使用
- 避免工具特定逻辑耦合

**实现方式：**
- 在 `src/core/shared/tool-detection.ts` 添加 `CORE_COMMANDS` 常量
- 修改 `generateCommands()` 函数，核心命令生成到所有工具目录

### 3. 审查内容来源：参考 cc-spex vs 从零设计

**决策：参考 cc-spex 实现逻辑，适配 OpenSpec 架构**

**理由：**
- cc-spex 的审查逻辑已在生产环境验证
- 避免 500+ 行重复代码
- 可以直接利用成熟的检查维度和流程
- 降低设计和实现风险

**适配策略：**
| cc-spex 特性 | OpenSpec 适配 |
|--------------|--------------|
| 规范格式 | Spec-Kit spec.md → OpenSpec 增量规范 |
| 规范选择 | 分支自动解析 → 手动指定或上下文推断 |
| 工作流模式 | 固定 9 阶段 → 灵活工作流 |
| 命令前缀 | `/spex:` → `/phsx:` |
| 项目路径 | `.specify/specs/` → `openspec/changes/` |

### 4. 最终门控：强制执行 vs 建议式

**决策：实现建议式审查，不强制门控**

**理由：**
- OpenSpec 是通用 CLI 工具，不能假设特定测试环境
- 保持"灵活而非僵化"的工作流理念
- 降低实现复杂度（避免 5+ 审查代理）
- 先建立基础能力，验证价值后再考虑增强

**分阶段实现：**
- 阶段 1：基础审查命令（review-spec、review-code、review-design）
- 阶段 2：增强现有 verify 命令（基于使用反馈）
- 阶段 3（可选）：评估完整深度验证需求

### 5. 审查命令前缀：`phspec-*` vs `openspec-*`

**决策：使用 `phspec-*` 前缀**

**理由：**
- 与现有 OpenSpec 命令保持一致（`phspec-*`）
- 避免与 `openspec-*` 命令（CLI 命令）混淆
- 技能使用 `phspec-*`，CLI 使用 `openspec-*` 的命名约定已建立

### 6. 路径处理：跨平台兼容性

**决策：严格使用 Node.js path 模块**

**理由：**
- OpenSpec 支持 macOS、Linux、Windows
- 不同平台路径分隔符不同
- 避免硬编码 `/` 或 `\`

**实现规范：**
- 总是使用 `path.join()` 或 `path.resolve()`
- 测试中使用 `path.join()` 进行路径比较
- 考虑文件系统大小写敏感性

## Risks / Trade-offs

### 风险 1：cc-spex 审查逻辑可能不完全适配 OpenSpec
**风险 → 缓解：**
仔细适配 cc-spex 的审查逻辑到 OpenSpec 的增量规范格式；在提案中明确适配策略；基于使用反馈持续优化

### 风险 2：审查命令可能生成过多文件
**风险 → 缓解：**
使用核心命令机制，只生成一套技能文件供所有工具使用；评估文件体积，必要时拆分

### 风险 3：跨平台路径处理可能引入 bug
**风险 → 缓解：**
严格使用 Node.js path 模块；在 Windows 环境测试；添加路径处理单元测试

### Trade-off 1：功能深度 vs 实现复杂度
**权衡：**牺牲部分深度功能（如强制测试运行）以保持通用性和低复杂度

### Trade-off 2：灵活性 vs 强制性
**权衡：**选择建议式审查而非强制门控，优先保持工作流灵活性

## Migration Plan

### 部署步骤
1. **Phase 1：代码实现**
   - 在 `src/core/templates/skill-templates.ts` 添加审查命令模板函数
   - 修改 `src/core/shared/tool-detection.ts` 添加核心命令标记
   - 修改 `src/core/command-generation/generator.ts` 处理核心命令生成
   - 在各适配器目录添加审查命令内容函数

2. **Phase 2：文档更新**
   - 更新 `docs/workflows.md` 添加审查命令使用指南
   - 可选：创建 `docs/review-guide.md` 详细使用指南

3. **Phase 3：测试验证**
   - 在 macOS、Linux、Windows 测试路径处理
   - 验证技能和命令文件正确生成
   - 测试各审查命令的基本功能

### 回滚策略
- 新增文件（模板函数、适配器）可直接删除
- 修改文件（`tool-detection.ts`、`generator.ts`）可通过 git 回滚
- 没有数据迁移或配置变更，回滚无风险

## Open Questions

1. **Q: 是否需要为每个审查命令创建独立的 spec.md 文件？**
   - 建议：是，在 `specs/review-spec/`、`specs/review-code/`、`specs/review-design/` 目录下创建

2. **Q: 审查报告的详细程度如何设定？**
   - 建议：参考 cc-spex 的报告格式，但简化到适合通用 CLI 工具的复杂度

3. **Q: 是否需要支持审查配置（如自定义检查维度）？**
   - 建议：不在第一阶段实现，基于使用反馈评估需求
