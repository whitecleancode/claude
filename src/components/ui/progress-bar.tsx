import { cn } from "@/lib/utils/cn";

const colorMap = {
  cyan: "from-neon-cyan-dark to-neon-cyan-light",
  purple: "from-neon-purple-dark to-neon-purple-light",
  pink: "from-neon-pink-dark to-neon-pink-light",
  green: "from-neon-green-dark to-neon-green-light",
  amber: "from-neon-amber-dark to-neon-amber-light",
} as const;

const glowMap = {
  cyan: "shadow-[0_0_8px_rgba(6,182,212,0.4)]",
  purple: "shadow-[0_0_8px_rgba(168,85,247,0.4)]",
  pink: "shadow-[0_0_8px_rgba(236,72,153,0.4)]",
  green: "shadow-[0_0_8px_rgba(34,197,94,0.4)]",
  amber: "shadow-[0_0_8px_rgba(245,158,11,0.4)]",
} as const;

interface ProgressBarProps {
  value: number;
  max: number;
  color?: keyof typeof colorMap;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max,
  color = "cyan",
  className,
  showLabel = false,
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>
            {value} / {max}
          </span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500",
            colorMap[color],
            glowMap[color]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
