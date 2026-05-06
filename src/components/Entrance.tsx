"use client";

/**
 * Entrance — minimal "content settles" enter animation per spec §10
 * Option A. Paper ground is instant; the content fades from 0.85 → 1
 * over 500ms, ease-out-soft, on initial paint. No gate, no threshold.
 *
 * Mounted as a client wrapper around route content to keep server
 * rendering untouched. The animation runs once on first mount.
 */
import { useEffect, useRef } from "react";

export default function Entrance({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.settled = "";
  }, []);

  return (
    <div ref={ref} className="entrance">
      {children}
      <style>{`
        .entrance {
          opacity: 0.85;
          transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .entrance[data-settled] { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .entrance { opacity: 1; transition: none; }
        }
      `}</style>
    </div>
  );
}
