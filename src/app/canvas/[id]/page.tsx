import { notFound } from "next/navigation";
import { getCanvas } from "@/lib/data";
import { CanvasEditor } from "@/components/canvas-editor";

export default async function CanvasEditorPage({
  params,
}: PageProps<"/canvas/[id]">) {
  const { id } = await params;
  const canvas = await getCanvas(id);
  if (!canvas) notFound();

  const scene = (canvas.scene ?? {}) as {
    elements?: unknown[];
    files?: Record<string, unknown>;
  };

  return (
    <CanvasEditor
      canvasId={canvas.id}
      initialName={canvas.name}
      projectId={canvas.projectId}
      projectName={canvas.project.name}
      initialElements={scene.elements ?? []}
      initialFiles={scene.files ?? {}}
    />
  );
}
