"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { format, isPast, isToday as isDateToday } from "date-fns";
import { ru } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge } from "@/components/features/tasks/priority-badge";
import { useTasks } from "@/lib/hooks/use-tasks";
import { cn } from "@/lib/utils/cn";

export function TasksWidget() {
  const { data: tasks, isLoading, error } = useTasks({ status: "all" });

  const activeTasks = tasks
    ?.filter((t) => t.status !== "done" && t.status !== "cancelled")
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  return (
    <Card hoverable className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">Активные задачи</h3>
        <Link
          href="/tasks"
          className="text-xs text-neon-cyan hover:underline flex items-center gap-1"
        >
          Все <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-neon-pink/80 py-2">Ошибка загрузки</p>
      )}

      {activeTasks && activeTasks.length === 0 && (
        <p className="text-sm text-slate-500 py-2">Нет активных задач</p>
      )}

      {activeTasks && activeTasks.length > 0 && (
        <div className="space-y-1.5">
          {activeTasks.map((task) => {
            const isOverdue =
              task.due_date &&
              isPast(new Date(task.due_date)) &&
              !isDateToday(new Date(task.due_date));

            return (
              <div
                key={task.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <PriorityBadge priority={task.priority} />
                  <span className="text-sm truncate">{task.title}</span>
                </div>
                {task.due_date && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs shrink-0 ml-2",
                      isOverdue ? "text-neon-pink" : "text-slate-400"
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.due_date), "d MMM", { locale: ru })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
