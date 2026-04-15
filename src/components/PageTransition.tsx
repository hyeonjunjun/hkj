"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const firstMount = useRef(true);

  const tlRef = useRef<HTMLSpanElement>(null);
  const trRef = useRef<HTMLSpanElement>(null);
  const blRef = useRef<HTMLSpanElement>(null);
  const brRef = useRef<HTMLSpanElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    const corners = [tlRef.current, trRef.current, blRef.current, brRef.current].filter(Boolean);
    const offsets = [
      { x: "10vw", y: "10vh" },
      { x: "-10vw", y: "10vh" },
      { x: "10vw", y: "-10vh" },
      { x: "-10vw", y: "-10vh" },
    ];

    const tl = gsap.timeline();

    // Outgoing: corners grow from center to viewport edges
    corners.forEach((el, i) => {
      tl.fromTo(
        el,
        { x: offsets[i].x, y: offsets[i].y, opacity: 0, scale: 0.8 },
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.22, ease: "power3.out" },
        i === 0 ? 0 : "<"
      );
    });

    // Rules flash + label at the swap moment
    tl.fromTo(
      rulesRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.08, ease: "power2.out" },
      0.18
    )
      .to(rulesRef.current, { opacity: 0, duration: 0.12, ease: "power2.in" }, 0.3)
      .fromTo(
        labelRef.current,
        { opacity: 0, y: -4 },
        { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.2
      )
      .to(labelRef.current, { opacity: 0, duration: 0.08, ease: "power2.in" }, 0.36);

    // Incoming: corners retract + fade
    corners.forEach((el, i) => {
      tl.to(
        el,
        { x: offsets[i].x, y: offsets[i].y, opacity: 0, duration: 0.22, ease: "power3.in" },
        i === 0 ? 0.22 : "<"
      );
    });

    return () => {
      tl.kill();
    };
  }, [pathname, reducedMotion]);

  if (reducedMotion) return <>{children}</>;

  const cornerBase: React.CSSProperties = {
    position: "absolute",
    fontFamily: "var(--font-mono)",
    fontSize: 24,
    color: "var(--ink)",
    lineHeight: 1,
    opacity: 0,
    pointerEvents: "none",
  };

  return (
    <>
      {children}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <span ref={tlRef} style={{ ...cornerBase, top: 8, left: 8 }}>┌</span>
        <span ref={trRef} style={{ ...cornerBase, top: 8, right: 8 }}>┐</span>
        <span ref={blRef} style={{ ...cornerBase, bottom: 8, left: 8 }}>└</span>
        <span ref={brRef} style={{ ...cornerBase, bottom: 8, right: 8 }}>┘</span>
        <div
          ref={rulesRef}
          style={{ position: "absolute", inset: 0, opacity: 0 }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              borderTop: "1px solid var(--ink-ghost)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderBottom: "1px solid var(--ink-ghost)",
            }}
          />
        </div>
        <div
          ref={labelRef}
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "var(--ink-muted)",
            opacity: 0,
          }}
        >
          TRANSITION
        </div>
      </div>
    </>
  );
}
