"use client";

import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useHabitLogs } from "@/lib/hooks/use-habits";
import { toDateString } from "@/lib/utils/dates";

function computeActivityStreak(logs: { completed_date: string }[]): number {
  if (!logs || logs.length === 0) return 0;

  // Get unique dates with activity
  const dates = new Set(logs.map((l) => l.completed_date));
  const sortedDates = Array.from(dates).sort().reverse();

  const today = toDateString(new Date());
  const yesterday = toDateString(new Date(Date.now() - 86400000));

  // Must include today or yesterday to count
  if (!dates.has(today) && !dates.has(yesterday)) return 0;

  let streak = 0;
  const startDate = dates.has(today) ? today : yesterday;
  const current = new Date(startDate);

  while (true) {
    const dateStr = toDateString(current);
    if (dates.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function StreakCounter() {
  // Get logs for last 365 days
  const today = new Date();
  const yearAgo = new Date(today);
  yearAgo.setDate(yearAgo.getDate() - 365);
  const { data: logs } = useHabitLogs(toDateString(yearAgo), toDateString(today));

  const streak = computeActivityStreak(logs ?? []);

  if (streak === 0) return null;

  return (
    <Card className="p-4 flex items-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon-amber/20 to-neon-pink/20 flex items-center justify-center">
          <Flame className="h-6 w-6 text-neon-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
        </div>
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: "0 0 16px rgba(245,158,11,0.2)",
          }}
        />
      </div>
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-neon-amber">{streak}</span>
          <span className="text-sm text-slate-400">
            {streak === 1 ? "день" : streak < 5 ? "дня" : "дней"}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Вы активны {streak} {streak === 1 ? "день" : streak < 5 ? "дня" : "дней"} подряд!
        </p>
      </div>
    </Card>
  );
}
