"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Palette, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fmtDate } from "@/lib/format";
import { deleteCanvas } from "@/lib/actions";

export type CanvasItem = {
  id: string;
  name: string;
  thumbnail: string | null;
  updatedAt: Date;
  projectName?: string;
};

export function CanvasGrid({
  canvases,
  showProjectBadge = false,
}: {
  canvases: CanvasItem[];
  showProjectBadge?: boolean;
}) {
  const [items, setItems] = useState(canvases);
  const [, startTransition] = useTransition();

  function handleDelete(id: string) {
    const prev = items;
    setItems((cur) => cur.filter((c) => c.id !== id));
    startTransition(async () => {
      try {
        await deleteCanvas(id);
        toast.success("Canvas eliminado.");
      } catch {
        toast.error("No se pudo eliminar el canvas.");
        setItems(prev);
      }
    });
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay canvas.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <Link key={c.id} href={`/canvas/${c.id}`}>
          <Card className="group h-full gap-2 p-3 transition-colors hover:border-foreground/20">
            <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-md bg-muted">
              {c.thumbnail ? (
                <Image
                  src={c.thumbnail}
                  alt={c.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <Palette className="size-6 text-muted-foreground" />
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(c.id);
                }}
                className="absolute right-1.5 top-1.5 rounded-md bg-background/80 p-1 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
            <span className="text-sm font-medium">{c.name}</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {showProjectBadge && c.projectName && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  {c.projectName}
                </Badge>
              )}
              <span>Modificado {fmtDate(c.updatedAt)}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
