import { describe, it, expect } from 'vitest';
import path from 'path';
import { generateCommand, generateCommands } from '../../../src/core/command-generation/generator.js';
import { claudeAdapter } from '../../../src/core/command-generation/adapters/claude.js';
import type { CommandContent, ToolCommandAdapter } from '../../../src/core/command-generation/types.js';
import { isCoreCommand } from '../../../src/core/shared/tool-detection.js';

describe('command-generation/generator', () => {
  const sampleContent: CommandContent = {
    id: 'explore',
    name: 'OpenSpec Explore',
    description: 'Enter explore mode',
    category: 'Workflow',
    tags: ['workflow'],
    body: 'Command body here.',
  };

  describe('generateCommand', () => {
    it('should generate command with path and content using Claude adapter', () => {
      const result = generateCommand(sampleContent, claudeAdapter);

      expect(result.path).toContain('.claude');
      expect(result.path).toContain('explore.md');
      expect(result.fileContent).toContain('name: OpenSpec Explore');
      expect(result.fileContent).toContain('Command body here.');
    });
  });

  describe('generateCommands', () => {
    it('should generate multiple commands', () => {
      const contents: CommandContent[] = [
        { ...sampleContent, id: 'explore', name: 'Explore' },
        { ...sampleContent, id: 'new', name: 'New' },
        { ...sampleContent, id: 'apply', name: 'Apply' },
      ];

      const results = generateCommands(contents, claudeAdapter);

      expect(results).toHaveLength(3);
      expect(results[0].path).toContain('explore.md');
      expect(results[1].path).toContain('new.md');
      expect(results[2].path).toContain('apply.md');
    });

    it('should return empty array for empty input', () => {
      const results = generateCommands([], claudeAdapter);
      expect(results).toEqual([]);
    });

    it('should preserve order of input', () => {
      const contents: CommandContent[] = [
        { ...sampleContent, id: 'c', name: 'C' },
        { ...sampleContent, id: 'a', name: 'A' },
        { ...sampleContent, id: 'b', name: 'B' },
      ];

      const results = generateCommands(contents, claudeAdapter);

      expect(results[0].path).toContain('c.md');
      expect(results[1].path).toContain('a.md');
      expect(results[2].path).toContain('b.md');
    });

    it('should generate each command independently', () => {
      const contents: CommandContent[] = [
        { id: 'a', name: 'A', description: 'DA', category: 'C1', tags: ['t1'], body: 'B1' },
        { id: 'b', name: 'B', description: 'DB', category: 'C2', tags: ['t2'], body: 'B2' },
      ];

      const results = generateCommands(contents, claudeAdapter);

      expect(results[0].fileContent).toContain('name: A');
      expect(results[0].fileContent).toContain('B1');
      expect(results[0].fileContent).not.toContain('name: B');

      expect(results[1].fileContent).toContain('name: B');
      expect(results[1].fileContent).toContain('B2');
      expect(results[1].fileContent).not.toContain('name: A');
    });
  });

  describe('core command generation logic', () => {
    it('should identify core commands correctly', () => {
      expect(isCoreCommand('review-spec')).toBe(true);
      expect(isCoreCommand('review-code')).toBe(true);
      expect(isCoreCommand('review-design')).toBe(true);
      expect(isCoreCommand('explore')).toBe(false);
      expect(isCoreCommand('verify')).toBe(false);
      expect(isCoreCommand('unknown')).toBe(false);
    });

    it('should handle core command paths correctly', () => {
      const coreCommand: CommandContent = {
        id: 'review-spec',
        name: 'PHSX: Review Spec',
        description: 'Specification quality review',
        category: 'Review',
        tags: ['review', 'spec'],
        body: 'Review spec content',
      };

      const result = generateCommand(coreCommand, claudeAdapter);

      expect(result.path).toContain('.claude');
      expect(result.path).toContain('review-spec.md');
      expect(result.path).toContain(path.join('.claude', 'commands', 'phsx', 'review-spec.md'));
    });

    it('should handle multiple core commands', () => {
      const coreCommands: CommandContent[] = [
        { id: 'review-spec', name: 'Review Spec', description: 'Spec review', category: 'Review', tags: ['review', 'spec'], body: 'Spec content' },
        { id: 'review-code', name: 'Review Code', description: 'Code review', category: 'Review', tags: ['review', 'code'], body: 'Code content' },
        { id: 'review-design', name: 'Review Design', description: 'Design review', category: 'Review', tags: ['review', 'design'], body: 'Design content' },
      ];

      const results = generateCommands(coreCommands, claudeAdapter);

      expect(results).toHaveLength(3);

      const reviewSpecResult = results.find(r => r.path.includes('review-spec'));
      const reviewCodeResult = results.find(r => r.path.includes('review-code'));
      const reviewDesignResult = results.find(r => r.path.includes('review-design'));

      expect(reviewSpecResult).toBeDefined();
      expect(reviewCodeResult).toBeDefined();
      expect(reviewDesignResult).toBeDefined();

      expect(reviewSpecResult?.fileContent).toContain('name: Review Spec');
      expect(reviewCodeResult?.fileContent).toContain('name: Review Code');
      expect(reviewDesignResult?.fileContent).toContain('name: Review Design');
    });

    it('should handle mixed core and non-core commands', () => {
      const commands: CommandContent[] = [
        { id: 'review-spec', name: 'Review Spec', description: 'Spec review', category: 'Review', tags: ['review', 'spec'], body: 'Spec content' },
        { id: 'explore', name: 'Explore', description: 'Explore mode', category: 'Workflow', tags: ['workflow'], body: 'Explore content' },
        { id: 'review-code', name: 'Review Code', description: 'Code review', category: 'Review', tags: ['review', 'code'], body: 'Code content' },
      ];

      const results = generateCommands(commands, claudeAdapter);

      expect(results).toHaveLength(3);

      commands.forEach(cmd => {
        const result = results.find(r => r.path.includes(cmd.id));
        expect(result).toBeDefined();
        expect(result?.fileContent).toContain(`name: ${cmd.name}`);
      });
    });

    it('should handle empty array for core commands', () => {
      const results = generateCommands([], claudeAdapter);
      expect(results).toEqual([]);
    });
  });
});
