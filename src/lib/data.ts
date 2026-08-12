import { prisma } from "@/lib/prisma";

export async function getHomeSummary() {
  const [pending, progress, canvases, diagrams] = await Promise.all([
    prisma.task.count({ where: { status: "backlog" } }),
    prisma.task.count({ where: { status: "progress" } }),
    prisma.canvas.count(),
    prisma.diagram.count(),
  ]);
  return { pending, progress, canvases, diagrams };
}

export async function getRecentProjects(limit = 3) {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      _count: { select: { tasks: true, canvases: true, diagrams: true } },
    },
  });
  return projects;
}

export async function getAllProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { tasks: true, canvases: true, diagrams: true } },
    },
  });
  return projects;
}

export async function getProjectOptions() {
  return prisma.project.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getAllTasks() {
  return prisma.task.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { project: { select: { id: true, name: true } } },
  });
}

export async function getProjectDetail(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
      canvases: { orderBy: { updatedAt: "desc" } },
      diagrams: { orderBy: { updatedAt: "desc" } },
    },
  });
}

export async function getAllCanvases() {
  return prisma.canvas.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { id: true, name: true } } },
  });
}

export async function getCanvas(id: string) {
  return prisma.canvas.findUnique({
    where: { id },
    include: { project: { select: { id: true, name: true } } },
  });
}

export async function getAllDiagrams() {
  return prisma.diagram.findMany({
    orderBy: { updatedAt: "desc" },
    include: { project: { select: { id: true, name: true } } },
  });
}

export async function getDiagram(id: string) {
  return prisma.diagram.findUnique({
    where: { id },
    include: { project: { select: { id: true, name: true } } },
  });
}
