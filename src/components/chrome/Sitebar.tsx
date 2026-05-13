"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const RESERVE_PX = 120; // width carved out for BackButton when off-home

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
      <span className="t-footnote sitebar__right">
        Selective for q3 2026
      </span>

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
        .sitebar__right { justify-self: end; }
        .sitebar .t-footnote { color: var(--paper); }
        .sitebar .t-sep { color: var(--paper); opacity: 0.5; margin: 0 0.4em; }
        @media (max-width: 640px) {
          .sitebar {
            grid-template-columns: 1fr;
            height: auto;
            padding: 6px 12px;
          }
          .sitebar[data-off-home] { padding-left: 12px; }
          .sitebar__left { display: none; }
          .sitebar__right { display: none; }
        }
      `}</style>
    </header>
  );
}
