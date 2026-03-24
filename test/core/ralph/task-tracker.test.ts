import { describe, it, expect } from "vitest";
import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import {
  markTaskDoneByDescription,
  markTaskDoneById,
} from "../../../src/core/ralph/task-tracker.js";

async function createTasksFile(suffix: string, content: string): Promise<string> {
  const tracksPath = path.join(
    os.tmpdir(),
    `phspec-task-tracker-${Date.now()}-${suffix}.md`,
  );
  await fs.writeFile(tracksPath, content, "utf-8");
  return tracksPath;
}

describe("task-tracker", () => {
  it("marks a task done by checkbox index id", async () => {
    const tracksPath = await createTasksFile(
      "id",
      ["- [ ] task one", "- [ ] task two"].join("\n"),
    );

    const updated = await markTaskDoneById(tracksPath, "2");
    expect(updated).toBe(true);

    const content = await fs.readFile(tracksPath, "utf-8");
    expect(content).toContain("- [x] task two");
  });

  it("is idempotent when task is already marked done", async () => {
    const tracksPath = await createTasksFile(
      "idempotent",
      ["- [x] task one", "- [ ] task two"].join("\n"),
    );

    const updated = await markTaskDoneById(tracksPath, "1");
    expect(updated).toBe(true);

    const content = await fs.readFile(tracksPath, "utf-8");
    expect(content).toContain("- [x] task one");
  });

  it("falls back to description matching", async () => {
    const tracksPath = await createTasksFile(
      "desc",
      ["- [ ] implement login page", "- [ ] add tests"].join("\n"),
    );

    const updated = await markTaskDoneByDescription(tracksPath, "login page");
    expect(updated).toBe(true);

    const content = await fs.readFile(tracksPath, "utf-8");
    expect(content).toContain("- [x] implement login page");
  });
});
