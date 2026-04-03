"use client";

import { Zap } from "lucide-react";
import { NavLink } from "./nav-link";
import { NAV_ITEMS } from "@/lib/utils/constants";

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-white/10 bg-surface-secondary/50">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <Zap className="h-6 w-6 text-neon-cyan" />
        <span className="text-lg font-bold neon-text-cyan">Life-OS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>
    </aside>
  );
}
