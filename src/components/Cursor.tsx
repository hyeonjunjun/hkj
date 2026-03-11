"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

/**
 * Cursor — soft gold orb that responds to context.
 *
 * States:
 *   default  → 10px warm glow orb
 *   link     → 4px dot
 *   image    → 60px ring with "View"
 *   explore  → 80px ring with "Explore"
 */

type CursorState = "default" | "link" | "image" | "explore";

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const exploreTarget = target.closest("[data-cursor='explore']");
      if (exploreTarget) {
        setCursorState("explore");
        return;
      }

      const imageTarget = target.closest(
        "[data-cursor='view'], img, video:not([data-cursor='explore'])"
      );
      if (imageTarget) {
        setCursorState("image");
        return;
      }

      const interactive = target.closest(
        "a, button, [role='button'], [role='link'], input, textarea, select"
      );
      if (interactive) {
        setCursorState("link");
        return;
      }

      setCursorState("default");
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const goldRgba = "196, 162, 101"; // --color-gold

  return (
    <>
      {/* Click Ripple */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            key="ripple"
            className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
            initial={{ width: 10, height: 10, opacity: 0.6 }}
            animate={{ width: 50, height: 50, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
              border: `1px solid rgba(${goldRgba}, 0.4)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Orb */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width:
            cursorState === "explore"
              ? 80
              : cursorState === "image"
                ? 60
                : cursorState === "link"
                  ? 4
                  : 10,
          height:
            cursorState === "explore"
              ? 80
              : cursorState === "image"
                ? 60
                : cursorState === "link"
                  ? 4
                  : 10,
          opacity: 1,
        }}
        transition={{
          width: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
          height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        }}
      >
        <div
          className="absolute inset-0 rounded-full transition-all duration-300"
          style={{
            background:
              cursorState === "image" || cursorState === "explore"
                ? "transparent"
                : `rgba(${goldRgba}, 0.9)`,
            border:
              cursorState === "image" || cursorState === "explore"
                ? `1.5px solid rgba(${goldRgba}, 0.7)`
                : "none",
            boxShadow:
              cursorState === "default"
                ? `0 0 20px 6px rgba(${goldRgba}, 0.25), 0 0 40px 12px rgba(${goldRgba}, 0.08)`
                : cursorState === "image" || cursorState === "explore"
                  ? `0 0 30px 8px rgba(${goldRgba}, 0.12)`
                  : "none",
            opacity: cursorState === "link" ? 0.8 : 1,
          }}
        />

        {cursorState === "image" && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: "9px", color: "var(--color-gold)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            View
          </motion.span>
        )}

        {cursorState === "explore" && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: "9px", color: "var(--color-gold)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            Explore
          </motion.span>
        )}
      </motion.div>

      {/* Ambient glow halo */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9995] rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: 120,
          height: 120,
          background: `radial-gradient(circle, rgba(${goldRgba}, 0.04) 0%, transparent 70%)`,
        }}
      />
    </>
  );
}
