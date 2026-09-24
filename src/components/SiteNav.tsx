"use client";

import Link from "next/link";
import { studio } from "@/data/studio";
import type { RoomKey } from "@/lib/types";
import { rememberView, type HomeView } from "@/lib/homeView";

/* ──────────────────────────────────────────────────────────────────
   NAV SPACING — tune these three values and nothing else.

   The nav row is anchored to the HERO MEDIA, not to the viewport. Its
   cell is col-start-3 col-span-8, which is the same span the media
   block uses on the home page, so:

     · index / gallery / journal  start on the media's centre line
     · info                       sits on the media's right edge
     · the wordmark               stays at column 1
     · the clock                  stays in columns 11-12

   Anything that changes the media block's columns has to change this
   cell to match, or the two stop agreeing.

   Gap between adjacent links is ethanandtom.com's, measured at 1440:
   Selects x871-908, Index x928-955, Photo x975-1004 — 20px apart, with
   a "/" centred in each gap.
   ────────────────────────────────────────────────────────────────── */

/** Gap between adjacent nav links. Theirs is 20px at 1440. */
const LINK_GAP = "20px";

/** The columns the hero media occupies. Keep in step with HomeIndex. */
const MEDIA_CELL = "md:col-start-3 md:col-span-8";

/** Distance from the wordmark's baseline row to the top edge. */
const TOP_INSET = "var(--space-1)";

interface SiteNavProps {
  /**
   * Set only on home, where the index is an arrangement of this page
   * rather than a route: the wordmark and the index link then switch
   * the view in place instead of navigating. Absent everywhere else,
   * where both are ordinary links back to `/`.
   */
  homeView?: HomeView;
  onShowView?: (view: HomeView) => void;
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
 * Set in Switzer, the face ethanandtom.com uses. Theirs is 10.8px/600 at
 * a viewport-relative size (0.75vw: 10.8px at 1440, 14.4px at 1920);
 * this project runs one fixed 12px everywhere, so the family is adopted
 * and the sizing is not. Switzer is self-hosted as two variable files —
 * see layout.tsx — so 600 here is a real cut, not a synthesized one.
 *
 * Every element in the row sits at that one weight and one ink, so the
 * underline is the only state signal — see .nav-link in globals.css.
 * The modifier comes from the same boolean that sets aria-current, so
 * the visual and semantic states cannot drift.
 */
export default function SiteNav({ activeRoom, trailing, homeView, onShowView }: SiteNavProps) {
  const rooms = [...studio.navItems];
  const info = { label: "info", href: "/info", room: "info" as RoomKey };

  const linkClass = (isActive: boolean) =>
    `nav-link text-label text-ws-ink ${isActive ? "nav-link--active" : ""}`;

  return (
    /* data-site-nav lets globals.css hold this row still through a
       home <-> /works move, instead of fading it out with the view it
       happens to be sitting in. */
    <div
      data-site-nav=""
      className="grid12 items-baseline font-switzer"
      style={{ paddingTop: TOP_INSET }}
    >
      {/* Two columns, not four. The nav cell starts at column 3, and a
          four-column wordmark overlapped it — overlapping grid items get
          auto-placed into a new row, which is what put the whole nav 14px
          below the wordmark. It is left-aligned in its cell either way,
          so nothing moves visually. */}
      <Link
        href="/"
        onClick={(event) => {
          // On home the wordmark returns to the spread without a
          // navigation; elsewhere it is an ordinary link.
          if (!onShowView) return;
          event.preventDefault();
          onShowView("home");
        }}
        className="col-span-2 col-start-1 text-label text-ws-ink"
      >
        {studio.wordmark}
      </Link>

      {/* One cell on the media's columns: the rooms start at its centre
          and info is pinned to its right edge, so both line up with the
          hero without either needing a hard-coded position. */}
      <nav
        aria-label="Primary"
        // flex-nowrap from md up: a WRAPPING flex container is
        // multi-line, and a multi-line flex container has no real
        // baseline — the browser synthesises one from its bottom edge,
        // which would knock it off the wordmark's line.
        //
        // pl-[50%] puts the first link's left edge on the cell's centre,
        // and the cell spans the media, so "index" starts exactly on the
        // media's centre line.
        className={`relative col-span-8 col-start-5 flex flex-wrap items-baseline ${MEDIA_CELL} md:flex-nowrap md:pl-[50%]`}
        style={{ columnGap: LINK_GAP, rowGap: "4px" }}
      >
        {rooms.map((item) => {
          // "index" is not a room. It is home's other arrangement, so on
          // home it switches the view, and from any other page it asks
          // home to open in that arrangement and then goes there. The
          // href stays real either way, so middle-click and copy-link
          // still do something sensible.
          const isIndex = item.room === "index";
          const isActive = isIndex ? homeView === "index" : item.room === activeRoom;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => {
                if (!isIndex) return;
                if (onShowView) {
                  event.preventDefault();
                  onShowView("index");
                  return;
                }
                rememberView("index");
              }}
              aria-current={isActive ? "page" : undefined}
              className={linkClass(isActive)}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          href={info.href}
          aria-current={activeRoom === "info" ? "page" : undefined}
          className={`${linkClass(activeRoom === "info")} md:absolute md:right-0`}
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
