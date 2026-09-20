"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

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

    // lerp rather than duration: frame-rate-independent exponential
    // decay, so a new gesture mid-scroll redirects the motion instead of
    // queueing behind a fixed-length tween. That difference is most of
    // what reads as "analog" rather than "animated".
    //
    // 0.1 is gsproductions.co.za's, derived from its measured response to
    // a single 600px wheel gesture: 49% at 109ms, 84% at 310ms, 96% at
    // 526ms, settled by ~940ms. Solving (1-lerp)^frames against those
    // samples gives 0.098.
    const lenis = new Lenis({ lerp: 0.1 });
    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
