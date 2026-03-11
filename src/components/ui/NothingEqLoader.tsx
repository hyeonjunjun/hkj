"use client";

import { useEffect, useState } from "react";

/**
 * A strict, segmented equalizer loader inspired by Nothing OS's dot-matrix displays.
 * Instead of smooth CSS height transitions, it snaps discrete blocks to simulate hardware polling.
 */

interface Props {
  className?: string;
  bars?: number;
  segmentsPerBar?: number;
  intervalMs?: number;
}

export default function NothingEqLoader({
  className = "",
  bars = 4,
  segmentsPerBar = 4,
  intervalMs = 120, // Snappy hardware refresh rate
}: Props) {
  const [levels, setLevels] = useState<number[]>(Array(bars).fill(0));

  useEffect(() => {
    let animationFrame: number;
    let lastUpdate = 0;

    const tick = (timestamp: number) => {
      if (timestamp - lastUpdate > intervalMs) {
        // Randomize levels, snapping to discrete segment counts
        setLevels((prev) =>
          prev.map(() => Math.floor(Math.random() * (segmentsPerBar + 1)))
        );
        lastUpdate = timestamp;
      }
      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [bars, segmentsPerBar, intervalMs]);

  return (
    <div className={`flex items-end gap-[3px] ${className}`}>
      {levels.map((level, barIndex) => (
        <div key={barIndex} className="flex flex-col-reverse gap-[3px]">
          {Array.from({ length: segmentsPerBar }).map((_, segmentIndex) => {
            const isActive = segmentIndex < level;
            return (
              <div
                key={segmentIndex}
                className={`w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-[1px] transition-colors duration-75 ${
                  isActive ? "bg-white" : "bg-white/10"
                }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
