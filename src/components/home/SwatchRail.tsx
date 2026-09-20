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
 * The state mechanic is the whole point and is kept exactly: colour,
 * size and position are identical between states — only the radius
 * changes. Active is a square, everything else is a circle. Nothing
 * moves, so the rail never twitches as you go down it.
 *
 * Adapted in one respect. His swatch is a flat colour because he is a
 * colourist and the grade IS the project. Ours is the work's own media
 * cover-cropped into the same cell: at 20px a photograph reads as a
 * colour anyway, so the swatch stays content-derived without inventing
 * a colour field the data does not have.
 */
export default function SwatchRail({ works, activeIndex, onSelect }: SwatchRailProps) {
  return (
    <ul className="flex flex-row gap-[var(--space-2)] md:flex-col">
      {works.map((w, i) => {
        const isActive = i === activeIndex;
        return (
          <li key={w.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={isActive ? "true" : undefined}
              aria-label={w.title}
              className={`block h-5 w-5 overflow-hidden bg-ws-fill transition-[border-radius] duration-300 ${
                isActive ? "rounded-none" : "rounded-full"
              }`}
            >
              {/* Guarded: the placeholder path draws its own "content
                  coming soon" copy, which inside a 20px circle is noise. */}
              {w.media.src ? <MediaRenderer media={w.media} fit="cover" /> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
