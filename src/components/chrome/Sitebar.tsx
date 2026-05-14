"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";

const RESERVE_PX = 120; // width carved out for BackButton when off-home

const ROUTES = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
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
  const isHome = pathname === "/";
  const [stamp, setStamp] = useState(() => formatNYC(new Date()));

  useEffect(() => {
    const id = setInterval(() => setStamp(formatNYC(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

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
        <span className="sitebar__theme">
          <ThemeToggle />
        </span>
      </nav>

      <style>{`
        .sitebar {
          position: fixed;
          top: var(--margin-page);
          left: var(--margin-page);
          right: var(--margin-page);
          height: 32px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: clamp(16px, 2vw, 32px);
          padding: 0 16px;
          background: var(--ink);
          color: var(--paper);
          border-radius: 4px;
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
        .sitebar .t-sep { color: var(--paper); opacity: 0.5; margin: 0 0.4em; }
        .sitebar__nav-cell { display: inline-flex; align-items: baseline; }
        .sitebar__nav-sep { color: var(--paper); opacity: 0.4; }
        .sitebar__nav-link {
          color: var(--paper);
          opacity: 0.7;
          text-transform: uppercase;
          transition: opacity 180ms var(--ease);
          padding: 0 6px;
        }
        .sitebar__nav-link:hover { opacity: 1; }
        .sitebar__theme { margin-left: 12px; }
        /* ThemeToggle ships its own colors via .theme-toggle / __btn /
           __sep classes. Force the inverse register inside the dark
           Sitebar pill so its labels stay legible. */
        .sitebar__theme .theme-toggle { color: var(--paper); }
        .sitebar__theme .theme-toggle__btn { color: var(--paper); opacity: 0.6; }
        .sitebar__theme .theme-toggle__btn:hover,
        .sitebar__theme .theme-toggle__btn[data-active] { color: var(--paper); opacity: 1; }
        .sitebar__theme .theme-toggle__sep { color: var(--paper); opacity: 0.4; }
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
          .sitebar__theme { margin-left: 8px; }
          .sitebar__theme .theme-toggle { font-size: 9px; }
        }
        @media (max-width: 420px) {
          /* Even tighter: drop the theme toggle so nav fits. The toggle
             is still reachable on every desktop viewport. */
          .sitebar__theme { display: none; }
        }
      `}</style>
    </header>
  );
}
