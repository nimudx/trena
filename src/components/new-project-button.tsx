"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/components/project-dialog";

export function NewProjectButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Nuevo proyecto
      </Button>
      <ProjectDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(project) => router.push(`/projects/${project.id}`)}
      />
    </>
  );
}
