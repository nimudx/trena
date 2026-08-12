import { describe, expect, it } from "vitest";
import { createCanvas, createDiagram, createProject, createTask } from "@/lib/actions";
import {
  getAllCanvases,
  getAllDiagrams,
  getAllProjects,
  getAllTasks,
  getCanvas,
  getDiagram,
  getHomeSummary,
  getProjectDetail,
  getProjectOptions,
  getRecentProjects,
} from "@/lib/data";

async function seedProjectWithTask(status: "backlog" | "progress" | "done" = "backlog") {
  const project = await createProject({ name: "Data project", description: "" });
  const task = await createTask({
    title: "Read task",
    description: "",
    projectId: project.id,
    status,
    priority: "media",
    due: null,
    tags: [],
  });
  return { project, task };
}

describe("getHomeSummary", () => {
  it("counts pending and in-progress tasks plus canvases and diagrams", async () => {
    const { project } = await seedProjectWithTask("backlog");
    await createTask({
      title: "In progress",
      description: "",
      projectId: project.id,
      status: "progress",
      priority: "media",
      due: null,
      tags: [],
    });
    await createCanvas(project.id);
    await createDiagram(project.id);

    const summary = await getHomeSummary();
    expect(summary).toEqual({ pending: 1, progress: 1, canvases: 1, diagrams: 1 });
  });
});

describe("project reads", () => {
  it("lists recent projects up to the given limit", async () => {
    await createProject({ name: "A", description: "" });
    await createProject({ name: "B", description: "" });
    await createProject({ name: "C", description: "" });

    const recent = await getRecentProjects(2);
    expect(recent).toHaveLength(2);
  });

  it("lists all projects with counts", async () => {
    const { project } = await seedProjectWithTask();
    await createCanvas(project.id);

    const all = await getAllProjects();
    const found = all.find((p) => p.id === project.id);
    expect(found?._count.tasks).toBe(1);
    expect(found?._count.canvases).toBe(1);
  });

  it("returns project id/name options", async () => {
    const project = await createProject({ name: "Options project", description: "" });
    const options = await getProjectOptions();
    expect(options.some((o) => o.id === project.id && o.name === "Options project")).toBe(true);
  });

  it("returns full project detail with related records", async () => {
    const { project, task } = await seedProjectWithTask();
    const detail = await getProjectDetail(project.id);
    expect(detail?.tasks.map((t) => t.id)).toContain(task.id);
  });

  it("returns null for a missing project", async () => {
    const detail = await getProjectDetail("does-not-exist");
    expect(detail).toBeNull();
  });
});

describe("task reads", () => {
  it("lists all tasks across projects with their project info", async () => {
    const { project, task } = await seedProjectWithTask();
    const tasks = await getAllTasks();
    const found = tasks.find((t) => t.id === task.id);
    expect(found?.project.id).toBe(project.id);
  });
});

describe("canvas reads", () => {
  it("lists all canvases and fetches a single one", async () => {
    const project = await createProject({ name: "Canvas project", description: "" });
    const canvas = await createCanvas(project.id);

    const all = await getAllCanvases();
    expect(all.some((c) => c.id === canvas.id)).toBe(true);

    const single = await getCanvas(canvas.id);
    expect(single?.project.id).toBe(project.id);
  });

  it("returns null for a missing canvas", async () => {
    expect(await getCanvas("does-not-exist")).toBeNull();
  });
});

describe("diagram reads", () => {
  it("lists all diagrams and fetches a single one", async () => {
    const project = await createProject({ name: "Diagram project", description: "" });
    const diagram = await createDiagram(project.id);

    const all = await getAllDiagrams();
    expect(all.some((d) => d.id === diagram.id)).toBe(true);

    const single = await getDiagram(diagram.id);
    expect(single?.project.id).toBe(project.id);
  });

  it("returns null for a missing diagram", async () => {
    expect(await getDiagram("does-not-exist")).toBeNull();
  });
});
