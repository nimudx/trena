import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const schema = databaseUrl
    ? (new URL(databaseUrl).searchParams.get("schema") ?? undefined)
    : undefined;
  const adapter = new PrismaPg({ connectionString: databaseUrl }, { schema });
  const prisma = new PrismaClient({ adapter });

  await prisma.task.deleteMany();
  await prisma.canvas.deleteMany();
  await prisma.diagram.deleteMany();
  await prisma.project.deleteMany();

  await prisma.$disconnect();
}

main();
