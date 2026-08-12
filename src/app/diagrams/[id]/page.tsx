import { notFound } from "next/navigation";
import { getDiagram } from "@/lib/data";
import { DiagramEditor } from "@/components/diagram-editor";

export default async function DiagramEditorPage({
  params,
}: PageProps<"/diagrams/[id]">) {
  const { id } = await params;
  const diagram = await getDiagram(id);
  if (!diagram) notFound();

  return (
    <DiagramEditor
      diagramId={diagram.id}
      initialName={diagram.name}
      initialXml={diagram.xml}
      projectId={diagram.projectId}
      projectName={diagram.project.name}
    />
  );
}
