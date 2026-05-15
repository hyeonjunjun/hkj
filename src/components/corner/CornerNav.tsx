"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * CornerNav — ethan&tom-style editorial masthead for /v/corner.
 *
 *   ryan jun                Selects / Index / Notes / Info        21:11:43 (GMT)
 *
 * One row, full-bleed, page-margin padding only. The wordmark sits
 * top-left at editorial scale (~16px), tab nav sits center-right with
 * underline on the active tab, GMT timestamp pins the far right.
 *
 * Reference: ethan&tom (their nav layout) + Spotify Sans register (via
 * the Switzer font on `t-warmth`).
 *
 * Active route is shown via the `is-active` modifier — the link text
 * underlines on hover and on active. No amber accent here; pure
 * black/white discipline matches the dark corner register.
 */

const TABS = [
  // 2026-05-14 rename: Selects -> Index (the grid view is the index
  // we lead with) and Index -> Projects (the text ledger is the
  // exhaustive projects list).
  { href: "/v/corner",             label: "Index"    },
  { href: "/v/corner/list",        label: "Projects" },
  { href: "/v/corner/photography", label: "Photo"    },
  { href: "/v/corner/notes",       label: "Notes"    },
  { href: "/v/corner/about",       label: "Info"     },
] as const;

const EST_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function estNow(): string {
  return EST_FORMATTER.format(new Date());
}

export function CornerNav() {
  const pathname = usePathname() ?? "";
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(estNow());
    tick();
    // Align to the next whole-second boundary so the timestamp flips on
    // the actual second.
    const ms = 1000 - new Date().getMilliseconds();
    let id: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      tick();
      id = setInterval(tick, 1000);
    }, ms);
    return () => {
      clearTimeout(timeout);
      if (id) clearInterval(id);
    };
  }, []);

  return (
    <header className="corner-nav" role="banner">
      <Link href="/v/corner" className="corner-nav__mark t-warmth" aria-label="Ryan Jun — Index">
        ryan jun
      </Link>

      <nav className="corner-nav__tabs" aria-label="Primary">
        {TABS.map((t, i) => {
          const isActive =
            pathname === t.href ||
            (t.href !== "/v/corner" && pathname.startsWith(t.href));
          return (
            <span key={t.href} className="corner-nav__tab-cell">
              {i > 0 && <span className="corner-nav__sep" aria-hidden>/</span>}
              <Link
                href={t.href}
                className={`corner-nav__tab t-warmth${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {t.label}
              </Link>
            </span>
          );
        })}
      </nav>

      <span className="corner-nav__time t-warmth tabular" aria-label={time ? `Current Eastern time ${time}` : "Loading time"}>
        {time ?? "—:—:—"} <span className="corner-nav__time-suffix">(EST)</span>
      </span>

      <style>{`
        .corner-nav {
          position: sticky;
          top: 0;
          z-index: 30;
          width: 100%;
          padding: clamp(16px, 1.8vh, 22px) var(--margin-page);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          column-gap: clamp(16px, 2vw, 32px);
          /* Transparent background so mix-blend-mode on the text below
             can blend against whatever scrolls under the nav (grid,
             media, prose) rather than against a paper plate. The text
             color is white + mix-blend-mode: difference so the type
             always reads as the inverted color of whatever is behind. */
          background: transparent;
          mix-blend-mode: difference;
        }

        .corner-nav__mark {
          /* color: white + mix-blend-mode: difference on the parent
             nav = text inverts against whatever's behind. White over
             paper appears black; white over black media reads white. */
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: -0.01em;
          text-transform: none;
          line-height: 1;
          view-transition-name: rj-mark;
          padding: 4px 0;
        }
        .corner-nav__mark:hover {
          opacity: 0.85;
        }

        .corner-nav__tabs {
          justify-self: center;
          display: inline-flex;
          align-items: baseline;
          gap: 0;
        }
        .corner-nav__tab-cell {
          display: inline-flex;
          align-items: baseline;
        }
        /* Nav text colors are hardcoded rgba(255,255,255,...) because
           token vars (--ink, --ink-3) don't invert correctly under
           mix-blend-mode: difference applied at the .corner-nav level.
           Difference math wants the source to be pure white for the
           output to read as the inverse of whatever's behind. Alpha
           steps signal hover/active states. */
        .corner-nav__sep {
          color: rgba(255, 255, 255, 0.30);
          margin: 0 14px;
          font-family: var(--font-stack-spotify);
          font-size: 13px;
          font-weight: 400;
          user-select: none;
        }
        .corner-nav__tab {
          color: rgba(255, 255, 255, 0.55);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          padding: 4px 0;
          line-height: 1;
          position: relative;
          transition: color 200ms var(--ease);
        }
        .corner-nav__tab:hover {
          color: #fff;
        }
        .corner-nav__tab.is-active {
          color: #fff;
        }
        .corner-nav__tab.is-active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          background: #fff;
        }

        .corner-nav__time {
          justify-self: end;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          white-space: nowrap;
        }
        .corner-nav__time-suffix {
          color: rgba(255, 255, 255, 0.55);
          margin-left: 4px;
          font-size: 12px;
        }

        @media (max-width: 720px) {
          .corner-nav {
            grid-template-columns: auto 1fr;
            row-gap: 10px;
          }
          .corner-nav__tabs {
            grid-column: 1 / -1;
            justify-self: start;
          }
          .corner-nav__time {
            justify-self: end;
          }
        }
        @media (max-width: 480px) {
          .corner-nav__sep { margin: 0 8px; }
          .corner-nav__tab { font-size: 12px; }
          .corner-nav__time { font-size: 11px; }
        }
      `}</style>
    </header>
  );
}
