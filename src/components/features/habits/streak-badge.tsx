import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium",
        streak >= 7 ? "text-neon-amber" : "text-slate-400",
        className
      )}
    >
      <Flame
        className={cn(
          "h-4 w-4",
          streak >= 7 && "text-neon-amber drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]"
        )}
      />
      <span>{streak}</span>
    </div>
  );
}
