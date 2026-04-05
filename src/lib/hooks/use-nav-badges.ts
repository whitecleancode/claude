"use client";

import { useHabitsWithStats } from "./use-habits";
import { useTasks } from "./use-tasks";

export function useNavBadges() {
  const { data: habits } = useHabitsWithStats();
  const { data: tasks } = useTasks({ status: "all" });

  const incompleteHabits = habits
    ? habits.filter((h) => !h.completedToday).length
    : 0;

  const overdueTasks = tasks
    ? tasks.filter((t) => {
        if (t.status === "done" || t.status === "cancelled") return false;
        if (!t.due_date) return false;
        const due = new Date(t.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
      }).length
    : 0;

  return { incompleteHabits, overdueTasks };
}
