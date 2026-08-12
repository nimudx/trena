"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Segmented } from "@/components/segmented";
import { STATUS_META, PRIORITY_META } from "@/lib/format";
import type { TaskStatusKey, TaskPriorityKey } from "@/lib/format";
import { createTask, updateTask, type TaskInput } from "@/lib/actions";
import {
  Inbox,
  RotateCw,
  CheckCircle2,
  ChevronDown,
  Minus,
  ChevronUp,
  Flame,
} from "lucide-react";

const STATUS_ICONS = { Inbox, RotateCw, CheckCircle2 } as const;
const PRIORITY_ICONS = { ChevronDown, Minus, ChevronUp, Flame } as const;

export type EditableTask = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatusKey;
  priority: TaskPriorityKey;
  due: Date | null;
  tags: string[];
};

const EMPTY: Omit<TaskInput, "projectId"> = {
  title: "",
  description: "",
  status: "backlog",
  priority: "media",
  due: null,
  tags: [],
};

export function TaskDialog({
  open,
  onOpenChange,
  projects,
  defaultProjectId,
  defaultStatus,
  task,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: { id: string; name: string }[];
  defaultProjectId?: string;
  defaultStatus?: TaskStatusKey;
  task?: EditableTask | null;
  onSaved?: () => void;
}) {
  const [form, setForm] = useState<TaskInput>({
    ...EMPTY,
    projectId: defaultProjectId ?? projects[0]?.id ?? "",
    status: defaultStatus ?? "backlog",
  });
  const [tagsText, setTagsText] = useState("");
  const [pending, startTransition] = useTransition();
  const [wasOpen, setWasOpen] = useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          projectId: task.projectId,
          status: task.status,
          priority: task.priority,
          due: task.due ? task.due.toISOString().slice(0, 10) : null,
          tags: task.tags,
        });
        setTagsText(task.tags.join(", "));
      } else {
        setForm({
          ...EMPTY,
          projectId: defaultProjectId ?? projects[0]?.id ?? "",
          status: defaultStatus ?? "backlog",
        });
        setTagsText("");
      }
    }
  }

  function submit() {
    if (!form.title.trim()) {
      toast.error("El título es obligatorio.");
      return;
    }
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...form, tags };

    startTransition(async () => {
      try {
        if (task) {
          await updateTask(task.id, payload);
          toast.success("Tarea actualizada.");
        } else {
          await createTask(payload);
          toast.success("Tarea creada.");
        }
        onOpenChange(false);
        onSaved?.();
      } catch {
        toast.error("No se pudo guardar la tarea.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">Título</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-desc">Descripción</Label>
            <Textarea
              id="task-desc"
              className="min-h-16"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Proyecto</Label>
              <Select
                items={Object.fromEntries(projects.map((p) => [p.id, p.name]))}
                value={form.projectId}
                onValueChange={(v) =>
                  v && setForm((f) => ({ ...f, projectId: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-due">Fecha límite</Label>
              <Input
                id="task-due"
                type="date"
                value={form.due ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, due: e.target.value || null }))
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Estado</Label>
            <Segmented
              fullWidth
              value={form.status}
              onChange={(v) => setForm((f) => ({ ...f, status: v }))}
              options={(Object.keys(STATUS_META) as TaskStatusKey[]).map((key) => ({
                value: key,
                label: STATUS_META[key].label,
                icon: STATUS_ICONS[STATUS_META[key].icon],
              }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Prioridad</Label>
            <Segmented
              fullWidth
              value={form.priority}
              onChange={(v) => setForm((f) => ({ ...f, priority: v }))}
              options={(Object.keys(PRIORITY_META) as TaskPriorityKey[]).map(
                (key) => ({
                  value: key,
                  label: PRIORITY_META[key].label,
                  icon: PRIORITY_ICONS[PRIORITY_META[key].icon],
                  className: PRIORITY_META[key].className,
                })
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-tags">Etiquetas (separadas por coma)</Label>
            <Input
              id="task-tags"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="ui, bug, research"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={pending}>
            {task ? "Guardar" : "Crear tarea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
