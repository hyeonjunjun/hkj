"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRouteTransition } from "./useRouteTransition";

export function TransitionCover() {
  const { phase, onCoverComplete, onExitComplete } = useRouteTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const coverTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const revealTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (phase !== "covering") return;
    if (!rootRef.current || !borderRef.current || !fillRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pageRoot = document.querySelector<HTMLElement>("[data-page-root]");
    if (!pageRoot) {
      console.error("[TransitionCover] [data-page-root] not found in DOM");
      return;
    }

    rootRef.current.style.visibility = "visible";

    if (reduce) {
      // Reduced-motion: single 100ms tween, state machine preserved
      const tl = gsap.timeline({ onComplete: onCoverComplete });
      tl.to(fillRef.current, { height: "100%", duration: 0.1 });
      coverTimelineRef.current = tl;
      return () => {
        tl.kill();
      };
    }

    const tl = gsap.timeline();
    tl.to(pageRoot, {
      scale: 0.96,
      filter: "blur(6px)",
      opacity: 0.5,
      duration: 0.9,
      ease: "power2.in",
    }, 0);
    tl.to(borderRef.current, {
      borderWidth: "12vh",
      duration: 0.8,
      ease: "expo.inOut",
    }, 0.3);
    tl.to(fillRef.current, {
      height: "100%",
      duration: 0.8,
      ease: "expo.inOut",
    }, 0.5);
    // Hold tween — the onComplete fires only after fill is fully covering
    tl.to({}, { duration: 0.8, onComplete: onCoverComplete });

    coverTimelineRef.current = tl;
    return () => {
      tl.kill();
    };
  }, [phase, onCoverComplete]);

  useEffect(() => {
    if (phase !== "exiting") return;
    if (!rootRef.current || !borderRef.current || !fillRef.current) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pageRoot = document.querySelector<HTMLElement>("[data-page-root]");
    if (!pageRoot) return;

    if (reduce) {
      const tl = gsap.timeline({
        onComplete: () => {
          // Clear any GSAP-applied inline styles on page-root so a
          // reduced-motion toggle mid-session doesn't leave stale
          // blur/scale/opacity from a prior full-motion transition.
          if (pageRoot) {
            gsap.set(pageRoot, { clearProps: "transform,filter,opacity" });
          }
          if (rootRef.current) rootRef.current.style.visibility = "hidden";
          onExitComplete();
        },
      });
      tl.to(fillRef.current, { height: "0%", duration: 0.1 });
      revealTimelineRef.current = tl;
      return () => tl.kill();
    }

    const tl = gsap.timeline();
    tl.to(fillRef.current, {
      height: "0%",
      duration: 0.7,
      ease: "expo.inOut",
    }, 0.2);
    tl.to(borderRef.current, {
      borderWidth: 0,
      duration: 0.7,
      ease: "expo.inOut",
    }, 0.4);
    tl.to(pageRoot, {
      scale: 1,
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
      onComplete: () => {
        // Clear GSAP-applied inline styles so a subsequent reduced-motion
        // toggle (or a future cover) starts from a clean slate.
        gsap.set(pageRoot, { clearProps: "transform,filter,opacity" });
        if (rootRef.current) rootRef.current.style.visibility = "hidden";
        onExitComplete();
      },
    }, 0.4);

    revealTimelineRef.current = tl;
    return () => {
      tl.kill();
      // If we unmount mid-reveal, clear any styles we already applied.
      if (pageRoot) {
        gsap.set(pageRoot, { clearProps: "transform,filter,opacity" });
      }
    };
  }, [phase, onExitComplete]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        pointerEvents: "none",
        visibility: "hidden",
      }}
    >
      <div
        ref={borderRef}
        style={{
          position: "absolute",
          inset: 0,
          borderStyle: "solid",
          borderColor: "var(--ink)",
          borderWidth: 0,
          overflow: "hidden",
        }}
      >
        <div
          ref={fillRef}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "0%",
            background: "var(--ink)",
          }}
        />
      </div>
    </div>
  );
}
