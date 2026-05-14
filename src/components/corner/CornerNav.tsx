"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * CornerNav — full-bleed editorial nav for the /v/corner experience.
 *
 * "Editorial, no container" per spec: stretches edge-to-edge with
 * only the page-margin token for breathing. Two-row newspaper layout:
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ RYAN JUN  ·  multidisciplinary    ⏵ ADORE U     index / notes│
 *   │ new york                          fred again..  about       │
 *   ├ hairline ────────────────────────────────────────────────────┤
 *
 * Hairline rule below seals it. The wordmark carries the `rj-mark`
 * view-transition-name (shared with the global Logo across the rest
 * of the site, but Logo is hidden on /v/corner/* so there's no
 * duplication).
 *
 * Active route is indicated with `.is-active` rather than colored
 * underline — flat hierarchy reads more editorial.
 */

const ROUTES = [
  { href: "/v/corner",           label: "Index" },
  { href: "/v/corner/notes",     label: "Notes" },
  { href: "/v/corner/about",     label: "About" },
  { href: "/contact",            label: "Contact" },
] as const;

const NYC_DATE = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const NYC_TIME = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function stampNYC(): { date: string; time: string } {
  const now = new Date();
  return {
    date: NYC_DATE.format(now).replace(/\//g, "."),
    time: NYC_TIME.format(now),
  };
}

export function CornerNav() {
  const pathname = usePathname() ?? "";
  const [stamp, setStamp] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    const tick = () => setStamp(stampNYC());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="corner-nav" role="banner">
      <div className="corner-nav__row corner-nav__row--top">
        <Link href="/v/corner" className="corner-nav__mark" aria-label="Ryan Jun — Index">
          <span className="t-monument corner-nav__name">Ryan Jun</span>
        </Link>

        <span className="corner-nav__center t-meta tabular dim">
          {stamp ? (
            <>
              {stamp.date}
              <span className="t-sep" aria-hidden>·</span>
              NYC&nbsp;{stamp.time}
            </>
          ) : (
            "—— · NYC ——:——"
          )}
        </span>

        <nav className="corner-nav__links" aria-label="Primary">
          {ROUTES.map((r, i) => {
            const isActive =
              pathname === r.href ||
              (r.href !== "/v/corner" && pathname.startsWith(r.href));
            return (
              <span key={r.href} className="corner-nav__cell">
                {i > 0 && <span className="t-sep" aria-hidden>·</span>}
                <Link
                  href={r.href}
                  className={`t-meta corner-nav__link${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {r.label}
                </Link>
              </span>
            );
          })}
        </nav>
      </div>

      <div className="corner-nav__row corner-nav__row--sub">
        <span className="t-meta dim">multidisciplinary · design · engineering · direction</span>
        <span className="t-meta dim corner-nav__avail">
          <span className="corner-nav__live-dot" aria-hidden />
          currently accepting work for 2026
        </span>
      </div>

      <hr className="t-rule corner-nav__rule" />

      <style>{`
        .corner-nav {
          /* No container: span the full width of the page wrapper with
             only the page-margin token for breathing. */
          width: 100%;
          padding: clamp(14px, 2vh, 20px) var(--margin-page) 0;
          display: grid;
          row-gap: clamp(4px, 0.6vh, 8px);
          position: relative;
          z-index: 4;
        }
        .corner-nav__row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: baseline;
          column-gap: clamp(16px, 2vw, 32px);
        }
        .corner-nav__row--top {
          align-items: end;
        }
        .corner-nav__mark {
          color: var(--ink);
          justify-self: start;
          /* Lock the masthead to the editorial bottom-line so the
             wordmark anchors the row. */
        }
        .corner-nav__name {
          text-transform: none;
          letter-spacing: -0.02em;
          font-size: clamp(20px, 3vw, 32px);
          view-transition-name: rj-mark;
          line-height: 1;
        }
        .corner-nav__center {
          justify-self: center;
          color: var(--ink-3);
          white-space: nowrap;
        }
        .corner-nav__links {
          justify-self: end;
          display: inline-flex;
          align-items: baseline;
        }
        .corner-nav__cell {
          display: inline-flex;
          align-items: baseline;
        }
        .corner-nav__link {
          color: var(--ink-3);
          padding: 0 6px;
          transition: color 180ms var(--ease), letter-spacing 220ms var(--ease);
          letter-spacing: var(--track-loose);
          text-transform: uppercase;
        }
        .corner-nav__link:hover {
          color: var(--ink);
          letter-spacing: 0.10em;
        }
        .corner-nav__link.is-active {
          color: var(--ink);
        }
        .corner-nav__link.is-active::after {
          content: "";
          display: inline-block;
          width: 4px;
          height: 4px;
          margin-left: 6px;
          border-radius: 50%;
          background: var(--accent);
          vertical-align: middle;
          transform: translateY(-1px);
        }

        .corner-nav__row--sub {
          /* Second editorial line — tagline left, status right. */
          align-items: baseline;
        }
        .corner-nav__avail {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--ink-3);
        }
        .corner-nav__live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 0 var(--accent-2);
          animation: corner-nav-pulse 2.6s ease-in-out infinite;
        }
        @keyframes corner-nav-pulse {
          0%   { box-shadow: 0 0 0 0 var(--accent-2); }
          70%  { box-shadow: 0 0 0 6px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }

        .corner-nav__rule {
          margin-top: clamp(10px, 1.4vh, 16px);
          background: var(--ink-hair);
        }

        @media (max-width: 760px) {
          .corner-nav__row {
            grid-template-columns: 1fr auto;
          }
          .corner-nav__center { display: none; }
          .corner-nav__row--sub .corner-nav__avail {
            font-size: 9px;
          }
        }
        @media (max-width: 480px) {
          .corner-nav__row--sub > :first-child { display: none; }
          .corner-nav__row--sub { justify-content: flex-end; }
        }

        @media (prefers-reduced-motion: reduce) {
          .corner-nav__live-dot { animation: none; }
          .corner-nav__link { transition: color 180ms var(--ease); }
        }
      `}</style>
    </header>
  );
}
