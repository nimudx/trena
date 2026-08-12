"use client";

import { Badge } from "@/components/ui/badge";
import { fmtDate, PRIORITY_META } from "@/lib/format";
import type { TaskPriorityKey } from "@/lib/format";
import { ChevronDown, Minus, ChevronUp, Flame, Trash2, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITY_ICONS = { ChevronDown, Minus, ChevronUp, Flame } as const;

export type TaskCardData = {
  id: string;
  title: string;
  priority: TaskPriorityKey;
  tags: string[];
  due: Date | null;
  projectName?: string;
};

export function TaskCard({
  task,
  onClick,
  onDelete,
  onDragStart,
}: {
  task: TaskCardData;
  onClick: () => void;
  onDelete: () => void;
  onDragStart: () => void;
}) {
  const pm = PRIORITY_META[task.priority];
  const PIcon = PRIORITY_ICONS[pm.icon];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="group flex cursor-pointer flex-col gap-2 rounded-md border border-border bg-card p-3 text-sm shadow-sm transition-colors hover:border-foreground/20"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="leading-snug">{task.title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {task.projectName && (
          <Badge variant="outline" className="text-[10px] font-normal">
            {task.projectName}
          </Badge>
        )}
        <span className={cn("flex items-center gap-1 text-[11px]", pm.className)}>
          <PIcon className="size-3" />
          {pm.label}
        </span>
        {task.due && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3" />
            {fmtDate(task.due)}
          </span>
        )}
        {task.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
