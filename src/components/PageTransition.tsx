"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";

/**
 * PageTransition — Cathydolle-faithful clip-path + scale transition
 *
 * Enter: clip-path inset(100% 0 0 0) → inset(0 0 0 0), 1.75s
 * Exit:  scale 1 → 0.9, opacity 1 → 0.25, 1.75s
 * Easing: cubic-bezier(0.86, 0, 0.07, 1)
 */
const CINEMATIC = [0.86, 0, 0.07, 1] as const;
const DURATION = 1.75;

export default function PageTransition() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const clipProgress = useMotionValue(100); // inset top %
  const overlayOpacity = useMotionValue(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const sequence = async () => {
      // Enter: clip-path reveals from bottom to top
      clipProgress.set(100);
      overlayOpacity.set(1);

      await animate(clipProgress, 0, {
        duration: DURATION,
        ease: CINEMATIC,
      });

      // After reveal completes, hide overlay
      overlayOpacity.set(0);
      clipProgress.set(100);
    };

    sequence();
  }, [pathname, clipProgress, overlayOpacity]);

  return (
    <motion.div
      className="fixed inset-0 z-[999] pointer-events-none"
      style={{
        opacity: overlayOpacity,
        clipPath: useTransform(clipProgress, (v) => `inset(${v}% 0 0 0)`),
        backgroundColor: "var(--color-bg)",
      }}
    />
  );
}
