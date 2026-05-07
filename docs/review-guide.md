# 审查命令指南

OpenSpec 提供三个审查命令，用于在实施过程中进行质量检查，帮助发现问题并改进制品质量。

## 概述

审查命令是建议式的质量检查工具，不会强制阻塞工作流。它们提供结构化的评估和可执行的建议，帮助用户在适当的时候改进规格、设计和代码。

**自动触发机制**：在 OPSX 工作流中，review 检查会自动触发，无需手动调用：

| 触发时机                    | 自动调用的 Review 技能 |
| --------------------------- | ---------------------- |
| requirement/specs 制品创建后 | review-spec            |
| plan/tasks 制品创建后      | review-design          |
| 代码实施完成              | review-code            |

## 审查规格：`/phsx:review-spec`

检查规格的完整性、清晰度、可实施性和可测试性。

### 使用时机

**自动触发**：在 `/phsx:continue` 或 `/phsx:ff` 命令中，当 `requirement.md` 或 `specs/**/*.md` 创建完成后自动调用。

**手动调用**：
- 完成规范后需要重新检查
- 发现实施困难，需要回溯规格质量
- 归档前进行最终质量检查

### 检查查维度

| 维度         | 说明                                   |
| ------------ | -------------------------------------- |
| 完整性       | 是否包含所有必需章节（Why、What Changes、Capabilities、Impact） |
| 清晰度       | 语言是否明确无歧义，避免模糊表述         |
| 可实施性     | 技术方案是否可行，能否在约束条件下实现     |
| 可测试性     | 是否包含可测试的场景和验收标准           |

### 报告格式

```markdown
# Review Spec: add-auth
**Artifact:** add-auth.md
**Date:** 2026-04-21
**Status:** ✅ SOUND

## Overall Assessment
该规格清晰完整，具有良好的可实施性和可测试性。

## Dimensions

### Completeness: 5/5
**评估：** 所有必需章节完整。

### Clarity: 4/5
**评估：** 语言清晰，部分可优化。

### Implementability: 5/5
**评估：** 技术方案可行。

### Testability: 4/5
**评估：** 包含可测试场景，可增加更多边界条件。

## Recommendations

### Critical (Must Fix)
None

### Important (Should Fix)
- 建议添加更多边界条件场景。

### Optional (Nice to Have)
None

## Conclusion
**规格质量：** 良好，可进入设计阶段。
**下一步：** 创建设计文档
```

## 审查代码：`/phsx:review-code`

验证代码实现与规格的一致性，检查功能正确性、安全性、架构合规性、错误处理和死代码。

### 使用时机

**自动触发**：在 `/phsx:apply` 命令中，所有任务完成后自动调用。

**手动调用**：
- 实施过程中需要检查代码质量
- 发现 bug 时分析原因
- 归档前确认代码符合规范
- 安全审查前的初步筛查

### 检查维度

| 维度             | 说明                                   |
| ---------------- | -------------------------------------- |
| 功能正确性       | 代码是否满足规范需求                   |
| 错误处理         | 是否正确处理异常情况和边界条件         |
| 边界条件         | 是否处理边界和边缘情况                 |
| 安全性           | XSS、注入、SSRF、认证/授权、竞态条件等 |
| 架构合规性       | SRP、依赖方向、副作用隔离             |
| 非功能需求       | 性能、可维护性、可观测性等           |
| 规范漂移         | 代码是否与实际规范保持一致           |
| 死代码           | 未引用的函数/变量、注释代码、临时标记 |

详细增强说明见 [review-code-enhancements.md](review-code-enhancements.md)。

### 报告格式

```markdown
# Review Code: add-auth
**Artifact:** Implementation
**Date:** 2026-04-21
**Status:** ⚠️ NEEDS WORK

## Overall Assessment
代码基本实现了认证功能，但存在安全漏洞和错误处理问题需要改进。

## Layer 1: Quick Scan
| 检查项 | 状态 | 证据 |
|--------|------|------|
| 文件存在性 | ✓ | src/auth/login.ts |
| 关键字覆盖 | ✓ | SHALL → src/auth/login.ts:42 |
| Breaking Change | ✓ | 无 |

## Layer 2: Scenario Coverage
| Requirement | Scenario | 覆盖状态 | 证据 |
|-------------|----------|----------|------|
| User Login | Valid credentials | ✓ | src/auth/login.ts:42 |
| User Login | Invalid credentials | ✗ | 未覆盖 |

## Layer 2.5: Security Scan
| 漏洞类型 | 严重级别 | 状态 | 证据 |
|----------|----------|------|------|
| XSS | P0 | ✓ | 无风险 |
| 注入 | P0 | ✗ | src/auth/login.ts:58 字符串拼接 SQL |
| 认证/授权 | P0 | ⚠️ | 缺失登录失败次数限制 |
| 竞态条件 | P1 | ✗ | 余额检查与扣款非原子操作 |

## Layer 2.5: Architecture Check
| 检查项 | 状态 | 证据 |
|--------|------|------|
| 单一职责 | ⚠️ | login.ts 混合了验证和数据库操作 |
| 依赖方向 | ✓ | 通过接口注入 |

## Layer 3: Quality Checks
| 维度 | 评分/5 | 发现 |
|------|--------|------|
| 可测试性 | 4 | 基本可测试 |
| 可观测性 | 3 | 缺少登录失败日志 |
| API 契约 | 5 | 向后兼容 |

## Recommendations
### P0 — Critical (Must Fix)
- SQL 注入风险：login.ts:58 使用字符串拼接构建查询
  - **建议**：使用参数化查询

### P1 — High (Should Fix)
- 并发竞态：余额检查与扣款之间有并发窗口
  - **建议**：使用数据库事务或乐观锁

### P2 — Medium (Fix or Follow-up)
- 缺少登录失败的结构化日志
  - **建议**：添加失败尝试的 metrics 埋点

## Conclusion
**代码质量：** 需要修复 P0 安全问题后可继续。
**下一步：** 修复 SQL 注入和竞态条件问题
```

### 项目配置扫描

审查代码前会扫描项目规范文档（ESLint/Prettier/tsconfig.json/CONTRIBUTING.md/CODE_STANDARDS.md 等）作为审查依据。

**若未找到任何项目规范文档**：
- 审查会暂停，提示用户未找到项目规范
- 询问用户是否要补充项目规范文档，或选择继续使用通用规范进行底线审查
- 这有助于获得更有针对性的审查结果

### 报告保存

审查报告默认在聊天窗口显示，也可保存为本地 markdown 文件。详见下方「报告保存」小节。

## 审查设计：`/phsx:review-design`

检查设计方案与规格的关联性，评估设计质量。

### 使用时机

**自动触发**：在 `/phsx:continue` 或 `/phsx:ff` 命令中，当 `plan.md` 或 `tasks.md` 创建完成后自动调用。

**手动调用**：
- 完成设计后需要重新检查
- 实施中发现设计问题
- 归档前确认设计符合规范

### 检查维度

| 维度         | 说明                                   |
| ------------ | -------------------------------------- |
| 设计遵循度   | 实现是否遵循设计决策                   |
| 设计连贯性   | 设计决策是否内部一致，无冲突           |
| 架构对齐     | 设计是否与系统架构对齐                 |
| 可追溯性     | 设计是否能追溯到规格需求                 |
| 设计完整性   | 设计是否覆盖所有规格需求               |

### 报告格式

```markdown
# Review Design: add-auth
**Artifact:** add-auth.md
**Date:** 2026-04-21
**Status:** ✅ SOUND

## Overall Assessment
设计方案清晰完整，与规格需求对齐，架构选择合理。

## Dimensions

### Design Adherence: 5/5
**评估：** 设计决策得到良好遵循。

### Design Coherence: 5/5
**评估：** 设计决策内部一致，无冲突。

### Architecture Alignment: 5/5
**评估：** 设计与系统架构良好对齐。

### Traceability: 4/5
**评估：** 大部分设计决策可追溯到规格，部分可改进。

### Design Completeness: 5/5
**评估：** 设计覆盖了所有规格需求。

## Recommendations

### Critical (Must Fix)
None

### Important (Should Fix)
None

### Optional (Nice to Have)
- 建议在设计中更明确地说明性能考虑。

## Conclusion
**设计质量：** 良好，可进入实施阶段。
**下一步：** 开始实施
```

### 报告保存

所有审查报告均可在聊天窗口查看，也可保存为本地 markdown 文件：

| 命令 | 保存路径 |
|------|----------|
| `/phsx:review-spec` | `phspec/changes/<name>/reviews/review-spec-<timestamp>.md` |
| `/phsx:review-design` | `phspec/changes/<name>/reviews/review-design-<timestamp>.md` |
| `/phsx:review-code` | `phspec/changes/<name>/reviews/review-code-<timestamp>.md` |

报告文件用于归档和追溯，建议保存。

## 使用建议

### 自动审查工作流

在 OPSX 工作流中，review 检查会自动触发：

```text
/phsx:new ──► /phsx:continue (或 /phsx:ff)
                │
                ├──► 创建 requirement.md ──► [自动: review-spec]
                │       │
                │       ▼
                │   创建 specs/**/*.md ──► [自动: review-spec]
                │       │
                │       ▼
                │   创建 plan.md ──► [自动: review-design]
                │       │
                │       ▼
                │   创建 tasks.md ──► [自动: review-design]
                │       │
                │       ▼
                └──► /phsx:apply ──► 完成所有任务 ──► [自动: review-code]
                                                            │
                                                            ▼
                                                   /phsx:verify ──► /phsx:archive
```

### 手动审查工作流

如需手动审查（如修改制品后重新检查），可以直接调用对应的 review 命令：

```text
/phsx:review-spec    # 审查规格
/phsx:review-design  # 审查设计
/phsx:review-code    # 审查代码
```

### 最佳实践

1. **及时审查**：在完成制品后立即审查，不要等到归档前才发现问题。
2. **迭代改进**：审查发现问题时，及时调整制品，然后再次审查确认改进。
3. **关注优先级**：优先处理 Critical 级别的问题，其次是 Important。
4. **记录决策**：对于审查中发现的重要问题，记录解决决策和原因。
5. **团队协作**：审查结果可以作为团队代码评审的参考。

### 与其他命令的配合

- **`/phsx:verify`**：verify 命令从整体上检查实现与制品的一致性，审查命令则深入检查特定制品的质量。
- **`/phsx:apply`**：在实施过程中使用 review-code 发现问题，然后修改代码。
- **`/phsx:continue`**：在逐步创建制品时，每完成一个制品就进行相应审查。

## 常见问题

**Q：审查命令会阻止我归档吗？**

A：不会。审查命令是建议式的，不会强制阻塞工作流。你可以根据审查结果决定是否继续或先处理问题。

**Q：审查失败后应该做什么？**

A：根据审查报告中的建议进行改进：
1. 优先处理 P0 级别的问题（安全漏洞、正确性 bug）
2. 然后处理 P1 级别（错误处理、边界条件、架构问题）
3. P2/P3 可创建 follow-up 或选择性修复
4. 可选：再次运行审查确认改进

**Q：是否必须在每个阶段都运行审查？**

A：不是必须的，但建议在关键节点运行审查，如规范完成后、设计完成后、实施中期和归档前。

**Q：审查命令与代码评审（Code Review）是什么关系？**

A：审查命令侧重于与规范的一致性和制品质量，代码评审关注代码风格、最佳实践和正确性。两者可以互补使用。

**Q：安全扫描能替代专业安全审计吗？**

A：不能。review-code 的安全扫描是基于代码模式匹配的初步筛查，能捕获常见的安全反模式（如 SQL 注入、XSS、密钥泄露），但不能替代专业的安全审计工具和渗透测试。建议将其作为开发阶段的第一道防线。