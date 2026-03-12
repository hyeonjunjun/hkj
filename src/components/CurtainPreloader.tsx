"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/store";

/**
 * CurtainPreloader — Nothing OS / Teenage Engineering
 *
 * Technical boot sequence with grid background,
 * binary progress counter, and system init language.
 */

export default function CurtainPreloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (sessionStorage.getItem("hkj-loaded-v3")) {
      setLoaded(true);
      setTimeout(() => setVisible(false), 0);
      return;
    }

    const start = performance.now();
    const duration = 2000;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("hkj-loaded-v3", "1");
        setLoaded(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col justify-between overflow-hidden"
          style={{ backgroundColor: "var(--color-bg)" }}
          initial={{ opacity: 1 }}
          animate={isLoaded ? { opacity: 0 } : { opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
            delay: isLoaded ? 0.2 : 0,
          }}
          onAnimationComplete={() => {
            if (isLoaded) setVisible(false);
          }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Top bar — system labels */}
          <div
            className="relative z-10 flex items-start justify-between w-full"
            style={{ padding: "var(--page-px)" }}
          >
            <div className="flex flex-col gap-1">
              <span
                className="font-mono uppercase tracking-[0.15em]"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text)",
                }}
              >
                HKJ-01
              </span>
              <span
                className="font-mono uppercase tracking-[0.2em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                SYS.INIT
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className="font-mono uppercase tabular-nums tracking-[0.15em]"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text)",
                }}
              >
                {String(progress).padStart(3, "0")}%
              </span>
              <span
                className="font-mono uppercase tracking-[0.2em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: progress === 100
                    ? "var(--color-accent)"
                    : "var(--color-text-ghost)",
                }}
              >
                {progress === 100 ? "READY" : "LOADING"}
              </span>
            </div>
          </div>

          {/* Center — large brand + progress bar */}
          <div
            className="relative z-10 flex-1 flex flex-col items-center justify-center"
            style={{ padding: "0 var(--page-px)" }}
          >
            {/* Brand */}
            <motion.span
              className="font-display font-bold uppercase tracking-tighter leading-none"
              style={{
                fontSize: "clamp(5rem, 20vw, 16rem)",
                color: "var(--color-text)",
                opacity: 0.08,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              transition={{ duration: 0.6 }}
            >
              HKJ
            </motion.span>

            {/* Progress bar — centered below brand */}
            <div
              className="w-full max-w-xs mt-8"
              style={{ height: 2, backgroundColor: "var(--color-border)" }}
            >
              <div
                className="h-full origin-left"
                style={{
                  backgroundColor: "var(--color-accent)",
                  width: `${progress}%`,
                  transition: "width 80ms linear",
                }}
              />
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="relative z-10 flex items-end justify-between w-full"
            style={{ padding: "var(--page-px)" }}
          >
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              Design Engineering
            </span>
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              NYC / Seoul
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
