"use client";

import { useEffect, useState } from "react";

/**
 * LiveTime — the masthead's departure-board clock.
 *
 * Renders the current New York wall-clock time as HH:MM, updating
 * exactly when the minute rolls over (not 60s after page load). The
 * format is always 24h tabular mono — the goal is not to *display
 * time* (we have system clocks for that) but to read as a live board
 * that's *currently in operation*. Seconds are intentionally absent;
 * second-tick boards feel anxious, minute-tick boards feel alive.
 *
 * The component renders a non-ticking initial value during SSR using
 * a fixed-zone formatter, then resolves to the real time on mount.
 * No layout shift: the slot is always 5 chars wide via tabular-nums.
 */

const FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default function LiveTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const render = () => setTime(FORMATTER.format(new Date()));
    render();

    // Schedule the next render to land on the next wall-clock minute
    // boundary, then every 60s after. Without this alignment the tick
    // drifts up to 59s away from the actual minute change.
    const now = new Date();
    const msToNext =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      render();
      intervalId = setInterval(render, 60_000);
    }, msToNext);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <span className="live-time tabular" aria-live="off">
      {time ?? "——:——"}
      <style>{`
        .live-time {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          letter-spacing: 0.06em;
          color: var(--accent);
          /* Tabular numerals already from .tabular; explicit minimum
             width keeps the slot stable even when the digits transition
             from 09:59 to 10:00. */
          min-width: 5ch;
          display: inline-block;
        }
      `}</style>
    </span>
  );
}
