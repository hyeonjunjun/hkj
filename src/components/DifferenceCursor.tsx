"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DifferenceCursor — Cathy Dolle's signature cursor move.
 * A tiny square follows the pointer in `mix-blend-mode: difference`,
 * inverting against whatever it's over. When hovering an element with
 * `data-cursor-label`, a small uppercase mono label fades in beside it.
 *
 * Disabled on coarse pointers (touch). Hidden when cursor leaves the
 * viewport.
 */
export default function DifferenceCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setMounted(true);

    const root = rootRef.current;
    if (!root) return;

    let rafId = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const el = (e.target as Element | null)?.closest(
        "[data-cursor-label]"
      ) as HTMLElement | null;
      const next = el?.dataset.cursorLabel ?? null;
      setLabel((prev) => (prev === next ? prev : next));
    };

    const onLeave = () => {
      root.style.opacity = "0";
    };
    const onEnter = () => {
      root.style.opacity = "1";
    };

    const tick = () => {
      // Light easing so the dot trails the cursor with a hint of weight
      x += (targetX - x) * 0.35;
      y += (targetY - y) * 0.35;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="diff-cursor" aria-hidden>
      <span className="diff-cursor__dot" />
      <span className="diff-cursor__label" data-visible={label ? "" : undefined}>
        {label ?? ""}
      </span>
      <style>{`
        .diff-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 100;
          mix-blend-mode: difference;
          opacity: 1;
          transition: opacity 200ms var(--ease);
        }
        .diff-cursor__dot {
          position: absolute;
          top: -4px;
          left: -4px;
          width: 8px;
          height: 8px;
          background: #ffffff;
        }
        .diff-cursor__label {
          position: absolute;
          top: 10px;
          left: 14px;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #ffffff;
          white-space: nowrap;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 200ms var(--ease), transform 200ms var(--ease);
        }
        .diff-cursor__label[data-visible] {
          opacity: 1;
          transform: translateY(0);
        }

        @media (pointer: coarse) {
          .diff-cursor { display: none; }
        }
      `}</style>
    </div>
  );
}
