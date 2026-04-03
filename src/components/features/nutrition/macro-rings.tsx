"use client";

import { ProgressRing } from "@/components/ui/progress-ring";
import type { DailySummary, NutritionGoal } from "@/types/nutrition";

interface MacroRingsProps {
  summary: DailySummary;
  goal: NutritionGoal | null;
  compact?: boolean;
}

export function MacroRings({ summary, goal, compact = false }: MacroRingsProps) {
  const size = compact ? 64 : 80;
  const stroke = compact ? 5 : 6;

  const items = [
    {
      label: "Калории",
      value: summary.calories,
      max: goal?.calories_target ?? 2000,
      unit: "ккал",
      color: "cyan" as const,
    },
    {
      label: "Белки",
      value: summary.protein,
      max: goal?.protein_target ?? 150,
      unit: "г",
      color: "green" as const,
    },
    {
      label: "Жиры",
      value: summary.fat,
      max: goal?.fat_target ?? 65,
      unit: "г",
      color: "amber" as const,
    },
    {
      label: "Углеводы",
      value: summary.carbs,
      max: goal?.carbs_target ?? 250,
      unit: "г",
      color: "purple" as const,
    },
  ];

  return (
    <div className="flex items-center justify-around gap-2">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1">
          <ProgressRing
            value={item.value}
            max={Number(item.max)}
            size={size}
            strokeWidth={stroke}
            color={item.color}
          >
            <span className="text-xs font-bold">
              {Math.round(item.value)}
            </span>
          </ProgressRing>
          <span className="text-[10px] text-slate-400">{item.label}</span>
          <span className="text-[10px] text-slate-500">
            / {Math.round(Number(item.max))} {item.unit}
          </span>
        </div>
      ))}
    </div>
  );
}
