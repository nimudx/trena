"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Segmented } from "@/components/segmented";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- "mounted" can only be known client-side, this is next-themes' documented hydration-safe pattern
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-[132px]" />;
  }

  return (
    <Segmented
      value={(theme as "light" | "dark") ?? "dark"}
      onChange={setTheme}
      options={[
        { value: "light", label: "Claro", icon: Sun },
        { value: "dark", label: "Oscuro", icon: Moon },
      ]}
    />
  );
}
