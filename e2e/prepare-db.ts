import { execSync } from "node:child_process";
import { E2E_DATABASE_URL } from "./test-db-url";

const env = { ...process.env, DATABASE_URL: E2E_DATABASE_URL };
execSync("pnpm exec prisma migrate deploy", { stdio: "inherit", env });
execSync("pnpm exec tsx scripts/reset-db.ts", { stdio: "inherit", env });
