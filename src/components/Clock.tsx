"use client";

import { useEffect, useState } from "react";

/**
 * Renders the current time in New York, "HH:MM EST", updated every 30s.
 * Plain grotesk, no box — the site's one recurring idiosyncratic detail,
 * meant to sit unlabeled in the top-right corner of every page (the time
 * alone communicates what it is). Server-rendered as a static "--:-- EST"
 * placeholder so hydration never has to reconcile a server-rendered
 * timestamp against a different client-rendered one — the real value is
 * filled in after mount.
 *
 * The old `size` prop ("meta" | "micro") is gone: it existed only to stop
 * the clock rendering a step larger than the studio-info lines stacked
 * around it, and under the single-size system there is no step to differ
 * by. Both call sites now get the same 12px value register.
 */
interface ClockProps {
  /**
   * Type role. Defaults to `text-value` (400) for CornerMark's studio
   * block; SiteNav passes `text-label` so the nav row runs one weight
   * from wordmark to clock.
   */
  className?: string;
}

export default function Clock({ className = "text-value" }: ClockProps) {
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
    // normal-case is explicit, not redundant: CornerMark renders this
    // inside an uppercase block, and without the reset the same component
    // renders two different ways on one page.
    <span className={`${className} normal-case tabular-nums text-ws-ink-mute`}>
      {time} EST
    </span>
  );
}
