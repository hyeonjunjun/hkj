"use client";

import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface TrackRowProps {
  work: Work;
  /** 1-based position in the set. */
  position: number;
  isActive: boolean;
  onSelect: () => void;
}

/**
 * One row of the hero's track list — the playlist equivalent of
 * dylan.camera's left rail, measured off his homepage at 1920:
 *
 *   x12 y12  20x20  rgb(85,107,68)   border-radius 0     <- active
 *   x12 y56  20x20  rgb(42,150,195)  border-radius 50%   <- inactive
 *
 * The state mechanic is his and it is worth keeping exactly: the swatch
 * does not change colour, size or position between states — only its
 * radius. Active is a square, everything else is a circle. Nothing moves,
 * so the list never twitches as you go down it.
 *
 * What is adapted rather than copied:
 *
 * - His swatch is a flat colour because he is a colourist and the grade
 *   IS the project. Ours is the work's own media, cover-cropped into the
 *   same 20px cell — at that size a photograph reads as a colour anyway,
 *   so the swatch stays content-derived without inventing a colour field
 *   that the data does not have.
 * - His row collapses to just the swatch and expands on hover. Ours stays
 *   open, because a playlist row carries its metadata: title, then
 *   category and year, then position.
 *
 * Every field is a filled cell. That is the load-bearing detail from his
 * layout: a filled cell holding a short word reads as a form field, so
 * the space inside it is capacity rather than a gap. The same labels set
 * as bare text on paper are what made this page feel empty.
 */
export default function TrackRow({ work, position, isActive, onSelect }: TrackRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "true" : undefined}
      className="group flex w-full items-center gap-[var(--space-1)] text-left"
    >
      <span
        aria-hidden="true"
        className={`h-5 w-5 shrink-0 overflow-hidden bg-ws-fill transition-[border-radius] duration-300 ${
          isActive ? "rounded-none" : "rounded-full"
        }`}
      >
        {/* Only render media when there is actually a source: the
            placeholder path draws its own "content coming soon" copy,
            which inside a 20px circle is illegible noise. An empty fill
            reads correctly as "no image yet". */}
        {work.media.src ? <MediaRenderer media={work.media} fit="cover" /> : null}
      </span>

      <span
        className={`flex h-5 min-w-0 flex-1 items-center truncate bg-ws-fill px-[var(--space-1)] transition-colors ${
          isActive ? "text-label text-ws-ink" : "text-value text-ws-ink-mute group-hover:text-ws-ink"
        }`}
      >
        {work.title.toLowerCase()}
      </span>

      <span className="hidden h-5 shrink-0 items-center bg-ws-fill px-[var(--space-1)] text-value text-ws-ink-mute lg:flex">
        {work.category.toLowerCase()}
      </span>

      <span className="hidden h-5 shrink-0 items-center bg-ws-fill px-[var(--space-1)] text-value text-ws-ink-mute sm:flex">
        {work.year}
      </span>

      <span className="flex h-5 shrink-0 items-center bg-ws-fill px-[var(--space-1)] text-value tabular-nums text-ws-ink-mute">
        {pad2(position)}
      </span>
    </button>
  );
}
