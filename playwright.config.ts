import { defineConfig, devices } from "@playwright/test";
import { E2E_DATABASE_URL } from "./e2e/test-db-url";

const PORT = process.env.E2E_PORT ?? "3100";
const baseURL = `http://localhost:${PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e",
  // DB migration/reset runs via `pretest:e2e` (see package.json), not
  // Playwright's globalSetup: the webServer plugin starts before globalSetup
  // does, so migrating there would race the `next build && next start` below.
  // Tests share one Postgres schema (see e2e/test-db-url.ts) with no per-test
  // isolation, so they run serially to avoid racing each other's data.
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // `next dev` refuses to run twice in the same project directory (even on
    // a different port), so e2e always builds + starts a production server —
    // this also keeps it from ever touching the `make dev` dev server or its DB.
    command: `pnpm exec next build && pnpm exec next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    env: {
      DATABASE_URL: E2E_DATABASE_URL,
      NEXT_DIST_DIR: ".next-e2e",
    },
  },
});
