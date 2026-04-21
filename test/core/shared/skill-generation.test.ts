import { describe, it, expect } from 'vitest';
import {
  getSkillTemplates,
  getCommandTemplates,
  getCommandContents,
  generateSkillContent,
} from '../../../src/core/shared/skill-generation.js';
import {
  getReviewSpecSkillTemplate,
  getReviewSpecCommandContent,
  getReviewCodeSkillTemplate,
  getReviewDesignSkillTemplate,
  getReviewDesignCommandContent,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';

describe('skill-generation', () => {
  describe('getSkillTemplates', () => {
    it('should return all 13 skill templates', () => {
      const templates = getSkillTemplates();
      expect(templates).toHaveLength(13);
    });

    it('should have unique directory names', () => {
      const templates = getSkillTemplates();
      const dirNames = templates.map(t => t.dirName);
      const uniqueDirNames = new Set(dirNames);
      expect(uniqueDirNames.size).toBe(templates.length);
    });

    it('should include all expected skills', () => {
      const templates = getSkillTemplates();
      const dirNames = templates.map(t => t.dirName);

      expect(dirNames).toContain('phspec-explore');
      expect(dirNames).toContain('phspec-new-change');
      expect(dirNames).toContain('phspec-continue-change');
      expect(dirNames).toContain('phspec-apply-change');
      expect(dirNames).toContain('phspec-ff-change');
      expect(dirNames).toContain('phspec-sync-specs');
      expect(dirNames).toContain('phspec-archive-change');
      expect(dirNames).toContain('phspec-bulk-archive-change');
      expect(dirNames).toContain('phspec-verify-change');
      expect(dirNames).toContain('phspec-onboard');
      expect(dirNames).toContain('phspec-review-spec');
      expect(dirNames).toContain('phspec-review-code');
      expect(dirNames).toContain('phspec-review-design');
    });

    it('should have valid template structure', () => {
      const templates = getSkillTemplates();

      for (const { template, dirName } of templates) {
        expect(template.name).toBeTruthy();
        expect(template.description).toBeTruthy();
        expect(template.instructions).toBeTruthy();
        expect(dirName).toBeTruthy();
      }
    });
  });

  describe('getCommandTemplates', () => {
    it('should return all 13 command templates', () => {
      const templates = getCommandTemplates();
      expect(templates).toHaveLength(13);
    });

    it('should have unique IDs', () => {
      const templates = getCommandTemplates();
      const ids = templates.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(templates.length);
    });

    it('should include all expected commands', () => {
      const templates = getCommandTemplates();
      const ids = templates.map(t => t.id);

      expect(ids).toContain('explore');
      expect(ids).toContain('new');
      expect(ids).toContain('continue');
      expect(ids).toContain('apply');
      expect(ids).toContain('ff');
      expect(ids).toContain('sync');
      expect(ids).toContain('archive');
      expect(ids).toContain('bulk-archive');
      expect(ids).toContain('verify');
      expect(ids).toContain('review-spec');
      expect(ids).toContain('review-code');
      expect(ids).toContain('review-design');
      expect(ids).toContain('onboard');
    });
  });

  describe('getCommandContents', () => {
    it('should return all 13 command contents', () => {
      const contents = getCommandContents();
      expect(contents).toHaveLength(13);
    });

    it('should have valid content structure', () => {
      const contents = getCommandContents();

      for (const content of contents) {
        expect(content.id).toBeTruthy();
        expect(content.name).toBeTruthy();
        expect(content.description).toBeTruthy();
        expect(content.body).toBeTruthy();
      }
    });

    it('should have matching IDs with command templates', () => {
      const templates = getCommandTemplates();
      const contents = getCommandContents();

      const templateIds = templates.map(t => t.id).sort();
      const contentIds = contents.map(c => c.id).sort();

      expect(contentIds).toEqual(templateIds);
    });
  });

  describe('generateSkillContent', () => {
    it('should generate valid YAML frontmatter', () => {
      const template = {
        name: 'test-skill',
        description: 'Test description',
        instructions: 'Test instructions',
        license: 'MIT',
        compatibility: 'Test compatibility',
        metadata: {
          author: 'test-author',
          version: '2.0',
        },
      };

      const content = generateSkillContent(template, '0.23.0');

      expect(content).toMatch(/^---\n/);
      expect(content).toContain('name: test-skill');
      expect(content).toContain('description: Test description');
      expect(content).toContain('license: MIT');
      expect(content).toContain('compatibility: Test compatibility');
      expect(content).toContain('author: test-author');
      expect(content).toContain('version: "2.0"');
      expect(content).toContain('generatedBy: "0.23.0"');
      expect(content).toContain('Test instructions');
    });

    it('should use default values for optional fields', () => {
      const template = {
        name: 'minimal-skill',
        description: 'Minimal description',
        instructions: 'Minimal instructions',
      };

      const content = generateSkillContent(template, '0.24.0');

      expect(content).toContain('license: MIT');
      expect(content).toContain('compatibility: Requires phspec CLI.');
      expect(content).toContain('author: phspec');
      expect(content).toContain('version: "1.0"');
      expect(content).toContain('generatedBy: "0.24.0"');
    });

    it('should embed the provided version in generatedBy field', () => {
      const template = {
        name: 'version-test',
        description: 'Test version embedding',
        instructions: 'Instructions',
      };

      const content1 = generateSkillContent(template, '0.23.0');
      expect(content1).toContain('generatedBy: "0.23.0"');

      const content2 = generateSkillContent(template, '1.0.0');
      expect(content2).toContain('generatedBy: "1.0.0"');

      const content3 = generateSkillContent(template, '0.24.0-beta.1');
      expect(content3).toContain('generatedBy: "0.24.0-beta.1"');
    });

    it('should end frontmatter with separator and blank line', () => {
      const template = {
        name: 'test',
        description: 'Test',
        instructions: 'Body content',
      };

      const content = generateSkillContent(template, '0.23.0');

      expect(content).toMatch(/---\n\nBody content\n$/);
    });

    it('should apply transformInstructions callback when provided', () => {
      const template = {
        name: 'transform-test',
        description: 'Test transform callback',
        instructions: 'Use /opsx:new to start and /opsx:apply to implement.',
      };

      const transformer = (text: string) => text.replace(/\/opsx:/g, '/opsx-');
      const content = generateSkillContent(template, '0.23.0', transformer);

      expect(content).toContain('/opsx-new');
      expect(content).toContain('/opsx-apply');
      expect(content).not.toContain('/opsx:new');
      expect(content).not.toContain('/opsx:apply');
    });

    it('should not transform instructions when callback is undefined', () => {
      const template = {
        name: 'no-transform-test',
        description: 'Test without transform',
        instructions: 'Use /opsx:new to start.',
      };

      const content = generateSkillContent(template, '0.23.0', undefined);

      expect(content).toContain('/opsx:new');
    });

    it('should support custom transformInstructions logic', () => {
      const template = {
        name: 'custom-transform',
        description: 'Test custom transform',
        instructions: 'Some PLACEHOLDER text here.',
      };

      const customTransformer = (text: string) => text.replace('PLACEHOLDER', 'REPLACED');
      const content = generateSkillContent(template, '0.23.0', customTransformer);

      expect(content).toContain('Some REPLACED text here.');
      expect(content).not.toContain('PLACEHOLDER');
    });
  });

  describe('review-spec template generation', () => {
    it('should generate review-spec skill template with correct structure', () => {
      const template = getReviewSpecSkillTemplate();

      expect(template.name).toBe('phspec-review-spec');
      expect(template.description).toBe('规格质量审查 - 检查规格的完整性、清晰度、可实施性和可测试性');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
      expect(template.compatibility).toBe('Requires phspec CLI.');
      expect(template.metadata?.author).toBe('phspec');
      expect(template.metadata?.version).toBe('1.0');
    });

    it('should have review-spec skill template in skill templates', () => {
      const templates = getSkillTemplates();
      const reviewSpecTemplate = templates.find(t => t.dirName === 'phspec-review-spec');

      expect(reviewSpecTemplate).toBeDefined();
      expect(reviewSpecTemplate?.template.name).toBe('phspec-review-spec');
    });

    it('should generate review-spec command template with correct structure', () => {
      const templates = getCommandTemplates();
      const reviewSpecTemplate = templates.find(t => t.id === 'review-spec');

      expect(reviewSpecTemplate).toBeDefined();
      expect(reviewSpecTemplate?.template.name).toBe('PHSX: Review Spec');
      expect(reviewSpecTemplate?.template.description).toBe('规格质量审查 - 检查规格的完整性、清晰度、可实施性和可测试性');
      expect(reviewSpecTemplate?.template.category).toBe('Review');
      expect(reviewSpecTemplate?.template.tags).toEqual(['review', 'spec', 'experimental']);
    });

    it('should generate review-spec command content with required elements', () => {
      const content = getReviewSpecCommandContent();

      expect(content).toBeTruthy();
      expect(content).toContain('审查规格质量');
      expect(content).toContain('完整性');
      expect(content).toContain('清晰度');
      expect(content).toContain('可实施性');
      expect(content).toContain('可测试性');
      expect(content).toContain('phspec status');
      expect(content).toContain('phspec list');
    });

    it('should have review-spec command in command contents', () => {
      const contents = getCommandContents();
      const reviewSpecContent = contents.find(c => c.id === 'review-spec');

      expect(reviewSpecContent).toBeDefined();
      expect(reviewSpecContent?.name).toBe('PHSX: Review Spec');
      expect(reviewSpecContent?.category).toBe('Review');
      expect(reviewSpecContent?.tags).toContain('review');
      expect(reviewSpecContent?.tags).toContain('spec');
    });
  });

  describe('review-code template generation', () => {
    it('should generate review-code skill template with correct structure', () => {
      const template = getReviewCodeSkillTemplate();

      expect(template.name).toBe('phspec-review-code');
      expect(template.description).toBe('代码规范了规性审查 - 验证代码实现与规格的一致性');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
      expect(template.compatibility).toBe('Requires phspec CLI.');
      expect(template.metadata?.author).toBe('phspec');
      expect(template.metadata?.version).toBe('1.0');
    });

    it('should have review-code skill template in skill templates', () => {
      const templates = getSkillTemplates();
      const reviewCodeTemplate = templates.find(t => t.dirName === 'phspec-review-code');

      expect(reviewCodeTemplate).toBeDefined();
      expect(reviewCodeTemplate?.template.name).toBe('phspec-review-code');
    });

    it('should have review-code command template in command templates', () => {
      const templates = getCommandTemplates();
      const reviewCodeTemplate = templates.find(t => t.id === 'review-code');

      expect(reviewCodeTemplate).toBeDefined();
      expect(reviewCodeTemplate?.template.name).toBe('PHSX: Review Code');
      expect(reviewCodeTemplate?.template.description).toBe('代码规范合规性审查 - 验证代码实现与规格的一致性');
      expect(reviewCodeTemplate?.template.category).toBe('Review');
      expect(reviewCodeTemplate?.template.tags).toEqual(['review', 'code', 'experimental']);
    });

    it('should have review-code command in command contents', () => {
      const contents = getCommandContents();
      const reviewCodeContent = contents.find(c => c.id === 'review-code');

      expect(reviewCodeContent).toBeDefined();
      expect(reviewCodeContent?.name).toBe('PHSX: Review Code');
      expect(reviewCodeContent?.category).toBe('Review');
      expect(reviewCodeContent?.tags).toContain('review');
      expect(reviewCodeContent?.tags).toContain('code');
    });
  });

  describe('review-design template generation', () => {
    it('should generate review-design skill template with correct structure', () => {
      const template = getReviewDesignSkillTemplate();

      expect(template.name).toBe('phspec-review-design');
      expect(template.description).toBe('设计一致性审查 - 检查设计方案与规格的关联性');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
      expect(template.compatibility).toBe('Requires phspec CLI.');
      expect(template.metadata?.author).toBe('phspec');
      expect(template.metadata?.version).toBe('1.0');
    });

    it('should have review-design skill template in skill templates', () => {
      const templates = getSkillTemplates();
      const reviewDesignTemplate = templates.find(t => t.dirName === 'phspec-review-design');

      expect(reviewDesignTemplate).toBeDefined();
      expect(reviewDesignTemplate?.template.name).toBe('phspec-review-design');
    });

    it('should have review-design command template in command templates', () => {
      const templates = getCommandTemplates();
      const reviewDesignTemplate = templates.find(t => t.id === 'review-design');

      expect(reviewDesignTemplate).toBeDefined();
      expect(reviewDesignTemplate?.template.name).toBe('PHSX: Review Design');
      expect(reviewDesignTemplate?.template.description).toBe('设计一致性审查 - 检查设计方案与规格的关联性');
      expect(reviewDesignTemplate?.template.category).toBe('Review');
      expect(reviewDesignTemplate?.template.tags).toEqual(['review', 'design', 'experimental']);
    });

    it('should have review-design command in command contents', () => {
      const contents = getCommandContents();
      const reviewDesignContent = contents.find(c => c.id === 'review-design');

      expect(reviewDesignContent).toBeDefined();
      expect(reviewDesignContent?.name).toBe('PHSX: Review Design');
      expect(reviewDesignContent?.category).toBe('Review');
      expect(reviewDesignContent?.tags).toContain('review');
      expect(reviewDesignContent?.tags).toContain('design');
    });

    it('should generate review-design command content with required elements', () => {
      const content = getReviewDesignCommandContent();

      expect(content).toBeTruthy();
      expect(content).toContain('审查设计一致性');
      expect(content).toContain('设计遵循度');
      expect(content).toContain('设计连贯性');
      expect(content).toContain('架构对齐');
      expect(content).toContain('可追溯性');
      expect(content).toContain('设计完整性');
      expect(content).toContain('phspec status');
      expect(content).toContain('design.md');
    });
  });

  describe('enhanced verify functionality', () => {
    it('should generate verify skill template with four dimensions', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.name).toBe('phspec-verify-change');
      expect(template.description).toBe('校验实现与变更制品是否一致。适用于归档前确认实现完整、正确且一致时。');
      expect(template.instructions).toBeTruthy();
      expect(template.license).toBe('MIT');
      expect(template.compatibility).toBe('Requires phspec CLI.');
      expect(template.metadata?.author).toBe('phspec');
      expect(template.metadata?.version).toBe('1.0');
    });

    it('should include code hygiene dimension in verify instructions', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.instructions).toContain('代码卫生');
      expect(template.instructions).toContain('四个维度建报告');
      expect(template.instructions).toContain('Completeness/Correctness/Coherence/CodeHygiene');
    });

    it('should include specification compliance matrix check', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.instructions).toContain('规范合规性矩阵');
      expect(template.instructions).toContain('SHALL、MUST、REQUIRED、WILL');
      expect(template.instructions).toContain('规范约束未实现');
    });

    it('should include code hygiene checks in instructions', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.instructions).toContain('重复代码');
      expect(template.instructions).toContain('错误处理');
      expect(template.instructions).toContain('注释质量');
      expect(template.instructions).toContain('命名规范');
    });

    it('should maintain suggestion-based approach (non-blocking)', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.instructions).toContain('建议式校验');
      expect(template.instructions).toContain('不强制阻塞归档');
      expect(template.instructions).toContain('仅提示建议');
      expect(template.instructions).toContain('不阻止用户归档');
    });

    it('should have structured report sections in verify instructions', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.instructions).toContain('摘要表');
      expect(template.instructions).toContain('CRITICAL');
      expect(template.instructions).toContain('WARNING');
      expect(template.instructions).toContain('SUGGESTION');
      expect(template.instructions).toContain('按优先级列问题');
    });

    it('should include specific suggestions for code hygiene issues', () => {
      const template = getVerifyChangeSkillTemplate();

      expect(template.instructions).toContain('考虑抽取为共用函数');
      expect(template.instructions).toContain('添加错误处理');
      expect(template.instructions).toContain('添加注释说明意图');
      expect(template.instructions).toContain('以符合项目规范');
    });
  });
});
