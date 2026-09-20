import Link from "next/link";
import { studio } from "@/data/studio";
import type { RoomKey } from "@/lib/types";

interface SiteNavProps {
  /**
   * Which link renders active. Omitted on the landing page — no nav item
   * points at home, so nothing there should read as current.
   */
  activeRoom?: RoomKey;
}

/**
 * Wordmark, primary nav, clock.
 *
 * DELIBERATELY MINIMAL, pending a real navigation system. This is a
 * straight deduplication of markup that previously existed twice (once
 * in RoomHeader, once inline in the landing page) and had already
 * drifted — the wordmark was text-prose in one copy and text-label in
 * the other. Appearance is unchanged from that baseline; only the
 * duplication is gone.
 *
 * The only state is active/inactive on each link, carried by weight and
 * ink: 500/full when current, 400/mute otherwise. There is no
 * current-location readout — that row was removed deliberately.
 *
 * Reference measurements to build the real system against (1440px):
 *
 *   Shannon Lim    10px/400 UC   24px between every item without
 *                                exception; groups anchored left/centre/
 *                                right, separated by larger jumps;
 *                                top inset 7px, left inset 16px
 *   Cathy Dolle    11px/500 UC   16px within a group; groups placed on
 *                                grid columns; top and left inset 8px
 *   dylan.camera   12px/400      top inset 12px
 *
 * None of them centres a lone cluster, and none stretches items to fill
 * a width. Group and anchor instead.
 */
export default function SiteNav({ activeRoom }: SiteNavProps) {
  const items = [
    ...studio.navItems,
    { label: "info", href: "/info", room: "info" as RoomKey },
  ];

  return (
    <nav
      aria-label="Primary"
      className="flex flex-wrap items-baseline gap-[var(--space-3)]"
    >
      {items.map((item) => {
        const isActive = item.room === activeRoom;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive ? "text-label text-ws-ink" : "text-value text-ws-ink-mute"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** The wordmark, so both headers render it identically. */
export function Wordmark() {
  return (
    <Link href="/" className="text-label text-ws-ink">
      {studio.wordmark}
    </Link>
  );
}
