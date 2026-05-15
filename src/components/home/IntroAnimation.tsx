// src/components/home/IntroAnimation.tsx
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { useRouteTransition } from "@/components/transition/useRouteTransition";

const INTRO_KEY = "rj-intro-played";
const PRELOADER_TIMEOUT_MS = 4000;

declare global {
  interface Window {
    __rjPreloaderDone?: boolean;
  }
}

export function IntroAnimation() {
  const { registerDisposer, unregisterDisposer } = useRouteTransition();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(INTRO_KEY)) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      sessionStorage.setItem(INTRO_KEY, "1");
      return;
    }

    let started = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let timeline: gsap.core.Timeline | null = null;
    let handler: (() => void) | null = null;

    // Apply pre-intro state via CSS class on <html> so there's no FOUC
    // between paint and the GSAP fromTo() running. CSS rule lives in
    // globals.css under html.intro-pending — see Task 9.3.
    document.documentElement.classList.add("intro-pending");

    function start() {
      if (started) return;
      started = true;
      if (timeoutId) clearTimeout(timeoutId);

      // Remove the pre-intro class — GSAP fromTo() will set initial
      // state via the "from" object, then animate to the final values.
      document.documentElement.classList.remove("intro-pending");

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(INTRO_KEY, "1");
          unregisterDisposer("intro");
          timeline = null;
        },
      });

      // Animate the Sitebar's clip-path rather than width to avoid the
      // left+right+width geometry conflict (width takes precedence when
      // all three are set, producing undefined behavior in the snap).
      tl.fromTo(
        ".sitebar",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.9,
          ease: "power3.inOut",
        },
        0,
      );
      // The home centerpiece is the WebGL gallery now — its own intro
      // (cylindrical warp tween) lives in Gallery3D. The legacy
      // .carousel__card tween was attached to the deleted IndexCarousel
      // and now no-ops with a GSAP "target not found" warning.
      tl.fromTo(
        ".home__bottom",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.3,
      );

      timeline = tl;

      // Disposer: if user navigates mid-intro, kill the timeline cleanly
      registerDisposer("intro", () => {
        if (timeline) timeline.kill();
      });
    }

    // Race-free Preloader handoff. Read the sticky flag first (Preloader
    // sets window.__rjPreloaderDone synchronously when it finishes /
    // bails). If the flag is true, start immediately. Otherwise listen
    // for the event with a timeout fallback.
    if (window.__rjPreloaderDone) {
      start();
    } else {
      handler = () => start();
      window.addEventListener("rj-preloader-done", handler, { once: true });
      timeoutId = setTimeout(() => {
        if (handler) window.removeEventListener("rj-preloader-done", handler);
        start(); // fallback if event never arrives
      }, PRELOADER_TIMEOUT_MS);
    }

    return () => {
      document.documentElement.classList.remove("intro-pending");
      if (handler) window.removeEventListener("rj-preloader-done", handler);
      if (timeoutId) clearTimeout(timeoutId);
      if (timeline) timeline.kill();
      unregisterDisposer("intro");
    };
  }, [registerDisposer, unregisterDisposer]);

  return null;
}
