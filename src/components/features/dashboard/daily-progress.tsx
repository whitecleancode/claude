"use client";

import { motion } from "framer-motion";
import { useHabitsWithStats } from "@/lib/hooks/use-habits";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useNutritionLogs, useNutritionGoal } from "@/lib/hooks/use-nutrition";
import { toDateString } from "@/lib/utils/dates";

function getWaterProgress(): number {
  if (typeof window === "undefined") return 0;
  const d = new Date();
  const key = `water-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const saved = localStorage.getItem(key);
  const goalKey = "water-goal";
  const goal = Number(localStorage.getItem(goalKey)) || 8;
  return saved ? Math.min(Number(saved) / goal, 1) : 0;
}

export function DailyProgress() {
  const todayStr = toDateString(new Date());
  const { data: habits } = useHabitsWithStats();
  const { data: tasks } = useTasks({ status: "all" });
  const { data: logs } = useNutritionLogs(todayStr);
  const { data: goal } = useNutritionGoal();

  // Habits: % completed today
  const habitsTotal = habits?.length ?? 0;
  const habitsCompleted = habits?.filter((h) => h.completedToday).length ?? 0;
  const habitsScore = habitsTotal > 0 ? habitsCompleted / habitsTotal : 0;

  // Tasks: % done today
  const todayTasks = tasks?.filter((t) => t.status === "done") ?? [];
  const totalTasks = tasks?.length ?? 0;
  const tasksScore = totalTasks > 0 ? todayTasks.length / totalTasks : 0;

  // Nutrition: % of calorie goal
  const totalCals = logs?.reduce((s, l) => s + l.calories, 0) ?? 0;
  const calGoal = goal?.calories_target ?? 2000;
  const nutritionScore = Math.min(totalCals / calGoal, 1);

  // Water
  const waterScore = getWaterProgress();

  // Weighted average
  const scores = [habitsScore, tasksScore, nutritionScore, waterScore];
  const activeScores = scores.filter((_, i) => {
    if (i === 0) return habitsTotal > 0;
    if (i === 1) return totalTasks > 0;
    return true;
  });
  const overall = activeScores.length > 0
    ? Math.round((activeScores.reduce((a, b) => a + b, 0) / activeScores.length) * 100)
    : 0;

  const is100 = overall >= 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">
          Прогресс дня
        </span>
        <span className="text-sm font-bold text-neon-cyan">{overall}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, #06b6d4, #a855f7)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(overall, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {is100 && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "linear-gradient(90deg, #06b6d4, #a855f7)",
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
}
