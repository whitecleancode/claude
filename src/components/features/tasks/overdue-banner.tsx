"use client";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface OverdueBannerProps {
  count: number;
  onClick: () => void;
}

export function OverdueBanner({ count, onClick }: OverdueBannerProps) {
  if (count === 0) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl border border-neon-pink/30 bg-neon-pink/5 cursor-pointer hover:bg-neon-pink/10 transition-colors"
      style={{ boxShadow: "0 0 16px rgba(236,72,153,0.1)" }}
    >
      <div className="h-8 w-8 rounded-full bg-neon-pink/20 flex items-center justify-center shrink-0">
        <AlertTriangle className="h-4 w-4 text-neon-pink" />
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-neon-pink">
          {count} {count === 1 ? "просроченная задача" : count < 5 ? "просроченные задачи" : "просроченных задач"}
        </p>
        <p className="text-xs text-slate-400">Нажмите, чтобы посмотреть</p>
      </div>
    </motion.button>
  );
}
