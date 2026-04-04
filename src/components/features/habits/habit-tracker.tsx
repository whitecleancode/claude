"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils/cn";
import { getLast7Days, toDateString } from "@/lib/utils/dates";
import { useToggleHabitLog } from "@/lib/hooks/use-habits";
import { hapticLight, hapticSuccess } from "@/lib/capacitor/native";
import { Check } from "lucide-react";

interface HabitTrackerProps {
  habitId: string;
  color: string;
  completedDates: string[];
}

export function HabitTracker({
  habitId,
  color,
  completedDates,
}: HabitTrackerProps) {
  const days = getLast7Days();
  const toggle = useToggleHabitLog();

  return (
    <div className="flex items-center gap-1.5">
      {days.map((day) => {
        const dateStr = toDateString(day);
        const isCompleted = completedDates.includes(dateStr);

        return (
          <button
            key={dateStr}
            onClick={() => {
              if (isCompleted) hapticLight(); else hapticSuccess();
              toggle.mutate({
                habitId,
                date: dateStr,
                completed: isCompleted,
              });
            }}
            className={cn(
              "flex flex-col items-center gap-1 group cursor-pointer"
            )}
            title={format(day, "d MMMM", { locale: ru })}
          >
            <span className="text-[10px] text-slate-500">
              {format(day, "EEEEEE", { locale: ru })}
            </span>
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-200",
                isCompleted
                  ? "border-transparent"
                  : "border-white/10 hover:border-white/20"
              )}
              style={
                isCompleted
                  ? { backgroundColor: color, boxShadow: `0 0 10px ${color}40` }
                  : undefined
              }
            >
              {isCompleted && (
                <Check className="h-4 w-4 text-slate-950" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
