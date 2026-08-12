"use client";

import { SquareKanban, Palette, Workflow, NotebookPen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanBoard, type KanbanTask } from "@/components/kanban-board";
import { CanvasGrid, type CanvasItem } from "@/components/canvas-grid";
import { DiagramList, type DiagramItem } from "@/components/diagram-list";
import { NewCanvasButton } from "@/components/new-canvas-button";
import { NewDiagramButton } from "@/components/new-diagram-button";
import { NotesEditor } from "@/components/notes-editor";

export function ProjectTabs({
  projectId,
  notes,
  tasks,
  canvases,
  diagrams,
  projectOptions,
}: {
  projectId: string;
  notes: string;
  tasks: KanbanTask[];
  canvases: CanvasItem[];
  diagrams: DiagramItem[];
  projectOptions: { id: string; name: string }[];
}) {
  return (
    <Tabs defaultValue="tasks">
      <TabsList>
        <TabsTrigger value="tasks">
          <SquareKanban /> Tareas
        </TabsTrigger>
        <TabsTrigger value="canvas">
          <Palette /> Canvas
        </TabsTrigger>
        <TabsTrigger value="diagrams">
          <Workflow /> Diagramas
        </TabsTrigger>
        <TabsTrigger value="notes">
          <NotebookPen /> Notas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" className="mt-6">
        <KanbanBoard
          tasks={tasks}
          projects={projectOptions}
          defaultProjectId={projectId}
        />
      </TabsContent>

      <TabsContent value="canvas" className="mt-6">
        <div className="mb-3 flex justify-end">
          <NewCanvasButton projectId={projectId} />
        </div>
        <CanvasGrid canvases={canvases} />
      </TabsContent>

      <TabsContent value="diagrams" className="mt-6">
        <div className="mb-3 flex justify-end">
          <NewDiagramButton projectId={projectId} />
        </div>
        <DiagramList diagrams={diagrams} />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <NotesEditor projectId={projectId} initialNotes={notes} />
      </TabsContent>
    </Tabs>
  );
}
