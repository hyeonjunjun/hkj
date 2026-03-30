"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Custom cursor with three states:
 * 1. Default: 8px dot
 * 2. Interactive (links/buttons): scaled up 4x
 * 3. View (carousel items with [data-cursor-view]): shows "View" label
 */
export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const visible = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!wrap || !dot || !label) return;

    document.documentElement.style.cursor = "none";

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible.current) {
        visible.current = true;
        gsap.to(wrap, { opacity: 1, duration: 0.3 });
      }
    };

    const onLeave = () => {
      visible.current = false;
      gsap.to(wrap, { opacity: 0, duration: 0.3 });
    };

    // State: interactive (links/buttons) — dot scales up
    const onEnterInteractive = () => {
      gsap.to(dot, { scale: 4, duration: 0.3, ease: "power2.out" });
      gsap.to(label, { opacity: 0, duration: 0.15 });
    };

    // State: view (carousel items) — dot expands to circle with "View" label
    const onEnterView = () => {
      gsap.to(dot, { scale: 8, duration: 0.35, ease: "power2.out" });
      gsap.to(label, { opacity: 1, duration: 0.25, delay: 0.1 });
    };

    // State: default — small dot
    const onLeaveAny = () => {
      gsap.to(dot, { scale: 1, duration: 0.25, ease: "power2.out" });
      gsap.to(label, { opacity: 0, duration: 0.15 });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    // Bind interactive elements
    const observer = new MutationObserver(() => bindAll());
    observer.observe(document.body, { childList: true, subtree: true });

    function bindAll() {
      // Standard links/buttons
      document.querySelectorAll("a, button, [role='button']").forEach((el) => {
        if ((el as HTMLElement).dataset.cursorView) return; // handled separately
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveAny);
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveAny);
        (el as HTMLElement).style.cursor = "none";
      });

      // Carousel "View" items
      document.querySelectorAll("[data-cursor-view]").forEach((el) => {
        el.removeEventListener("mouseenter", onEnterView);
        el.removeEventListener("mouseleave", onLeaveAny);
        el.addEventListener("mouseenter", onEnterView);
        el.addEventListener("mouseleave", onLeaveAny);
        (el as HTMLElement).style.cursor = "none";
      });
    }
    bindAll();

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      observer.disconnect();
    };
  }, []);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        mixBlendMode: "difference",
        transform: "translate(-50%, -50%)",
        opacity: 0,
        willChange: "transform",
      }}
    >
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      {/* "View" label — visible in view state */}
      <span
        ref={labelRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-mono)",
          fontSize: 8,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#000",
          opacity: 0,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        View
      </span>
    </div>
  );
}
