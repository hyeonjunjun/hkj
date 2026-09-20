"use client";

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
 * WINDOW SIZE — why it is the project count
 *
 * The window shows exactly as many rows as there are projects (capped at
 * MAX_VISIBLE), so what you see is one full cycle: every project once,
 * then the next one wraps in at the far end. It reads as a loop.
 *
 * A fixed 11-row window over 5 projects showed two complete repeats at
 * once, which reads as duplicated content rather than a continuous one.
 * Tying the window to the count also means this needs no attention as
 * the catalogue grows — five projects show five rows, twelve show nine
 * and keep cycling.
 *
 * The list is still rendered in SETS copies underneath. That is what
 * makes the wrap seamless: the window never reaches an end, because
 * there is always another copy past it in both directions. The copies
 * are scenery — only the middle one is reachable by keyboard or screen
 * reader, since announcing every project three times would be noise.
 *
 * Geometry: with the strip centred, row i's centre sits at
 * (i + 0.5) * PITCH from its top, and the top is half the strip's height
 * above centre. The offset that puts row i on the line is therefore
 * (rows / 2 - i - 0.5) * PITCH.
 *
 * PITCH is fixed px rather than the fluid --space-2 token on purpose:
 * that token derives from the viewport (100vw/180), so a resize would
 * change the row height and silently break the transform.
 */
export default function SwatchRail({ works, activeIndex, onSelect }: SwatchRailProps) {
  const n = works.length;
  if (n === 0) return null;

  // One cycle in view, capped so a long catalogue does not run the strip
  // off the screen.
  const visible = Math.min(n, MAX_VISIBLE);

  // Enough copies that the window is always filled on both sides, however
  // few projects there are. Odd, viewer in the middle.
  const sets = Math.max(3, Math.ceil(visible / n) * 2 + 1);
  const middle = Math.floor(sets / 2);

  const rows = n * sets;
  const rowIndex = middle * n + activeIndex;
  const offset = (rows / 2 - rowIndex - 0.5) * PITCH;

  return (
    <div className="relative flex items-center gap-[var(--space-2)]">
      <div
        className="relative overflow-hidden"
        style={{
          width: SWATCH,
          height: PITCH * visible,
          // Fades at the ends only, so the cycle reads clearly while the
          // rows entering and leaving stay soft.
          maskImage:
            "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)",
        }}
      >
        <ul
          className="absolute left-0 top-1/2 flex flex-col motion-safe:transition-transform motion-safe:duration-500"
          style={{
            gap: GAP,
            transform: `translateY(calc(-50% + ${offset}px))`,
            transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {Array.from({ length: sets }).flatMap((_, s) =>
            works.map((w, i) => {
              const isPrimary = s === middle;
              const isActive = isPrimary && i === activeIndex;
              return (
                <li key={`${s}-${w.id}`} style={{ height: SWATCH }}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Go to ${w.title}`}
                    aria-hidden={!isPrimary}
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
