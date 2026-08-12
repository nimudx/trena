const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export function fmtDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export const STATUS_META = {
  backlog: { label: "Backlog", icon: "Inbox" },
  progress: { label: "En progreso", icon: "RotateCw" },
  done: { label: "Hecho", icon: "CheckCircle2" },
} as const;

export const PRIORITY_META = {
  baja: { label: "Baja", icon: "ChevronDown", className: "text-muted-foreground" },
  media: { label: "Media", icon: "Minus", className: "text-muted-foreground" },
  alta: { label: "Alta", icon: "ChevronUp", className: "text-amber-500" },
  urgente: { label: "Urgente", icon: "Flame", className: "text-red-500" },
} as const;

export type TaskStatusKey = keyof typeof STATUS_META;
export type TaskPriorityKey = keyof typeof PRIORITY_META;
