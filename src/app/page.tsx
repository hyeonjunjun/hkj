"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap, Observer } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
  loading: () => null,
});

const pieces = [...PIECES].sort((a, b) => a.order - b.order);

function isDark(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const [current, setCurrent] = useState(0);
  const animating = useRef(false);

  const piece = pieces[current];
  const dark = isDark(piece.cover.bg);
  const textColor = dark ? "rgba(255,252,245,0.92)" : "var(--fg)";
  const mutedColor = dark ? "rgba(255,252,245,0.45)" : "var(--fg-3)";
  const bgColor = piece.cover.bg;

  // Navigate to next/prev project
  const goTo = useCallback((direction: 1 | -1) => {
    if (animating.current) return;
    const next = ((current + direction) % pieces.length + pieces.length) % pieces.length;
    animating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrent(next);
        animating.current = false;
      },
    });

    // Fade out current info
    tl.to([titleRef.current, metaRef.current], {
      opacity: 0,
      y: -12 * direction,
      duration: 0.3,
      ease: "power2.in",
    }, 0);

    // Crossfade image via clip-path
    tl.to(imageContainerRef.current, {
      opacity: 0.6,
      scale: 0.98,
      duration: 0.25,
      ease: "power2.in",
    }, 0);

    tl.set(imageContainerRef.current, {}, "+=0.05");

    // Reveal new state
    tl.to(imageContainerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    tl.fromTo([titleRef.current, metaRef.current],
      { opacity: 0, y: 12 * direction },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.06 },
      "-=0.35"
    );

    // Progress bar
    const nextProgress = ((next + 1) / pieces.length) * 100;
    tl.to(progressRef.current, {
      width: `${nextProgress}%`,
      duration: 0.4,
      ease: "power2.out",
    }, 0.1);
  }, [current]);

  // GSAP Observer — wheel + touch + keyboard
  useEffect(() => {
    const obs = Observer.create({
      target: containerRef.current!,
      type: "wheel,touch,pointer",
      tolerance: 80,
      onDown: () => goTo(1),
      onUp: () => goTo(-1),
      wheelSpeed: -1,
      preventDefault: true,
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); goTo(1); }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); goTo(-1); }
    };
    window.addEventListener("keydown", onKey);

    return () => { obs.kill(); window.removeEventListener("keydown", onKey); };
  }, [goTo]);

  // Mouse parallax on image
  useEffect(() => {
    const container = containerRef.current;
    const img = imageContainerRef.current;
    if (!container || !img) return;

    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(img, {
        x: cx * 12,
        y: cy * 8,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    container.addEventListener("mousemove", onMove);
    return () => container.removeEventListener("mousemove", onMove);
  }, []);

  // Entrance
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [navRef, footerRef].forEach(r => { if (r.current) r.current.style.opacity = "1"; });
      if (imageContainerRef.current) imageContainerRef.current.style.clipPath = "none";
      if (titleRef.current) titleRef.current.style.opacity = "1";
      if (metaRef.current) metaRef.current.style.opacity = "1";
      return;
    }

    const tl = gsap.timeline();

    // Nav + footer
    tl.fromTo([navRef.current, footerRef.current],
      { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.1);

    // Image clip-path reveal
    tl.fromTo(imageContainerRef.current,
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)", duration: 1, ease: "circ.inOut" }, 0.2);

    // Title + meta
    tl.fromTo([titleRef.current, metaRef.current],
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.7);

    // Counter
    tl.fromTo(counterRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.9);

    // Progress bar
    tl.fromTo(progressRef.current,
      { width: "0%" },
      { width: `${(1 / pieces.length) * 100}%`, duration: 0.6, ease: "power2.out" }, 0.8);
  }, []);

  const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;

  return (
    <PageTransition>
      <div
        ref={containerRef}
        style={{
          height: "100dvh",
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "48px 1fr auto",
          backgroundColor: bgColor,
          transition: "background-color 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          position: "relative",
        }}
      >
        {/* ═══ NAV ═══ */}
        <header
          ref={navRef}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--margin)",
            opacity: 0,
            position: "relative",
            zIndex: 20,
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: textColor, transition: "color 500ms ease",
          }}>
            HKJ
          </span>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>
              Brand & Product Studio
            </span>
            <Link href="/about" style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, textDecoration: "none",
              transition: "color 200ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = textColor; }}
            onMouseLeave={e => { e.currentTarget.style.color = mutedColor; }}
            >
              About
            </Link>
          </div>
        </header>

        {/* ═══ MAIN ═══ */}
        <main
          style={{
            display: "grid",
            gridTemplateColumns: "1fr clamp(200px, 28vw, 400px)",
            gap: "var(--margin)",
            padding: "0 var(--margin)",
            alignItems: "center",
            minHeight: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Left: Featured image */}
          <Link href={href} style={{ display: "block", textDecoration: "none" }}>
            <div
              ref={imageContainerRef}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4/3",
                maxHeight: "70vh",
                overflow: "hidden",
                clipPath: "inset(100% 0 0 0)",
                backgroundColor: bgColor,
              }}
            >
              {/* All images stacked */}
              {pieces.map((p, i) => (
                p.image ? (
                  <Image
                    key={p.slug}
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 90vw, 65vw"
                    style={{
                      objectFit: "cover",
                      opacity: current === i ? 1 : 0,
                      transition: "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                      zIndex: current === i ? 2 : 1,
                    }}
                    priority={i === 0}
                  />
                ) : null
              ))}
              {/* Grain */}
              <div aria-hidden="true" style={{
                position: "absolute", inset: 0, opacity: 0.04,
                filter: "url(#grain)", background: "var(--bg)",
                mixBlendMode: "multiply", pointerEvents: "none", zIndex: 3,
              }} />
            </div>
          </Link>

          {/* Right: Project info */}
          <div style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center", gap: 24,
            height: "100%",
          }}>
            {/* Title block */}
            <div ref={titleRef} style={{ opacity: 0 }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: mutedColor, display: "block", marginBottom: 12,
                transition: "color 500ms ease",
              }}>
                {piece.type === "project" ? "Project" : "Experiment"}
              </span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3.5vw, 52px)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: textColor,
                marginBottom: 12,
                transition: "color 500ms ease",
              }}>
                {piece.title}
              </h2>
              <p style={{
                fontSize: 14, lineHeight: 1.55,
                color: mutedColor, maxWidth: 340,
                transition: "color 500ms ease",
              }}>
                {piece.description}
              </p>
            </div>

            {/* Meta */}
            <div ref={metaRef} style={{
              display: "flex", flexDirection: "column", gap: 8, opacity: 0,
            }}>
              <div style={{
                display: "flex", gap: 16, alignItems: "baseline",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: mutedColor, transition: "color 500ms ease",
                }}>
                  {piece.tags.slice(0, 2).join(" / ")}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 10,
                  letterSpacing: "0.08em",
                  color: mutedColor, transition: "color 500ms ease",
                }}>
                  {piece.year}
                </span>
              </div>

              {/* View link */}
              <Link href={href} style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: textColor, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 8, transition: "color 500ms ease, gap 200ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = "10px"; }}
              onMouseLeave={e => { e.currentTarget.style.gap = "6px"; }}
              >
                View Project <span style={{ fontSize: 14 }}>→</span>
              </Link>
            </div>
          </div>
        </main>

        {/* ═══ FOOTER + PROGRESS ═══ */}
        <footer
          ref={footerRef}
          style={{
            padding: "0 var(--margin)",
            paddingBottom: 16,
            opacity: 0,
            position: "relative",
            zIndex: 20,
          }}
        >
          {/* Progress bar */}
          <div style={{
            height: 1,
            backgroundColor: dark ? "rgba(255,252,245,0.12)" : "rgba(26,25,23,0.08)",
            marginBottom: 12,
            position: "relative",
            transition: "background-color 500ms ease",
          }}>
            <div
              ref={progressRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${((current + 1) / pieces.length) * 100}%`,
                backgroundColor: textColor,
                transition: "background-color 500ms ease",
              }}
            />
          </div>

          {/* Footer row */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>
              Brand & Product Design Studio — Seoul
            </span>

            <span
              ref={counterRef}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.08em",
                fontVariantNumeric: "tabular-nums",
                color: textColor, transition: "color 500ms ease",
                opacity: 0,
              }}
            >
              {String(current + 1).padStart(2, "0")} / {String(pieces.length).padStart(2, "0")}
            </span>

            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>
              © 2026 HKJ
            </span>
          </div>
        </footer>

        {/* Grain */}
        <div className="grain" />

        {/* Cursor */}
        <CustomCursor />
      </div>
    </PageTransition>
  );
}
