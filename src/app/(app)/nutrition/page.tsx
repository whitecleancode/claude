"use client";

import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function NutritionPage() {
  return (
    <>
      <Topbar title="Питание" />
      <div className="p-4 lg:p-6">
        <Card>
          <p className="text-slate-400">Модуль питания будет реализован в Phase 6</p>
        </Card>
      </div>
    </>
  );
}
