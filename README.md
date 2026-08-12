# Workspace

Hub personal y self-hosted para organizar proyectos: tareas (kanban), canvas
libre (Excalidraw) y diagramas estructurados (draw.io).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- shadcn/ui (preset Nova, sobre Base UI) + Lucide Icons
- Prisma 7 + PostgreSQL (Docker)
- `@excalidraw/excalidraw` embebido para Canvas
- `embed.diagrams.net` embebido (iframe + postMessage) para Diagramas

## Requisitos

- Node.js 20+
- pnpm
- Docker (para Postgres)

## Primer arranque

```bash
# 1. Levantar Postgres
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Crear el esquema en la base de datos
pnpm exec prisma migrate dev

# 4. (Opcional) cargar datos de ejemplo
pnpm db:seed

# 5. Arrancar la app
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Ver `.env.example`. Por defecto:

```
DATABASE_URL="postgresql://trena:trena@localhost:5433/trena?schema=public"
```

El puerto host de Postgres es `5433` (no `5432`) para no chocar con otros
contenedores Postgres que ya tengas corriendo localmente.

Diagramas usa por defecto el embed público `https://embed.diagrams.net`. Si
prefieres una instancia propia de draw.io self-hosted (imagen Docker
`jgraph/drawio`), define `NEXT_PUBLIC_DRAWIO_URL` apuntando a ella.

## Scripts

- `pnpm dev` — servidor de desarrollo
- `pnpm build` / `pnpm start` — build y arranque en producción
- `pnpm db:seed` — reinicia la base de datos con datos de ejemplo
- `pnpm db:studio` — abre Prisma Studio para inspeccionar la base de datos

## Estructura

- `src/app/(app)/` — pantallas con sidebar: Inicio, Tareas, Canvas, Diagramas,
  Proyectos, Servicios
- `src/app/canvas/[id]/` y `src/app/diagrams/[id]/` — editores a pantalla
  completa (fuera del sidebar)
- `src/lib/data.ts` — lecturas (Prisma)
- `src/lib/actions.ts` — mutaciones (Server Actions)
- `prisma/schema.prisma` — modelo de datos (Project, Task, Canvas, Diagram)
