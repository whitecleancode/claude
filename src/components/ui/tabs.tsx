"use client";

import { cn } from "@/lib/utils/cn";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 p-1 rounded-xl bg-white/5", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer",
            value === tab.value
              ? "bg-white/10 text-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.15)]"
              : "text-slate-400 hover:text-slate-300 hover:bg-white/5"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
