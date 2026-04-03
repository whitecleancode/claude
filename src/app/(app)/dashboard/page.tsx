"use client";

import { Topbar } from "@/components/layout/topbar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Card } from "@/components/ui/card";

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
          <p className="text-sm text-slate-400 mt-1">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Card hoverable>
            <h3 className="text-sm font-medium text-slate-400 mb-3">
              Привычки на сегодня
            </h3>
            <p className="text-slate-500 text-sm">Виджет будет в Phase 7</p>
          </Card>
          <Card hoverable>
            <h3 className="text-sm font-medium text-slate-400 mb-3">
              Активные задачи
            </h3>
            <p className="text-slate-500 text-sm">Виджет будет в Phase 7</p>
          </Card>
          <Card hoverable>
            <h3 className="text-sm font-medium text-slate-400 mb-3">
              Питание сегодня
            </h3>
            <p className="text-slate-500 text-sm">Виджет будет в Phase 7</p>
          </Card>
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
