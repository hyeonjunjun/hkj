"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Variant = "default" | "thumbnail" | "hero" | "portrait";
type AccentGradient = "warm" | "cool";

interface GeometricFrameProps {
  variant?: Variant;
  accentGradient?: AccentGradient;
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}

const cornerLength: Record<Variant, number> = {
  default: 12,
  thumbnail: 8,
  hero: 18,
  portrait: 14,
};

export default function GeometricFrame({
  variant = "default",
  accentGradient = "warm",
  children,
  className,
  layoutId,
}: GeometricFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const len = cornerLength[variant];
  const glowColor =
    accentGradient === "warm"
      ? "var(--accent-warm-1)"
      : "var(--accent-cool-1)";

  const showGlow = variant !== "thumbnail";

  return (
    <motion.div
      ref={ref}
      className={`geo-frame-wrap relative${className ? ` ${className}` : ""}`}
      layoutId={layoutId}
    >
      {children}

      {/* SVG overlay */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          overflow: "visible",
        }}
        preserveAspectRatio="none"
      >
        {/* Glow gradient definition */}
        {showGlow && (
          <defs>
            <radialGradient id={`glow-${layoutId ?? "default"}`} cx="0" cy="0" r="1">
              <stop offset="0%" stopColor={glowColor} stopOpacity="0.45" />
              <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </radialGradient>
          </defs>
        )}

        {/* Main border rect */}
        <motion.rect
          x="0.5%"
          y="0.5%"
          width="99%"
          height="99%"
          fill="none"
          stroke="var(--fg-3)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Corner accent — top-left horizontal */}
        <motion.line
          x1="0.5%"
          y1="0.5%"
          x2={`${0.5 + len}%`}
          y2="0.5%"
          stroke="var(--fg-2)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
        />

        {/* Corner accent — top-left vertical */}
        <motion.line
          x1="0.5%"
          y1="0.5%"
          x2="0.5%"
          y2={`${0.5 + len}%`}
          stroke="var(--fg-2)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.8 }}
        />

        {/* Glow pulse at top-left corner */}
        {showGlow && (
          <motion.circle
            cx="0.5%"
            cy="0.5%"
            r="24"
            fill={`url(#glow-${layoutId ?? "default"})`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={
              isInView
                ? { opacity: [0, 1, 0], scale: [0.5, 1.2, 1.4] }
                : { opacity: 0, scale: 0.5 }
            }
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.8 }}
          />
        )}
      </svg>
    </motion.div>
  );
}
