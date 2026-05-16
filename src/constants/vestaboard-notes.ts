/**
 * Vestaboard frames — single-line messages shown in the slot-reel
 * fixture. Two frames alternate on the FRAME_INTERVAL_MS clock; each
 * frame swap triggers the per-character spin-and-settle animation.
 *
 * Purpose: availability + an invitation to reach out. Two messages
 * by design — they live phase-locked with the shared epoch so all
 * visitors see the same line at the same wall-clock moment.
 *
 * Conventions:
 *  - Stick to A–Z, 0–9, and a small punctuation set (· . , ! ? & ')
 *  - All caps (the cells render uppercase regardless)
 *  - Keep each frame under ROW_WIDTH (32) characters; longer strings
 *    get truncated by the renderer
 */

export const VESTABOARD_FRAMES: ReadonlyArray<string> = [
  "AVAILABLE FOR 2026 PROJECTS",
  "FEEL FREE TO SEND ME A MESSAGE!",
];

/** ms between frame swaps. ~12s — the per-character spin takes
 *  ~0.45s, leaving ~11.5s to read each line before the next reel. */
export const VESTABOARD_INTERVAL_MS = 12_000;

/** Shared epoch — same value as the playlist so all rotating fixtures
 *  stay phase-locked across the site. */
export const VESTABOARD_EPOCH = 1700000000000;
