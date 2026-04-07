"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";

/** Single digit column that rolls like an odometer */
function DigitRoll({ digit }: { digit: number }) {
  return (
    <div
      style={{
        height: 14,
        overflow: "hidden",
        width: "0.65em",
        position: "relative",
      }}
    >
      <motion.div
        animate={{ y: -digit * 14 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div
            key={n}
            style={{
              height: 14,
              lineHeight: "14px",
              textAlign: "center",
            }}
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Preloader() {
  const preloaderDone = useTheaterStore((s) => s.preloaderDone);
  const setPreloaderDone = useTheaterStore((s) => s.setPreloaderDone);

  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const DURATION = 2200;
  const HOLD = 400;

  useEffect(() => {
    if (preloaderDone) {
      setVisible(false);
      return;
    }

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      // Ease-out curve for more natural counting
      const eased = 1 - Math.pow(1 - progress, 2);
      const value = Math.round(eased * 100);
      setCount(value);

      if (value < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), HOLD);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [preloaderDone]);

  if (preloaderDone) return null;

  // Split count into individual digits: [hundreds, tens, ones]
  const padded = String(count).padStart(3, "0");
  const digits = padded.split("").map(Number);

  return (
    <AnimatePresence onExitComplete={() => setPreloaderDone()}>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {/* Odometer counter */}
          <div
            style={{
              display: "flex",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.2em",
              color: "var(--fg)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <DigitRoll digit={digits[0]} />
            <DigitRoll digit={digits[1]} />
            <DigitRoll digit={digits[2]} />
          </div>

          {/* Detail text */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
            }}
          >
            40.7128&deg; N &mdash; Loading
          </motion.span>

          {/* Progress line */}
          <div
            style={{
              width: 80,
              height: 1,
              background: "var(--fg-4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                width: `${count}%`,
                background: "var(--fg-3)",
              }}
              transition={{ duration: 0.06 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
