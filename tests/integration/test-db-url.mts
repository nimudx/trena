export const TEST_DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://trena:trena@localhost:5433/trena?schema=test_integration";
