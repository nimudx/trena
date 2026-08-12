"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/task-dialog";
import { ProjectDialog } from "@/components/project-dialog";
import { createCanvas, createDiagram } from "@/lib/actions";

export function HomeQuickActions({
  projects,
  defaultProjectId,
}: {
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
}) {
  const router = useRouter();
  const [taskOpen, setTaskOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [, startTransition] = useTransition();
  const hasProject = Boolean(defaultProjectId);

  function newCanvas() {
    if (!defaultProjectId) return;
    startTransition(async () => {
      try {
        const canvas = await createCanvas(defaultProjectId);
        router.push(`/canvas/${canvas.id}`);
      } catch {
        toast.error("No se pudo crear el canvas.");
      }
    });
  }

  function newDiagram() {
    if (!defaultProjectId) return;
    startTransition(async () => {
      try {
        const diagram = await createDiagram(defaultProjectId);
        router.push(`/diagrams/${diagram.id}`);
      } catch {
        toast.error("No se pudo crear el diagrama.");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => setTaskOpen(true)} disabled={!hasProject}>
        <Plus className="size-4" /> Nueva tarea
      </Button>
      <Button variant="secondary" onClick={newCanvas} disabled={!hasProject}>
        <Plus className="size-4" /> Nuevo canvas
      </Button>
      <Button variant="secondary" onClick={newDiagram} disabled={!hasProject}>
        <Plus className="size-4" /> Nuevo diagrama
      </Button>
      <Button variant="secondary" onClick={() => setProjectOpen(true)}>
        <Plus className="size-4" /> Nuevo proyecto
      </Button>

      <TaskDialog
        open={taskOpen}
        onOpenChange={setTaskOpen}
        projects={projects}
        defaultProjectId={defaultProjectId}
      />
      <ProjectDialog open={projectOpen} onOpenChange={setProjectOpen} />
    </div>
  );
}
