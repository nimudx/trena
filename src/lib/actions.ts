"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { TaskPriorityKey, TaskStatusKey } from "@/lib/format";

function revalidateEverywhere(projectId?: string) {
  revalidatePath("/");
  revalidatePath("/tasks");
  revalidatePath("/canvas");
  revalidatePath("/diagrams");
  revalidatePath("/projects");
  if (projectId) revalidatePath(`/projects/${projectId}`);
}

// ----- Projects -----

export async function createProject(input: { name: string; description: string }) {
  const name = input.name.trim();
  if (!name) throw new Error("El nombre del proyecto es obligatorio.");
  const project = await prisma.project.create({
    data: { name, description: input.description.trim() },
  });
  revalidateEverywhere();
  return project;
}

export async function updateProjectNotes(projectId: string, notes: string) {
  await prisma.project.update({ where: { id: projectId }, data: { notes } });
  revalidatePath(`/projects/${projectId}`);
}

// ----- Tasks -----

export type TaskInput = {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatusKey;
  priority: TaskPriorityKey;
  due: string | null;
  tags: string[];
};

export async function createTask(input: TaskInput) {
  const title = input.title.trim();
  if (!title) throw new Error("El título de la tarea es obligatorio.");
  const task = await prisma.task.create({
    data: {
      title,
      description: input.description.trim(),
      projectId: input.projectId,
      status: input.status,
      priority: input.priority,
      due: input.due ? new Date(input.due) : null,
      tags: input.tags,
    },
  });
  revalidateEverywhere(input.projectId);
  return task;
}

export async function updateTask(id: string, input: TaskInput) {
  const title = input.title.trim();
  if (!title) throw new Error("El título de la tarea es obligatorio.");
  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description: input.description.trim(),
      projectId: input.projectId,
      status: input.status,
      priority: input.priority,
      due: input.due ? new Date(input.due) : null,
      tags: input.tags,
    },
  });
  revalidateEverywhere(input.projectId);
  return task;
}

export async function deleteTask(id: string) {
  const task = await prisma.task.delete({ where: { id } });
  revalidateEverywhere(task.projectId);
}

export async function moveTask(id: string, status: TaskStatusKey) {
  const task = await prisma.task.update({ where: { id }, data: { status } });
  revalidateEverywhere(task.projectId);
}

// ----- Canvas -----

export async function createCanvas(projectId: string) {
  const count = await prisma.canvas.count({ where: { projectId } });
  const canvas = await prisma.canvas.create({
    data: { name: `Canvas sin título ${count + 1}`, projectId },
  });
  revalidateEverywhere(projectId);
  return canvas;
}

export async function updateCanvas(
  id: string,
  input: { scene?: unknown; thumbnail?: string; name?: string }
) {
  const canvas = await prisma.canvas.update({
    where: { id },
    data: {
      ...(input.scene !== undefined ? { scene: input.scene as object } : {}),
      ...(input.thumbnail !== undefined ? { thumbnail: input.thumbnail } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
    },
  });
  revalidatePath("/canvas");
  revalidatePath(`/projects/${canvas.projectId}`);
  return canvas;
}

export async function deleteCanvas(id: string) {
  const canvas = await prisma.canvas.delete({ where: { id } });
  revalidateEverywhere(canvas.projectId);
}

// ----- Diagrams -----

export async function createDiagram(projectId: string) {
  const count = await prisma.diagram.count({ where: { projectId } });
  const diagram = await prisma.diagram.create({
    data: { name: `Diagrama sin título ${count + 1}`, projectId },
  });
  revalidateEverywhere(projectId);
  return diagram;
}

export async function updateDiagram(
  id: string,
  input: { xml?: string; name?: string }
) {
  const diagram = await prisma.diagram.update({
    where: { id },
    data: {
      ...(input.xml !== undefined ? { xml: input.xml } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
    },
  });
  revalidatePath("/diagrams");
  revalidatePath(`/projects/${diagram.projectId}`);
  return diagram;
}

export async function deleteDiagram(id: string) {
  const diagram = await prisma.diagram.delete({ where: { id } });
  revalidateEverywhere(diagram.projectId);
}
