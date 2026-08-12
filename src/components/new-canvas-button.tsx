"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCanvas } from "@/lib/actions";

export function NewCanvasButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const canvas = await createCanvas(projectId);
        router.push(`/canvas/${canvas.id}`);
      } catch {
        toast.error("No se pudo crear el canvas.");
      }
    });
  }

  return (
    <Button variant="secondary" onClick={handleClick} disabled={pending}>
      <Plus className="size-4" /> Nuevo canvas
    </Button>
  );
}
