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
export default function Clock() {
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
    <span className="font-instrument-sans text-[13px] font-medium tabular-nums text-ws-ink/50">
      {time} EST
    </span>
  );
}
