"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

function timeTint(h: number): string {
  if (h >= 5 && h <= 8) return "rgba(255, 220, 160, 0.02)";
  if (h >= 9 && h <= 16) return "rgba(0, 0, 0, 0)";
  if (h >= 17 && h <= 20) return "rgba(255, 170, 110, 0.02)";
  return "rgba(91, 137, 181, 0.01)";
}

export default function Environment() {
  const pathname = usePathname();
  const tintColor = useMemo(() => timeTint(new Date().getHours()), []);
  const isHome = pathname === "/";

  return (
    <>
      <div className="env-backdrop" aria-hidden>
        <video
          src="/assets/cloudsatsea.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isHome ? 0.18 : 0.08,
            filter: "saturate(0.85) contrast(0.95)",
            transition: "opacity 800ms ease",
          }}
        />
        <div
          className="env-backdrop__veil"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(247,247,245,0.3) 0%, rgba(247,247,245,0.5) 40%, rgba(247,247,245,0.95) 80%, var(--paper) 100%)",
          }}
        />
      </div>

      <div className="env-atmosphere" aria-hidden />

      <div
        className="env-vignette"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(28, 28, 26, 0.04))",
        }}
      />

      <div
        className="env-tint"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: tintColor,
        }}
      />

      <span className="env-glyph env-glyph--tl" aria-hidden>┼</span>
      <span className="env-glyph env-glyph--tr" aria-hidden>◐</span>
      <span className="env-glyph env-glyph--bl" aria-hidden>▒</span>
      <span className="env-glyph env-glyph--br" aria-hidden>↑</span>

      <style>{`
        @keyframes envAtmosphere {
          0%   { background-position: 30% 40%, 70% 70%; }
          50%  { background-position: 35% 45%, 65% 65%; }
          100% { background-position: 30% 40%, 70% 70%; }
        }
        .env-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 100vh;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .env-atmosphere {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse at 30% 40%, rgba(255, 230, 200, 0.06), transparent 60%),
            radial-gradient(ellipse at 70% 70%, rgba(91, 137, 181, 0.04), transparent 60%);
          animation: envAtmosphere 40s linear infinite;
        }
        .env-glyph {
          position: fixed;
          font-family: var(--font-stack-mono);
          font-size: 16px;
          color: var(--ink);
          opacity: 0.08;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          line-height: 1;
        }
        .env-glyph--tl { top: 48px; left: 48px; }
        .env-glyph--tr { top: 48px; right: 48px; }
        .env-glyph--bl { bottom: 56px; left: 48px; }
        .env-glyph--br { bottom: 56px; right: 48px; }
        @media (prefers-reduced-motion: reduce) {
          .env-atmosphere { animation: none !important; }
        }
        @media (pointer: coarse) {
          .env-glyph { display: none; }
        }
      `}</style>
    </>
  );
}
