"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Props = {
  text: string;
  /** Number of characters to scramble per hover-enter. Default 2. */
  count?: number;
  /** Per-character total scramble duration in ms. Default 160. */
  duration?: number;
  /** Random glyph pool for the scramble. Default ASCII alphanumeric. */
  pool?: string;
  /** className for the wrapper span. */
  className?: string;
  /** Additional inline style on the wrapper. */
  style?: React.CSSProperties;
};

const DEFAULT_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ELIGIBLE_RE = /[A-Za-z0-9]/;

/**
 * ScrambleText — splits text into per-character spans and runs a
 * brief character-cycle on hover-enter (aino-derived effect).
 * Eligibility: ASCII Latin alphanumeric only (`/[A-Za-z0-9]/`).
 * Non-alphanumeric characters (CJK, accented Latin, punctuation,
 * spaces) are never scrambled — they stay still.
 *
 * One-shot per hover-enter; does not recur while cursor stays in.
 * Re-entry (mouseleave then mouseenter) clears any in-flight
 * scramble and starts a new one. Unmount clears all intervals to
 * prevent React unmounted-update warnings.
 *
 * Reduced-motion: scramble disabled, hover does nothing visually.
 *
 * a11y: wrapper carries aria-label={text}; per-character spans are
 * aria-hidden so screen readers read the original text naturally.
 */
export default function ScrambleText({
  text,
  count = 2,
  duration = 160,
  pool = DEFAULT_POOL,
  className,
  style,
}: Props) {
  const reduced = useReducedMotion();
  const [scrambleState, setScrambleState] = useState<Record<number, string>>({});
  const intervalsRef = useRef<number[]>([]);

  // Cleanup all intervals on unmount.
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((id) => window.clearInterval(id));
      intervalsRef.current = [];
    };
  }, []);

  // Indices eligible for scrambling
  const eligibleIndices = [...text].reduce<number[]>((acc, ch, i) => {
    if (ELIGIBLE_RE.test(ch)) acc.push(i);
    return acc;
  }, []);

  function clearAllIntervals() {
    intervalsRef.current.forEach((id) => window.clearInterval(id));
    intervalsRef.current = [];
  }

  function startScramble() {
    if (reduced) return;
    if (eligibleIndices.length === 0) return;

    // Re-entry guard: clear any in-flight scramble before starting new.
    clearAllIntervals();
    setScrambleState({});

    // Pick min(count, eligible.length) random positions
    const k = Math.min(count, eligibleIndices.length);
    const shuffled = [...eligibleIndices].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, k);

    const swapsPerChar = 4;
    const swapInterval = duration / swapsPerChar;

    picked.forEach((idx) => {
      let swapCount = 0;
      const intervalId = window.setInterval(() => {
        if (swapCount >= swapsPerChar) {
          window.clearInterval(intervalId);
          intervalsRef.current = intervalsRef.current.filter((id) => id !== intervalId);
          setScrambleState((prev) => {
            const next = { ...prev };
            delete next[idx];
            return next;
          });
          return;
        }
        const randomChar = pool[Math.floor(Math.random() * pool.length)];
        setScrambleState((prev) => ({ ...prev, [idx]: randomChar }));
        swapCount++;
      }, swapInterval);
      intervalsRef.current.push(intervalId);
    });
  }

  return (
    <span
      className={className}
      style={style}
      aria-label={text}
      onMouseEnter={startScramble}
    >
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true">
          {scrambleState[i] ?? ch}
        </span>
      ))}
    </span>
  );
}
