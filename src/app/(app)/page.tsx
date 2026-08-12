import Link from "next/link";
import { Inbox, RotateCw, Palette, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getHomeSummary, getRecentProjects, getProjectOptions } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { HomeQuickActions } from "@/components/home-quick-actions";

export default async function HomePage() {
  const [summary, recentProjects, projectOptions] = await Promise.all([
    getHomeSummary(),
    getRecentProjects(3),
    getProjectOptions(),
  ]);

  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

  const stats = [
    { label: "Pendientes", value: summary.pending, icon: Inbox },
    { label: "En progreso", value: summary.progress, icon: RotateCw },
    { label: "Canvas", value: summary.canvases, icon: Palette },
    { label: "Diagramas", value: summary.diagrams, icon: Workflow },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Inicio</h1>
      <p className="mb-8 text-sm text-muted-foreground">Hoy es {today}</p>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="gap-1 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>

      <h5 className="mb-3 text-sm font-medium text-muted-foreground">
        Acciones rápidas
      </h5>
      <div className="mb-8">
        <HomeQuickActions
          projects={projectOptions}
          defaultProjectId={recentProjects[0]?.id}
        />
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <h5 className="text-sm font-medium text-muted-foreground">
          Proyectos recientes
        </h5>
        <Link href="/projects" className="text-sm hover:underline">
          Ver todos
        </Link>
      </div>

      {recentProjects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no tienes proyectos. Crea el primero con &quot;Nuevo proyecto&quot;.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
