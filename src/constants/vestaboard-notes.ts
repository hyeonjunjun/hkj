/**
 * Vestaboard messages — rotating notes shown in the VestaboardNote
 * fixture (top of /). Each entry is one "frame"; the fixture flips
 * between them on a slow timer.
 *
 * Conventions:
 * - Stick to A–Z, 0–9, and a small punctuation set (· · . , ! ? & ’).
 *   The flip animation is per-character; rare glyphs still work but
 *   typography degrades.
 * - 22 characters per line is the canonical Vestaboard row width.
 *   Strings longer than 22 are wrapped onto the next row.
 * - Two rows feels right for portfolio context. Don’t exceed six
 *   (the real Vestaboard ceiling) — beyond that, use a notes entry.
 *
 * Edit this file directly to publish a new message. The flip-board
 * cycles on a fixed epoch, so everyone sees the same frame at the
 * same wall-clock moment.
 */

export interface VestaboardFrame {
  /** Lines of text. Each line is rendered as one board row. */
  lines: ReadonlyArray<string>;
  /** Optional tint for accent characters (per-line). Not yet wired. */
  tint?: "amber" | "ink";
}

export const VESTABOARD_FRAMES: ReadonlyArray<VestaboardFrame> = [
  {
    lines: [
      "NOW SHOWING",
      "PROJECT INCOMING",
    ],
  },
  {
    lines: [
      "AVAILABLE FOR 2026",
      "PROJECTS · COMMISSIONS",
    ],
  },
  {
    lines: [
      "RYAN JUN, NYC",
      "MULTIDISCIPLINARY",
    ],
  },
  {
    lines: [
      "EIGHT IN THE CATALOG",
      "MORE INCOMING",
    ],
  },
  {
    lines: [
      "MFA D & T",
      "PARSONS, FALL 2026",
    ],
  },
];

/** ms between frame swaps. ~12s feels right — enough to read, not so
 *  slow that visitors think it’s static. */
export const VESTABOARD_INTERVAL_MS = 12_000;

/** Epoch for the shared rotation. Same value used by the playlist
 *  so all rotating fixtures stay phase-locked. */
export const VESTABOARD_EPOCH = 1700000000000;
