"use client";

import { cn } from "@/lib/utils/cn";
import type { TaskFilters, TaskStatus, TaskPriority } from "@/types/tasks";

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const statusTabs: { value: TaskStatus | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "todo", label: "К выполнению" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Готово" },
];

const priorityOptions: { value: TaskPriority | "all"; label: string }[] = [
  { value: "all", label: "Любой приоритет" },
  { value: "urgent", label: "Срочный" },
  { value: "high", label: "Высокий" },
  { value: "medium", label: "Средний" },
  { value: "low", label: "Низкий" },
];

export function TaskFiltersBar({ filters, onChange }: TaskFiltersBarProps) {
  return (
    <div className="space-y-3">
      {/* Status tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              onChange({ ...filters, status: tab.value })
            }
            className={cn(
              "flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
              filters.status === tab.value || (!filters.status && tab.value === "all")
                ? "bg-neon-cyan/15 text-neon-cyan"
                : "text-slate-400 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Priority filter + search */}
      <div className="flex gap-2">
        <select
          value={filters.priority ?? "all"}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: e.target.value as TaskPriority | "all",
            })
          }
          className="h-9 px-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground appearance-none cursor-pointer"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Поиск задач..."
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({ ...filters, search: e.target.value })
          }
          className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-neon-cyan/50"
        />
      </div>
    </div>
  );
}
