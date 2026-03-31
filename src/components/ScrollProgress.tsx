"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrapper = document.querySelector("[data-page-scrollable]");
    if (!wrapper) return;

    const handleScroll = () => {
      const el = wrapper as HTMLElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }
      const pct = Math.round((scrollTop / scrollHeight) * 100);
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    wrapper.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 200,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--fg-3)",
          pointerEvents: "auto",
        }}
      >
        {progress}%
      </span>
      <a
        href="mailto:hello@hkjstudio.com"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--fg-3)",
          textDecoration: "none",
          pointerEvents: "auto",
        }}
        className="nav-link"
      >
        Contact
      </a>
    </div>
  );
}
