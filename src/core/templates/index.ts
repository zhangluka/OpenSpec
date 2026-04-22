/**
 * Template exports for OpenSpec.
 *
 * The old config file templates (AGENTS.md, project.md, claude-template, etc.)
 * have been removed. The skill-based workflow uses skill-templates.ts directly.
 */

// Re-export skill templates for convenience
export {
  getExploreSkillTemplate,
  getNewChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getApplyChangeSkillTemplate,
  getFfChangeSkillTemplate,
  getSyncSpecsSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getVerifyChangeSkillTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxApplyCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxVerifyCommandTemplate,
  getReviewSpecSkillTemplate,
  getReviewCodeSkillTemplate,
  getReviewDesignSkillTemplate,
  getOpsxReviewSpecCommandTemplate,
  getOpsxReviewCodeCommandTemplate,
  getOpsxReviewDesignCommandTemplate,
} from './skill-templates.js';
