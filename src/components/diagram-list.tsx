"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Workflow, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { fmtDate } from "@/lib/format";
import { deleteDiagram } from "@/lib/actions";

export type DiagramItem = {
  id: string;
  name: string;
  updatedAt: Date;
  projectName?: string;
};

export function DiagramList({
  diagrams,
  showProjectBadge = false,
}: {
  diagrams: DiagramItem[];
  showProjectBadge?: boolean;
}) {
  const [items, setItems] = useState(diagrams);
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((d) => d.id !== id));
    startTransition(async () => {
      try {
        await deleteDiagram(id);
        toast.success("Diagrama eliminado.");
      } catch {
        toast.error("No se pudo eliminar el diagrama.");
        setItems(prev);
      }
    });
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay diagramas.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs text-muted-foreground">
          <th className="w-9 py-2 font-normal" />
          <th className="py-2 font-normal">Nombre</th>
          {showProjectBadge && <th className="py-2 font-normal">Proyecto</th>}
          <th className="py-2 font-normal">Modificado</th>
          <th className="w-9 py-2 font-normal" />
        </tr>
      </thead>
      <tbody>
        {items.map((d) => (
          <tr key={d.id} className="group border-b border-border/60 last:border-0">
            <td className="py-2">
              <Workflow className="size-4 text-muted-foreground" />
            </td>
            <td className="py-2 pr-2">
              <Link href={`/diagrams/${d.id}`} className="hover:underline">
                {d.name}
              </Link>
            </td>
            {showProjectBadge && (
              <td className="py-2 pr-2">
                {d.projectName && (
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {d.projectName}
                  </Badge>
                )}
              </td>
            )}
            <td className="py-2 pr-2 text-muted-foreground">{fmtDate(d.updatedAt)}</td>
            <td className="py-2">
              <button
                onClick={() => handleDelete(d.id)}
                className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
