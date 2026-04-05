"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#06b6d4", "#a855f7", "#ec4899", "#22c55e", "#f59e0b"];
const PARTICLE_COUNT = 40;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
}

export function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // Only trigger once per session
    const key = `confetti-${new Date().toISOString().split("T")[0]}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const newParticles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(10, 90),
      y: -10,
      color: COLORS[i % COLORS.length],
      size: randomBetween(6, 12),
      rotation: randomBetween(0, 360),
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: "-5vh",
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                rotate: p.rotation + randomBetween(180, 720),
                x: `${p.x + randomBetween(-15, 15)}vw`,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: randomBetween(2, 3.5),
                ease: "easeIn",
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size * 0.6,
                backgroundColor: p.color,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
