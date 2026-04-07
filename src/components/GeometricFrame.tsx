"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Variant = "default" | "thumbnail" | "hero" | "portrait";

interface GeometricFrameProps {
  variant?: Variant;
  accentGradient?: "warm" | "cool";
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}

export default function GeometricFrame({
  variant = "default",
  accentGradient = "warm",
  children,
  className = "",
  layoutId,
}: GeometricFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const accentColor =
    accentGradient === "warm" ? "var(--accent-warm-1)" : "var(--accent-cool-1)";
  const cornerLen = variant === "hero" ? 24 : variant === "thumbnail" ? 10 : 16;
  const showGlow = variant !== "thumbnail";

  return (
    <motion.div
      ref={ref}
      className={`geo-frame-wrap ${className}`}
      layoutId={layoutId}
    >
      {children}

      {/* Frame overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Border */}
        <div
          className="absolute inset-0"
          style={{ border: "1px solid var(--fg-4)" }}
        />

        {/* Top-left corner accent — horizontal */}
        <motion.div
          className="absolute top-0 left-0 h-px"
          style={{ width: cornerLen, background: accentColor }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Top-left corner accent — vertical */}
        <motion.div
          className="absolute top-0 left-0 w-px"
          style={{ height: cornerLen, background: accentColor }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Bottom-right corner accent — horizontal */}
        <motion.div
          className="absolute bottom-0 right-0 h-px"
          style={{ width: cornerLen, background: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Bottom-right corner accent — vertical */}
        <motion.div
          className="absolute bottom-0 right-0 w-px"
          style={{ height: cornerLen, background: accentColor, opacity: 0.5 }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Glow pulse — top-left, once */}
        {showGlow && (
          <motion.div
            className="absolute -top-3 -left-3 w-6 h-6 rounded-full"
            style={{
              background: `radial-gradient(circle, ${accentColor}, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 0.4, 0] } : {}}
            transition={{ duration: 1.2, delay: 0.6 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
