"use client";

import { useEffect, useMemo, useState } from "react";
import {
  VESTABOARD_EPOCH,
  VESTABOARD_FRAMES,
  VESTABOARD_INTERVAL_MS,
  type VestaboardFrame,
} from "@/constants/vestaboard-notes";

/**
 * VestaboardNote — split-flap message board fixture.
 *
 * Inspired by Vestaboard's smart flip-disc display. Renders the
 * current message as a grid of fixed-width character cards. When the
 * frame changes (on a shared timer), each card flips to its new
 * character with a staggered scaleY collapse-and-expand — the
 * Solari mechanism borrowed from LiveTime, applied per-character.
 *
 * Content comes from VESTABOARD_FRAMES in /constants/vestaboard-notes.
 * Edit that file to publish a new message. The frame index is derived
 * from real time (modulo the frame count) so all visitors see the
 * same frame at the same wall-clock moment.
 *
 * Sizing: 22-character row width is the canonical Vestaboard. Rows
 * pad with spaces; characters outside [A–Z 0–9 · . , ! ? & ’ space]
 * still render but the family-feel is sharpest with the canonical set.
 *
 * Reduced-motion: characters update without the flip — content swaps
 * silently per tick.
 */

const ROW_WIDTH = 22;
const FLIP_DURATION_MS = 320;
const FLIP_SWAP_MS = 160;
const CHAR_STAGGER_MS = 22;

function frameIndexFor(timeMs: number, frameCount: number): number {
  if (frameCount === 0) return 0;
  const elapsed = Math.max(0, timeMs - VESTABOARD_EPOCH);
  return Math.floor(elapsed / VESTABOARD_INTERVAL_MS) % frameCount;
}

function padRow(line: string): string {
  const upper = line.toUpperCase();
  if (upper.length >= ROW_WIDTH) return upper.slice(0, ROW_WIDTH);
  const pad = ROW_WIDTH - upper.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return " ".repeat(left) + upper + " ".repeat(right);
}

function framePadded(frame: VestaboardFrame): string[] {
  return frame.lines.map(padRow);
}

export function VestaboardNote() {
  // Stable initial render: frame 0 on SSR, then the real frame after
  // mount. Avoids hydration mismatch from Date.now().
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    const tick = () => setFrameIdx(frameIndexFor(Date.now(), VESTABOARD_FRAMES.length));
    tick();
    // Align to the next frame boundary so the flip fires on the
    // shared epoch boundary, not at an arbitrary offset since mount.
    const elapsed = Date.now() - VESTABOARD_EPOCH;
    const msToNextFrame = VESTABOARD_INTERVAL_MS - (elapsed % VESTABOARD_INTERVAL_MS);
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, VESTABOARD_INTERVAL_MS);
    }, msToNextFrame);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const frame = VESTABOARD_FRAMES[frameIdx] ?? VESTABOARD_FRAMES[0];
  const rows = useMemo(() => framePadded(frame), [frame]);

  return (
    <aside className="vestaboard" aria-label="Vestaboard note">
      <div className="vestaboard__head">
        <span className="vestaboard__corner-tl" aria-hidden />
        <span className="vestaboard__label">NOTE</span>
        <span className="vestaboard__corner-tr" aria-hidden />
      </div>
      <div className="vestaboard__board" role="status" aria-live="polite">
        {rows.map((row, ri) => (
          <div key={ri} className="vestaboard__row">
            {Array.from(row, (ch, ci) => (
              <Cell key={ci} ch={ch} delayMs={(ri * ROW_WIDTH + ci) * CHAR_STAGGER_MS} />
            ))}
          </div>
        ))}
      </div>

      <style>{`
        .vestaboard {
          display: grid;
          row-gap: 8px;
          padding: 14px clamp(14px, 1.6vw, 22px) 16px;
          background: var(--paper-2);
          border: 1px solid var(--ink-hair);
          border-radius: 3px;
          /* Subtle drop shadow so the board reads as a physical object
             sitting on the page surface. */
          box-shadow:
            0 1px 0 var(--ink-hair) inset,
            0 12px 24px rgba(0, 0, 0, 0.04),
            0 2px 6px rgba(0, 0, 0, 0.03);
          max-width: max-content;
          margin-inline: auto;
        }
        .vestaboard__head {
          display: grid;
          grid-template-columns: 8px 1fr 8px;
          align-items: center;
          column-gap: 10px;
        }
        .vestaboard__corner-tl,
        .vestaboard__corner-tr {
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ink-3);
          opacity: 0.55;
        }
        .vestaboard__label {
          text-align: center;
          color: var(--ink-3);
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          line-height: 1;
        }

        .vestaboard__board {
          display: grid;
          row-gap: 4px;
          padding: 8px;
          background: var(--paper-3);
          border-radius: 2px;
          box-shadow:
            0 1px 0 rgba(0, 0, 0, 0.04) inset,
            0 -1px 0 rgba(255, 255, 255, 0.4) inset;
        }
        .vestaboard__row {
          display: grid;
          grid-template-columns: repeat(${ROW_WIDTH}, 1fr);
          column-gap: 2px;
        }
      `}</style>
    </aside>
  );
}

interface CellProps {
  ch: string;
  delayMs: number;
}

function Cell({ ch, delayMs }: CellProps) {
  const [shown, setShown] = useState(ch);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (ch === shown) return;
    const start = setTimeout(() => setFlipping(true), delayMs);
    const swap = setTimeout(() => setShown(ch), delayMs + FLIP_SWAP_MS);
    const stop = setTimeout(() => setFlipping(false), delayMs + FLIP_DURATION_MS);
    return () => {
      clearTimeout(start);
      clearTimeout(swap);
      clearTimeout(stop);
    };
  }, [ch, shown, delayMs]);

  const isBlank = shown === " ";

  return (
    <span
      className={`vesta-cell${isBlank ? " is-blank" : ""}`}
      data-flipping={flipping ? "" : undefined}
      aria-hidden
    >
      <span className="vesta-cell__face">{shown}</span>

      <style>{`
        .vesta-cell {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(14px, 1.3vw, 20px);
          height: clamp(18px, 1.7vw, 26px);
          background: #0f0d0b;
          color: var(--accent);
          border-radius: 1px;
          font-family: var(--font-stack-chrome);
          font-size: clamp(10px, 1vw, 14px);
          line-height: 1;
          letter-spacing: 0;
          /* Subtle inner edges so each card reads as a flap. */
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.04) inset,
            0 -1px 0 rgba(0, 0, 0, 0.4) inset;
          overflow: hidden;
          perspective: 240px;
        }
        :root[data-theme="dark"] .vesta-cell {
          background: #1a1816;
        }
        .vesta-cell.is-blank {
          background: #0a0807;
          color: transparent;
        }
        .vesta-cell__face {
          display: block;
          transform-origin: center;
          backface-visibility: hidden;
          will-change: transform;
        }
        .vesta-cell[data-flipping] .vesta-cell__face {
          animation: vesta-flip ${FLIP_DURATION_MS}ms cubic-bezier(.4, 0, .2, 1);
        }
        @keyframes vesta-flip {
          0%   { transform: scaleY(1); }
          48%  { transform: scaleY(0.04); }
          52%  { transform: scaleY(0.04); }
          100% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vesta-cell[data-flipping] .vesta-cell__face {
            animation: none;
          }
        }
      `}</style>
    </span>
  );
}
