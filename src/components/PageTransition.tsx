"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const washRef = useRef<HTMLDivElement | null>(null);
  const runesRef = useRef<HTMLDivElement | null>(null);
  const scanRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip on first mount — no transition needed on initial page load
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Simple opacity flash for reduced motion
      const ov = overlayRef.current;
      if (!ov) return;
      gsap.fromTo(
        ov,
        { opacity: 0, pointerEvents: "none" },
        {
          opacity: 0.6,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(ov, { opacity: 0, duration: 0.2, delay: 0.1, ease: "power2.in" });
          },
        }
      );
      return;
    }

    const ov = overlayRef.current;
    const wash = washRef.current;
    const runes = runesRef.current;
    const scan = scanRef.current;
    const corners = cornersRef.current;
    if (!ov || !wash || !runes || !scan || !corners) return;

    // Ensure the overlay captures pointer during transit
    ov.style.pointerEvents = "auto";

    const tl = gsap.timeline({
      onComplete: () => {
        ov.style.pointerEvents = "none";
      },
    });

    // --- DEPART (0-320ms)
    tl.set([ov, wash, runes, scan, corners], { opacity: 0 });
    tl.set(wash, { scale: 0.6, transformOrigin: "center center" });
    tl.set(corners, { scale: 0.4 });
    tl.set(scan, { scaleX: 0, transformOrigin: "center center" });

    tl.to(ov, { opacity: 1, duration: 0.02 }, 0);
    tl.to(
      wash,
      { opacity: 1, scale: 1, duration: 0.32, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
      0
    );
    tl.to(runes, { opacity: 1, duration: 0.24, ease: "power2.out" }, 0.08);
    tl.to(
      corners,
      { opacity: 1, scale: 1, duration: 0.28, ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
      0.04
    );
    tl.to(scan, { opacity: 1, scaleX: 1, duration: 0.2, ease: "power2.out" }, 0.1);

    // --- HOLD (320-440ms)
    // Nothing animates; Next.js completes route change during this window

    // --- ARRIVE (440-780ms)
    tl.to([runes, corners, scan], { opacity: 0, duration: 0.22, ease: "power2.in" }, 0.44);
    tl.to(
      wash,
      { opacity: 0, scale: 1.1, duration: 0.32, ease: "cubic-bezier(0.16, 1, 0.3, 1)" },
      0.48
    );
    tl.to(ov, { opacity: 0, duration: 0.02 }, 0.78);

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      {children}
      <div
        ref={overlayRef}
        className="pt-overlay"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 95,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        {/* Hanada wash — soft radial glow from center */}
        <div
          ref={washRef}
          className="pt-wash"
          style={{
            position: "absolute",
            inset: "-10%",
            background:
              "radial-gradient(ellipse at center, rgba(91,137,181,0.28) 0%, rgba(91,137,181,0.12) 50%, rgba(242,240,234,0.02) 100%)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Backdrop layer — subtle paper darken */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(28, 28, 26, 0.02)",
          }}
        />

        {/* Runed glyph ornament — central rune circle */}
        <div
          ref={runesRef}
          className="pt-runes"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-stack-mono)",
            fontSize: 20,
            letterSpacing: "0.3em",
            color: "var(--accent)",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 0 20px rgba(91,137,181,0.5), 0 0 4px rgba(91,137,181,0.8)",
          }}
        >
          <div style={{ marginBottom: 14, opacity: 0.6 }}>┌ · ─ · ─ · ─ · ┐</div>
          <div
            style={{
              fontFamily: "var(--font-stack-mono)",
              fontSize: 40,
              letterSpacing: "0.1em",
              color: "var(--accent)",
              opacity: 0.95,
            }}
          >
            ┼
          </div>
          <div style={{ marginTop: 14, opacity: 0.6 }}>└ · ─ · ─ · ─ · ┘</div>
          <div
            style={{
              marginTop: 18,
              fontSize: 10,
              letterSpacing: "0.32em",
              color: "var(--accent)",
              opacity: 0.7,
            }}
          >
            TRAVELING
          </div>
        </div>

        {/* Central horizontal scan line */}
        <div
          ref={scanRef}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(to right, transparent 0%, var(--accent) 20%, var(--accent) 80%, transparent 100%)",
            transform: "scaleX(0)",
            boxShadow: "0 0 20px rgba(91,137,181,0.6)",
            opacity: 0,
          }}
        />

        {/* Viewport corner brackets */}
        <div
          ref={cornersRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            fontFamily: "var(--font-stack-mono)",
            color: "var(--accent)",
            opacity: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              fontSize: 24,
              textShadow: "0 0 12px rgba(91,137,181,0.6)",
            }}
          >
            ┌
          </span>
          <span
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              fontSize: 24,
              textShadow: "0 0 12px rgba(91,137,181,0.6)",
            }}
          >
            ┐
          </span>
          <span
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              fontSize: 24,
              textShadow: "0 0 12px rgba(91,137,181,0.6)",
            }}
          >
            └
          </span>
          <span
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              fontSize: 24,
              textShadow: "0 0 12px rgba(91,137,181,0.6)",
            }}
          >
            ┘
          </span>
        </div>

        {/* Faint scanline texture during warp */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(91,137,181,0.03) 3px, rgba(91,137,181,0.03) 4px)",
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />
      </div>
    </>
  );
}
