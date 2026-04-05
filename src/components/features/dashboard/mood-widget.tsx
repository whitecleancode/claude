"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const MOODS = [
  { emoji: "😫", label: "Ужасно", color: "rgba(236,72,153,0.4)" },
  { emoji: "😕", label: "Плохо", color: "rgba(245,158,11,0.4)" },
  { emoji: "😐", label: "Норм", color: "rgba(100,116,139,0.4)" },
  { emoji: "😊", label: "Хорошо", color: "rgba(34,197,94,0.4)" },
  { emoji: "🔥", label: "Отлично", color: "rgba(6,182,212,0.4)" },
];

function getMoodKey(): string {
  const d = new Date();
  return `mood-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function MoodWidget() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(getMoodKey());
    if (saved !== null) setSelected(Number(saved));
  }, []);

  const select = (index: number) => {
    setSelected(index);
    localStorage.setItem(getMoodKey(), String(index));
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-slate-400 mb-3">
        Как настроение?
      </h3>
      <div className="flex items-center justify-around">
        {MOODS.map((mood, i) => (
          <button
            key={i}
            onClick={() => select(i)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer",
              selected === i
                ? "scale-110"
                : "opacity-60 hover:opacity-100"
            )}
            style={
              selected === i
                ? { boxShadow: `0 0 16px ${mood.color}`, background: `${mood.color.replace("0.4", "0.1")}` }
                : undefined
            }
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] text-slate-400">{mood.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
