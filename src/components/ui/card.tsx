"use client";

import { cn } from "@/lib/utils/cn";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  glow?: "cyan" | "purple" | "pink" | "green";
  hoverable?: boolean;
  animate?: boolean;
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "glass-card glass-card-glow p-6",
        hoverable && "transition-all duration-300 hover:bg-glass-hover hover:border-glass-border-hover hover:shadow-[0_0_25px_rgba(6,182,212,0.2),0_0_50px_rgba(168,85,247,0.1)] hover:scale-[1.01]",
        glow && glowMap[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
