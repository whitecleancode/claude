"use client";

import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Settings2 } from "lucide-react";
import { toDateString } from "@/lib/utils/dates";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { MacroRings } from "@/components/features/nutrition/macro-rings";
import { MealCard } from "@/components/features/nutrition/meal-card";
import { MealLogForm } from "@/components/features/nutrition/meal-log-form";
import { GoalsForm } from "@/components/features/nutrition/goals-form";
import {
  useNutritionLogs,
  useNutritionGoal,
  useDailySummary,
} from "@/lib/hooks/use-nutrition";
import { MEAL_TYPES } from "@/lib/utils/constants";
import type { MealType } from "@/types/nutrition";

export default function NutritionPage() {
  const [date, setDate] = useState(new Date());
  const dateStr = toDateString(date);
  const [formOpen, setFormOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [defaultMeal, setDefaultMeal] = useState<MealType>("snack");

  const { data: logs, isLoading } = useNutritionLogs(dateStr);
  const { data: goal } = useNutritionGoal();
  const summary = useDailySummary(logs);

  const openMealForm = (mealType: MealType) => {
    setDefaultMeal(mealType);
    setFormOpen(true);
  };

  return (
    <>
      <Topbar title="Питание" />
      <div className="p-4 lg:p-6 space-y-4 max-w-2xl">
        {/* Date navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setDate(subDays(date, 1))}
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium capitalize">
            {format(date, "EEEE, d MMMM", { locale: ru })}
          </span>
          <button
            onClick={() => setDate(addDays(date, 1))}
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Macro rings */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-400">
              Дневная сводка
            </h3>
            <button
              onClick={() => setGoalsOpen(true)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Настроить цели"
            >
              <Settings2 className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <MacroRings summary={summary} goal={goal ?? null} />
        </Card>

        {/* Meals by type */}
        {isLoading && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!isLoading &&
          (Object.keys(MEAL_TYPES) as MealType[]).map((mealType) => {
            const mealLogs = logs?.filter((l) => l.meal_type === mealType) ?? [];
            const mealInfo = MEAL_TYPES[mealType];

            return (
              <Card key={mealType} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <span>{mealInfo.icon}</span>
                    {mealInfo.label}
                    {mealLogs.length > 0 && (
                      <span className="text-xs text-slate-500">
                        ({mealLogs.reduce((s, l) => s + l.calories, 0)} ккал)
                      </span>
                    )}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openMealForm(mealType)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {mealLogs.length === 0 && (
                  <p className="text-xs text-slate-500 py-2">
                    Нет записей
                  </p>
                )}

                {mealLogs.map((log) => (
                  <MealCard key={log.id} log={log} />
                ))}
              </Card>
            );
          })}
      </div>

      <MealLogForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        date={dateStr}
        defaultMealType={defaultMeal}
      />
      <GoalsForm
        isOpen={goalsOpen}
        onClose={() => setGoalsOpen(false)}
        current={goal ?? null}
      />
    </>
  );
}
