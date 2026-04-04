"use client";

import { Topbar } from "@/components/layout/topbar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { HabitsWidget } from "@/components/features/dashboard/habits-widget";
import { TasksWidget } from "@/components/features/dashboard/tasks-widget";
import { NutritionWidget } from "@/components/features/dashboard/nutrition-widget";

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const greeting = getGreeting();

  return (
    <>
      <Topbar title="Дашборд" />
      <div className="p-4 lg:p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            {greeting},{" "}
            <span className="neon-text-cyan">
              {profile?.full_name ?? "друг"}
            </span>
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
            📅{" "}
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HabitsWidget />
          <TasksWidget />
          <div className="md:col-span-2">
            <NutritionWidget />
          </div>
        </div>
      </div>
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "Доброй ночи";
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}
