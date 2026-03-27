"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BlueDot() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: -14,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--accent-blue)",
        }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="tooltip"
            initial={{ opacity: 0, y: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-muted)",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              position: "absolute",
              top: 14,
            }}
          >
            start here
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlueDot;
