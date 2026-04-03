"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StreakBadge } from "@/components/features/habits/streak-badge";
import { HabitStats } from "@/components/features/habits/habit-stats";
import { HabitForm } from "@/components/features/habits/habit-form";
import { useHabitsWithStats, useDeleteHabit } from "@/lib/hooks/use-habits";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Каждый день",
  weekdays: "Будни",
  weekends: "Выходные",
  custom: "По дням",
};

export default function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: habits, isLoading } = useHabitsWithStats();
  const deleteHabit = useDeleteHabit();
  const [editOpen, setEditOpen] = useState(false);

  const habit = habits?.find((h) => h.id === id);

  if (!isLoading && !habit) {
    notFound();
  }

  const handleDelete = async () => {
    if (!habit) return;
    await deleteHabit.mutateAsync(habit.id);
    router.push("/habits");
  };

  return (
    <>
      <Topbar title="Детали привычки" />
      <div className="p-4 lg:p-6 space-y-4 max-w-2xl">
        <Link
          href="/habits"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Link>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        )}

        {habit && (
          <>
            <Card className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <h2 className="text-xl font-bold">{habit.name}</h2>
                  <StreakBadge streak={habit.currentStreak} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={deleteHabit.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {habit.description && (
                <p className="text-sm text-slate-400">{habit.description}</p>
              )}

              <div className="flex gap-2">
                <Badge variant="cyan">
                  {FREQUENCY_LABELS[habit.frequency]}
                </Badge>
                <Badge>
                  Выполнение за 7 дн: {habit.completionRate7d}%
                </Badge>
              </div>
            </Card>

            <HabitStats habitId={habit.id} color={habit.color} />

            <HabitForm
              isOpen={editOpen}
              onClose={() => setEditOpen(false)}
              habit={habit}
            />
          </>
        )}
      </div>
    </>
  );
}
