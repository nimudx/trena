import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProjectDetail, getProjectOptions } from "@/lib/data";
import { ProjectTabs } from "@/components/project-tabs";

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const [project, projectOptions] = await Promise.all([
    getProjectDetail(id),
    getProjectOptions(),
  ]);

  if (!project) notFound();

  const tasks = project.tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    tags: t.tags,
    due: t.due,
    projectId: t.projectId,
  }));

  const canvases = project.canvases.map((c) => ({
    id: c.id,
    name: c.name,
    thumbnail: c.thumbnail,
    updatedAt: c.updatedAt,
  }));

  const diagrams = project.diagrams.map((d) => ({
    id: d.id,
    name: d.name,
    updatedAt: d.updatedAt,
  }));

  return (
    <div>
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Proyectos
      </Link>

      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <p className="mb-6 max-w-xl text-sm text-muted-foreground">
        {project.description || "Sin descripción."}
      </p>

      <ProjectTabs
        projectId={project.id}
        notes={project.notes}
        tasks={tasks}
        canvases={canvases}
        diagrams={diagrams}
        projectOptions={projectOptions}
      />
    </div>
  );
}
