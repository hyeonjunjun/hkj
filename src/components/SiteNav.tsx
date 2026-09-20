import Link from "next/link";
import { studio } from "@/data/studio";
import type { RoomKey } from "@/lib/types";

interface SiteNavProps {
  /** Which room renders as current. Omit on the landing page. */
  activeRoom?: RoomKey;
  /** Rendered at the end of the nav row — the landing page puts its clock here. */
  trailing?: React.ReactNode;
}

/**
 * Wordmark + primary nav, on the grid.
 *
 * Previously this markup existed twice — once in RoomHeader and once
 * inline in the landing page — with the two copies already drifting
 * apart (different wordmark sizes, one with a clock, one without). One
 * component now serves both.
 *
 * Laid out on grid columns rather than with `justify-between` against
 * the viewport edges. Edge-pinning looked fine at 1440 but pushed the
 * wordmark and the links further apart the wider the screen got, leaving
 * a growing dead centre; grid columns are fluid, so the row holds the
 * same proportions at every width.
 *
 * Current room is signalled by weight (500 vs 400), not colour alone —
 * the whole type system runs on weight, and state should too.
 */
export default function SiteNav({ activeRoom, trailing }: SiteNavProps) {
  const items = [
    ...studio.navItems,
    { label: "info", href: "/info", room: "info" as RoomKey },
  ];

  return (
    <div className="grid12 items-end">
      {/* Wordmark takes 4 columns, then each link takes 2 — 4 + 4x2 = 12,
          so the row fills the measure exactly at any width. Every cell is
          ruled underneath (ard.works' pattern): at ultrawide the space
          between items becomes structure rather than a void, which is
          what a plain right-aligned nav could not do. */}
      <Link
        href="/"
        className="col-span-6 col-start-1 border-b border-ws-rule pb-[var(--space-1)] text-label text-ws-ink md:col-span-4"
      >
        {studio.wordmark}
      </Link>

      <nav
        aria-label="Primary"
        // With a trailing slot the clock claims columns 11-12, so the nav
        // yields to 5-10; without one it runs 5-12.
        className={`col-span-6 col-start-7 grid grid-cols-2 gap-x-[var(--gutter)] md:col-start-5 md:grid-cols-4 ${
          trailing ? "md:col-span-6" : "md:col-span-8"
        }`}
      >
        {items.map((item) => {
          const isActive = item.room === activeRoom;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              // State is weight, not colour alone — the type system runs
              // on weight, so navigation state should too.
              className={`border-b border-ws-rule pb-[var(--space-1)] transition-colors hover:text-ws-ink ${
                isActive ? "text-label text-ws-ink" : "text-value text-ws-ink-mute"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {trailing && (
        <div className="col-span-12 col-start-1 mt-[var(--space-2)] flex justify-end md:col-span-2 md:col-start-11 md:mt-0 md:border-b md:border-ws-rule md:pb-[var(--space-1)]">
          {trailing}
        </div>
      )}
    </div>
  );
}
