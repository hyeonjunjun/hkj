"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Reticle() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const hoverLabelRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)");
    if (coarse.matches) {
      setEnabled(false);
      return;
    }
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(rm.matches);
    const onRm = () => setReduced(rm.matches);
    rm.addEventListener?.("change", onRm);
    const onTouch = () => setEnabled(false);
    window.addEventListener("touchstart", onTouch, { once: true, passive: true });
    return () => {
      rm.removeEventListener?.("change", onRm);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof document === "undefined") return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onBlur = () => setVisible(false);
    const onFocus = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest) return;
      const hit = target.closest("[data-reticle-lock]") as HTMLElement | null;
      if (hit) {
        const label = hit.dataset.reticleLabel;
        hoverLabelRef.current = label ? label.toUpperCase() : null;
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const related = e.relatedTarget as HTMLElement | null;
      if (!target) return;
      const hit = target.closest?.("[data-reticle-lock]") as HTMLElement | null;
      if (hit && (!related || !hit.contains(related))) {
        hoverLabelRef.current = null;
      }
    };

    const checkActive = () => {
      const ae = document.activeElement as HTMLElement | null;
      if (ae && ae.matches && ae.matches('input,textarea,[contenteditable="true"],[contenteditable=""]')) {
        document.body.classList.add("cursor-reveal");
        return true;
      }
      document.body.classList.remove("cursor-reveal");
      return false;
    };

    const tick = () => {
      const mouse = posRef.current;
      const root = rootRef.current;
      const readout = readoutRef.current;
      const dot = dotRef.current;
      const inText = checkActive();

      const label = hoverLabelRef.current;
      const locked = label !== null;

      if (root) {
        root.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
        root.style.opacity = visible && !inText ? "1" : "0";
      }
      if (readout) {
        readout.textContent = label ?? "";
        readout.style.opacity = locked ? "1" : "0";
        readout.style.color = locked ? "var(--accent)" : "var(--ink-muted)";
      }
      if (dot) {
        dot.style.color = locked ? "var(--accent)" : "var(--ink)";
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("focusin", () => checkActive());
    document.addEventListener("focusout", () => checkActive());
    rafRef.current = window.requestAnimationFrame(tick);

    document.body.classList.add("reticle-active");

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("cursor-reveal");
      document.body.classList.remove("reticle-active");
    };
  }, [enabled, visible, reduced]);

  if (!enabled) return null;
  if (pathname === "/" || pathname === "/writing") return null;

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate3d(-100px,-100px,0)",
        willChange: "transform, opacity",
        transition: "opacity 160ms var(--ease)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "var(--font-stack-mono)",
          lineHeight: 1,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-stack-mono)",
            fontSize: 11,
            lineHeight: 1,
            color: "var(--ink)",
            marginRight: 2,
          }}
        >
          [
        </span>
        <span
          ref={dotRef}
          style={{
            fontFamily: "var(--font-stack-mono)",
            fontSize: 13,
            lineHeight: 1,
            color: "var(--ink)",
            verticalAlign: "baseline",
          }}
        >
          ·
        </span>
        <span
          style={{
            fontFamily: "var(--font-stack-mono)",
            fontSize: 11,
            lineHeight: 1,
            color: "var(--ink)",
            marginLeft: 2,
          }}
        >
          ]
        </span>
      </span>
      <div
        ref={readoutRef}
        style={{
          position: "absolute",
          left: 14,
          top: 14,
          fontFamily: "var(--font-stack-mono)",
          fontSize: 9,
          letterSpacing: "0.1em",
          color: "var(--ink-muted)",
          whiteSpace: "nowrap",
          opacity: 0,
          transition: "opacity 160ms var(--ease)",
        }}
      />
    </div>
  );
}
