/**
 * DevAgent Command Adapter
 *
 * DevAgent is a Cline-compatible fork; it uses the same workflow format
 * (markdown headers, no YAML frontmatter) but with different directory names.
 * File path: .devagentrules/workflows/opsx-<id>.md
 */

import path from "path";
import type { CommandContent, ToolCommandAdapter } from "../types.js";

/**
 * DevAgent adapter for command generation.
 * File path: .devagentrules/workflows/opsx-<id>.md
 * Format: Markdown header with description (same as Cline)
 */
export const devagentAdapter: ToolCommandAdapter = {
  toolId: "devagent",

  getFilePath(commandId: string): string {
    return path.join(".devagentrules", "workflows", `opsx-${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    return `# ${content.name}

${content.description}

${content.body}
`;
  },
};
