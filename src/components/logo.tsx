const ACCENT = "#3F8F5F";

/**
 * Isotype: three rounded strands rotated 120° around a shared center,
 * evoking a "trenza" (braid) — the three tools (tareas, canvas, diagramas)
 * woven into one hub. Kept to a single accent color at three opacities
 * instead of multiple hues, in line with the app's mostly-neutral palette.
 */
export function TrenaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="12.5" y="2" width="7" height="15" rx="3.5" fill={ACCENT} />
      <rect
        x="12.5"
        y="2"
        width="7"
        height="15"
        rx="3.5"
        fill={ACCENT}
        opacity="0.7"
        transform="rotate(120 16 16)"
      />
      <rect
        x="12.5"
        y="2"
        width="7"
        height="15"
        rx="3.5"
        fill={ACCENT}
        opacity="0.45"
        transform="rotate(240 16 16)"
      />
    </svg>
  );
}
