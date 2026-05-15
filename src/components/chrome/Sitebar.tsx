"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition/TransitionLink";

const RESERVE_PX = 120; // width carved out for BackButton when off-home
const NEXT_AVAILABILITY = "23 MAY 2026";

const ROUTES = [
  { href: "/legacy", label: "Index" },
  { href: "/legacy/work", label: "Work" },
  { href: "/legacy/about", label: "About" },
  { href: "/legacy/contact", label: "Contact" },
];

function formatNYC(now: Date): { time: string; date: string } {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now).replace(/\//g, ".");
  return { time, date };
}

export function Sitebar() {
  const pathname = usePathname();
  const isHome = pathname === "/legacy";
  const [stamp, setStamp] = useState(() => formatNYC(new Date()));

  useEffect(() => {
    const id = setInterval(() => setStamp(formatNYC(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  // The corner (everything outside /legacy) renders its own editorial
  // nav inside CornerNav. Only show the global Sitebar on /legacy
  // routes — these are the preserved old pages.
  if (!pathname?.startsWith("/legacy")) return null;

  return (
    <header
      className="sitebar"
      role="banner"
      aria-label="Site header"
      data-off-home={isHome ? undefined : ""}
    >
      <span className="t-footnote sitebar__left">
        {isHome && (
          <>
            Ryan Jun
            <span className="t-sep">·</span>
            <span>Multidisciplinary design / engineering / direction</span>
          </>
        )}
      </span>
      <span className="t-footnote tabular sitebar__center">
        {stamp.date} <span className="t-sep">·</span> NYC {stamp.time}
      </span>
      <nav className="sitebar__nav" aria-label="Primary">
        {ROUTES.map((route, i) => (
          <span key={route.href} className="sitebar__nav-cell">
            {i > 0 && <span className="t-sep sitebar__nav-sep" aria-hidden>·</span>}
            <TransitionLink
              href={route.href}
              className="t-footnote sitebar__nav-link"
              showActiveIndicator
            >
              {route.label}
            </TransitionLink>
          </span>
        ))}
        <span className="t-footnote sitebar__next-avail">
          <span className="t-sep" aria-hidden>·</span>
          <span aria-label={`Next availability ${NEXT_AVAILABILITY}`}>
            Next · {NEXT_AVAILABILITY}
          </span>
        </span>
      </nav>

      <style>{`
        .sitebar {
          position: fixed;
          /* Small breathing from the top edge — sits as a thin pill at
             the top of the viewport with side padding scaled to the
             page margin token. Height bumped to 36 so internal text
             has air around it instead of crowding the top/bottom. */
          top: 12px;
          left: clamp(12px, 1.5vw, 24px);
          right: clamp(12px, 1.5vw, 24px);
          height: 36px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: clamp(24px, 3vw, 48px);
          padding: 0 clamp(16px, 2vw, 28px);
          background: var(--ink);
          color: var(--paper);
          border-radius: 2px;
          z-index: 50;
          pointer-events: auto;
        }
        .sitebar[data-off-home] {
          padding-left: ${RESERVE_PX}px;
        }
        .sitebar__left { justify-self: start; }
        .sitebar__center { justify-self: center; }
        .sitebar__nav {
          justify-self: end;
          display: inline-flex;
          align-items: baseline;
          gap: 0;
        }
        .sitebar .t-footnote { color: var(--paper); }
        .sitebar .t-sep { color: var(--paper); opacity: 0.5; margin: 0 0.55em; }
        .sitebar__nav-cell { display: inline-flex; align-items: baseline; }
        .sitebar__nav-sep { color: var(--paper); opacity: 0.4; margin: 0 0.4em; }
        .sitebar__nav-link {
          color: var(--paper);
          opacity: 0.7;
          text-transform: uppercase;
          transition: opacity 180ms var(--ease);
          padding: 0 10px;
        }
        .sitebar__nav-link:hover { opacity: 1; }
        .sitebar__next-avail {
          display: inline-flex;
          align-items: baseline;
          color: var(--paper);
          opacity: 0.65;
          padding-left: 10px;
          gap: 0.4em;
        }
        @media (max-width: 760px) {
          /* Drop the center clock and shrink to a single row: nav only,
             since the brand wordmark and clock are nice-to-have, not
             load-bearing chrome on small viewports. */
          .sitebar {
            grid-template-columns: 1fr;
            height: 32px;
            padding: 0 12px;
          }
          .sitebar[data-off-home] { padding-left: 88px; }
          .sitebar__left { display: none; }
          .sitebar__center { display: none; }
          .sitebar__nav { justify-self: end; }
          .sitebar__nav-link { padding: 0 4px; font-size: 8px; }
          .sitebar__nav-sep { margin: 0 0.2em; }
          .sitebar__next-avail { font-size: 8px; padding-left: 4px; }
        }
        @media (max-width: 420px) {
          /* Tightest layout: drop the availability indicator so nav
             fits. The date is still visible at every wider viewport. */
          .sitebar__next-avail { display: none; }
        }
      `}</style>
    </header>
  );
}
