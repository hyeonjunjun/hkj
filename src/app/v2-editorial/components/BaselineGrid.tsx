"use client";

import { useEffect, useState } from "react";

// Toggles a baseline-grid overlay over the recto via the `g` key.
// Off by default. If the toggle reveals text NOT sitting on the lines,
// the implementation is broken — that is intended.
export function BaselineGrid() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      }
      if (e.key === "g" || e.key === "G") setOn((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  return <div className={`v2-grid-overlay ${on ? "is-on" : ""}`} aria-hidden />;
}
