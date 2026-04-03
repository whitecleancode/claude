"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function HabitsPage() {
  return (
    <>
      <Topbar title="Привычки" />
      <div className="p-4 lg:p-6">
        <Card>
          <p className="text-slate-400">Модуль привычек будет реализован в Phase 4</p>
        </Card>
      </div>
    </>
  );
}
