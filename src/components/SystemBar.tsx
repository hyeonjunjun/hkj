"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const EMAIL = "hyeonjunjun07@gmail.com";

export default function SystemBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.max(0, Math.min(1, p)));
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(computeProgress);
    };

    const onResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(computeProgress);
    };

    computeProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (pathname === "/") return null;

  return (
    <>
      <div className="system-bar" aria-hidden="true">
        <span className="system-bar__left">
          <span className="sb-live">
            <span className="sb-live__dot" aria-hidden />
            AVAILABLE · 2026
          </span>
          <span className="sb-signature">Hyeonjoon</span>
        </span>
        <span className="system-bar__center">
          SCROLL <span style={{ color: "var(--accent)" }}>{progress.toFixed(2)}</span> / 1.00 &middot; PATH {pathname || "/"}
        </span>
        <a
          className="system-bar__right"
          href={`mailto:${EMAIL}`}
        >
          {EMAIL}
        </a>
      </div>
      <style>{`
        .system-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(16px, 3vw, 32px);
          background: linear-gradient(to top, rgba(247, 247, 245, 0.95), rgba(247, 247, 245, 0));
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 40;
          pointer-events: none;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .system-bar__left {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .sb-signature {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 13px;
          letter-spacing: -0.01em;
          text-transform: none;
          color: var(--ink);
        }
        .sb-live {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
        }
        .sb-live__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: sb-pulse 2.4s ease-in-out infinite;
        }
        @keyframes sb-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.7); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sb-live__dot { animation: none; }
        }
        .system-bar__center {
          font-family: var(--font-mono);
        }
        .system-bar__right {
          pointer-events: auto;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          transition: color 200ms var(--ease);
        }
        .system-bar__right:hover {
          color: var(--accent);
        }
        @media (pointer: coarse) {
          .system-bar {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
