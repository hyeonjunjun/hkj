"use client";

import { useEffect, useState } from "react";

const PLACEHOLDER = "-- ------- --, ----, --:--:-- EDT";

/**
 * Full live date + time readout for the homepage top bar, e.g.
 * "Tuesday July 14 2026, 20:18:19 EDT". Distinct from Clock.tsx (a short
 * "HH:MM EST" used in room chrome elsewhere) -- this is a homepage-only,
 * more verbose format. Server-rendered as a static placeholder, same
 * pattern as Clock.tsx, so hydration never has to reconcile a
 * server-rendered timestamp against a different client-rendered one.
 */
export default function DateTimeReadout() {
  const [value, setValue] = useState<string>(PLACEHOLDER);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const weekday = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: "America/New_York",
      }).format(now);
      const monthDay = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        timeZone: "America/New_York",
      }).format(now);
      const year = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        timeZone: "America/New_York",
      }).format(now);
      const time = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      }).format(now);
      setValue(`${weekday} ${monthDay} ${year}, ${time} EDT`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-display text-[13px] tabular-nums text-ws-ink">{value}</span>;
}
