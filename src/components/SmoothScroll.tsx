"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wires Lenis scroll momentum — scrolling keeps drifting briefly after
 * input stops, then settles, rather than stopping dead. This is the
 * page-level "wind" register from the project's motion plan, distinct
 * from the snappier feel interactive controls should have.
 *
 * Lenis was already a dependency here but had never been mounted.
 *
 * No-ops harmlessly on pages that don't scroll (Home is locked to one
 * viewport), and bails out entirely under prefers-reduced-motion, where
 * hijacking native scrolling would be actively hostile.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Matches windEasing in lib/motion.ts — fast start, slow settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
