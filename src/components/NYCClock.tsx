"use client";

import { useState, useEffect } from "react";

function getNYCTime(): string {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
}

export function NYCClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(getNYCTime());
    const interval = setInterval(() => {
      setTime(getNYCTime());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-meta)",
        color: "var(--ink-muted)",
        letterSpacing: "0.04em",
      }}
    >
      {time ?? "—"}
    </span>
  );
}

export default NYCClock;
