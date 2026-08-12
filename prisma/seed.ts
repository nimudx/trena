import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.task.deleteMany();
  await prisma.canvas.deleteMany();
  await prisma.diagram.deleteMany();
  await prisma.project.deleteMany();

  const personal = await prisma.project.create({
    data: {
      name: "Mi aplicación personal",
      description: "Rediseño del workspace personal con kanban, canvas y diagramas.",
      notes: "Objetivo: reducir fricción entre herramientas.\n\nPróxima iteración: integrar editor de canvas embebido.",
    },
  });

  const blog = await prisma.project.create({
    data: {
      name: "Blog técnico",
      description: "Migración del blog a un stack más simple.",
      notes: "Pendiente elegir motor de sitio estático.",
    },
  });

  const home = await prisma.project.create({
    data: {
      name: "Automatización doméstica",
      description: "Notas y diagramas de la red de sensores en casa.",
      notes: "Revisar cableado del sensor de puerta.",
    },
  });

  await prisma.task.createMany({
    data: [
      { title: "Definir esquema de datos", projectId: personal.id, status: "backlog", priority: "alta", tags: ["diseño"], order: 0 },
      { title: "Bocetar sidebar colapsable", projectId: personal.id, status: "progress", priority: "media", tags: ["ui"], order: 0 },
      { title: "Conectar editor de canvas", projectId: personal.id, status: "backlog", priority: "urgente", tags: ["integración"], order: 1, description: "Excalidraw embebido vía @excalidraw/excalidraw." },
      { title: "Revisar tipografía", projectId: personal.id, status: "done", priority: "baja", tags: ["ui"], order: 0 },
      { title: "Elegir generador estático", projectId: blog.id, status: "backlog", priority: "media", tags: ["research"], order: 0 },
      { title: "Migrar posts antiguos", projectId: blog.id, status: "progress", priority: "alta", tags: ["contenido"], order: 0 },
      { title: "Configurar dominio", projectId: blog.id, status: "done", priority: "baja", tags: [], order: 0 },
      { title: "Mapear sensores existentes", projectId: home.id, status: "backlog", priority: "media", tags: ["research"], order: 0 },
      { title: "Diagramar red actual", projectId: home.id, status: "progress", priority: "alta", tags: ["diagrama"], order: 0 },
      { title: "Revisar cableado sensor puerta", projectId: home.id, status: "backlog", priority: "urgente", tags: ["bug"], order: 1, description: "El sensor pierde señal intermitente." },
    ],
  });

  await prisma.canvas.createMany({
    data: [
      { name: "Mapa del producto", projectId: personal.id },
      { name: "Flujo de onboarding", projectId: personal.id },
      { name: "Ideas de portada", projectId: blog.id },
      { name: "Layout del hub casero", projectId: home.id },
    ],
  });

  await prisma.diagram.createMany({
    data: [
      { name: "Arquitectura de datos", projectId: personal.id },
      { name: "Flujo de publicación", projectId: blog.id },
      { name: "Red de sensores", projectId: home.id },
      { name: "Estados de tarea", projectId: personal.id },
    ],
  });

  console.log("Seed completo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
