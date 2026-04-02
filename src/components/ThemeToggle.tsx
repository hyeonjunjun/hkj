"use client";

import { useSyncExternalStore } from "react";

function getIsLight() {
  return document.documentElement.classList.contains("light");
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle() {
  const isLight = useSyncExternalStore(subscribe, getIsLight, () => false);

  const toggle = () => {
    const next = !isLight;
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "var(--fg-3)",
        padding: "4px",
        transition: "color 0.3s var(--ease)",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-3)")}
    >
      {isLight ? "●" : "○"}
    </button>
  );
}
