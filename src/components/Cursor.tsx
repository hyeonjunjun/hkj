"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";

/**
 * Cursor — Caliper Edition
 *
 * States:
 *   default  → 8px dot, mix-blend-difference
 *   link     → 6px dot
 *   image    → 50px thin ring + "View"
 *   explore  → 60px thin ring + "Open"
 *   caliper  → 80px SVG measurement ring with tick marks + coordinate readout
 *   play     → 50px thin ring + play icon
 *
 * Uses gsap.quickTo for X/Y positioning (replaces Framer springs).
 * No velocity-based stretching — precision aesthetic.
 */

type CursorState = "default" | "link" | "image" | "explore" | "caliper" | "play";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const quickToX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickToY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });

  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const experienceMode = useStudioStore((s) => s.experienceMode);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer || !dotRef.current) return;

    setTimeout(() => setIsVisible(true), 0);

    // GSAP quickTo for smooth, frame-synced cursor
    quickToX.current = gsap.quickTo(dotRef.current, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    quickToY.current = gsap.quickTo(dotRef.current, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    const moveCursor = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      quickToX.current?.(e.clientX);
      quickToY.current?.(e.clientY);

      // Update coordinate readout
      if (coordRef.current) {
        coordRef.current.textContent = `${e.clientX.toFixed(0)}, ${e.clientY.toFixed(0)}`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-cursor='caliper']")) { setCursorState("caliper"); return; }
      if (target.closest("[data-cursor='play']")) { setCursorState("play"); return; }
      if (target.closest("[data-cursor='explore']")) { setCursorState("explore"); return; }
      if (target.closest("[data-cursor='view'], img, video:not([data-cursor='explore'])")) {
        setCursorState("image"); return;
      }
      if (target.closest("a, button, [role='button'], [role='link'], input, textarea, select")) {
        setCursorState("link"); return;
      }
      setCursorState("default");
    };

    const handleMouseDown = () => {
      if (rippleRef.current) {
        gsap.set(rippleRef.current, {
          x: mousePos.current.x,
          y: mousePos.current.y,
          width: 8,
          height: 8,
          opacity: 0.6,
        });
        gsap.to(rippleRef.current, {
          width: 36,
          height: 36,
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  if (experienceMode === "recruiter") return null;

  const isRing = cursorState === "image" || cursorState === "explore" || cursorState === "play";
  const isCaliper = cursorState === "caliper";

  const sizeMap: Record<CursorState, number> = {
    default: 8,
    link: 6,
    image: 50,
    explore: 60,
    caliper: 80,
    play: 50,
  };

  const size = sizeMap[cursorState];

  return (
    <>
      {/* Click Ripple */}
      <div
        ref={rippleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
        style={{
          transform: "translate(-50%, -50%)",
          border: "1px solid var(--color-accent)",
          opacity: 0,
        }}
      />

      {/* Main Cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: size,
          height: size,
          transform: "translate(-50%, -50%)",
          mixBlendMode: isRing || isCaliper ? "normal" : "difference",
          opacity: isVisible ? 1 : 0,
          transition: "width 0.25s cubic-bezier(0.22,1,0.36,1), height 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.15s",
        }}
      >
        {/* Default / Link dot */}
        {!isRing && !isCaliper && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "#ffffff",
              opacity: cursorState === "link" ? 0.7 : 1,
            }}
          />
        )}

        {/* Ring states (image, explore, play) */}
        {isRing && (
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1px solid rgba(0,0,0,0.6)" }}
          />
        )}

        {/* Caliper state — SVG measurement ring */}
        {isCaliper && (
          <svg
            className="absolute inset-0"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer ring */}
            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Inner ring */}
            <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            {/* Crosshairs */}
            <line x1="40" y1="0" x2="40" y2="14" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            <line x1="40" y1="66" x2="40" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            <line x1="0" y1="40" x2="14" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            <line x1="66" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            {/* Tick marks (8 around the ring) */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const x1 = 40 + Math.cos(angle) * 35;
              const y1 = 40 + Math.sin(angle) * 35;
              const x2 = 40 + Math.cos(angle) * 38;
              const y2 = 40 + Math.sin(angle) * 38;
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              );
            })}
            {/* Center dot */}
            <circle cx="40" cy="40" r="1.5" fill="var(--color-accent)" />
          </svg>
        )}

        {/* Labels */}
        {cursorState === "image" && (
          <span
            className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: "7px", color: "var(--color-text)" }}
          >
            View
          </span>
        )}

        {cursorState === "explore" && (
          <span
            className="absolute inset-0 flex items-center justify-center font-mono uppercase tracking-[0.1em]"
            style={{ fontSize: "7px", color: "var(--color-text)" }}
          >
            Open
          </span>
        )}

        {cursorState === "play" && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1L9 6L1 11V1Z" fill="rgba(0,0,0,0.7)" />
            </svg>
          </span>
        )}

        {/* Caliper coordinate readout */}
        {isCaliper && (
          <span
            ref={coordRef}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono tracking-widest"
            style={{ fontSize: "7px", color: "var(--color-text-dim)" }}
          >
            0, 0
          </span>
        )}
      </div>
    </>
  );
}
