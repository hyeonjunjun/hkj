/**
 * PixelMark — `HKJ` rendered as a 5×7 pixel-grid wordmark using
 * inline SVG. Each letter is a fixed glyph map; the `cell` prop
 * controls the size of one pixel cell in pixels. Intended for
 * hero-scale display use (large cells); also available as a small
 * brand mark.
 *
 * Cell color is var(--ink). Empty cells render as paper-colored
 * negative space (no SVG node — just gaps).
 *
 * The mark is purely presentational; aria-label carries the actual
 * text "HKJ" for screen readers.
 */

type Glyph = ReadonlyArray<ReadonlyArray<0 | 1>>;

// 5 columns × 7 rows. 1 = filled, 0 = empty.
const H: Glyph = [
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
];
const K: Glyph = [
  [1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0],
  [1, 0, 1, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 0, 0, 1, 0],
  [1, 0, 0, 0, 1],
];
const J: Glyph = [
  [0, 0, 1, 1, 1],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [1, 0, 0, 1, 0],
  [0, 1, 1, 0, 0],
];

const GLYPHS: Record<string, Glyph> = { H, K, J };

type Props = {
  /** Cell size in px. 8 = small mark; 16-24 = hero scale. */
  cell?: number;
  /** Letter gap in cells (default 1). */
  letterGap?: number;
  /** className for the SVG root. */
  className?: string;
};

export default function PixelMark({ cell = 12, letterGap = 1, className }: Props) {
  const letters = ["H", "K", "J"] as const;
  const cols = letters.reduce(
    (sum, ch, i) => sum + GLYPHS[ch][0].length + (i < letters.length - 1 ? letterGap : 0),
    0
  );
  const rows = 7;
  const w = cols * cell;
  const h = rows * cell;

  // Build rect list with cumulative x offsets per letter
  const rects: Array<{ x: number; y: number }> = [];
  let xCursor = 0;
  for (const ch of letters) {
    const g = GLYPHS[ch];
    for (let r = 0; r < g.length; r++) {
      const row = g[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === 1) {
          rects.push({ x: (xCursor + c) * cell, y: r * cell });
        }
      }
    }
    xCursor += g[0].length + letterGap;
  }

  return (
    <svg
      role="img"
      aria-label="HKJ"
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      style={{ display: "block" }}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={cell} height={cell} fill="currentColor" />
      ))}
    </svg>
  );
}
