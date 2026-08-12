export const E2E_DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  "postgresql://trena:trena@localhost:5433/trena?schema=e2e";
