/**
 * Validation threshold constants
 */

// Minimum character lengths
export const MIN_WHY_SECTION_LENGTH = 50;
export const MIN_PURPOSE_LENGTH = 50;

// Maximum character/item limits
export const MAX_WHY_SECTION_LENGTH = 1000;
export const MAX_REQUIREMENT_TEXT_LENGTH = 500;
export const MAX_DELTAS_PER_CHANGE = 10;

// Validation messages
export const VALIDATION_MESSAGES = {
  // Required content
  SCENARIO_EMPTY: "场景正文不能为空",
  REQUIREMENT_EMPTY: "需求正文不能为空",
  REQUIREMENT_NO_SHALL: "需求须包含 SHALL 或 MUST 关键词",
  REQUIREMENT_NO_SCENARIOS: "需求须包含至少一个场景",
  SPEC_NAME_EMPTY: "规范名称不能为空",
  SPEC_PURPOSE_EMPTY: "Purpose 节不能为空",
  SPEC_NO_REQUIREMENTS: "规范须包含至少一条需求",
  CHANGE_NAME_EMPTY: "变更名称不能为空",
  CHANGE_WHY_TOO_SHORT: `Why 节至少 ${MIN_WHY_SECTION_LENGTH} 个字符`,
  CHANGE_WHY_TOO_LONG: `Why 节不宜超过 ${MAX_WHY_SECTION_LENGTH} 个字符`,
  CHANGE_WHAT_EMPTY: "What Changes 节不能为空",
  CHANGE_NO_DELTAS: "变更须包含至少一个增量",
  CHANGE_TOO_MANY_DELTAS: `建议将超过 ${MAX_DELTAS_PER_CHANGE} 个增量的变更拆分为多个`,
  DELTA_SPEC_EMPTY: "规范名称不能为空",
  DELTA_DESCRIPTION_EMPTY: "增量描述不能为空",

  // Warnings
  PURPOSE_TOO_BRIEF: `Purpose 节过短（少于 ${MIN_PURPOSE_LENGTH} 个字符）`,
  REQUIREMENT_TOO_LONG: `需求正文过长（>${MAX_REQUIREMENT_TEXT_LENGTH} 个字符），建议拆分。`,
  DELTA_DESCRIPTION_TOO_BRIEF: "增量描述过短",
  DELTA_MISSING_REQUIREMENTS: "增量宜包含需求",

  // Guidance snippets (appended to primary messages for remediation)
  GUIDE_NO_DELTAS:
    '未找到增量。请确保变更含有 specs/ 目录及能力子目录（如 specs/http-server/spec.md），其中的 .md 使用增量标题（## ADDED/MODIFIED/REMOVED/RENAMED Requirements），且每条需求包含至少一个 "#### Scenario:" 块。提示：运行 "phspec change show <change-id> --json --deltas-only" 查看已解析增量。',
  GUIDE_MISSING_SPEC_SECTIONS:
    '缺少必填节。需要标题："## Purpose" 与 "## Requirements"。示例：\n## Purpose\n[简要目的]\n\n## Requirements\n### Requirement: 清晰需求陈述\nUsers SHALL ...\n\n#### Scenario: 描述性名称\n- **WHEN** ...\n- **THEN** ...',
  GUIDE_MISSING_CHANGE_SECTIONS:
    '缺少必填节。需要标题："## Why" 与 "## What Changes"。请在 specs/ 中使用增量标题记录增量。',
  GUIDE_SCENARIO_FORMAT:
    "场景须使用四级标题。将列表改为：\n#### Scenario: 简短名称\n- **WHEN** ...\n- **THEN** ...\n- **AND** ...",
} as const;
