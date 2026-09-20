"use client";

import { useEffect, useRef, useState } from "react";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

/** Swatch edge, px. Matches the 20px cell measured on dylan.camera. */
const SWATCH = 20;
/** Gap between swatches, px. */
const GAP = 16;
/** One row of the strip. */
const PITCH = SWATCH + GAP;
/**
 * Ceiling on the window, for when the catalogue grows. Below this the
 * window is simply the project count.
 */
const MAX_VISIBLE = 9;
/** Strip travel time. The fold below has to outlast it. */
const TRAVEL_MS = 500;

/**
 * Shortest signed step from `from` to `to` around a ring of `n`.
 *
 * This is the whole fix. Project 1 to project 5 is `0 -> 4`, and reading
 * that difference literally sends the strip four rows the wrong way —
 * past every other project — when project 5 is sitting one row above.
 * Around the ring the step is -1, which is what the picture shows.
 */
function ringStep(from: number, to: number, n: number): number {
  let d = (to - from) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

interface SwatchRailProps {
  works: Work[];
  activeIndex: number;
  onSelect: (i: number) => void;
}

/**
 * dylan.camera's swatch navigation, measured off his homepage at 1920:
 *
 *   x12 y12  20x20  rgb(85,107,68)   border-radius 0     <- active
 *   x12 y56  20x20  rgb(42,150,195)  border-radius 50%   <- inactive
 *
 * The state mechanic is kept exactly: colour, size and position are
 * identical between states — only the radius changes. Active is a
 * square, everything else a circle.
 *
 * WHERE THIS DIVERGES FROM HIS
 *
 * His rail is a static list; the active square can sit anywhere in it.
 * Here the strip translates so the active swatch always lands on the
 * viewport's centre line — the same line the page uses to decide which
 * work is current. Swatches travel past a fixed point, and the title
 * beside that point never moves.
 *
 * MOVING BY THE SHORT WAY ROUND
 *
 * The strip does not position itself from `activeIndex`. It keeps its
 * own running position and advances it by `ringStep`, so every move is
 * one row when the projects are adjacent on the ring — including the
 * wrap from the first project back to the last, which the index alone
 * would have read as a jump across the whole list.
 *
 * That running position drifts out of range as you keep going, so once
 * the travel finishes it is folded back by a whole cycle with the
 * transition switched off. The fold is invisible because the content
 * repeats every `n` rows: the strip is in a different place by the
 * numbers and an identical one on screen. Same trick the page itself
 * uses to loop.
 *
 * WINDOW SIZE
 *
 * The window is the project count (capped at MAX_VISIBLE), so what you
 * see is one full cycle — every project once, the rest wrapping in at
 * the ends. A fixed window showed two complete repeats at five projects,
 * which reads as duplicated content rather than a loop. Tying it to the
 * count also means nothing here needs revisiting as the catalogue grows.
 *
 * Geometry: with the strip centred, row i's centre sits at
 * (i + 0.5) * PITCH from its top, and the top is half the strip's height
 * above centre, so the offset that puts row i on the line is
 * (rows / 2 - i - 0.5) * PITCH.
 *
 * PITCH is fixed px rather than the fluid --space-2 token on purpose:
 * that token derives from the viewport (100vw/180), so a resize would
 * change the row height and silently break the transform.
 */
export default function SwatchRail({ works, activeIndex, onSelect }: SwatchRailProps) {
  const n = works.length;

  /** The strip's own position on the ring. Drifts, then folds. */
  const [pos, setPos] = useState(activeIndex);
  const [animate, setAnimate] = useState(true);
  const [seenIndex, setSeenIndex] = useState(activeIndex);

  /*
   * Advance by the short way round whenever the active work changes.
   *
   * Adjusted during render rather than in an effect — React's documented
   * pattern for deriving state from a changed prop. In an effect this is
   * a synchronous setState, which lints as a cascading render and also
   * paints one frame at the old position first.
   */
  if (n > 0 && activeIndex !== seenIndex) {
    setSeenIndex(activeIndex);
    setPos((p) => p + ringStep(seenIndex, activeIndex, n));
    setAnimate(true);
  }

  // Once travel is done, fold back into range with the transition off.
  // Invisible: the content repeats every n rows, so a whole cycle of
  // offset lands on identical pixels.
  useEffect(() => {
    if (n === 0 || (pos >= 0 && pos < n)) return;
    const t = window.setTimeout(() => {
      setAnimate(false);
      setPos((p) => ((p % n) + n) % n);
    }, TRAVEL_MS + 40);
    return () => clearTimeout(t);
  }, [pos, n]);

  // Re-arm the transition the frame after a fold, so the fold itself
  // cannot animate but the next real move can.
  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  if (n === 0) return null;

  const visible = Math.min(n, MAX_VISIBLE);
  // Enough copies that the window is filled on both sides even while the
  // running position sits a cycle outside the middle one.
  const sets = 5;
  const middle = Math.floor(sets / 2);

  const rows = n * sets;
  const centredRow = middle * n + pos;
  const offset = (rows / 2 - centredRow - 0.5) * PITCH;

  return (
    <div className="relative flex items-center gap-[var(--space-2)]">
      <div
        className="relative overflow-hidden"
        style={{
          width: SWATCH,
          height: PITCH * visible,
          maskImage:
            "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
        }}
      >
        <ul
          className="absolute left-0 top-1/2 flex flex-col"
          style={{
            gap: GAP,
            transform: `translateY(calc(-50% + ${offset}px))`,
            transition: animate ? `transform ${TRAVEL_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none",
          }}
        >
          {Array.from({ length: sets }).flatMap((_, s) =>
            works.map((w, i) => {
              const flat = s * n + i;
              // The square is whichever row is actually on the line, not
              // whichever copy we nominally call the middle — they part
              // company while the position is mid-fold.
              const isActive = flat === centredRow;
              const isPrimary = s === middle;
              return (
                <li key={`${s}-${w.id}`} style={{ height: SWATCH }}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Go to ${w.title}`}
                    // One copy carries the semantics; the rest are
                    // scenery that makes the wrap seamless. Announcing
                    // every project five times would be noise.
                    aria-hidden={!isPrimary && !isActive}
                    tabIndex={isPrimary ? undefined : -1}
                    className={`block overflow-hidden bg-ws-fill transition-[border-radius,opacity] duration-300 ${
                      isActive
                        ? "rounded-none opacity-100"
                        : "rounded-full opacity-45 hover:opacity-100"
                    }`}
                    style={{ width: SWATCH, height: SWATCH }}
                  >
                    {/* Guarded: the placeholder path draws its own
                        "content coming soon" copy, illegible at 20px. */}
                    {w.media.src ? <MediaRenderer media={w.media} fit="cover" /> : null}
                  </button>
                </li>
              );
            }),
          )}
        </ul>
      </div>

      {/* Title, fixed on the centre line. aria-hidden because each button
          above already carries its work's name. */}
      <span
        aria-hidden="true"
        className="hidden whitespace-nowrap text-label text-ws-ink md:block"
      >
        {works[activeIndex]?.title.toLowerCase()}
      </span>
    </div>
  );
}
