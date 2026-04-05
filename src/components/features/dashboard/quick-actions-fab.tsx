"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Target, ListTodo, Utensils, Droplets } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const ACTIONS = [
  { label: "Привычка", icon: Target, href: "/habits", color: "from-neon-green to-neon-cyan" },
  { label: "Задача", icon: ListTodo, href: "/tasks", color: "from-neon-purple to-neon-pink" },
  { label: "Питание", icon: Utensils, href: "/nutrition", color: "from-neon-amber to-neon-pink" },
  { label: "Вода", icon: Droplets, href: "/dashboard", color: "from-neon-cyan to-neon-purple" },
];

export function QuickActionsFAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed right-4 z-40 lg:hidden" style={{ bottom: "calc(5rem + var(--safe-bottom))" }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3 items-end"
          >
            {ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setOpen(false);
                    router.push(action.href);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span className="text-xs text-slate-300 bg-surface-secondary/90 px-2 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                    {action.label}
                  </span>
                  <div className={cn("h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg", action.color)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="h-14 w-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 45 : 0 }}
      >
        {open ? <X className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
      </motion.button>
    </div>
  );
}
