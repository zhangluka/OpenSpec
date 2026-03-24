import { describe, expect, it } from "vitest";
import {
  getCommandContents,
  getSkillTemplates,
} from "../../../src/core/shared/skill-generation.js";

describe("apply-ralph registration", () => {
  it("registers apply-ralph skill template", () => {
    const skillDirs = getSkillTemplates().map((x) => x.dirName);
    expect(skillDirs).toContain("phspec-apply-ralph");
  });

  it("registers apply-ralph command content", () => {
    const commandIds = getCommandContents().map((x) => x.id);
    expect(commandIds).toContain("apply-ralph");
  });
});
