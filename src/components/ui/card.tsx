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
        "glass-card glass-card-glow p-6 animate-card-in",
        hoverable && "transition-all duration-300 hover:bg-glass-hover hover:border-glass-border-hover hover:shadow-[0_0_25px_rgba(6,182,212,0.2),0_0_50px_rgba(168,85,247,0.1)] hover:scale-[1.01]",
        glow && glowMap[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
