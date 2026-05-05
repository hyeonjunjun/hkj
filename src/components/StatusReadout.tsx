"use client";

import { useEffect, useState } from "react";

/**
 * StatusReadout — fixed top-right live data block. Three lines of
 * microtype: local time (updates each second), session local
 * indicator, and the build SHA. aino-coded fixed-corner data
 * presence — the page feels live without anything moving on idle.
 *
 * Time updates via setInterval(1000); reduced-motion does not
 * disable it because text-only updates aren't motion. Hidden on
 * small viewports to avoid crowding the nav.
 */
function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function StatusReadout() {
  const [time, setTime] = useState<string>(() => formatTime(new Date()));

  useEffect(() => {
    // Sync to the next second boundary, then tick.
    const now = new Date();
    const msToNextSec = 1000 - now.getMilliseconds();
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      setTime(formatTime(new Date()));
      interval = window.setInterval(() => setTime(formatTime(new Date())), 1000);
    }, msToNextSec);
    return () => {
      window.clearTimeout(timeout);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, []);

  const buildSha = (process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7) ?? "local").toUpperCase();

  return (
    <aside className="status" aria-label="Live status">
      <span className="status__row">
        <span className="status__label">NYC</span>
        <span className="status__value tabular">{time}</span>
      </span>
      <span className="status__row">
        <span className="status__label">Status</span>
        <span className="status__value">Live</span>
      </span>
      <span className="status__row">
        <span className="status__label">Build</span>
        <span className="status__value tabular">{buildSha}</span>
      </span>

      <style>{`
        .status {
          position: fixed;
          top: 56px;
          right: 24px;
          z-index: 49;
          display: grid;
          gap: 4px;
          font-family: var(--font-stack-sans);
          font-size: 9px;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: var(--ink-4);
          pointer-events: none;
          text-align: right;
        }
        .status__row {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          justify-content: flex-end;
        }
        .status__label {
          color: var(--ink-4);
          opacity: 0.7;
        }
        .status__value {
          color: var(--ink-3);
        }
        @media (max-width: 960px) {
          .status { display: none; }
        }
      `}</style>
    </aside>
  );
}
