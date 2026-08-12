import type { ReactNode } from "react";
import { AppSidebar, MobileNav } from "@/components/app-sidebar";

// Personal single-user tool: always read fresh from Postgres rather than
// rely on static-shell caching + revalidatePath scoping being exhaustive.
export const dynamic = "force-dynamic";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
