"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // While loading or redirecting, show nothing (AuthProvider handles the spinner)
  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-surface-primary">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0" style={{ paddingBottom: "calc(4rem + var(--safe-bottom))" }}>{children}</main>
      <BottomNav />
    </div>
  );
}
