"use client";

import { useEffect } from "react";
import { getTimePeriod } from "@/lib/time";
import { useStudioStore } from "@/lib/store";

/**
 * TimeProvider — Sets data-time-period on <html> based on NYC Eastern Time.
 * Re-checks every 60 seconds. Drives the site-wide color scheme.
 */
export default function TimeProvider() {
  const setTimePeriod = useStudioStore((s) => s.setTimePeriod);

  useEffect(() => {
    function update() {
      const period = getTimePeriod();
      document.documentElement.setAttribute("data-time-period", period);
      setTimePeriod(period);
    }

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [setTimePeriod]);

  return null;
}
