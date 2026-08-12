"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Inbox, RotateCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/format";
import type { TaskStatusKey } from "@/lib/format";
import { deleteTask, moveTask } from "@/lib/actions";
import { TaskCard, type TaskCardData } from "@/components/task-card";
import { TaskDialog, type EditableTask } from "@/components/task-dialog";

const STATUS_ICONS = { Inbox, RotateCw, CheckCircle2 } as const;
const COLUMNS: TaskStatusKey[] = ["backlog", "progress", "done"];

export type KanbanTask = TaskCardData & {
  description: string;
  projectId: string;
  status: TaskStatusKey;
};

export function KanbanBoard({
  tasks,
  projects,
  showProjectBadge = false,
  defaultProjectId,
}: {
  tasks: KanbanTask[];
  projects: { id: string; name: string }[];
  showProjectBadge?: boolean;
  defaultProjectId?: string;
}) {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [prevTasks, setPrevTasks] = useState(tasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatusKey | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<EditableTask | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatusKey>("backlog");
  const [, startTransition] = useTransition();

  if (tasks !== prevTasks) {
    setPrevTasks(tasks);
    setLocalTasks(tasks);
  }

  const grouped = useMemo(() => {
    const map: Record<TaskStatusKey, KanbanTask[]> = {
      backlog: [],
      progress: [],
      done: [],
    };
    for (const t of localTasks) map[t.status].push(t);
    return map;
  }, [localTasks]);

  function handleDrop(status: TaskStatusKey) {
    setOverColumn(null);
    const id = draggingId;
    setDraggingId(null);
    if (!id) return;
    const current = localTasks.find((t) => t.id === id);
    if (!current || current.status === status) return;

    setLocalTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    startTransition(async () => {
      try {
        await moveTask(id, status);
      } catch {
        toast.error("No se pudo mover la tarea.");
        setLocalTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: current.status } : t))
        );
      }
    });
  }

  function handleDelete(id: string) {
    const prevTasks = localTasks;
    setLocalTasks((prev) => prev.filter((t) => t.id !== id));
    startTransition(async () => {
      try {
        await deleteTask(id);
        toast.success("Tarea eliminada.");
      } catch {
        toast.error("No se pudo eliminar la tarea.");
        setLocalTasks(prevTasks);
      }
    });
  }

  function openNew(status: TaskStatusKey) {
    setEditingTask(null);
    setNewTaskStatus(status);
    setDialogOpen(true);
  }

  function openEdit(task: KanbanTask) {
    setEditingTask({
      id: task.id,
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      due: task.due,
      tags: task.tags,
    });
    setDialogOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const meta = STATUS_META[col];
          const Icon = STATUS_ICONS[meta.icon];
          const items = grouped[col];
          return (
            <div
              key={col}
              onDragOver={(e) => {
                e.preventDefault();
                if (overColumn !== col) setOverColumn(col);
              }}
              onDragLeave={() => setOverColumn((c) => (c === col ? null : c))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(col);
              }}
              className={cn(
                "flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5 min-h-[200px] transition-colors",
                overColumn === col && "border-foreground/30 bg-muted/40"
              )}
            >
              <div className="flex items-center justify-between px-1 py-1">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Icon className="size-3.5 text-muted-foreground" />
                  {meta.label}
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <button
                  onClick={() => openNew(col)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {items.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={{
                      ...task,
                      projectName: showProjectBadge ? task.projectName : undefined,
                    }}
                    onClick={() => openEdit(task)}
                    onDelete={() => handleDelete(task.id)}
                    onDragStart={() => setDraggingId(task.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projects={projects}
        defaultProjectId={defaultProjectId}
        defaultStatus={newTaskStatus}
        task={editingTask}
      />
    </>
  );
}
