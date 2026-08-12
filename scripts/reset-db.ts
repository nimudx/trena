import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  await prisma.task.deleteMany();
  await prisma.canvas.deleteMany();
  await prisma.diagram.deleteMany();
  await prisma.project.deleteMany();

  await prisma.$disconnect();
}

main();
