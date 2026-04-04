import { cn } from "@/lib/utils/cn";

const colorMap = {
  cyan: "stroke-neon-cyan",
  purple: "stroke-neon-purple",
  pink: "stroke-neon-pink",
  green: "stroke-neon-green",
  amber: "stroke-neon-amber",
} as const;

const glowColorMap = {
  cyan: "#06b6d4",
  purple: "#a855f7",
  pink: "#ec4899",
  green: "#22c55e",
  amber: "#f59e0b",
} as const;

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: keyof typeof colorMap;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  value,
  max,
  size = 80,
  strokeWidth = 6,
  color = "cyan",
  className,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-white/5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-700", colorMap[color])}
          style={{ filter: `drop-shadow(0 0 4px ${glowColorMap[color]})` }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
