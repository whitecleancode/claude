"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { Habit } from "@/types/habits";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { HabitCard } from "@/components/features/habits/habit-card";
import { HabitForm } from "@/components/features/habits/habit-form";
import { useHabitsWithStats, useHabitLogs } from "@/lib/hooks/use-habits";
import { toDateString, getLast7Days } from "@/lib/utils/dates";

export default function HabitsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const { data: habits, isLoading } = useHabitsWithStats();

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
            {habits ? `${habits.length} привычек` : "Загрузка..."}
          </p>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>

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
      </div>

      <HabitForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditHabit(null); }} habit={editHabit} />
    </>
  );
}
