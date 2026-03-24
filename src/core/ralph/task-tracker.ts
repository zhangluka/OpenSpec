import { promises as fs } from "node:fs";

const CHECKBOX_RE = /^([-*]\s*\[)([ xX])(\]\s*)(.+)\s*$/;

function updateTaskLine(line: string): string {
  const match = line.match(CHECKBOX_RE);
  if (!match) {
    return line;
  }
  return `${match[1]}x${match[3]}${match[4]}`;
}

async function writeFileAtomic(path: string, content: string): Promise<void> {
  const tempPath = `${path}.tmp-${Date.now()}`;
  await fs.writeFile(tempPath, content, "utf-8");
  await fs.rename(tempPath, path);
}

export async function markTaskDoneById(
  tracksPath: string,
  taskId: string,
): Promise<boolean> {
  const parsedIndex = Number.parseInt(taskId, 10);
  if (!Number.isFinite(parsedIndex) || parsedIndex <= 0) {
    return false;
  }

  const content = await fs.readFile(tracksPath, "utf-8");
  const lines = content.split("\n");

  let checkboxIndex = 0;
  let updated = false;
  for (let idx = 0; idx < lines.length; idx += 1) {
    if (!CHECKBOX_RE.test(lines[idx])) {
      continue;
    }
    checkboxIndex += 1;
    if (checkboxIndex === parsedIndex) {
      lines[idx] = updateTaskLine(lines[idx]);
      updated = true;
      break;
    }
  }

  if (!updated) {
    return false;
  }

  await writeFileAtomic(tracksPath, lines.join("\n"));
  return true;
}

export async function markTaskDoneByDescription(
  tracksPath: string,
  description: string,
): Promise<boolean> {
  const normalizedDescription = description.trim().toLowerCase();
  if (!normalizedDescription) {
    return false;
  }

  const content = await fs.readFile(tracksPath, "utf-8");
  const lines = content.split("\n");
  let updated = false;

  for (let idx = 0; idx < lines.length; idx += 1) {
    const match = lines[idx].match(CHECKBOX_RE);
    if (!match) {
      continue;
    }
    const lineDescription = match[4].trim().toLowerCase();
    const isMatch =
      lineDescription === normalizedDescription ||
      lineDescription.includes(normalizedDescription) ||
      normalizedDescription.includes(lineDescription);
    if (!isMatch) {
      continue;
    }
    lines[idx] = updateTaskLine(lines[idx]);
    updated = true;
    break;
  }

  if (!updated) {
    return false;
  }

  await writeFileAtomic(tracksPath, lines.join("\n"));
  return true;
}
