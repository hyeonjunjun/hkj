"use client";

import { useState, useEffect } from "react";

export default function NycClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }) + " EST"
      );
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <span
      className="font-mono"
      style={{
        fontSize: 10,
        letterSpacing: "0.06em",
        color: "var(--ink-muted)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {time}
    </span>
  );
}
