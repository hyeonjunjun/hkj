"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { motion } from "framer-motion";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InfiniteMarqueeProps {
  items: string[];
  separator?: string;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export default function InfiniteMarquee({
  items,
  separator = "·",
  speed = 50,
  direction = "left",
  className = "",
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const skewY = useScrollVelocity(0.3, 3);

  useGSAP(
    () => {
      if (reduced || !trackRef.current) return;

      const track = trackRef.current;
      // Each "copy" is 25% of the track (4 copies total)
      // Animate 50% to loop seamlessly through 2 copies
      const xTarget = direction === "left" ? -50 : 50;

      gsap.to(track, {
        xPercent: xTarget,
        duration: (items.join("").length * 2) / (speed / 50),
        ease: "none",
        repeat: -1,
      });
    },
    { scope: containerRef, dependencies: [reduced, speed, direction, items] }
  );

  // Build the repeated content
  const content = items.map((item, i) => (
    <span key={i} className="flex items-center gap-4 md:gap-8 shrink-0">
      <span className="font-serif italic whitespace-nowrap" style={{ fontSize: "var(--text-2xl)" }}>
        {item}
      </span>
      <span
        className="font-serif opacity-30"
        style={{ fontSize: "var(--text-lg)" }}
      >
        {separator}
      </span>
    </span>
  ));

  if (reduced) {
    return (
      <div
        className={`py-6 overflow-hidden ${className}`}
        style={{
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-4 md:gap-8 px-6" style={{ color: "var(--color-text)", opacity: 0.15 }}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`py-6 overflow-hidden ${className}`}
      style={{
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <motion.div
        ref={trackRef}
        className="marquee-track flex items-center gap-4 md:gap-8"
        style={{
          color: "var(--color-text)",
          opacity: 0.15,
          skewY,
        }}
      >
        {/* 4 copies for seamless loop */}
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} className="flex items-center gap-4 md:gap-8 shrink-0">
            {content}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
