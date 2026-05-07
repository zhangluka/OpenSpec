/**
 * Tool Detection Utilities
 *
 * Shared utilities for detecting tool configurations and version status.
 */

import path from 'path';
import * as fs from 'fs';
import { AI_TOOLS } from '../config.js';

/**
 * Names of skill directories created by openspec init.
 */
export const SKILL_NAMES = [
  'phspec-explore',
  'phspec-new-change',
  'phspec-continue-change',
  'phspec-apply-change',
  'phspec-ff-change',
  'phspec-sync-specs',
  'phspec-archive-change',
  'phspec-bulk-archive-change',
  'phspec-verify-change',
  'phspec-review-spec',
  'phspec-review-code',
  'phspec-review-design',
  'phspec-onboard',
] as const;

export type SkillName = (typeof SKILL_NAMES)[number];

/**
 * Core OpenSpec commands that should be available across all AI tools.
 * These are tool-agnostic fundamental features, not Claude-specific.
 */
export const CORE_COMMANDS = [
  'review-spec',
  'review-code',
  'review-design',
] as const;

export type CoreCommand = (typeof CORE_COMMANDS)[number];

/**
 * Check if a command is a core command.
 * @param command - The command identifier (e.g., 'review-spec')
 * @returns True if command is a core command
 */
export function isCoreCommand(command: string): boolean {
  return CORE_COMMANDS.includes(command as CoreCommand);
}

/**
 * Status of skill configuration for a tool.
 */
export interface ToolSkillStatus {
  /** Whether the tool has any skills configured */
  configured: boolean;
  /** Whether all 9 skills are configured */
  fullyConfigured: boolean;
  /** Number of skills currently configured (0-9) */
  skillCount: number;
}

/**
 * Version information for a tool's skills.
 */
export interface ToolVersionStatus {
  /** The tool ID */
  toolId: string;
  /** The tool's display name */
  toolName: string;
  /** Whether the tool has any skills configured */
  configured: boolean;
  /** The generatedBy version found in the skill files, or null if not found */
  generatedByVersion: string | null;
  /** Whether the tool needs updating (version mismatch or missing) */
  needsUpdate: boolean;
}

/**
 * Gets the list of tools with skillsDir configured.
 */
export function getToolsWithSkillsDir(): string[] {
  return AI_TOOLS.filter((t) => t.skillsDir).map((t) => t.value);
}

/**
 * Checks which skill files exist for a tool.
 */
export function getToolSkillStatus(projectRoot: string, toolId: string): ToolSkillStatus {
  const tool = AI_TOOLS.find((t) => t.value === toolId);
  if (!tool?.skillsDir) {
    return { configured: false, fullyConfigured: false, skillCount: 0 };
  }

  const skillsDir = path.join(projectRoot, tool.skillsDir, 'skills');
  let skillCount = 0;

  for (const skillName of SKILL_NAMES) {
    const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      skillCount++;
    }
  }

  return {
    configured: skillCount > 0,
    fullyConfigured: skillCount === SKILL_NAMES.length,
    skillCount,
  };
}

/**
 * Gets the skill status for all tools with skillsDir configured.
 */
export function getToolStates(projectRoot: string): Map<string, ToolSkillStatus> {
  const states = new Map<string, ToolSkillStatus>();
  const toolIds = AI_TOOLS.filter((t) => t.skillsDir).map((t) => t.value);

  for (const toolId of toolIds) {
    states.set(toolId, getToolSkillStatus(projectRoot, toolId));
  }

  return states;
}

/**
 * Extracts the generatedBy version from a skill file's YAML frontmatter.
 * Returns null if the field is not found or the file doesn't exist.
 */
export function extractGeneratedByVersion(skillFilePath: string): string | null {
  try {
    if (!fs.existsSync(skillFilePath)) {
      return null;
    }

    const content = fs.readFileSync(skillFilePath, 'utf-8');

    // Look for generatedBy in the YAML frontmatter
    // The file format is:
    // ---
    // ...
    // metadata:
    //   author: openspec
    //   version: "1.0"
    //   generatedBy: "0.23.0"
    // ---
    const generatedByMatch = content.match(/^\s*generatedBy:\s*["']?([^"'\n]+)["']?\s*$/m);

    if (generatedByMatch && generatedByMatch[1]) {
      return generatedByMatch[1].trim();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Gets version status for a tool by reading the first available skill file.
 */
export function getToolVersionStatus(
  projectRoot: string,
  toolId: string,
  currentVersion: string
): ToolVersionStatus {
  const tool = AI_TOOLS.find((t) => t.value === toolId);
  if (!tool?.skillsDir) {
    return {
      toolId,
      toolName: toolId,
      configured: false,
      generatedByVersion: null,
      needsUpdate: false,
    };
  }

  const skillsDir = path.join(projectRoot, tool.skillsDir, 'skills');
  let generatedByVersion: string | null = null;

  // Find the first skill file that exists and read its version
  for (const skillName of SKILL_NAMES) {
    const skillFile = path.join(skillsDir, skillName, 'SKILL.md');
    if (fs.existsSync(skillFile)) {
      generatedByVersion = extractGeneratedByVersion(skillFile);
      break;
    }
  }

  const configured = getToolSkillStatus(projectRoot, toolId).configured;
  const needsUpdate = configured && (generatedByVersion === null || generatedByVersion !== currentVersion);

  return {
    toolId,
    toolName: tool.name,
    configured,
    generatedByVersion,
    needsUpdate,
  };
}

/**
 * Gets all configured tools in the project.
 */
export function getConfiguredTools(projectRoot: string): string[] {
  return AI_TOOLS
    .filter((t) => t.skillsDir && getToolSkillStatus(projectRoot, t.value).configured)
    .map((t) => t.value);
}

/**
 * Gets version status for all configured tools.
 */
export function getAllToolVersionStatus(
  projectRoot: string,
  currentVersion: string
): ToolVersionStatus[] {
  const configuredTools = getConfiguredTools(projectRoot);
  return configuredTools.map((toolId) =>
    getToolVersionStatus(projectRoot, toolId, currentVersion)
  );
}
