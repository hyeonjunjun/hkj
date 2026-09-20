import Link from "next/link";
import { studio } from "@/data/studio";
import type { RoomKey } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────────
   NAV SPACING — tune these four values and nothing else.

   Measured off ethanandtom.com at 1440x900:

     Ethan & Tom   x  16 –   91      wordmark, 16px from the left edge
     Selects       x 871 –  908  ┐
     Index         x 928 –  955  │   20px gaps, a "/" centred in each
     Photo         x 975 – 1004  ┘   (8px + 4px slash + 8px)
     Info          x1154 – 1173      150px break before it
     17:59:04      x1348 – 1424      175px break, right-aligned

   Their link group begins at 60.5% of the viewport, Info sits at 80.1%,
   and the clock is flush right — so the right-hand side is a distributed
   set of three stops rather than one cluster.
   ────────────────────────────────────────────────────────────────── */

/** Gap between adjacent nav links. Theirs is 20px at 1440. */
const LINK_GAP = "20px";

/** Which grid column the link group starts on. Theirs lands at 60.5% ≈ col 8. */
const GROUP_START = "md:col-start-8";

/** Break before the trailing link, where they use 150px. */
const TRAILING_GAP = "40px";

/** Distance from the wordmark's baseline row to the top edge. */
const TOP_INSET = "var(--space-1)";

interface SiteNavProps {
  /**
   * Which link renders active. Omitted on the landing page — no nav item
   * points at home, so nothing there should read as current.
   */
  activeRoom?: RoomKey;
  /** Rendered flush right on the same row. */
  trailing?: React.ReactNode;
}

/**
 * Wordmark, primary nav, clock.
 *
 * The wordmark stays at column 1 where it was. Only the spacing on the
 * right-hand side changed, to ethanandtom.com's — see the block above.
 *
 * Their nav links are Switzer 10.8px/600, letter-spacing -0.02px,
 * line-height 14.4px, sentence case. That size is viewport-relative
 * (0.75vw: 10.8px at 1440, 14.4px at 1920), which this project does not
 * do — it runs one fixed 12px size everywhere — so type is left alone
 * here and only spacing was taken.
 *
 * The only state is active/inactive per link, carried by weight and ink:
 * 500/full when current, 400/mute otherwise.
 */
export default function SiteNav({ activeRoom, trailing }: SiteNavProps) {
  const items = [...studio.navItems];
  const info = { label: "info", href: "/info", room: "info" as RoomKey };

  const linkClass = (isActive: boolean) =>
    isActive ? "text-label text-ws-ink" : "text-value text-ws-ink-mute transition-colors hover:text-ws-ink";

  return (
    <div className="grid12 items-baseline" style={{ paddingTop: TOP_INSET }}>
      <Link href="/" className="col-span-4 col-start-1 text-label text-ws-ink">
        {studio.wordmark}
      </Link>

      <nav
        aria-label="Primary"
        className={`col-span-8 col-start-5 flex flex-wrap items-baseline ${GROUP_START} md:col-span-3`}
        style={{ columnGap: LINK_GAP, rowGap: "4px" }}
      >
        {items.map((item) => {
          const isActive = item.room === activeRoom;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={linkClass(isActive)}
            >
              {item.label}
            </Link>
          );
        })}

        {/* Trailing link, set off by a larger break as their Info is. */}
        <Link
          href={info.href}
          aria-current={activeRoom === "info" ? "page" : undefined}
          className={linkClass(activeRoom === "info")}
          style={{ marginLeft: `calc(${TRAILING_GAP} - ${LINK_GAP})` }}
        >
          {info.label}
        </Link>
      </nav>

      {/* text-right rather than flex: a flex container does not share the
          row's baseline reliably, which left the clock sitting 14px below
          the links. */}
      {trailing && (
        <div className="col-span-12 col-start-1 mt-1 text-right md:col-span-2 md:col-start-11 md:mt-0">
          {trailing}
        </div>
      )}
    </div>
  );
}

