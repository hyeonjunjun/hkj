"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface WobblyRuleProps {
  className?: string;
  style?: React.CSSProperties;
  strokeColor?: string;
}

/**
 * WobblyRule — Hand-drawn SVG horizontal divider
 *
 * Uses feTurbulence displacement for a subtle organic wobble.
 * Falls back to a plain hairline when reduced motion is preferred.
 */
export default function WobblyRule({
  className = "",
  style,
  strokeColor = "var(--color-border-strong)",
}: WobblyRuleProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div
        className={`hairline ${className}`}
        style={{ backgroundColor: strokeColor, height: 1, ...style }}
      />
    );
  }

  return (
    <svg
      className={className}
      style={{ width: "100%", height: 6, display: "block", ...style }}
      preserveAspectRatio="none"
      viewBox="0 0 1200 6"
      aria-hidden="true"
    >
      <defs>
        <filter id="wobbly-rule">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.02"
            numOctaves={3}
            seed={42}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={4}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <line
        x1="0"
        y1="3"
        x2="1200"
        y2="3"
        stroke={strokeColor}
        strokeWidth="1"
        filter="url(#wobbly-rule)"
      />
    </svg>
  );
}
