"use client";

import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

/** Swatch edge, px. Matches the 20px cell measured on dylan.camera. */
const SWATCH = 20;
/** Gap between swatches, px. */
const GAP = 16;
/** One row of the strip. */
const PITCH = SWATCH + GAP;
/** Rows shown through the mask. Odd, so one sits dead centre. */
const VISIBLE = 11;
/**
 * Copies of the list stacked into the strip. Odd, viewer in the middle.
 *
 * The strip has to read as endless in BOTH directions — the page loops,
 * so a rail that runs out of swatches above the first project or below
 * the last would say the opposite. Three copies mean there is always
 * more strip past the mask whichever way you are going.
 */
const SETS = 3;
const MIDDLE = Math.floor(SETS / 2);

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
 * work is current. Swatches travel past a fixed point as you scroll, and
 * the title beside that point never moves.
 *
 * The title is therefore NOT rendered per row. One element sits at the
 * centre and swaps its text, which keeps it still while the strip moves.
 *
 * Geometry: with the strip centred, row i's centre sits at
 * (i + 0.5) * PITCH from its top, and the top is half the strip's height
 * above centre. Solving for the offset that puts row i on the line gives
 * (rows/2 - i - 0.5) * PITCH.
 *
 * PITCH is fixed px rather than the fluid --space-2 token on purpose:
 * that token derives from the viewport (100vw/180), so a resize would
 * change the row height and silently break the transform.
 */
export default function SwatchRail({ works, activeIndex, onSelect }: SwatchRailProps) {
  const n = works.length;
  const rows = n * SETS;
  // Track the copy in the middle set, so there is always strip above and
  // below regardless of which project is current.
  const rowIndex = MIDDLE * n + activeIndex;
  const offset = (rows / 2 - rowIndex - 0.5) * PITCH;

  return (
    <div className="relative flex items-center gap-[var(--space-2)]">
      <div
        className="relative overflow-hidden"
        style={{
          width: SWATCH,
          height: PITCH * VISIBLE,
          // Fades only at the very ends, so most of the strip reads
          // clearly. A tighter mask left barely three swatches legible
          // and hid the fact that the list continues.
          maskImage:
            "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
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
          {Array.from({ length: SETS }).flatMap((_, s) =>
            works.map((w, i) => {
              const isActive = s === MIDDLE && i === activeIndex;
              const isPrimary = s === MIDDLE;
              return (
                <li key={`${s}-${w.id}`} style={{ height: SWATCH }}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Go to ${w.title}`}
                    // Only the middle copy is reachable by keyboard or
                    // screen reader; the other two exist to make the
                    // strip look endless, and announcing every project
                    // three times would be noise.
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
