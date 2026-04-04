"use client";

import { Trash2, Pencil, Loader2 } from "lucide-react";
import { useDeleteNutritionLog } from "@/lib/hooks/use-nutrition";
import type { NutritionLog } from "@/types/nutrition";

interface MealCardProps {
  log: NutritionLog;
  onEdit?: (log: NutritionLog) => void;
}

export function MealCard({ log, onEdit }: MealCardProps) {
  const deleteLog = useDeleteNutritionLog();

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{log.name}</p>
        <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
          <span>{log.calories} ккал</span>
          <span>Б {Number(log.protein)}г</span>
          <span>Ж {Number(log.fat)}г</span>
          <span>У {Number(log.carbs)}г</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onEdit && (
          <button
            onClick={() => onEdit(log)}
            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5 text-slate-400" />
          </button>
        )}
        <button
          onClick={() => deleteLog.mutate(log.id)}
          disabled={deleteLog.isPending}
          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
        >
          {deleteLog.isPending ? (
            <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
}
