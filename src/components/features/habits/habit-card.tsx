"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StreakBadge } from "./streak-badge";
import { HabitTracker } from "./habit-tracker";
import { useDeleteHabit } from "@/lib/hooks/use-habits";
import type { Habit, HabitWithStats } from "@/types/habits";

interface HabitCardProps {
  habit: HabitWithStats;
  completedDates: string[];
  onEdit?: (habit: Habit) => void;
}

export function HabitCard({ habit, completedDates, onEdit }: HabitCardProps) {
  const deleteHabit = useDeleteHabit();
  const [reminderTime, setReminderTime] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`habit-reminder-${habit.id}`);
    setReminderTime(saved);
  }, [habit.id]);

  return (
    <Card hoverable className="space-y-3 group">
      <div className="flex items-center justify-between">
        <Link
          href={`/habits/${habit.id}`}
          className="flex items-center gap-3 group/link"
        >
          <div
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <h3 className="font-medium group-hover/link:text-neon-cyan transition-colors">
            {habit.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {reminderTime && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
              <Clock className="h-3 w-3" />
              {reminderTime}
            </span>
          )}
          <StreakBadge streak={habit.currentStreak} />
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              className="p-1 rounded opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-slate-400" />
            </button>
          )}
          <button
            onClick={() => deleteHabit.mutate(habit.id)}
            disabled={deleteHabit.isPending}
            className="p-1 rounded opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {deleteHabit.isPending ? (
              <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {habit.description && (
        <p className="text-sm text-slate-400 line-clamp-1">
          {habit.description}
        </p>
      )}

      <HabitTracker
        habitId={habit.id}
        color={habit.color}
        completedDates={completedDates}
      />
    </Card>
  );
}
