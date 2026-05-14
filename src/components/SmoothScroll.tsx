"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * SmoothScroll — page-level lerp scrolling via Lenis.
 *
 * Active on every page; honors prefers-reduced-motion (Lenis is skipped
 * entirely under reduced motion, falling back to native scroll). The
 * gallery's WebGL section sets its own wheel handler — Lenis is told
 * to skip wheel events that originate inside .webgl-gallery so the
 * drag-scroll carousel keeps full control of those events.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1,
      // Skip wheel/touch events that originate in the WebGL gallery.
      // The carousel's pointer/wheel logic lives there and needs full
      // control of those events; double-handling would compete.
      prevent: (node) =>
        node instanceof HTMLElement && !!node.closest(".webgl-gallery"),
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
