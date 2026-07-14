"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

interface WindBlurRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

/**
 * The Windswept brief's signature "caught in a gust of wind before
 * settling into crisp focus" entrance -- reserved for exactly the
 * Wordmark identity mark per the design spec, not applied broadly.
 *
 * Uses the same setTimeout + CSS-transition mechanism as MotionReveal
 * (not Framer Motion) specifically because Framer Motion's `filter`
 * animation support targets standard CSS filter functions (`blur()`,
 * `brightness()`, etc.), not a `url(#id)` reference to a custom SVG
 * filter -- CSS `filter: blur()` alone can't do a directional
 * (X-axis-only) blur, so this needs the SVG `feGaussianBlur
 * stdDeviation="8 0"` filter, driven the same reliable way MotionReveal
 * already drives opacity/transform. As a side effect, this inherits
 * prefers-reduced-motion handling for free from the global CSS rule in
 * globals.css, the same way MotionReveal does -- no separate wiring
 * needed here.
 */
export default function WindBlurReveal({ children, delay = 0, duration = 600 }: WindBlurRevealProps) {
  const [visible, setVisible] = useState(false);
  const rawId = useId();
  const filterId = `wind-blur-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="8 0" />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-16px)",
          filter: visible ? "none" : `url(#${filterId})`,
          transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {children}
      </div>
    </>
  );
}
