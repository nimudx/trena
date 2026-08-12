# Workspace

Personal, self-hosted hub for organizing projects: tasks (kanban), a free-form
canvas (Excalidraw), and structured diagrams (draw.io).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- shadcn/ui (Nova preset, on top of Base UI) + Lucide Icons
- Prisma 7 + PostgreSQL (Docker)
- `@excalidraw/excalidraw` embedded for Canvas
- `embed.diagrams.net` embedded (iframe + postMessage) for Diagrams

## Requirements

- Node.js 20+
- pnpm
- Docker (for Postgres)

## First run

```bash
# 1. Start Postgres
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Create the database schema
pnpm exec prisma migrate dev

# 4. (Optional) load sample data
pnpm db:seed

# 5. Start the app
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

You can also use the `Makefile`: `make dev` brings up Postgres and the app in
the background (`make stop` / `make down` to stop them, `make logs` /
`make status` to inspect them).

## Environment variables

See `.env.example`. By default:

```
DATABASE_URL="postgresql://trena:trena@localhost:5433/trena?schema=public"
```

Postgres' host port is `5433` (not `5432`) so it doesn't clash with any other
Postgres containers you might already have running locally.

Diagrams defaults to the public `https://embed.diagrams.net` embed. If you'd
rather run your own self-hosted draw.io instance (Docker image
`jgraph/drawio`), set `NEXT_PUBLIC_DRAWIO_URL` to point at it.

## Scripts

- `pnpm dev` — development server
- `pnpm build` / `pnpm start` — production build and start
- `pnpm typecheck` / `pnpm lint` — type checking and linting
- `pnpm test` / `pnpm test:coverage` — unit tests (Vitest)
- `pnpm test:integration` / `pnpm test:integration:coverage` — integration tests (Vitest + real Postgres, see below)
- `pnpm test:e2e` — e2e tests (Playwright, see below)
- `pnpm db:seed` — resets the database with sample data
- `pnpm db:studio` — opens Prisma Studio to inspect the database

## Testing

Three layers, all running against real Postgres (no mocked Prisma) to catch
query/migration issues before production:

- **Unit** (`pnpm test` / `src/lib/**/*.test.ts`) — pure functions, no DB.
- **Integration** (`pnpm test:integration` / `tests/integration/`) — server
  actions and reads (`src/lib/actions.ts`, `src/lib/data.ts`) against the
  Postgres from `docker-compose.yml`, isolated in the `test_integration`
  schema so it never touches your dev data. Migrations are applied
  automatically.
- **E2E** (`pnpm test:e2e` / `e2e/`) — real user flows with Playwright against
  a production build of their own (`next build && next start`) on port
  `3100`, with its own `e2e` schema. Uses build+start instead of `next dev`
  because Next.js 16 refuses to run two `next dev` servers in the same
  project.

Coverage (`pnpm test:coverage`, `pnpm test:integration:coverage`) is scoped to
the code each layer actually exercises — `src/lib/{format,utils}.ts` for unit,
`src/lib/{actions,data}.ts` for integration — and gated at 80%
lines/branches/functions/statements; a run fails if it drops below that.

Requires Postgres up (`make up` or `docker compose up -d`). Also available:
`make test`, `make test-integration`, `make test-e2e`, `make test-all`.

CI (`.github/workflows/ci.yml`) runs lint, typecheck, and all three test
layers on every push/PR to `main`, each with its own Postgres service
container.

## Structure

- `src/app/(app)/` — sidebar screens: Home, Tasks, Canvas, Diagrams,
  Projects, Services
- `src/app/canvas/[id]/` and `src/app/diagrams/[id]/` — full-screen editors
  (outside the sidebar)
- `src/lib/data.ts` — reads (Prisma)
- `src/lib/actions.ts` — mutations (Server Actions)
- `prisma/schema.prisma` — data model (Project, Task, Canvas, Diagram)
