"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

const HorizontalGrid = dynamic(
  () => import("@/components/HorizontalGrid"),
  { ssr: false, loading: () => null }
);

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

export default function Home() {
  const navRef = useRef<HTMLElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);

  // Entrance
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (navRef.current) navRef.current.style.opacity = "1";
      if (lockupRef.current) lockupRef.current.style.opacity = "1";
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
    tl.fromTo(navRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
    tl.fromTo(lockupRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.05);
  }, []);


  // Counter update
  const handleCenterChange = useCallback((index: number) => {
    setCenterIndex(index);
    if (counterRef.current) {
      gsap.fromTo(
        counterRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <PageTransition>
      <div
        style={{
          height: "100dvh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--paper)",
          position: "relative",
        }}
      >
        {/* ── Nav ── */}
        <header
          ref={navRef}
          style={{
            height: 40,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
            opacity: 0,
            position: "relative",
            zIndex: 20,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-full)",
            }}
          >
            HKJ
          </span>
          <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {[
              { label: "Work", href: "/work" },
              { label: "Lab", href: "/lab" },
              { label: "About", href: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono"
                style={{
                  fontSize: "var(--text-label)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--ink-secondary)",
                  textDecoration: "none",
                  transition: "color var(--dur-hover) var(--ease-out)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--ink-full)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--ink-secondary)";
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* ── Brand Lockup — parallax on scroll ── */}
        <div
          ref={lockupRef}
          style={{
            position: "absolute",
            top: "clamp(28px, 7vh, 72px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            textAlign: "center",
            pointerEvents: "none",
            opacity: 0,
          }}
        >
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(56px, 14vw, 180px)",
              fontWeight: 700,
              lineHeight: 0.88,
              color: "var(--ink-full)",
              letterSpacing: "-0.04em",
            }}
          >
            HKJ
          </h1>
          <p
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-secondary)",
              marginTop: 10,
            }}
          >
            Studio / 2026
          </p>
        </div>

        {/* ── Gallery ── */}
        <main id="main" style={{ flex: 1, minHeight: 0 }}>
          <HorizontalGrid
            pieces={pieces}
            onCenterChange={handleCenterChange}
          />
        </main>

        {/* ── Footer with counter ── */}
        <footer
          style={{
            height: 32,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
            position: "relative",
            zIndex: 20,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-muted)",
            }}
          >
            Design & Engineering
          </span>

          {/* Center counter */}
          <span
            ref={counterRef}
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.06em",
              fontVariantNumeric: "tabular-nums",
              color: "var(--ink-full)",
            }}
          >
            {String(centerIndex + 1).padStart(2, "0")} /{" "}
            {String(pieces.length).padStart(2, "0")}
          </span>

          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              color: "var(--ink-muted)",
            }}
          >
            Seoul, 2026
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}
