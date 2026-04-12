"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Reticle() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Hide on touch devices
    if (window.matchMedia("(hover: none)").matches) {
      ring.style.display = "none";
      dot.style.display = "none";
      return;
    }

    const duration = reducedMotion ? 0 : 0.12;
    const xRing = gsap.quickTo(ring, "x", { duration, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration, ease: "power3.out" });
    const xDot = gsap.quickTo(dot, "x", { duration: duration * 0.5, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: duration * 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xRing(e.clientX);
      yRing(e.clientY);
      xDot(e.clientX);
      yDot(e.clientY);
    };

    const onEnter = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.("[data-hotspot], a, button");
      if (target) {
        gsap.to(ring, { scale: 1.8, borderColor: "rgba(196,162,101,0.7)", duration: 0.3, ease: "power2.out" });
      }
    };
    const onLeave = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.("[data-hotspot], a, button");
      if (target) {
        gsap.to(ring, { scale: 1, borderColor: "rgba(255,255,255,0.3)", duration: 0.3, ease: "power2.out" });
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter, true);
    document.addEventListener("mouseout", onLeave, true);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter, true);
      document.removeEventListener("mouseout", onLeave, true);
    };
  }, [reducedMotion]);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -11,
          left: -11,
          width: 22,
          height: 22,
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate3d(-100px,-100px,0)",
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -2,
          left: -2,
          width: 4,
          height: 4,
          background: "rgba(196,162,101,0.9)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate3d(-100px,-100px,0)",
          willChange: "transform",
        }}
      />
    </>
  );
}
