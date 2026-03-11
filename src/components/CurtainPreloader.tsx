"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStudioStore } from "@/lib/store";

/**
 * Preloader — a quiet brand moment.
 * Serif "HKJ" with a gold accent line, then clip-path reveal out.
 */

const letterDrop = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

export default function CurtainPreloader() {
  const [visible, setVisible] = useState(true);
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);

  useEffect(() => {
    // Check sessionStorage — only show on first visit
    if (sessionStorage.getItem("hkj-loaded")) {
      setLoaded(true);
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("hkj-loaded", "1");
      setLoaded(true);
    }, 2200);
    return () => clearTimeout(timer);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ backgroundColor: "var(--color-bg)" }}
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={
            isLoaded
              ? { clipPath: "inset(0 0 100% 0)" }
              : { clipPath: "inset(0 0 0 0)" }
          }
          transition={{
            duration: 0.9,
            ease: [0.76, 0, 0.24, 1],
            delay: isLoaded ? 0.3 : 0,
          }}
          onAnimationComplete={() => {
            if (isLoaded) setVisible(false);
          }}
        >
          <motion.div
            className="flex flex-col items-center select-none"
            animate={isLoaded ? { scale: 0.95, opacity: 0 } : {}}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* HKJ in serif */}
            <motion.div
              className="font-serif italic flex overflow-hidden"
              style={{ fontSize: "var(--text-3xl)", letterSpacing: "0.05em" }}
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.06, delayChildren: 0.3 }}
            >
              {"HKJ".split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterDrop}
                  className="inline-block will-change-transform"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Gold accent line */}
            <motion.div
              className="mt-4"
              style={{ backgroundColor: "var(--color-gold)" }}
              initial={{ width: 0, height: 1 }}
              animate={{ width: 40 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Subtitle */}
            <motion.p
              className="font-mono uppercase tracking-[0.3em] mt-4"
              style={{
                color: "var(--color-text-dim)",
                fontSize: "var(--text-xs)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              Studio
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
