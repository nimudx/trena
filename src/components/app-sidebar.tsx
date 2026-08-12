"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  SquareKanban,
  Palette,
  Workflow,
  FolderOpen,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { TrenaMark } from "@/components/logo";

const ICONS = {
  Home,
  SquareKanban,
  Palette,
  Workflow,
  FolderOpen,
} as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ws-sidebar-collapsed");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a persisted UI preference on mount
    if (stored) setCollapsed(stored === "1");
  }, []);

  function toggle() {
    setCollapsed((c) => {
      localStorage.setItem("ws-sidebar-collapsed", c ? "0" : "1");
      return !c;
    });
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border shrink-0 py-4 px-2 transition-[width] duration-150",
        collapsed ? "w-16" : "w-52"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 px-2 pb-4 mb-2",
          collapsed && "justify-center px-0"
        )}
      >
        <TrenaMark className="size-5 shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-sm truncate">Trena</span>
        )}
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                collapsed && "justify-center"
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="h-px bg-border my-2" />

      <Link
        href="/services"
        title="Servicios"
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
          isActive(pathname, "/services")
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          collapsed && "justify-center"
        )}
      >
        <Settings className="size-[18px] shrink-0" />
        {!collapsed && <span className="truncate">Servicios</span>}
      </Link>

      <button
        onClick={toggle}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2 py-2 mt-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors",
          collapsed && "justify-center"
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="size-[18px] shrink-0" />
        ) : (
          <>
            <PanelLeftClose className="size-[18px] shrink-0" />
            <span className="truncate">Colapsar</span>
          </>
        )}
      </button>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background">
      <div className="flex w-full overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px]",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/services"
          className={cn(
            "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px]",
            isActive(pathname, "/services") ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Settings className="size-[18px]" />
          Servicios
        </Link>
      </div>
    </nav>
  );
}
