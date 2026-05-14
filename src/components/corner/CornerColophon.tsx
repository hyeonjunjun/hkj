"use client";

import { useEffect, useState } from "react";

/**
 * CornerColophon — quiet footer for the corner.
 *
 * Three beats:
 *   1. signature line — `ryan jun · independent practice · © 2026`
 *   2. live indicator — a slowly-pulsing amber dot + NYC time (one of
 *      the three rationed Solari amber accent placements)
 *   3. build hash — a 7-char git hash micro-flourish (the engineering
 *      tell) read from NEXT_PUBLIC_BUILD_HASH at build time, falling
 *      back to a static placeholder in dev.
 *
 * No theme toggle button here for v0 — the global theme toggle lives
 * in existing chrome; the corner inherits it. Adding a duplicate
 * would be noise.
 */

const NYC_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function nycNow(): string {
  return NYC_FORMATTER.format(new Date());
}

export function CornerColophon() {
  const [time, setTime] = useState<string | null>(null);
  const buildHash =
    process.env.NEXT_PUBLIC_BUILD_HASH ??
    "0000000"; // placeholder when not provided by CI

  useEffect(() => {
    const tick = () => setTime(nycNow());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="corner-foot">
      <div className="corner-foot__line">
        <span className="t-footnote">ryan jun</span>
        <span className="t-sep" aria-hidden>·</span>
        <span className="t-footnote dim">independent practice</span>
        <span className="t-sep" aria-hidden>·</span>
        <span className="t-footnote dim">© 2026</span>
      </div>

      <div className="corner-foot__live" aria-label={`Live now in New York${time ? `, ${time}` : ""}`}>
        <span className="corner-foot__dot" aria-hidden />
        <span className="t-footnote tabular live">
          NYC {time ?? "——:——"}
        </span>
      </div>

      <div className="corner-foot__build">
        <span className="t-footnote dimmer">build · {buildHash.slice(0, 7)}</span>
      </div>

      <style>{`
        .corner-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: clamp(12px, 2vw, 28px);
          padding-top: clamp(60px, 8vh, 96px);
          margin-top: clamp(60px, 8vh, 96px);
          border-top: 1px solid var(--ink-ghost);
        }
        .corner-foot__line {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
        }
        .corner-foot__live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .corner-foot__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 0 var(--accent-2);
          animation: corner-foot-pulse 2.6s ease-in-out infinite;
        }
        @keyframes corner-foot-pulse {
          0%   { box-shadow: 0 0 0 0 var(--accent-2); }
          70%  { box-shadow: 0 0 0 6px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .corner-foot__build {
          display: inline-flex;
          align-items: baseline;
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-foot__dot { animation: none; }
        }
      `}</style>
    </footer>
  );
}
