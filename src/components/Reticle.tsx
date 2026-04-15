"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_LEN = 6;
const TRAIL_SAMPLE_MS = 60;
const LOCK_MS = 180;
const RELEASE_MS = 120;

// cubic-bezier(0.16, 1, 0.3, 1) approximation via ease-out cubic
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function Reticle() {
  const [enabled, setEnabled] = useState(true);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const posRef = useRef({ x: -100, y: -100 });
  const renderPosRef = useRef({ x: -100, y: -100 });
  const trailBufRef = useRef<Array<{ x: number; y: number }>>([]);
  const lastSampleRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Lock state
  const lockedTargetRef = useRef<HTMLElement | null>(null);
  const lockStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const lockStartTimeRef = useRef<number>(0);
  const lockPhaseRef = useRef<"idle" | "locking" | "locked" | "releasing">("idle");
  const releaseStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const releaseStartTimeRef = useRef<number>(0);
  const lockedLabelRef = useRef<string>("LOCKED");

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
      const locked = target.closest("[data-reticle-lock]") as HTMLElement | null;
      if (locked && locked !== lockedTargetRef.current) {
        lockedTargetRef.current = locked;
        const label = locked.dataset.reticleLabel;
        lockedLabelRef.current = label ? label.toUpperCase() : "LOCKED";
        lockStartPosRef.current = { ...renderPosRef.current };
        lockStartTimeRef.current = performance.now();
        lockPhaseRef.current = "locking";
      }
    };

    const onOut = (e: MouseEvent) => {
      const current = lockedTargetRef.current;
      if (!current) return;
      const related = e.relatedTarget as HTMLElement | null;
      if (related && current.contains(related)) return;
      // Release
      releaseStartPosRef.current = { ...renderPosRef.current };
      releaseStartTimeRef.current = performance.now();
      lockedTargetRef.current = null;
      lockPhaseRef.current = reduced ? "idle" : "releasing";
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

    const tick = (t: number) => {
      const mouse = posRef.current;
      const root = rootRef.current;
      const readout = readoutRef.current;
      const inText = checkActive();

      const phase = lockPhaseRef.current;
      const target = lockedTargetRef.current;

      let rx = mouse.x;
      let ry = mouse.y;
      let readoutText = `${Math.max(0, Math.round(mouse.x)).toString().padStart(4, "0")},${Math.max(0, Math.round(mouse.y)).toString().padStart(4, "0")}`;
      let scale = 1;
      let freezeTrail = false;

      if (target && (phase === "locking" || phase === "locked")) {
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (reduced) {
          rx = cx;
          ry = cy;
          scale = 1.25;
          lockPhaseRef.current = "locked";
        } else if (phase === "locking") {
          const elapsed = t - lockStartTimeRef.current;
          const p = Math.min(1, elapsed / LOCK_MS);
          const e = easeOutExpo(p);
          const s = lockStartPosRef.current || { x: mouse.x, y: mouse.y };
          rx = s.x + (cx - s.x) * e;
          ry = s.y + (cy - s.y) * e;
          scale = 1 + 0.25 * e;
          if (p >= 1) lockPhaseRef.current = "locked";
        } else {
          rx = cx;
          ry = cy;
          scale = 1.25;
        }
        readoutText = lockedLabelRef.current;
        freezeTrail = true;
      } else if (phase === "releasing") {
        if (reduced) {
          lockPhaseRef.current = "idle";
        } else {
          const elapsed = t - releaseStartTimeRef.current;
          const p = Math.min(1, elapsed / RELEASE_MS);
          const e = easeOutExpo(p);
          const s = releaseStartPosRef.current || { x: mouse.x, y: mouse.y };
          rx = s.x + (mouse.x - s.x) * e;
          ry = s.y + (mouse.y - s.y) * e;
          scale = 1.25 - 0.25 * e;
          if (p >= 1) lockPhaseRef.current = "idle";
        }
      }

      renderPosRef.current = { x: rx, y: ry };

      if (root) {
        root.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale})`;
        root.style.opacity = visible && !inText ? "1" : "0";
      }
      if (readout) {
        readout.textContent = readoutText;
      }

      if (!reduced) {
        if (!freezeTrail) {
          if (t - lastSampleRef.current >= TRAIL_SAMPLE_MS) {
            lastSampleRef.current = t;
            trailBufRef.current.unshift({ x: rx, y: ry });
            if (trailBufRef.current.length > TRAIL_LEN) trailBufRef.current.length = TRAIL_LEN;
          }
        }
        for (let i = 0; i < TRAIL_LEN; i++) {
          const el = trailRefs.current[i];
          if (!el) continue;
          const p = trailBufRef.current[i];
          if (!p) {
            el.style.opacity = "0";
            continue;
          }
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
          const base = 0.35 * (1 - i / TRAIL_LEN);
          const opacity = freezeTrail ? 0 : base;
          el.style.opacity = visible && !inText ? String(opacity) : "0";
        }
        if (freezeTrail) {
          // Fade the trail buffer away over time so returning is clean
          trailBufRef.current = [];
        }
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

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("cursor-reveal");
    };
  }, [enabled, visible, reduced]);

  if (!enabled) return null;

  return (
    <>
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
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-stack-mono)",
            fontSize: 14,
            lineHeight: 1,
            color: "var(--ink)",
            userSelect: "none",
          }}
        >
          ┼
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
          }}
        />
      </div>
      {!reduced &&
        Array.from({ length: TRAIL_LEN }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 9998,
              transform: "translate3d(-100px,-100px,0)",
              willChange: "transform, opacity",
              opacity: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%)",
                fontFamily: "var(--font-stack-mono)",
                fontSize: 10,
                lineHeight: 1,
                color: "var(--ink-muted)",
                userSelect: "none",
              }}
            >
              +
            </span>
          </div>
        ))}
    </>
  );
}
