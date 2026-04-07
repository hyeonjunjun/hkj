"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursorState, type CursorState } from "@/hooks/useCursorState";

const SPRING = { stiffness: 500, damping: 35, mass: 0.3 };

const SIZE: Record<CursorState, number> = {
  default: 16,
  media: 40,
  link: 6,
  idle: 16,
};

export default function Cursor() {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const { state, velocity } = useCursorState();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, SPRING);
  const springY = useSpring(mouseY, SPRING);

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isTouch, mouseX, mouseY]);

  if (isTouch) return null;

  const r = SIZE[state] / 2;
  const tickOp = state === "idle" ? 0.15 : state === "link" ? 0 : 0.3;
  const rot = state === "idle" ? 45 : velocity > 10 ? velocity * 0.3 : 0;
  const circleOp = state === "idle" ? 0.15 : 0.35;

  return (
    <motion.div
      className="cursor-overlay"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <svg width={64} height={64} viewBox="-32 -32 64 64" overflow="visible">
        {/* Main ring */}
        <motion.circle
          cx={0}
          cy={0}
          fill="none"
          stroke="var(--accent-cool-1)"
          strokeWidth={0.75}
          animate={{ r, opacity: circleOp }}
          transition={{ type: "spring" as const, ...SPRING }}
        />

        {/* Tick marks */}
        <motion.g
          animate={{ rotate: rot, opacity: tickOp }}
          transition={{ type: "spring" as const, stiffness: 150, damping: 20 }}
        >
          {[0, 90, 180, 270].map((angle) => (
            <line
              key={angle}
              x1={0}
              y1={-(r + 3)}
              x2={0}
              y2={-(r + 6)}
              stroke="var(--accent-cool-1)"
              strokeWidth={0.75}
              transform={`rotate(${angle})`}
            />
          ))}
        </motion.g>

        {/* Warm ring on media hover */}
        {state === "media" && (
          <motion.circle
            cx={0}
            cy={0}
            r={22}
            fill="none"
            stroke="var(--accent-warm-1)"
            strokeWidth={0.5}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ type: "spring" as const, ...SPRING }}
          />
        )}
      </svg>
    </motion.div>
  );
}
