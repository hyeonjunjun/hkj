import Link from "next/link";
import { studio } from "@/data/studio";
import type { RoomKey } from "@/lib/types";
import Clock from "./Clock";

interface RoomHeaderProps {
  /** Displayed as-is in the room label, e.g. "Index · 5". */
  roomLabel: string;
  /** Optional count, appended to roomLabel as " · {roomCount}". */
  roomCount?: number;
  /** Which nav item (if any) should render active rather than muted. */
  activeRoom?: RoomKey;
}

/**
 * Shared chrome at the top of every room: wordmark / nav / info as bare
 * text (no pill/container backgrounds — the editorial-analog rebuild's
 * explicit rule, applied site-wide per the "chips out everywhere"
 * call), then a room-label row with the plain grotesk clock in the same
 * top-right position it holds on every other page.
 */
/**
 * Primary navigation — DELIBERATELY UNSTYLED, pending a real system.
 *
 * The previous arrangement used `justify-between` across wordmark / nav /
 * clock, which pins the outer two and *centres* the middle one: at 1440
 * that left the link cluster marooned between two 569px voids, with an
 * arbitrary 20px gap that matched nothing in the grid.
 *
 * Rather than patch that, it has been reduced to the plain baseline you
 * see here: links in source order, left-anchored, separated by one
 * spacing token, no positioning opinion of its own. Layout above and
 * below is untouched.
 *
 * Measured reference values to build the new system against (1440px):
 *
 *   Shannon Lim    10px/400 UC   gap 24px between every item, without
 *                                exception; groups anchored left/centre/
 *                                right and separated by larger jumps;
 *                                top inset 7px, left inset 16px
 *   Cathy Dolle    11px/500 UC   gap 16px within a group; groups placed
 *                                on grid columns; top and left inset 8px
 *   dylan.camera   12px/400      top inset 12px
 *
 * None of them centres a lone cluster. Fill the width with grouped
 * items, or anchor groups to columns — do not stretch items to fit.
 */
export default function RoomHeader({ roomLabel, roomCount, activeRoom }: RoomHeaderProps) {
  return (
    <header className="relative z-10 px-[var(--edge-margin)] pt-[var(--space-1)]">
      <div className="flex flex-wrap items-baseline gap-x-[var(--space-3)] gap-y-2">
        <Link href="/" className="text-label text-ws-ink">
          {studio.wordmark}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-baseline gap-[var(--space-3)]">
          {[...studio.navItems, { label: "info", href: "/info", room: "info" as const }].map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.room === activeRoom ? "page" : undefined}
                className={
                  item.room === activeRoom ? "text-label text-ws-ink" : "text-value text-ws-ink-mute"
                }
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="mt-[var(--space-3)] flex items-baseline justify-between border-b border-ws-rule pb-[var(--space-2)]">
        <p className="text-label uppercase text-ws-ink">
          {roomCount !== undefined ? `${roomLabel} · ${roomCount}` : roomLabel}
        </p>
        <Clock />
      </div>
    </header>
  );
}
