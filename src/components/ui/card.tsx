import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "purple" | "pink" | "green";
  hoverable?: boolean;
}

const glowMap = {
  cyan: "neon-glow-cyan",
  purple: "neon-glow-purple",
  pink: "neon-glow-pink",
  green: "neon-glow-green",
} as const;

export function Card({
  className,
  glow,
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6",
        hoverable && "transition-all duration-300 hover:bg-glass-hover hover:border-glass-border-hover",
        glow && glowMap[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
