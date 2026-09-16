"use client";

import { useEffect, useState } from "react";

/**
 * Renders the current time in New York, "HH:MM EST", updated every 30s.
 * Plain grotesk, same weight/size as the nav bar text, no box — the
 * site's one recurring idiosyncratic detail, meant to sit unlabeled in
 * the top-right corner of every page (the time alone communicates what
 * it is). Server-rendered as a static "--:-- EST" placeholder so
 * hydration never has to reconcile a server-rendered timestamp against
 * a different client-rendered one — the real value is filled in after
 * mount.
 */
interface ClockProps {
  /**
   * "meta" (default) is the header row's size. "micro" matches CornerMark's
   * studio-info block, which is a step smaller — without this the same
   * clock rendered visibly larger than the lines stacked around it.
   */
  size?: "meta" | "micro";
}

export default function Clock({ size = "meta" }: ClockProps) {
  const [time, setTime] = useState<string>("--:--");

  useEffect(() => {
    const update = () => {
      const now = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date());
      setTime(now);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    // normal-case/tracking-normal are explicit, not redundant: CornerMark
    // renders this inside an uppercase, letter-spaced block, and without
    // the reset the same component renders two different ways on one page.
    <span
      className={`font-instrument-sans font-medium normal-case tracking-normal tabular-nums text-ws-ink/50 ${
        size === "micro" ? "text-micro" : "text-meta"
      }`}
    >
      {time} EST
    </span>
  );
}
