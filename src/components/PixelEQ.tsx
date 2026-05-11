"use client";

import { useEffect, useRef } from "react";

/**
 * PixelEQ — tiny animated pixel-art EQ. 5 vertical bars (2px wide
 * each) whose heights step through a pre-baked pattern at ~150ms
 * per frame, giving an 8-bit "now-playing" visualizer feel. Not
 * audio-reactive; ambient motion only.
 *
 * Each bar runs its own pattern offset so the bars don't sync —
 * reads as a real-time signal indicator rather than a metronome.
 * `image-rendering: pixelated` keeps edges crisp at the small
 * scale even on high-DPI displays.
 *
 * Reduced-motion: bars freeze at a mid-height static state.
 */

type Props = {
  /** Total bar count. */
  bars?: number;
  /** Tick rate in ms (per height change). */
  step?: number;
};

// Pre-baked height sequences per bar (in px). Different lengths +
// different magnitudes so the bars desync naturally.
const PATTERNS: ReadonlyArray<ReadonlyArray<number>> = [
  [2, 4, 6, 8, 6, 4, 3, 5, 7, 5, 3],
  [3, 5, 7, 6, 8, 7, 4, 2, 4, 6, 8, 5],
  [5, 7, 4, 2, 4, 7, 9, 6, 3, 5],
  [4, 6, 8, 7, 5, 3, 5, 7, 8, 6, 4, 2, 4],
  [2, 3, 5, 7, 8, 6, 4, 6, 8, 5, 3],
];

export default function PixelEQ({ bars = 5, step = 150 }: Props) {
  const barsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      // Settle bars to a static low-amplitude state
      barsRef.current.forEach((el, i) => {
        if (el) el.style.height = `${3 + (i % 2) * 2}px`;
      });
      return;
    }

    const interval = setInterval(() => {
      tickRef.current = (tickRef.current + 1) % 1000;
      barsRef.current.forEach((el, i) => {
        if (!el) return;
        const pattern = PATTERNS[i % PATTERNS.length];
        // Offset each bar by its index so they aren't in lockstep
        const h = pattern[(tickRef.current + i * 3) % pattern.length];
        el.style.height = `${h}px`;
      });
    }, step);

    return () => clearInterval(interval);
  }, [step]);

  return (
    <span className="peq" aria-hidden role="presentation">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            barsRef.current[i] = el;
          }}
          className="peq__bar"
          style={{ height: "4px" }}
        />
      ))}

      <style>{`
        .peq {
          display: inline-flex;
          align-items: flex-end;
          gap: 1px;
          height: 10px;
          line-height: 1;
          vertical-align: middle;
          image-rendering: pixelated;
        }
        .peq__bar {
          display: inline-block;
          width: 2px;
          background: var(--ink);
          /* Smooth-ish height transition between steps — short
             so it still feels stepped, not continuous. */
          transition: height 90ms steps(2, end);
        }
      `}</style>
    </span>
  );
}
