"use client";

import { useState, useEffect } from "react";
import { Droplets, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";

const GOAL = 8;

function getStorageKey(): string {
  const d = new Date();
  return `water-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function WaterWidget() {
  const [glasses, setGlasses] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) setGlasses(Number(saved));
  }, []);

  const update = (n: number) => {
    const next = Math.max(0, Math.min(n, 20));
    setGlasses(next);
    localStorage.setItem(getStorageKey(), String(next));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Droplets className="h-4 w-4 text-neon-cyan" />
          Водный баланс
        </h3>
        <span className="text-xs text-slate-400">{glasses} / {GOAL} стаканов</span>
      </div>

      <ProgressBar value={glasses} max={GOAL} color="cyan" />

      <div className="flex items-center justify-center gap-4 mt-3">
        <button
          onClick={() => update(glasses - 1)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex gap-1">
          {Array.from({ length: GOAL }, (_, i) => (
            <div
              key={i}
              className={`h-6 w-2 rounded-full transition-all ${
                i < glasses ? "bg-neon-cyan shadow-[0_0_4px_rgba(6,182,212,0.4)]" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => update(glasses + 1)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
