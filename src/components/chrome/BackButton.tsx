// src/components/chrome/BackButton.tsx
"use client";

import { usePathname } from "next/navigation";
import { useRouteTransition } from "@/components/transition/useRouteTransition";

export function BackButton() {
  const pathname = usePathname();
  const { startTransition, isTransitioning } = useRouteTransition();

  if (pathname === "/") return null;
  // /v/corner is being explored as a full homepage concept — no
  // back-to-index affordance there (the editorial nav owns navigation).
  if (pathname?.startsWith("/v/corner")) return null;

  return (
    <button
      type="button"
      className="back-btn"
      aria-label="Return to index"
      onClick={() => {
        if (!isTransitioning) startTransition("/");
      }}
    >
      <span aria-hidden>←</span>
      <span className="t-footnote back-btn__label">Index</span>

      <style>{`
        .back-btn {
          position: fixed;
          top: var(--margin-page);
          left: var(--margin-page);
          z-index: 51; /* one above Sitebar */
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 32px;
          padding: 0 16px;
          background: var(--ink);
          color: var(--paper);
          border: 0;
          border-radius: 4px;
          cursor: pointer;
          font-family: var(--font-stack-mono);
          transition: opacity 180ms var(--ease);
        }
        .back-btn:hover { opacity: 0.85; }
        .back-btn__label {
          color: var(--paper);
          text-transform: uppercase;
        }
      `}</style>
    </button>
  );
}
