"use client";

import { useEffect, useRef, useState } from "react";

/** Java Edition's colormap is a 35×35 square — one cell per chunk. */
const GRID = 35;
const CELL_COUNT = GRID * GRID;
const CENTER = (GRID - 1) / 2;

/** Rendered small — these read as pixels, not tiles. 35 cells across ~245px ≈ 7px each. */
const GRID_PX = 245;

const BASE_GEN_MS = 520;
/** Delay per ring out from center — this is what makes the map fill outward. */
const RING_DELAY_MS = 16;
const FADE_MS = 380;

/**
 * Three generation paths, assigned deterministically per cell. Real chunk
 * status is irregular — most chunks resolve nearly straight to Full while
 * a few visibly walk the whole pipeline. Running every cell through all
 * twelve stages in lockstep (the previous version) produced tidy
 * concentric rainbow rings, which is not what generation actually looks
 * like.
 */
const VARIANTS = ["chunk-gen-fast", "chunk-gen-fast", "chunk-gen-mid", "chunk-gen-full"] as const;

/**
 * Integer-only hash returning 0..999. Deliberately avoids Math.sin/random:
 * transcendental results aren't guaranteed bit-identical across JS engines,
 * and these values get embedded in `animation` style strings — a 1-ULP
 * difference between Node and the browser makes the server and client
 * markup disagree and trips a hydration mismatch. Bitwise/imul ops are
 * exactly specified, and every derived value below is rounded to whole
 * milliseconds so the emitted strings are byte-identical. (Same reason
 * ArcCarousel rounds its cos/sin output to whole pixels.)
 */
function hash(n: number, salt: number): number {
  let h = Math.imul(n + salt, 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return Math.abs(h) % 1000;
}

function cellPlan(index: number) {
  const row = Math.floor(index / GRID);
  const col = index % GRID;
  const ring = Math.max(Math.abs(row - CENTER), Math.abs(col - CENTER));
  return {
    variant: VARIANTS[hash(index, 17) % VARIANTS.length],
    delay: Math.round(ring * RING_DELAY_MS + (hash(index, 101) / 1000) * 260),
    duration: Math.round(BASE_GEN_MS * (0.55 + (hash(index, 211) / 1000) * 0.9)),
  };
}

const PLANS = Array.from({ length: CELL_COUNT }, (_, i) => cellPlan(i));
const LAST_FINISH = Math.max(...PLANS.map((p) => p.delay + p.duration));
/** Begin the reveal just before the last cells land, so it never sits on a dead white square. */
const TOTAL_MS = LAST_FINISH - 120;

/**
 * Recreation of Minecraft Java Edition's world-loading chunk colormap
 * (per the Minecraft Wiki's Loading world screen page):
 * - 35×35 square grid, one cell per chunk, no border (removed in 1.21),
 *   rendered small so cells read as pixels rather than tiles.
 * - Cells use the wiki's exact chunk-status hex values, as discrete
 *   jumps — status is categorical, not a gradient.
 * - Cells take irregular paths at irregular speeds: most resolve almost
 *   straight to Full, a minority walk the whole pipeline. Uniform
 *   progression looked far too orderly.
 * - Fill spreads outward from center, so delay scales with ring distance.
 * - Background is plain white for now — a placeholder Ryan will replace
 *   (the real screen uses a blurred world panorama).
 *
 * Caveat worth keeping: this was built from the wiki's written spec and
 * color table, not from frame-accurate observation of the animation.
 *
 * Color here is a deliberate, scoped exception to the site's otherwise
 * colorless rule — temporal, not permanent chrome. Lives in the root
 * layout, which persists across client-side navigation, so it plays on a
 * real page load and never replays between pages.
 */
export default function Preloader() {
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setExiting(true);
      setTimeout(() => setRemoved(true), FADE_MS);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const timer = setTimeout(finish, TOTAL_MS);
    window.addEventListener("keydown", finish);
    window.addEventListener("click", finish);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("click", finish);
    };
  }, []);

  if (removed) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white"
      style={{ opacity: exiting ? 0 : 1, transition: `opacity ${FADE_MS}ms ease-out` }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))`,
          width: GRID_PX,
          height: GRID_PX,
        }}
      >
        {PLANS.map((plan, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#545454",
              // linear, not steps(): the keyframes already jump discretely
              // (each status holds across a range and flips within a 0.01%
              // window). steps(1) would collapse the whole sequence to a
              // single jump at the end and skip every intermediate status.
              animation: `${plan.variant} ${plan.duration}ms linear ${plan.delay}ms forwards`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
