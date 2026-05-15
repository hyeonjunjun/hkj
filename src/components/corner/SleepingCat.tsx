/**
 * SleepingCat — minimal SVG illustration of a curled-up sleeping cat.
 *
 * Used as the personality-laden empty-state for project tiles and
 * media placeholders that don't yet have hero assets. Replaces the
 * prior diagonal-stripe hatch with a quieter, hand-drawn-feel mark
 * (Ryan-coded, not generic).
 *
 * Stroke uses currentColor so the parent's `color` cascade tints the
 * cat. Recommended parent color: var(--ink-3) or var(--ink-4) so it
 * sits as a quiet detail rather than competing for attention.
 *
 * The "z" floating above the cat marks it as sleeping — a small
 * editorial detail that rewards a closer look.
 */

interface Props {
  /** Pixel size of the cat (width). Height is proportional. */
  size?: number;
  className?: string;
}

export function SleepingCat({ size = 56, className }: Props) {
  return (
    <svg
      width={size}
      height={size * (40 / 80)}
      viewBox="0 0 80 40"
      role="img"
      aria-label="A sleeping cat"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Body — a curled loaf shape. One continuous path. */}
      <path d="M 8 30 C 8 16, 22 14, 32 14 C 52 14, 64 18, 66 24 C 67 30, 58 34, 44 34 C 26 34, 12 34, 8 30 Z" />

      {/* Left ear */}
      <path d="M 18 18 L 16 9 L 24 16" />

      {/* Right ear */}
      <path d="M 28 14 L 30 7 L 34 14" />

      {/* Closed eye — a soft downward arc */}
      <path d="M 20 22 q 2.5 1.6 5 0" />

      {/* Whisker hint — small line under the eye */}
      <path d="M 14 26 l 4 0.5" />

      {/* Tail curling around the body */}
      <path d="M 64 24 C 70 22, 72 16, 66 14 C 62 13, 60 16, 62 19" />

      {/* z z — sleeping marker, drawn as two stacked z paths */}
      <path d="M 44 8 L 50 8 L 44 13 L 50 13" strokeWidth="0.9" />
      <path d="M 53 4 L 58 4 L 53 8 L 58 8" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}
