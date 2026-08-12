"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  className?: string;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-1 rounded-md border border-border bg-muted/40 p-1",
        fullWidth ? "w-full" : "inline-flex"
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-sm px-3 py-1 text-sm font-medium transition-colors",
              fullWidth && "flex-1",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
              active && opt.className
            )}
          >
            {Icon && <Icon className="size-4" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
