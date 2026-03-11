"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useStudioStore } from "@/lib/store";
import NothingEqLoader from "@/components/ui/NothingEqLoader";

/**
 * Preloader — High-Fidelity & Brutal
 * A mechanical dot-matrix style equalizer loader setting the tone.
 */

export default function CurtainPreloader() {
  const [visible, setVisible] = useState(true);
  const setLoaded = useStudioStore((s) => s.setLoaded);
  const isLoaded = useStudioStore((s) => s.isLoaded);

  useEffect(() => {
    // Check sessionStorage — only show on first visit
    if (sessionStorage.getItem("hkj-loaded-v2")) {
      setLoaded(true);
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("hkj-loaded-v2", "1");
      setLoaded(true);
    }, 2800); // Give enough time for the mechanical feel to register
    return () => clearTimeout(timer);
  }, [setLoaded]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={
            isLoaded
              ? { clipPath: "inset(0 0 100% 0)" }
              : { clipPath: "inset(0 0 0 0)" }
          }
          transition={{
            duration: 0.8,
            ease: [0.83, 0, 0.17, 1], // Sharp, mechanical ease
            delay: isLoaded ? 0.2 : 0,
          }}
          onAnimationComplete={() => {
            if (isLoaded) setVisible(false);
          }}
        >
          <motion.div
            className="flex flex-col items-center justify-center gap-6"
            animate={isLoaded ? { scale: 0.98, opacity: 0 } : {}}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <NothingEqLoader bars={5} segmentsPerBar={4} intervalMs={100} />

            {/* Brutalist loading text */}
            <motion.div
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888] flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span>Initializing State</span>
              <span className="w-1 h-1 bg-white inline-block animate-pulse" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

