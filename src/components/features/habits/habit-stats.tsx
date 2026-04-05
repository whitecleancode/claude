"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, getDay, subMonths, addMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toDateString, getMonthDays, calculateStreak, calculateBestStreak, getCompletionRate } from "@/lib/utils/dates";
import { useHabitLogsForHabit } from "@/lib/hooks/use-habits";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

interface HabitStatsProps {
  habitId: string;
  color: string;
}

export function HabitStats({ habitId, color }: HabitStatsProps) {
  const [month, setMonth] = useState(new Date());
  const start = toDateString(startOfMonth(month));
  const end = toDateString(endOfMonth(month));
  const { data: logs } = useHabitLogsForHabit(habitId, start, end);

  const completedDates = logs?.map((l) => l.completed_date) ?? [];
  const days = getMonthDays(month);
  const totalDays = days.length;
  const rate = getCompletionRate(completedDates, totalDays);
  const streak = calculateStreak(completedDates);
  const bestStreak = calculateBestStreak(completedDates);

  // Day of week offset for the first day (Monday = 0)
  const firstDayOfWeek = (getDay(days[0]) + 6) % 7;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs text-slate-400">Выполнение</p>
          <p className="text-2xl font-bold mt-1">{rate}%</p>
          <ProgressBar value={rate} max={100} color="cyan" className="mt-2" />
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Текущая серия</p>
          <p className="text-2xl font-bold mt-1">{streak} дн.</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-400">Лучший стрик</p>
          <p className="text-2xl font-bold mt-1 text-neon-amber">{bestStreak} дн.</p>
        </Card>
      </div>

      {/* Calendar heatmap */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setMonth(subMonths(month, 1))}
            className="p-1 rounded hover:bg-white/10 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium capitalize">
            {format(month, "LLLL yyyy", { locale: ru })}
          </span>
          <button
            onClick={() => setMonth(addMonths(month, 1))}
            className="p-1 rounded hover:bg-white/10 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
            <div
              key={d}
              className="text-[10px] text-slate-500 text-center"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const dateStr = toDateString(day);
            const isCompleted = completedDates.includes(dateStr);
            const isToday = dateStr === toDateString(new Date());

            return (
              <div
                key={dateStr}
                className={cn(
                  "aspect-square rounded-md flex items-center justify-center text-xs",
                  isToday && "ring-1 ring-white/20",
                  isCompleted ? "text-slate-950 font-medium" : "text-slate-500"
                )}
                style={
                  isCompleted
                    ? { backgroundColor: color, opacity: 0.9 }
                    : undefined
                }
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
