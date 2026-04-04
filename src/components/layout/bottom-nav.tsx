"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, ListTodo, Utensils } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface TabItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { label: "Главная", href: "/dashboard", icon: LayoutDashboard },
  { label: "Привычки", href: "/habits", icon: Target },
  { label: "Задачи", href: "/tasks", icon: ListTodo },
  { label: "Питание", href: "/nutrition", icon: Utensils },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/10 bg-surface-primary/90 backdrop-blur-md" style={{ paddingBottom: "var(--safe-bottom)" }}>
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-xs transition-all",
                isActive ? "text-neon-cyan" : "text-slate-500"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]")} />
              {isActive && (
                <span className="w-4 h-[2px] rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              )}
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
