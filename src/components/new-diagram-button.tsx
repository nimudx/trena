"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDiagram } from "@/lib/actions";

export function NewDiagramButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const diagram = await createDiagram(projectId);
        router.push(`/diagrams/${diagram.id}`);
      } catch {
        toast.error("No se pudo crear el diagrama.");
      }
    });
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={pending}>
      <Plus className="size-4" /> Nuevo diagrama
    </Button>
  );
}
