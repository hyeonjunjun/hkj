"use client";

import { useEffect, useState, type ReactNode } from "react";

interface MotionRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
}

/**
 * Wraps a subtree in a fade + upward-translate entrance animation.
 * Global reduced-motion handling lives in globals.css (it zeroes
 * transition-duration for every element), so this component doesn't
 * need to branch on prefers-reduced-motion itself — the inline
 * transition below is neutralized automatically when the media query
 * matches.
 */
export default function MotionReveal({
  children,
  delay = 0,
  duration = 600,
  translateY = 8,
}: MotionRevealProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      {children}
    </div>
  );
}
