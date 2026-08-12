import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createProject,
  updateProjectNotes,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  createCanvas,
  updateCanvas,
  deleteCanvas,
  createDiagram,
  updateDiagram,
  deleteDiagram,
} from "@/lib/actions";
import { getProjectDetail } from "@/lib/data";

async function makeProject(name = "Test project") {
  return createProject({ name, description: "" });
}

describe("projects", () => {
  it("creates a project and trims its name", async () => {
    const project = await createProject({ name: "  My project  ", description: "d" });
    expect(project.name).toBe("My project");
    expect(project.description).toBe("d");
  });

  it("rejects an empty name", async () => {
    await expect(createProject({ name: "   ", description: "" })).rejects.toThrow(
      /obligatorio/
    );
  });

  it("updates project notes", async () => {
    const project = await makeProject();
    await updateProjectNotes(project.id, "some notes");
    const updated = await prisma.project.findUniqueOrThrow({ where: { id: project.id } });
    expect(updated.notes).toBe("some notes");
  });
});

describe("tasks", () => {
  it("creates a task attached to its project", async () => {
    const project = await makeProject();
    const task = await createTask({
      title: "Write tests",
      description: "",
      projectId: project.id,
      status: "backlog",
      priority: "alta",
      due: "2026-09-01",
      tags: ["ci"],
    });

    expect(task.projectId).toBe(project.id);
    expect(task.status).toBe("backlog");
    expect(task.due).toEqual(new Date("2026-09-01"));

    const detail = await getProjectDetail(project.id);
    expect(detail?.tasks).toHaveLength(1);
  });

  it("rejects an empty title", async () => {
    const project = await makeProject();
    await expect(
      createTask({
        title: "  ",
        description: "",
        projectId: project.id,
        status: "backlog",
        priority: "media",
        due: null,
        tags: [],
      })
    ).rejects.toThrow(/obligatorio/);
  });

  it("rejects an empty title on update", async () => {
    const project = await makeProject();
    const task = await createTask({
      title: "Valid title",
      description: "",
      projectId: project.id,
      status: "backlog",
      priority: "media",
      due: null,
      tags: [],
    });

    await expect(
      updateTask(task.id, {
        title: "   ",
        description: "",
        projectId: project.id,
        status: "backlog",
        priority: "media",
        due: null,
        tags: [],
      })
    ).rejects.toThrow(/obligatorio/);
  });

  it("moves a task between statuses", async () => {
    const project = await makeProject();
    const task = await createTask({
      title: "Ship feature",
      description: "",
      projectId: project.id,
      status: "backlog",
      priority: "media",
      due: null,
      tags: [],
    });

    await moveTask(task.id, "progress");
    const moved = await prisma.task.findUniqueOrThrow({ where: { id: task.id } });
    expect(moved.status).toBe("progress");
  });

  it("updates and deletes a task", async () => {
    const project = await makeProject();
    const task = await createTask({
      title: "Old title",
      description: "",
      projectId: project.id,
      status: "backlog",
      priority: "baja",
      due: null,
      tags: [],
    });

    const updated = await updateTask(task.id, {
      title: "New title",
      description: "updated",
      projectId: project.id,
      status: "done",
      priority: "urgente",
      due: "2026-10-15",
      tags: ["a", "b"],
    });
    expect(updated.title).toBe("New title");
    expect(updated.status).toBe("done");
    expect(updated.due).toEqual(new Date("2026-10-15"));

    await deleteTask(task.id);
    await expect(prisma.task.findUniqueOrThrow({ where: { id: task.id } })).rejects.toThrow();
  });
});

describe("canvases", () => {
  it("auto-numbers new canvases per project", async () => {
    const project = await makeProject();
    const first = await createCanvas(project.id);
    const second = await createCanvas(project.id);

    expect(first.name).toBe("Canvas sin título 1");
    expect(second.name).toBe("Canvas sin título 2");
  });

  it("updates and deletes a canvas", async () => {
    const project = await makeProject();
    const canvas = await createCanvas(project.id);

    const updated = await updateCanvas(canvas.id, { name: "Renamed", scene: { a: 1 } });
    expect(updated.name).toBe("Renamed");

    const withThumbnail = await updateCanvas(canvas.id, {
      thumbnail: "data:image/png;base64,AAA",
    });
    expect(withThumbnail.thumbnail).toBe("data:image/png;base64,AAA");
    expect(withThumbnail.name).toBe("Renamed");

    await deleteCanvas(canvas.id);
    await expect(prisma.canvas.findUniqueOrThrow({ where: { id: canvas.id } })).rejects.toThrow();
  });
});

describe("diagrams", () => {
  it("auto-numbers new diagrams per project", async () => {
    const project = await makeProject();
    const first = await createDiagram(project.id);
    const second = await createDiagram(project.id);

    expect(first.name).toBe("Diagrama sin título 1");
    expect(second.name).toBe("Diagrama sin título 2");
  });

  it("updates and deletes a diagram", async () => {
    const project = await makeProject();
    const diagram = await createDiagram(project.id);

    const updated = await updateDiagram(diagram.id, { xml: "<xml/>" });
    expect(updated.xml).toBe("<xml/>");

    const withName = await updateDiagram(diagram.id, { name: "Renamed diagram" });
    expect(withName.name).toBe("Renamed diagram");
    expect(withName.xml).toBe("<xml/>");

    await deleteDiagram(diagram.id);
    await expect(
      prisma.diagram.findUniqueOrThrow({ where: { id: diagram.id } })
    ).rejects.toThrow();
  });
});

describe("cascade delete", () => {
  it("removes tasks, canvases and diagrams when their project is deleted", async () => {
    const project = await makeProject();
    await createTask({
      title: "t",
      description: "",
      projectId: project.id,
      status: "backlog",
      priority: "media",
      due: null,
      tags: [],
    });
    await createCanvas(project.id);
    await createDiagram(project.id);

    await prisma.project.delete({ where: { id: project.id } });

    expect(await prisma.task.count({ where: { projectId: project.id } })).toBe(0);
    expect(await prisma.canvas.count({ where: { projectId: project.id } })).toBe(0);
    expect(await prisma.diagram.count({ where: { projectId: project.id } })).toBe(0);
  });
});
