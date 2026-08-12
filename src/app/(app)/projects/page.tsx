import { getAllProjects } from "@/lib/data";
import { ProjectCard } from "@/components/project-card";
import { NewProjectButton } from "@/components/new-project-button";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <NewProjectButton />
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no tienes proyectos.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
