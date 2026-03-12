"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Segmented bar indicator — scroll-driven or ambient.
 * No audio dependency. Charcoal segments on bone.
 */

interface Props {
  className?: string;
  bars?: number;
  segmentsPerBar?: number;
  intervalMs?: number;
  size?: number;
  gap?: number;
  mouseReactive?: boolean;
  /** When provided, bars fill based on scroll progress (0–1) */
  scrollProgress?: number;
}

export default function NothingEqLoader({
  className = "",
  bars = 4,
  segmentsPerBar = 4,
  intervalMs = 120,
  size = 6,
  gap = 3,
  mouseReactive = false,
  scrollProgress,
}: Props) {
  const [levels, setLevels] = useState<number[]>(Array(bars).fill(0));
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [containerLeft, setContainerLeft] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      setContainerLeft(rect.left);
      setContainerWidth(rect.width);
    },
    []
  );

  useEffect(() => {
    if (!mouseReactive) return;
    const onMove = (e: MouseEvent) => setMouseX(e.clientX);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseReactive]);

  useEffect(() => {
    // If scroll-driven, compute levels from progress
    if (scrollProgress !== undefined) {
      setTimeout(() => {
        setLevels(
          Array.from({ length: bars }, (_, i) => {
            const barProgress = scrollProgress * bars;
            const fill = Math.min(Math.max(barProgress - i, 0), 1);
            return Math.round(fill * segmentsPerBar);
          })
        );
      }, 0);
      return;
    }

    // Ambient mode
    let animationFrame: number;
    let lastUpdate = 0;

    const tick = (timestamp: number) => {
      if (timestamp - lastUpdate > intervalMs) {
        setLevels((prev) =>
          prev.map((_, barIndex) => {
            const maxLevel = segmentsPerBar;

            if (mouseReactive && mouseX !== null && containerWidth > 0) {
              const barCenterX =
                containerLeft + (barIndex / Math.max(bars - 1, 1)) * containerWidth;
              const distance = Math.abs(mouseX - barCenterX);
              const proximity = Math.max(0, 1 - distance / 300);
              const boost = Math.floor(proximity * segmentsPerBar * 0.6);
              const base = Math.floor(Math.random() * (segmentsPerBar * 0.5 + 1));
              return Math.min(base + boost, maxLevel);
            }

            return Math.floor(Math.random() * (maxLevel * 0.6 + 1));
          })
        );
        lastUpdate = timestamp;
      }
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [bars, segmentsPerBar, intervalMs, mouseReactive, mouseX, containerLeft, containerWidth, scrollProgress]);

  return (
    <div
      ref={containerRef}
      className={`flex items-end ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {levels.map((level, barIndex) => (
        <div
          key={barIndex}
          className="flex flex-col-reverse"
          style={{ gap: `${gap}px` }}
        >
          {Array.from({ length: segmentsPerBar }).map((_, segmentIndex) => {
            const isActive = segmentIndex < level;
            return (
              <div
                key={segmentIndex}
                className="rounded-[1px] transition-colors duration-75"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: isActive
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
