"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function TasksPage() {
  return (
    <>
      <Topbar title="Задачи" />
      <div className="p-4 lg:p-6">
        <Card>
          <p className="text-slate-400">Модуль задач будет реализован в Phase 5</p>
        </Card>
      </div>
    </>
  );
}
