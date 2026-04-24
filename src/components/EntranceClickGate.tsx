"use client";

import { useEffect } from "react";

export default function EntranceClickGate() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let queuedAnchor: HTMLAnchorElement | null = null;

    const onClick = (e: MouseEvent) => {
      if (window.__hkjEntranceComplete) return;

      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;
      if (href.startsWith("http") || href.startsWith("mailto")) return;
      if (target.target === "_blank") return;

      e.preventDefault();
      e.stopPropagation();
      queuedAnchor = target;
    };

    const onEntranceComplete = () => {
      const a = queuedAnchor;
      if (!a) return;
      queuedAnchor = null;
      window.setTimeout(() => a.click(), 60);
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("hkj:entranceComplete", onEntranceComplete);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("hkj:entranceComplete", onEntranceComplete);
    };
  }, []);

  return null;
}
