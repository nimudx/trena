import { ThemeToggle } from "@/components/theme-toggle";

export default function ServicesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Servicios</h1>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Apariencia</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
