"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * CursorReadout — aino-coded cursor with live [X, Y] coordinate
 * readout. Renders only on devices with a fine pointer (desktop).
 * Hidden during preloader; hidden under reduced-motion.
 *
 * The cursor itself remains the system default (we don't replace it
 * — that hurts accessibility); we add a readout floating below-right
 * of the cursor position.
 */
function getCapability(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function subscribeCapability(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const m1 = window.matchMedia("(hover: hover) and (pointer: fine)");
  const m2 = window.matchMedia("(prefers-reduced-motion: reduce)");
  m1.addEventListener("change", cb);
  m2.addEventListener("change", cb);
  return () => {
    m1.removeEventListener("change", cb);
    m2.removeEventListener("change", cb);
  };
}

export default function CursorReadout() {
  const enabled = useSyncExternalStore(
    subscribeCapability,
    getCapability,
    () => false
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    function onMove(e: MouseEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const dot = dotRef.current;
        const label = labelRef.current;
        if (dot) dot.style.transform = `translate(${lastX}px, ${lastY}px)`;
        if (label) {
          label.textContent = `${lastX.toString().padStart(4, "0")} ${lastY
            .toString()
            .padStart(4, "0")}`;
        }
      });
    }

    function onLeave() {
      const dot = dotRef.current;
      if (dot) dot.style.opacity = "0";
    }
    function onEnter() {
      const dot = dotRef.current;
      if (dot) dot.style.opacity = "1";
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={dotRef} className="cursor-readout" aria-hidden>
      <span className="cursor-readout__crosshair">+</span>
      <span ref={labelRef} className="cursor-readout__label tabular">0000 0000</span>
      <style>{`
        .cursor-readout {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          pointer-events: none;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          color: var(--ink-3);
          opacity: 1;
          transition: opacity 200ms var(--ease);
          will-change: transform;
        }
        .cursor-readout__crosshair {
          font-family: var(--font-stack-sans);
          font-size: 12px;
          line-height: 1;
          color: var(--ink);
          margin-left: 14px;
          margin-top: 8px;
        }
        .cursor-readout__label {
          font-family: var(--font-stack-sans);
          font-size: 9px;
          letter-spacing: 0.10em;
          color: var(--ink-4);
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
