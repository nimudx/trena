import { getAllCanvases, getRecentProjects } from "@/lib/data";
import { CanvasGrid } from "@/components/canvas-grid";
import { NewCanvasButton } from "@/components/new-canvas-button";

export default async function CanvasPage() {
  const [canvases, recentProjects] = await Promise.all([
    getAllCanvases(),
    getRecentProjects(1),
  ]);

  const items = canvases.map((c) => ({
    id: c.id,
    name: c.name,
    thumbnail: c.thumbnail,
    updatedAt: c.updatedAt,
    projectName: c.project.name,
  }));

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Canvas</h1>
        {recentProjects[0] && <NewCanvasButton projectId={recentProjects[0].id} />}
      </div>
      <CanvasGrid canvases={items} showProjectBadge />
    </div>
  );
}
