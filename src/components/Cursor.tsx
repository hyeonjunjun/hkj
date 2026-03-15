"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Cursor — 6px circle, GSAP-only
 *
 * States:
 *   default  → 6px circle, --color-text-dim at 0.5 opacity
 *   link     → 8px circle, --color-accent at 0.9 opacity
 *   project  → dot hides, "View" label in 10px mono
 *
 * Position: GSAP quickTo (frame-synced)
 * State transitions: GSAP .to()
 */

type CursorState = "default" | "link" | "project";

export default function Cursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const posXRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const posYRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const stateRef = useRef<CursorState>("default");
  const prefersReduced = useReducedMotion();

  // Detect touch vs pointer
  useEffect(() => {
    setIsTouchDevice(!window.matchMedia("(pointer: fine)").matches);
  }, []);

  // Init GSAP quickTo
  useEffect(() => {
    if (isTouchDevice || prefersReduced || !containerRef.current) return;

    posXRef.current = gsap.quickTo(containerRef.current, "x", {
      duration: 0.15,
      ease: "power2.out",
    });
    posYRef.current = gsap.quickTo(containerRef.current, "y", {
      duration: 0.15,
      ease: "power2.out",
    });
  }, [isTouchDevice, prefersReduced]);

  // Apply cursor state visuals
  const applyState = useCallback((newState: CursorState) => {
    if (stateRef.current === newState) return;
    stateRef.current = newState;

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    if (newState === "project") {
      gsap.to(dot, { scale: 0, duration: 0.15, ease: "power2.in" });
      gsap.to(label, { opacity: 1, duration: 0.2, ease: "power3.out" });
    } else if (newState === "link") {
      gsap.to(dot, {
        scale: 1,
        width: 8,
        height: 8,
        opacity: 0.9,
        backgroundColor: "var(--color-accent)",
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(label, { opacity: 0, duration: 0.12 });
    } else {
      gsap.to(dot, {
        scale: 1,
        width: 6,
        height: 6,
        opacity: 0.5,
        backgroundColor: "var(--color-text-dim)",
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(label, { opacity: 0, duration: 0.12 });
    }
  }, []);

  // Resolve cursor state from event target
  const resolveState = useCallback(
    (target: HTMLElement) => {
      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorEl) {
        const attr = cursorEl.getAttribute("data-cursor");
        if (attr === "project") {
          applyState("project");
          return;
        }
      }

      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, label"
      );
      if (interactive) {
        applyState("link");
        return;
      }

      applyState("default");
    },
    [applyState]
  );

  // Global listeners
  useEffect(() => {
    if (isTouchDevice || prefersReduced) return;

    const onMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      posXRef.current?.(e.clientX);
      posYRef.current?.(e.clientY);
      resolveState(e.target as HTMLElement);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [isTouchDevice, prefersReduced, visible, resolveState]);

  if (isTouchDevice || prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.15s" }}
    >
      {/* Dot */}
      <div
        ref={dotRef}
        className="rounded-full"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          backgroundColor: "var(--color-text-dim)",
          opacity: 0.5,
        }}
      />

      {/* View label (shown on project hover) */}
      <span
        ref={labelRef}
        className="absolute font-mono"
        style={{
          fontSize: 10,
          color: "var(--color-text)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0,
          top: -6,
          left: 8,
          whiteSpace: "nowrap",
        }}
      >
        View
      </span>
    </div>
  );
}
