"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { updateProjectNotes } from "@/lib/actions";

export function NotesEditor({
  projectId,
  initialNotes,
}: {
  projectId: string;
  initialNotes: string;
}) {
  const [value, setValue] = useState(initialNotes);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  function handleChange(next: string) {
    setValue(next);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      updateProjectNotes(projectId, next).catch(() => {
        toast.error("No se pudieron guardar las notas.");
      });
    }, 800);
  }

  return (
    <Textarea
      className="min-h-64 font-normal"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Escribe notas para este proyecto…"
    />
  );
}
