import Link from "next/link";
import { Card } from "@/components/ui/card";
import { fmtDate } from "@/lib/format";

export type ProjectCardData = {
  id: string;
  name: string;
  description: string;
  updatedAt: Date;
  _count: { tasks: number; canvases: number; diagrams: number };
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full gap-2 p-4 transition-colors hover:border-foreground/20">
        <span className="text-xs text-muted-foreground">Proyecto</span>
        <span className="font-medium leading-tight">{project.name}</span>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {project.description || "Sin descripción."}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{project._count.tasks} tareas</span>
          <span>·</span>
          <span>{project._count.canvases} canvas</span>
          <span>·</span>
          <span>{project._count.diagrams} diagramas</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Modificado {fmtDate(project.updatedAt)}
        </div>
      </Card>
    </Link>
  );
}
