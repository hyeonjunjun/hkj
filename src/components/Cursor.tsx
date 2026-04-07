"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { useCursorState, type CursorState } from "@/hooks/useCursorState";

const SPRING_CONFIG = { stiffness: 300, damping: 28, mass: 0.5 };

const SIZE_MAP: Record<CursorState, number> = {
  media: 48,
  link: 8,
  default: 20,
  idle: 20,
};

const TICK_OPACITY: Record<CursorState, number> = {
  default: 0.4,
  media: 0.4,
  idle: 0.1,
  link: 0,
};

function tickRotation(state: CursorState, velocity: number): number {
  if (state === "idle") return 45;
  if (velocity > 10) return velocity * 0.5;
  return 0;
}

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(true); // SSR-safe default

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const { state, velocity } = useCursorState();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  useEffect(() => {
    if (isTouch) return;

    const handleMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [isTouch, mouseX, mouseY]);

  if (isTouch) return null;

  const radius = SIZE_MAP[state];
  const tickOp = TICK_OPACITY[state];
  const rot = tickRotation(state, velocity);

  // Tick mark positions scale with radius
  const tickGap = 4;
  const tickLen = 6;
  const tickStart = radius / 2 + tickGap;
  const tickEnd = tickStart + tickLen;

  const ticks = [
    { x1: 0, y1: -tickStart, x2: 0, y2: -tickEnd },     // top
    { x1: tickStart, y1: 0, x2: tickEnd, y2: 0 },        // right
    { x1: 0, y1: tickStart, x2: 0, y2: tickEnd },        // bottom
    { x1: -tickStart, y1: 0, x2: -tickEnd, y2: 0 },      // left
  ];

  return (
    <motion.div
      className="cursor-overlay"
      style={{
        x: springX,
        y: springY,
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
      }}
    >
      <svg width={80} height={80} viewBox="-40 -40 80 80">
        {/* Main circle */}
        <motion.circle
          cx={0}
          cy={0}
          r={radius / 2}
          fill="none"
          stroke="var(--accent-cool-1)"
          strokeWidth={1}
          animate={{ r: radius / 2 }}
          transition={{ type: "spring", ...SPRING_CONFIG }}
        />

        {/* Warm glow on media */}
        {state === "media" && (
          <motion.circle
            cx={0}
            cy={0}
            r={24}
            fill="none"
            stroke="var(--accent-warm-1)"
            strokeWidth={0.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Tick marks */}
        <motion.g
          animate={{ rotate: rot }}
          transition={{ type: "spring", ...SPRING_CONFIG }}
        >
          {ticks.map((t, i) => (
            <motion.line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="var(--accent-cool-1)"
              strokeWidth={1}
              animate={{
                opacity: tickOp,
                x1: t.x1,
                y1: t.y1,
                x2: t.x2,
                y2: t.y2,
              }}
              transition={{ type: "spring", ...SPRING_CONFIG }}
            />
          ))}
        </motion.g>
      </svg>
    </motion.div>
  );
}
