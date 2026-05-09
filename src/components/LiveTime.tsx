"use client";

import { useEffect, useState } from "react";

/**
 * LiveTime — the page's live element. Renders current New York
 * wall-clock time as HH:MM, updating exactly when the minute
 * rolls over (not 60s after page load). The format is always
 * 24h tabular — minute-tick boards feel alive; second-tick
 * boards feel anxious.
 *
 * Styling is owned by the parent (the consuming cell). This
 * component emits text only — no font-family, no color, no size
 * — so it can drop into a cell__sym slot and inherit cell type
 * styles directly.
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

  return <>{time ?? "——:——"}</>;
}
