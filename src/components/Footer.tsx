"use client";

import { useState, useEffect } from "react";
import { CONTACT_EMAIL } from "@/constants/contact";

export default function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "America/New_York",
        })
      );
    fmt();
    const i = setInterval(fmt, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <footer className="foot" data-footer-stagger>
      <span>{time ? `New York · ${time}` : "\u00A0"}</span>
      <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    </footer>
  );
}
