"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabitsWithStats, useToggleHabitLog } from "@/lib/hooks/use-habits";
import { toDateString } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

export function HabitsWidget() {
  const { data: habits, isLoading, error } = useHabitsWithStats();
  const toggle = useToggleHabitLog();
  const todayStr = toDateString(new Date());

  const completed = habits?.filter((h) => h.completedToday).length ?? 0;
  const total = habits?.length ?? 0;

  return (
    <Card hoverable className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">
          Привычки на сегодня
        </h3>
        <Link
          href="/habits"
          className="text-xs text-neon-cyan hover:underline flex items-center gap-1"
        >
          Все <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-neon-pink/80 py-2">Ошибка загрузки</p>
      )}

      {!isLoading && !error && habits && habits.length === 0 && (
        <p className="text-sm text-slate-500 py-2">Нет привычек</p>
      )}

      {habits && habits.length > 0 && (
        <>
          <ProgressBar value={completed} max={total} color="green" showLabel />
          <div className="space-y-1">
            {habits.slice(0, 5).map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <button
                  onClick={() =>
                    toggle.mutate({
                      habitId: habit.id,
                      date: todayStr,
                      completed: habit.completedToday,
                    })
                  }
                  className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer",
                    habit.completedToday
                      ? "border-transparent"
                      : "border-white/20 hover:border-white/40"
                  )}
                  style={
                    habit.completedToday
                      ? {
                          backgroundColor: habit.color,
                          boxShadow: `0 0 6px ${habit.color}40`,
                        }
                      : undefined
                  }
                >
                  {habit.completedToday && (
                    <Check className="h-3 w-3 text-slate-950" />
                  )}
                </button>
                <span
                  className={cn(
                    "text-sm",
                    habit.completedToday && "line-through text-slate-500"
                  )}
                >
                  {habit.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
