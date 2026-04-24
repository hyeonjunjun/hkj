"use client";

declare global {
  interface Window {
    __hkjEntranceComplete?: boolean;
  }
}

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Phase = "in" | "settling" | "out" | "done";

export default function CinematicEntrance() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("done");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("hkj.entered") === "1") {
      window.__hkjEntranceComplete = true;
      return;
    }

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm) {
      sessionStorage.setItem("hkj.entered", "1");
      window.__hkjEntranceComplete = true;
      return;
    }

    const destIsStage = pathname === "/" || pathname?.startsWith("/work/");
    document.documentElement.dataset.entranceDest = destIsStage ? "stage" : "paper";

    setPhase("in");
    const t1 = window.setTimeout(() => setPhase("settling"), 150);
    const t2 = window.setTimeout(() => setPhase("out"), 730);
    const t3 = window.setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("hkj.entered", "1");
      window.__hkjEntranceComplete = true;
      delete document.documentElement.dataset.entranceDest;
      window.dispatchEvent(new CustomEvent("hkj:entranceComplete"));
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className="entrance"
      data-phase={phase}
      aria-hidden
      role="presentation"
    >
      <span className="entrance__mark">HKJ</span>
      <style>{`
        .entrance {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          background: var(--stage);
          pointer-events: none;
          will-change: opacity, background;
          transition:
            background 260ms var(--ease),
            opacity 260ms var(--ease);
        }
        .entrance[data-phase="in"],
        .entrance[data-phase="settling"] {
          opacity: 1;
        }
        .entrance[data-phase="out"] {
          opacity: 0;
        }
        html[data-entrance-dest="paper"] .entrance[data-phase="out"] {
          background: var(--paper);
        }

        .entrance__mark {
          font-family: var(--font-stack-serif);
          font-weight: 700;
          font-size: clamp(56px, 10vw, 112px);
          letter-spacing: 0.02em;
          color: var(--glow);
          opacity: 0;
          transform: translateY(8px) scale(0.98);
          filter: blur(1.5px);
          transition:
            opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .entrance[data-phase="settling"] .entrance__mark,
        .entrance[data-phase="out"] .entrance__mark {
          opacity: 1;
          transform: none;
          filter: blur(0);
        }
        .entrance[data-phase="out"] .entrance__mark {
          opacity: 0;
          transform: translateY(-4px) scale(1.02);
          transition-duration: 260ms;
        }
      `}</style>
    </div>
  );
}
