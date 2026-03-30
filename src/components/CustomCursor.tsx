"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Custom cursor — 8px dot that scales on interactive elements.
 * mix-blend-mode: difference inverts against any background.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const visible = useRef(false);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    // Hide default cursor
    document.documentElement.style.cursor = "none";

    const xTo = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible.current) {
        visible.current = true;
        gsap.to(dot, { opacity: 1, duration: 0.3 });
      }
    };

    const onLeave = () => {
      visible.current = false;
      gsap.to(dot, { opacity: 0, duration: 0.3 });
    };

    // Scale up on interactive elements
    const onEnterInteractive = () => {
      gsap.to(dot, { scale: 4, duration: 0.3, ease: "power2.out" });
    };
    const onLeaveInteractive = () => {
      gsap.to(dot, { scale: 1, duration: 0.25, ease: "power2.out" });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    // Observe interactive elements
    const observer = new MutationObserver(() => bindInteractive());
    observer.observe(document.body, { childList: true, subtree: true });

    function bindInteractive() {
      document.querySelectorAll("a, button, [role='button']").forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
        (el as HTMLElement).style.cursor = "none";
      });
    }
    bindInteractive();

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      observer.disconnect();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--fg)",
        pointerEvents: "none",
        zIndex: 99999,
        mixBlendMode: "difference",
        transform: "translate(-50%, -50%)",
        opacity: 0,
        willChange: "transform",
      }}
    />
  );
}
