"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StreakBadge } from "./streak-badge";
import { HabitTracker } from "./habit-tracker";
import type { HabitWithStats } from "@/types/habits";

interface HabitCardProps {
  habit: HabitWithStats;
  completedDates: string[];
}

export function HabitCard({ habit, completedDates }: HabitCardProps) {
  return (
    <Card hoverable className="space-y-3">
      <div className="flex items-center justify-between">
        <Link
          href={`/habits/${habit.id}`}
          className="flex items-center gap-3 group"
        >
          <div
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: habit.color }}
          />
          <h3 className="font-medium group-hover:text-neon-cyan transition-colors">
            {habit.name}
          </h3>
        </Link>
        <StreakBadge streak={habit.currentStreak} />
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
