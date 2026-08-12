import { getAllDiagrams, getRecentProjects } from "@/lib/data";
import { DiagramList } from "@/components/diagram-list";
import { NewDiagramButton } from "@/components/new-diagram-button";

export default async function DiagramsPage() {
  const [diagrams, recentProjects] = await Promise.all([
    getAllDiagrams(),
    getRecentProjects(1),
  ]);

  const items = diagrams.map((d) => ({
    id: d.id,
    name: d.name,
    updatedAt: d.updatedAt,
    projectName: d.project.name,
  }));

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Diagramas</h1>
        {recentProjects[0] && <NewDiagramButton projectId={recentProjects[0].id} />}
      </div>
      <DiagramList diagrams={items} showProjectBadge />
    </div>
  );
}
