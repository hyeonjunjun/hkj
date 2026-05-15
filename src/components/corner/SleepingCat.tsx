/**
 * SleepingCat — multi-color pixel-art bicolor sleeping cat.
 *
 * Reference: vector-stock pixel-art kitten lying on its side — brown
 * head and tail with pink inner ears, white body with small brown
 * patches, light gray shadow beneath. Used as the personality empty-
 * state across project tiles and media placeholders.
 *
 * Implementation: a 26×12 grid encoded in a string-array PATTERN
 * where each character maps to a fixed palette color. Each cell is a
 * 1×1 SVG <rect>; `shape-rendering="crispEdges"` keeps pixels sharp
 * at any scale.
 *
 * Colors are intentionally fixed regardless of light/dark theme —
 * the cat is a quaint moment of personality, not a system surface,
 * so it keeps its own palette in both registers.
 */

interface Props {
  /** Pixel size of the cat (width). Height is proportional. */
  size?: number;
  className?: string;
}

// Palette legend:
//   K = outline (warm near-black)
//   B = brown (head + tail markings)
//   W = white fur (body)
//   P = pink (inner ears + nose blush)
//   G = light gray (cast shadow)
//   . = transparent
const PALETTE: Record<string, string> = {
  K: "#1c1a18",
  B: "#6e4d3a",
  W: "#ffffff",
  P: "#f0bdbd",
  G: "#d4d4d4",
};

// 26 cols × 12 rows. Head on the left, tail on the right, shadow at
// the bottom. The cat lies on its side; the visible (left) ear is
// brown with a pink interior, the back ear shows just its outline.
const PATTERN = [
  "......KK......K...........",
  ".....KBBK....KBK..........",
  "....KBPPBK..KBPK..........",
  "....KBPPBBKKBBBK..........",
  "...KKBBBBBBBBBBKKKK.......",
  "..KWWKKKBBBBBBKWWWKK......",
  ".KWWWPKK.KKKKKWWWWWWK.....",
  ".KWWWWWWK....KWWBBWWK.....",
  ".KWWWWWWK....KWWWWBWK.KKKK",
  "..KKKWWWK....KWWWWWWKKBBBK",
  "....KKKKK....KKKKKKKKBBBKK",
  "..GGGGGGG....GGGGGGGGG.G..",
];

const W = PATTERN[0].length;
const H = PATTERN.length;

export function SleepingCat({ size = 80, className }: Props) {
  return (
    <svg
      width={size}
      height={size * (H / W)}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="A pixel-art sleeping cat"
      className={className}
      shapeRendering="crispEdges"
    >
      {PATTERN.flatMap((row, y) =>
        Array.from(row, (cell, x) => {
          const fill = PALETTE[cell];
          if (!fill) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={fill}
            />
          );
        }),
      )}
    </svg>
  );
}
