import { cn } from "@/lib/utils/cn";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  if (streak === 0) return null;

  const isHot = streak >= 7;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border",
        isHot
          ? "bg-neon-amber/10 border-neon-amber/30 text-neon-amber neon-glow-amber"
          : "bg-white/5 border-white/10 text-slate-400",
        className
      )}
    >
      <span className="text-base">{isHot ? "🔥" : "🔥"}</span>
      <span>{streak}</span>
      {isHot && <span className="text-base">🏆</span>}
    </div>
  );
}
