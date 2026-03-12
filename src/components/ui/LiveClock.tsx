"use client";

import { useState, useEffect } from "react";

interface LiveClockProps {
  timezone?: string;
  label?: string;
  showSeconds?: boolean;
  showTimezone?: boolean;
  className?: string;
}

export default function LiveClock({
  timezone = "America/New_York",
  label,
  showSeconds = true,
  showTimezone = false,
  className = "",
}: LiveClockProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      };
      if (showSeconds) options.second = "2-digit";

      let formatted = now.toLocaleTimeString("en-US", options);
      // Replace colons with spaced colons for monospace aesthetic: "19 : 05 : 28"
      formatted = formatted.replace(/:/g, " : ");
      if (showTimezone) {
        const tzAbbr = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          timeZoneName: "short",
        })
          .formatToParts(now)
          .find((p) => p.type === "timeZoneName")?.value || "";
        formatted += ` ${tzAbbr}`;
      }

      setTime(formatted);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [showSeconds, showTimezone, timezone]);

  return (
    <span className={className} suppressHydrationWarning>
      {label && (
        <span className="block font-mono uppercase tracking-[0.15em]" style={{ fontSize: "var(--text-micro)", color: "var(--color-text-ghost)", marginBottom: "2px" }}>
          {label}
        </span>
      )}
      <span className="font-mono tabular-nums" style={{ fontSize: "var(--text-xs)", letterSpacing: "0.05em" }}>
        {time || "00 : 00 : 00"}
      </span>
    </span>
  );
}
