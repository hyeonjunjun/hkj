import type { Work } from "@/data/works";

/** Below this distance-to-target (px), snap instead of taking another tiny step. */
const SETTLE_EPSILON_PX = 0.1;

/**
 * One frame of eased interpolation toward `target`. Used by HomeTimeline's
 * requestAnimationFrame loop so wheel-driven scrolling feels like inertia
 * rather than snapping directly to raw deltas. Snaps to `target` once the
 * remaining distance is imperceptible, so the loop can stop cleanly
 * instead of approaching forever.
 */
export function dampStep(current: number, target: number, damping: number): number {
  const next = current + (target - current) * damping;
  return Math.abs(target - next) < SETTLE_EPSILON_PX ? target : next;
}

export type WheelGesture = "horizontal" | "vertical";

/**
 * Classifies a wheel event's dominant axis. "vertical" means a plain
 * mouse wheel or an incidental vertical trackpad move — HomeTimeline
 * redirects these into horizontal scroll, since the page itself never
 * scrolls vertically. An exact tie classifies as "horizontal" so it's
 * left to pass through to native scroll rather than being redirected.
 */
export function classifyWheelGesture(delta: { deltaX: number; deltaY: number }): WheelGesture {
  return Math.abs(delta.deltaY) > Math.abs(delta.deltaX) ? "vertical" : "horizontal";
}

/**
 * Index of the center in `centers` closest to `targetCenter`. Ties break
 * toward the earlier (lower) index. Used to find which timeline stop is
 * nearest the container's center, driving the active-stop title/emphasis.
 */
export function findNearestIndex(centers: number[], targetCenter: number): number {
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < centers.length; i++) {
    const distance = Math.abs(centers[i] - targetCenter);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  return bestIndex;
}

/** Clamps `index` into `[0, length - 1]` — no wraparound at either end. */
export function clampIndex(index: number, length: number): number {
  return Math.max(0, Math.min(index, length - 1));
}

/**
 * Sorts Works newest → oldest by year (a "lookback"/retrospective read —
 * scrolling forward moves backward through time). Same-year entries
 * break ties by `index`, descending. Does not mutate its input.
 */
export function sortWorksForTimeline(works: Work[]): Work[] {
  return [...works].sort((a, b) => {
    if (a.year !== b.year) return b.year.localeCompare(a.year);
    return b.index - a.index;
  });
}
