"use client";

import { useEffect, useMemo, useState } from "react";
import {
  VESTABOARD_EPOCH,
  VESTABOARD_FRAMES,
  VESTABOARD_INTERVAL_MS,
} from "@/constants/vestaboard-notes";

/**
 * VestaboardNote — single-line slot-reel message board.
 *
 * Two frames live in VESTABOARD_FRAMES (availability + send-a-message
 * invitation). They alternate on the shared VESTABOARD_INTERVAL_MS
 * clock. On each swap every character "spins" through random letters
 * and symbols, slowing down before settling on its final value — like
 * a slot machine reel.
 *
 * Stagger: leftmost cells settle first, rightmost cells settle last,
 * so the row reads "spinning down" left-to-right. Blanks don't spin
 * (they'd flash distractingly across the gaps); they hold a space.
 *
 * The flip aesthetic from the prior multi-row board is preserved on
 * the cell card (near-black background, white Departure Mono char,
 * inset highlights). The animation is what changed: scaleY flip →
 * cycling random characters with a decay-easing rate. Palette stays
 * within the corner's black/white register — no amber.
 *
 * Reduced-motion: no spin. Characters swap instantly to their target.
 */

const ROW_WIDTH = 32;

/** Total spin duration for the LEFTMOST cell, in ms. */
const SPIN_BASE_MS = 220;
/** Additional spin time per cell index — produces the left-to-right
 *  settle. The rightmost cell ends ~220+(32*7)=444ms after start. */
const SPIN_STAGGER_MS = 7;

/** Character set used while spinning. Excludes the target itself so
 *  the settle reads clearly. Same Departure-Mono-friendly set as the
 *  rest of the corner. */
const SPIN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·!?&*+";

function randomChar(exclude: string): string {
  let c = SPIN_CHARS[Math.floor(Math.random() * SPIN_CHARS.length)];
  if (c === exclude) {
    c = SPIN_CHARS[(SPIN_CHARS.indexOf(c) + 1) % SPIN_CHARS.length];
  }
  return c;
}

function frameAt(nowMs: number): string {
  const elapsed = Math.max(0, nowMs - VESTABOARD_EPOCH);
  const idx = Math.floor(elapsed / VESTABOARD_INTERVAL_MS) % VESTABOARD_FRAMES.length;
  return VESTABOARD_FRAMES[idx] ?? VESTABOARD_FRAMES[0];
}

function padRow(s: string): string {
  const upper = s.toUpperCase();
  if (upper.length >= ROW_WIDTH) return upper.slice(0, ROW_WIDTH);
  const pad = ROW_WIDTH - upper.length;
  const left = Math.floor(pad / 2);
  const right = pad - left;
  return " ".repeat(left) + upper + " ".repeat(right);
}

export function VestaboardNote() {
  // SSR-stable: serve frame 0 on first render; client effect picks up
  // the time-based frame on mount. Avoids hydration mismatch.
  const [target, setTarget] = useState(() => padRow(VESTABOARD_FRAMES[0]));

  useEffect(() => {
    const tick = () => setTarget(padRow(frameAt(Date.now())));
    tick();
    // Align to the next frame boundary so swaps fire on the shared
    // epoch rather than offset from mount.
    const elapsed = Date.now() - VESTABOARD_EPOCH;
    const msToNext = VESTABOARD_INTERVAL_MS - (elapsed % VESTABOARD_INTERVAL_MS);
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      tick();
      intervalId = setInterval(tick, VESTABOARD_INTERVAL_MS);
    }, msToNext);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const chars = useMemo(() => Array.from(target), [target]);

  return (
    <aside className="vestaboard" aria-label="Note">
      <div className="vestaboard__head">
        <span className="vestaboard__corner" aria-hidden />
        <span className="vestaboard__label">NOTE</span>
        <span className="vestaboard__corner" aria-hidden />
      </div>

      <div className="vestaboard__board" role="status" aria-live="polite">
        <div className="vestaboard__row">
          {chars.map((ch, i) => (
            <SpinCell
              key={i}
              target={ch}
              durationMs={SPIN_BASE_MS + i * SPIN_STAGGER_MS}
            />
          ))}
        </div>
      </div>

      <style>{`
        .vestaboard {
          display: grid;
          row-gap: 8px;
          padding: 12px clamp(12px, 1.4vw, 18px) 14px;
          background: var(--paper-2);
          border: 1px solid var(--ink-hair);
          border-radius: 3px;
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
        .vestaboard__corner {
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ink-3);
          opacity: 0.5;
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
        @media (max-width: 640px) {
          .vestaboard__row {
            /* Cells shrink via clamp inside SpinCell; the grid retains
               its 32 columns. */
          }
        }
      `}</style>
    </aside>
  );
}

interface SpinCellProps {
  target: string;
  durationMs: number;
}

function SpinCell({ target, durationMs }: SpinCellProps) {
  const [shown, setShown] = useState(target);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (shown === target) return;

    // Spaces don't spin (flashing random chars across blank gaps
    // pollutes the row). Reduced-motion users also skip the reel.
    // Both branches just snap to the target. setState in an effect
    // body fires the react-hooks/set-state-in-effect rule, so the
    // snap is deferred via a 0ms timeout that the cleanup can cancel.
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (target === " " || reducedMotion) {
      const snapId = window.setTimeout(() => setShown(target), 0);
      return () => window.clearTimeout(snapId);
    }

    let cancelled = false;
    let elapsed = 0;
    let interval = 28; // fast at the start, slows over time

    const tick = () => {
      if (cancelled) return;
      if (elapsed >= durationMs) {
        setShown(target);
        setSpinning(false);
        return;
      }
      setShown(randomChar(target));
      elapsed += interval;
      // Decay curve: each tick gets slightly longer. Capped at 110ms
      // so the trailing cells don't drag — the reel slows but still
      // settles inside the per-cell budget.
      interval = Math.min(interval * 1.14, 110);
      window.setTimeout(tick, interval);
    };

    // setSpinning is deferred into the same timeout that kicks off the
    // reel — setState synchronously in the effect body would trip
    // react-hooks/set-state-in-effect.
    const startId = window.setTimeout(() => {
      setSpinning(true);
      tick();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(startId);
    };
  }, [target, durationMs, shown]);

  const isBlank = shown === " ";

  return (
    <span
      className={`vesta-cell${isBlank ? " is-blank" : ""}`}
      data-spinning={spinning ? "" : undefined}
      aria-hidden
    >
      <span className="vesta-cell__face">{shown}</span>

      <style>{`
        .vesta-cell {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(12px, 1.1vw, 18px);
          height: clamp(16px, 1.5vw, 24px);
          background: #0d0d0d;
          color: #f4f4f4;
          border-radius: 1px;
          font-family: var(--font-stack-chrome);
          font-size: clamp(9px, 0.9vw, 13px);
          line-height: 1;
          letter-spacing: 0;
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.05) inset,
            0 -1px 0 rgba(0, 0, 0, 0.5) inset;
          overflow: hidden;
        }
        :root[data-theme="dark"] .vesta-cell {
          background: #161616;
        }
        .vesta-cell.is-blank {
          background: #060606;
          color: transparent;
        }
        .vesta-cell[data-spinning] {
          /* Slight brightness lift during the spin — kept monochrome.
             Reverts when the cell settles. */
          color: #ffffff;
        }
        .vesta-cell__face {
          display: block;
          will-change: contents;
        }
      `}</style>
    </span>
  );
}
