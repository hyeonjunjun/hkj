"use client";

import { useState, useEffect } from "react";

function getNYCFormattedTime(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  };
  return new Intl.DateTimeFormat("en-US", options).format(now);
}

export default function NYCClock() {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setTime(getNYCFormattedTime());
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <span
      className="font-mono nyc-clock"
      style={{
        fontSize: "var(--text-meta)",
        letterSpacing: "var(--tracking-label)",
        color: "var(--ink-muted)",
        whiteSpace: "nowrap",
      }}
    >
      {time}
    </span>
  );
}
