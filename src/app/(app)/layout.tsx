import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-primary">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 min-w-0 pb-16 lg:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
