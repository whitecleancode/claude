"use client";

import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useHabits, useHabitLogs } from "@/lib/hooks/use-habits";
import { getLast7Days, toDateString } from "@/lib/utils/dates";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const RING_COLORS = ["cyan", "purple", "green", "pink", "cyan", "amber", "purple"] as const;

export function WeeklyRadar() {
  const { data: habits } = useHabits();
  const today = new Date();
  const days = getLast7Days(today);
  const startDate = toDateString(days[0]);
  const endDate = toDateString(today);
  const { data: logs } = useHabitLogs(startDate, endDate);

  const totalHabits = habits?.length ?? 0;

  if (totalHabits === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-300">Weekly Radar</h3>
        <span className="text-xs text-slate-500">
          {format(days[0], "d MMM", { locale: ru })} — {format(today, "d MMM", { locale: ru })}
        </span>
      </div>

      <div className="flex items-end justify-around gap-1">
        {days.map((day, i) => {
          const dateStr = toDateString(day);
          const completedToday = logs
            ? new Set(logs.filter((l) => l.completed_date === dateStr).map((l) => l.habit_id)).size
            : 0;
          const dayOfWeek = day.getDay();
          const label = DAY_LABELS[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
          const isCurrentDay = dateStr === toDateString(today);

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <ProgressRing
                value={completedToday}
                max={totalHabits}
                size={48}
                strokeWidth={4}
                color={RING_COLORS[i]}
              >
                <span className="text-[10px] font-medium">
                  {completedToday}
                </span>
              </ProgressRing>
              <span className={`text-xs font-medium ${isCurrentDay ? "text-neon-cyan" : "text-slate-400"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
