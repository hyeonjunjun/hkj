/**
 * SleepingCat — pixel-art illustration of a curled-up sleeping cat.
 *
 * Used as the personality-laden empty-state for project tiles and
 * media placeholders that don't yet have hero assets. The pixel-art
 * register echoes Departure Mono's chrome (small caps / catalog
 * labels) — both share the dot-matrix sensibility, so the cat reads
 * as part of the same visual family rather than a different language.
 *
 * Implementation: a 14×9 pixel grid encoded as a string array, with
 * each `#` cell rendered as a 1×1 SVG `<rect>` and each `z` cell
 * rendered at reduced opacity (the sleep marks are visually quieter
 * than the body). `shape-rendering="crispEdges"` keeps the pixels
 * sharp at any scale; `currentColor` lets the parent's color cascade
 * tint the cat (default: --ink-3).
 */

interface Props {
  /** Pixel size of the cat (width). Height is proportional. */
  size?: number;
  className?: string;
}

// 14 cols × 9 rows. `#` = body pixel, `z` = sleep mark (drawn at lower
// opacity), `.` = empty. Left side is the head + ears; tail wraps on
// the right; sleep "z z" floats above the head.
const PATTERN = [
  ".##.##........",
  "######...z....",
  "######..z.z...",
  "##############",
  "#............#",
  "#..........###",
  "#............#",
  ".############.",
  "..############",
];

const W = PATTERN[0].length;
const H = PATTERN.length;

export function SleepingCat({ size = 56, className }: Props) {
  return (
    <svg
      width={size}
      height={size * (H / W)}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="A pixel-art sleeping cat"
      className={className}
      shapeRendering="crispEdges"
      fill="currentColor"
    >
      {PATTERN.flatMap((row, y) =>
        Array.from(row, (cell, x) => {
          if (cell === "#") {
            return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />;
          }
          if (cell === "z") {
            return (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="1"
                height="1"
                opacity="0.5"
              />
            );
          }
          return null;
        }),
      )}
    </svg>
  );
}
