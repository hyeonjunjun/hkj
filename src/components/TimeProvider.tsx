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
      const override = useStudioStore.getState().timeOverride;
      // If there's a manual override (pixel art click), respect it
      document.documentElement.setAttribute("data-time-period", override ?? period);
      setTimePeriod(period);
    }

    update();
    const interval = setInterval(update, 60_000);

    // Listen for override changes to update the attribute immediately
    let prevOverride = useStudioStore.getState().timeOverride;
    const unsub = useStudioStore.subscribe((state) => {
      if (state.timeOverride !== prevOverride) {
        prevOverride = state.timeOverride;
        const period = state.timeOverride ?? state.timePeriod;
        document.documentElement.setAttribute("data-time-period", period);
      }
    });

    return () => {
      clearInterval(interval);
      unsub();
    };
  }, [setTimePeriod]);

  return null;
}
