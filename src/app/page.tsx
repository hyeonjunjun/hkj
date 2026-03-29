"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap, SplitText } from "@/lib/gsap";
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRefs = useRef<(HTMLElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [centerIndex, setCenterIndex] = useState(0);

  // Entrance choreography
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [navRef, lockupRef].forEach((ref) => {
        if (ref.current) ref.current.style.opacity = "1";
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    // Phase 1: Brand lockup — chars reveal
    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: "chars" });
      tl.fromTo(
        split.chars,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.03,
          ease: "power3.out",
        },
        0.2
      );
    }

    // Phase 2: Metadata lines stagger
    const validMeta = metaRefs.current.filter(Boolean);
    tl.fromTo(
      validMeta,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
      0.6
    );

    // Phase 3: Nav
    tl.fromTo(
      navRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      0.8
    );
  }, []);

  const handleCenterChange = useCallback((index: number) => {
    setCenterIndex(index);
    if (counterRef.current) {
      gsap.fromTo(
        counterRef.current,
        { opacity: 0, y: 3 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
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
        }}
      >
        {/* ═══ TOP ZONE: Brand + Nav ═══ */}
        <div
          style={{
            flexShrink: 0,
            padding: "0 var(--grid-margin)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Nav */}
          <header
            ref={navRef}
            style={{
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: 0,
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

          {/* Brand lockup */}
          <div
            ref={lockupRef}
            style={{
              paddingTop: "clamp(16px, 3vh, 40px)",
              paddingBottom: "clamp(20px, 4vh, 48px)",
            }}
          >
            {/* Title — large display, overflow hidden for char reveal */}
            <h1
              ref={titleRef}
              className="font-display"
              style={{
                fontSize: "var(--text-display)",
                fontWeight: 700,
                lineHeight: "var(--leading-display)",
                letterSpacing: "var(--tracking-display)",
                color: "var(--ink-full)",
                overflow: "hidden",
              }}
            >
              HKJ Studio
            </h1>

            {/* Metadata row */}
            <div
              style={{
                display: "flex",
                gap: "clamp(24px, 4vw, 48px)",
                marginTop: "clamp(12px, 2vh, 20px)",
                flexWrap: "wrap",
              }}
            >
              {[
                "Design & Engineering",
                "Seoul",
                "2024 — Present",
              ].map((text, i) => (
                <span
                  key={text}
                  ref={(el) => { metaRefs.current[i] = el; }}
                  className="font-mono"
                  style={{
                    fontSize: "var(--text-label)",
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                    opacity: 0,
                  }}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "var(--ink-ghost)",
            marginInline: "var(--grid-margin)",
            flexShrink: 0,
          }}
        />

        {/* ═══ BOTTOM ZONE: Gallery ═══ */}
        <main id="main" style={{ flex: 1, minHeight: 0 }}>
          <HorizontalGrid
            pieces={pieces}
            onCenterChange={handleCenterChange}
          />
        </main>

        {/* Footer */}
        <footer
          style={{
            height: 36,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--grid-margin)",
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
            {pieces[centerIndex]?.title}
          </span>
          <span
            ref={counterRef}
            className="font-mono"
            style={{
              fontSize: "var(--text-label)",
              letterSpacing: "var(--tracking-label)",
              fontVariantNumeric: "tabular-nums",
              color: "var(--ink-secondary)",
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
            {pieces[centerIndex]?.tags[0]?.toUpperCase()}
          </span>
        </footer>
      </div>
    </PageTransition>
  );
}
