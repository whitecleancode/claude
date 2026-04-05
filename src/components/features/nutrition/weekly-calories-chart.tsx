"use client";

import { Card } from "@/components/ui/card";
import { useWeeklyNutritionLogs, useNutritionGoal } from "@/lib/hooks/use-nutrition";
import { format, subDays } from "date-fns";
import { ru } from "date-fns/locale";

export function WeeklyCaloriesChart() {
  const { data: logs } = useWeeklyNutritionLogs();
  const { data: goal } = useNutritionGoal();
  const calGoal = goal?.calories_target ?? 2000;

  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    return {
      date: d.toISOString().split("T")[0],
      label: format(d, "EE", { locale: ru }),
    };
  });

  const dailyTotals = days.map((day) => {
    const dayLogs = logs?.filter((l) => l.logged_date === day.date) ?? [];
    return dayLogs.reduce((sum, l) => sum + l.calories, 0);
  });

  const maxVal = Math.max(...dailyTotals, calGoal);
  const chartHeight = 120;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-300">Калории за неделю</h3>
        <span className="text-xs text-slate-500">Цель: {calGoal} ккал</span>
      </div>

      <svg viewBox={`0 0 280 ${chartHeight + 30}`} className="w-full">
        {/* Goal line */}
        <line
          x1="0"
          y1={chartHeight - (calGoal / maxVal) * chartHeight}
          x2="280"
          y2={chartHeight - (calGoal / maxVal) * chartHeight}
          stroke="rgba(168,85,247,0.3)"
          strokeDasharray="4 4"
          strokeWidth="1"
        />

        {days.map((day, i) => {
          const barWidth = 24;
          const gap = (280 - barWidth * 7) / 8;
          const x = gap + i * (barWidth + gap);
          const value = dailyTotals[i];
          const barHeight = maxVal > 0 ? (value / maxVal) * chartHeight : 0;
          const y = chartHeight - barHeight;
          const isOverGoal = value > calGoal;

          return (
            <g key={day.date}>
              {/* Bar */}
              <defs>
                <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isOverGoal ? "#ec4899" : "#06b6d4"} />
                  <stop offset="100%" stopColor={isOverGoal ? "#db2777" : "#0891b2"} />
                </linearGradient>
              </defs>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={`url(#bar-${i})`}
                opacity={0.85}
              />
              {/* Value on top */}
              {value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="text-[8px] fill-slate-400"
                >
                  {value}
                </text>
              )}
              {/* Day label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 capitalize"
              >
                {day.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}
