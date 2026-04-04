"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MacroRings } from "@/components/features/nutrition/macro-rings";
import {
  useNutritionLogs,
  useNutritionGoal,
  useDailySummary,
} from "@/lib/hooks/use-nutrition";
import { toDateString } from "@/lib/utils/dates";

export function NutritionWidget() {
  const todayStr = toDateString(new Date());
  const { data: logs, isLoading, error } = useNutritionLogs(todayStr);
  const { data: goal } = useNutritionGoal();
  const summary = useDailySummary(logs);

  return (
    <Card hoverable className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">
          Питание сегодня
        </h3>
        <Link
          href="/nutrition"
          className="text-xs text-neon-cyan hover:underline flex items-center gap-1"
        >
          Подробнее <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-around">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-neon-pink/80 py-2">Ошибка загрузки</p>
      )}

      {!isLoading && !error && (
        <MacroRings summary={summary} goal={goal ?? null} compact />
      )}
    </Card>
  );
}
