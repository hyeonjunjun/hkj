"use client";

import { useEffect, useRef } from "react";
import CreatureField from "@/components/CreatureField";
import ModeCycle from "@/components/ModeCycle";
import { MODES, useMode } from "@/hooks/useMode";
import { useTheme } from "@/hooks/useTheme";

const AUTO_CYCLE_MS = 3300;

export default function Home() {
  const { mode, setMode } = useMode("sea");
  const [theme] = useTheme();
  const modeRef = useRef(mode);

  // Keep ref in sync so the interval can always read the current mode
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Auto-cycle every 3.3s. Re-runs when mode changes so manual selection
  // resets the timer to give the new mode its full interval.
  useEffect(() => {
    const id = setInterval(() => {
      const current = modeRef.current;
      const i = MODES.indexOf(current);
      const next = MODES[(i + 1) % MODES.length];
      setMode(next);
    }, AUTO_CYCLE_MS);
    return () => clearInterval(id);
  }, [mode, setMode]);

  return (
    <main id="main" className="home">
      <section className="home-hero" aria-label="Hyeonjoon Jun — design engineer, New York">
        <CreatureField mode={mode} theme={theme} />
        <div className="home-hero__byline" aria-hidden>
          <span className="home-hero__name">Hyeonjoon Jun</span>
          <span className="home-hero__sep"> · </span>
          <span className="home-hero__role">design engineer, new york</span>
        </div>
        <div className="home-hero__controls">
          <ModeCycle mode={mode} onSelect={setMode} />
        </div>
      </section>

      <style>{`
        .home {
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .home-hero {
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        .home-hero__byline {
          position: absolute;
          left: clamp(24px, 4vw, 64px);
          bottom: clamp(32px, 5vh, 56px);
          z-index: 2;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          pointer-events: none;
          user-select: none;
        }
        .home-hero__name {
          font-family: var(--font-stack-serif);
          font-style: italic;
          font-size: 14px;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .home-hero__sep {
          color: var(--ink-faint);
          font-family: var(--font-stack-mono);
          font-size: 10px;
        }
        .home-hero__role {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .home-hero__controls {
          position: absolute;
          right: clamp(24px, 4vw, 64px);
          bottom: clamp(32px, 5vh, 56px);
          z-index: 2;
          left: auto;
          transform: none;
        }

        @media (max-width: 640px) {
          .home-hero__byline {
            left: 50%;
            bottom: clamp(72px, 11vh, 96px);
            transform: translateX(-50%);
            text-align: center;
            flex-wrap: wrap;
            justify-content: center;
          }
          .home-hero__controls {
            left: 50%;
            right: auto;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </main>
  );
}
