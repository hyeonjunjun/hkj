/**
 * Pure layout calculations for the homepage carousel.
 *
 * Dimensions and spacing derived from Cathydolle's implementation:
 * - Portrait cards: 32vw × 48vw (1:1.5) on desktop
 * - Landscape cards: 49vw × 28vw (1.75:1) on desktop
 * - Zero gap between cards (edge-to-edge)
 * - Snap-to-center positioning
 *
 * List view spacing also derived from Cathydolle:
 * - Row height: 11vh
 * - Side margins: 7.73vw
 * - Vertical padding: 10vh
 * - Number column: 7.73vw wide
 * - Proximity-based hover falloff (circular distance)
 */

import type { Project } from "@/constants/projects";

/* ── Format ── */

export function getFormat(
  project: Project,
  index: number
): "portrait" | "landscape" {
  return project.cardFormat ?? (index % 2 === 0 ? "portrait" : "landscape");
}

/* ── Slider card dimensions ── */

export interface CardDimensions {
  portrait: { width: number; height: number };
  landscape: { width: number; height: number };
}

export function getCardDimensions(vw: number, vh: number): CardDimensions {
  if (vw < 768) {
    // Mobile: uniform full-width
    return {
      portrait: { width: vw, height: vh * 0.7 },
      landscape: { width: vw, height: vh * 0.7 },
    };
  }
  if (vw < 1024) {
    // Tablet
    const pw = vw * 0.38;
    const lw = vw * 0.55;
    return {
      portrait: { width: pw, height: pw * 1.5 },
      landscape: { width: lw, height: lw / 1.75 },
    };
  }
  // Desktop — matches Cathydolle: portrait ~32vw, landscape ~49vw
  const pw = vw * 0.32;
  const lw = vw * 0.49;
  return {
    portrait: { width: pw, height: pw * 1.5 },
    landscape: { width: lw, height: lw / 1.75 },
  };
}

/* ── Slider position helpers ── */

export function buildCardWidths(
  projects: Project[],
  dims: CardDimensions
): number[] {
  return projects.map((p, i) => dims[getFormat(p, i)].width);
}

export function buildCardHeights(
  projects: Project[],
  dims: CardDimensions
): number[] {
  return projects.map((p, i) => dims[getFormat(p, i)].height);
}

/** Returns the x value that centers card i in the viewport */
export function buildCardPositions(
  widths: number[],
  viewportWidth: number
): number[] {
  const positions: number[] = [];
  let cursor = 0;
  for (const w of widths) {
    positions.push(-(cursor + w / 2 - viewportWidth / 2));
    cursor += w;
  }
  return positions;
}

export function buildCardLeftEdges(widths: number[]): number[] {
  const edges: number[] = [];
  let cursor = 0;
  for (const w of widths) {
    edges.push(cursor);
    cursor += w;
  }
  return edges;
}

export function snapToNearest(target: number, positions: number[]): number {
  let closest = positions[0];
  let minDist = Math.abs(target - positions[0]);
  for (let i = 1; i < positions.length; i++) {
    const dist = Math.abs(target - positions[i]);
    if (dist < minDist) {
      minDist = dist;
      closest = positions[i];
    }
  }
  return closest;
}

export function findNearestIndex(
  currentX: number,
  positions: number[]
): number {
  let idx = 0;
  let minDist = Infinity;
  for (let i = 0; i < positions.length; i++) {
    const dist = Math.abs(currentX - positions[i]);
    if (dist < minDist) {
      minDist = dist;
      idx = i;
    }
  }
  return idx;
}

/* ── List view proximity hover ── */

/** Circular distance — wraps around the list ends */
export function circularDistance(
  a: number,
  b: number,
  total: number
): number {
  const direct = Math.abs(a - b);
  return Math.min(direct, total - direct);
}

/**
 * Cathydolle proximity falloff:
 * - Hovered item: 0.85
 * - Adjacent: ~0.49
 * - 2 away: ~0.25
 * - 3+ away: ~0.15 (floor)
 */
export function distanceToOpacity(
  dist: number,
  total: number
): number {
  if (dist === 0) return 0.85;
  const maxDist = Math.floor(total / 2);
  const normalized = dist / maxDist;
  return Math.max(0.15, 0.85 * Math.pow(1 - normalized, 1.8));
}

/** Blur: 0 at hovered, 0.3–0.9px scaling with distance */
export function distanceToBlur(
  dist: number,
  total: number
): number {
  if (dist === 0) return 0;
  const maxDist = Math.floor(total / 2);
  const normalized = dist / maxDist;
  return 0.3 + normalized * 0.6;
}

/* ── List view layout constants (Cathydolle-derived) ── */

export const LIST_LAYOUT = {
  /** Row height as fraction of viewport height */
  rowHeightVh: 11,
  /** Side margin as fraction of viewport width */
  sideMarginVw: 7.73,
  /** Top/bottom padding as fraction of viewport height */
  verticalPaddingVh: 10,
  /** Number column width as fraction of viewport width */
  numberColumnVw: 7.73,
  /** Name column width as fraction of viewport width */
  nameColumnVw: 16.02,
  /** Gap between rows in px */
  rowGapPx: 8,
} as const;
