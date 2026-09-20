"use client";

import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

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
 *   44px vertical pitch
 *
 * The state mechanic is kept exactly: colour, size and position are
 * identical between states — only the radius changes. Active is a
 * square, everything else a circle. Nothing moves, so the rail never
 * twitches as the page scrolls through it.
 *
 * His swatch is a flat colour because he is a colourist and the grade IS
 * the project. Ours is the work's own media cover-cropped into the same
 * cell: at 20px a photograph reads as a colour anyway, so the swatch
 * stays content-derived without inventing a colour field.
 *
 * The title sits beside the active row only — also his pattern, where a
 * collapsed row expands to show its name. Rendered for every row but
 * hidden when inactive, so the rail's width never changes and the
 * swatches never shift sideways as the active row moves.
 */
export default function SwatchRail({ works, activeIndex, onSelect }: SwatchRailProps) {
  return (
    <ul className="flex flex-row items-center gap-[var(--space-2)] md:flex-col md:items-start">
      {works.map((w, i) => {
        const isActive = i === activeIndex;
        return (
          <li key={w.id} className="flex items-center gap-[var(--space-2)]">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Go to ${w.title}`}
              className={`block h-5 w-5 shrink-0 overflow-hidden bg-ws-fill transition-[border-radius] duration-300 ${
                isActive ? "rounded-none" : "rounded-full"
              }`}
            >
              {/* Guarded: the placeholder path draws its own "content
                  coming soon" copy, illegible inside a 20px circle. */}
              {w.media.src ? <MediaRenderer media={w.media} fit="cover" /> : null}
            </button>

            {/* aria-hidden: the button above already carries this name,
                so exposing it twice would double it for screen readers. */}
            <span
              aria-hidden="true"
              className={`hidden whitespace-nowrap text-label text-ws-ink transition-opacity duration-300 md:block ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {w.title.toLowerCase()}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
