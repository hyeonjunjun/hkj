"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollCoords() {
  const [progress, setProgress] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const pathname = usePathname();
  const rafRef = useRef<number | null>(null);
  const mouseTimerRef = useRef<number | null>(null);

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

    const onMove = (e: MouseEvent) => {
      if (mouseTimerRef.current != null) return;
      const x = e.clientX;
      const y = e.clientY;
      mouseTimerRef.current = window.setTimeout(() => {
        setPos({ x, y });
        mouseTimerRef.current = null;
      }, 50);
    };

    computeProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      if (mouseTimerRef.current != null) window.clearTimeout(mouseTimerRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const xStr = Math.max(0, Math.round(pos.x)).toString().padStart(4, "0");
  const yStr = Math.max(0, Math.round(pos.y)).toString().padStart(4, "0");

  return (
    <>
      <div className="scroll-coords" aria-hidden="true">
        <span>SCROLL {progress.toFixed(2)} / 1.00</span>
        <span>PATH {pathname || "/"}</span>
        <span>POS {xStr},{yStr}</span>
      </div>
      <style jsx>{`
        .scroll-coords {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(16px, 3vw, 32px);
          background: linear-gradient(to top, rgba(247, 247, 245, 0.92), rgba(247, 247, 245, 0));
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 40;
          pointer-events: none;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        @media (pointer: coarse) {
          .scroll-coords {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
