"use client";

import { useState, useEffect } from "react";

interface LocalTimeProps {
  timezone?: string;
  label?: string;
  className?: string;
}

export default function LocalTime({
  timezone = "America/New_York",
  label = "NYC",
  className = "",
}: LocalTimeProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const tz = now
        .toLocaleTimeString("en-US", {
          timeZone: timezone,
          timeZoneName: "short",
        })
        .split(" ")
        .pop();
      setTime(`${label} — ${formatted} ${tz}`);
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [timezone, label]);

  if (!time) return null;

  return (
    <span
      className={`font-mono uppercase tracking-wider ${className}`}
      style={{ fontSize: "var(--text-xs)", color: "var(--color-text-dim)" }}
    >
      {time}
    </span>
  );
}
