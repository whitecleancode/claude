"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Target, ListTodo, Utensils } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useNavBadges } from "@/lib/hooks/use-nav-badges";
import type { LucideIcon } from "lucide-react";

interface TabItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badgeKey?: "incompleteHabits" | "overdueTasks";
}

const TABS: TabItem[] = [
  { label: "Главная", href: "/dashboard", icon: LayoutDashboard },
  { label: "Привычки", href: "/habits", icon: Target, badgeKey: "incompleteHabits" },
  { label: "Задачи", href: "/tasks", icon: ListTodo, badgeKey: "overdueTasks" },
  { label: "Питание", href: "/nutrition", icon: Utensils },
];

export function BottomNav() {
  const pathname = usePathname();
  const badges = useNavBadges();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-white/10 bg-surface-primary/90 backdrop-blur-md" style={{ paddingBottom: "var(--safe-bottom)" }}>
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const Icon = tab.icon;
          const badgeCount = tab.badgeKey ? badges[tab.badgeKey] : 0;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-xs transition-all",
                isActive ? "text-neon-cyan" : "text-slate-500"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pulse"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
                  }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <div className="relative">
                <Icon className={cn("h-5 w-5 relative z-10", isActive && "drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]")} />
                {badgeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-neon-pink text-[9px] font-bold text-white shadow-[0_0_6px_rgba(236,72,153,0.5)]"
                  >
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </motion.span>
                )}
              </div>
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="w-4 h-[2px] rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                />
              )}
              <span className="mt-0.5 relative z-10">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
