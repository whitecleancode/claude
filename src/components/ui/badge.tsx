import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

const variants = {
  default: "bg-white/10 text-slate-300",
  cyan: "bg-neon-cyan/10 text-neon-cyan",
  purple: "bg-neon-purple/10 text-neon-purple",
  pink: "bg-neon-pink/10 text-neon-pink",
  green: "bg-neon-green/10 text-neon-green",
  amber: "bg-neon-amber/10 text-neon-amber",
} as const;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants;
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
