"use client";

import { useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import type { Habit } from "@/types/habits";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkeletonCard } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { HabitCard } from "@/components/features/habits/habit-card";
import { HabitForm } from "@/components/features/habits/habit-form";
import { useHabitsWithStats, useHabitLogs, useArchivedHabits, useRestoreHabit } from "@/lib/hooks/use-habits";
import { toDateString, getLast7Days } from "@/lib/utils/dates";

export default function HabitsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [tab, setTab] = useState<"active" | "archive">("active");
  const { data: habits, isLoading, error } = useHabitsWithStats();
  const { data: archived } = useArchivedHabits();
  const restoreHabit = useRestoreHabit();

  const today = new Date();
  const days7 = getLast7Days(today);
  const startDate = toDateString(days7[0]);
  const endDate = toDateString(today);
  const { data: logs } = useHabitLogs(startDate, endDate);

  return (
    <>
      <Topbar title="Привычки" />
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {error ? "Ошибка загрузки" : habits ? `${habits.length} привычек` : "Загрузка..."}
          </p>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>

        <Tabs
          tabs={[
            { label: "Активные", value: "active" },
            { label: `Архив${archived?.length ? ` (${archived.length})` : ""}`, value: "archive" },
          ]}
          value={tab}
          onChange={(v) => setTab(v as "active" | "archive")}
        />

        {tab === "active" && (
          <>
            {isLoading && (
              <div className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}

            {habits && habits.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">
                  У вас пока нет привычек
                </p>
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Создать первую привычку
                </Button>
              </div>
            )}

            {habits && habits.length > 0 && (
              <div className="space-y-3">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completedDates={
                      logs
                        ?.filter((l) => l.habit_id === habit.id)
                        .map((l) => l.completed_date) ?? []
                    }
                    onEdit={(h) => { setEditHabit(h); setFormOpen(true); }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "archive" && (
          <>
            {(!archived || archived.length === 0) && (
              <div className="text-center py-12">
                <p className="text-slate-500">Архив пуст</p>
              </div>
            )}

            {archived && archived.length > 0 && (
              <div className="space-y-3">
                {archived.map((habit) => (
                  <Card key={habit.id} className="p-4 opacity-60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: habit.color }}
                      />
                      <span className="text-sm line-through">{habit.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => restoreHabit.mutate(habit.id)}
                      loading={restoreHabit.isPending}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Восстановить
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <HabitForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditHabit(null); }} habit={editHabit} />
    </>
  );
}
