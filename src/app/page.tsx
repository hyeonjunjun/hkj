"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
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

// Grid aspect ratios for visual rhythm
const GRID_ASPECTS = ["4/5", "3/4", "1/1", "4/5", "3/4", "1/1"];

export default function Home() {
  const navRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const indexRefs = useRef<(HTMLElement | null)[]>([]);
  const taglineRef = useRef<HTMLElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridItemRefs = useRef<(HTMLElement | null)[]>([]);
  const aboutRef = useRef<HTMLElement>(null);

  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [gridHovered, setGridHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const featured = pieces[featuredIdx];

  /* ── Lenis smooth scroll + ScrollTrigger sync ── */
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Sync Lenis with GSAP ScrollTrigger + track scroll position
    lenis.on("scroll", (e: { scroll: number }) => {
      ScrollTrigger.update();
      setScrolled(e.scroll > 80);
    });
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after Lenis settles
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);
  const featuredBg = featured?.cover.bg || "#2a241c";

  /* ── Entrance choreography ── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      [navRef, taglineRef, scrollCueRef].forEach((r) => {
        if (r.current) r.current.style.opacity = "1";
      });
      if (brandRef.current) {
        brandRef.current.style.opacity = "0.15";
        brandRef.current.style.filter = "none";
      }
      if (heroImageRef.current) heroImageRef.current.style.clipPath = "none";
      indexRefs.current.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
      return;
    }

    const tl = gsap.timeline();

    // Phase 1: Brand name materializes (blur → sharp)
    if (brandRef.current) {
      tl.fromTo(
        brandRef.current,
        { opacity: 0, scale: 1.03, filter: "blur(12px)" },
        { opacity: 0.12, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
        0.1
      );
    }

    // Phase 2: Hero image clip-path reveal
    if (heroImageRef.current) {
      tl.fromTo(
        heroImageRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "circ.inOut" },
        0.3
      );
    }

    // Phase 3: Index titles stagger
    const validIndex = indexRefs.current.filter(Boolean);
    tl.fromTo(
      validIndex,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: "power2.out" },
      0.6
    );

    // Phase 4: Nav + tagline + scroll cue
    tl.fromTo(
      [navRef.current, taglineRef.current, scrollCueRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.4, stagger: 0.06 },
      0.8
    );
  }, []);

  /* ── Scroll-triggered reveals for grid + about ── */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gridItemRefs.current.forEach((el) => {
        if (el) { el.style.opacity = "1"; el.style.clipPath = "none"; }
      });
      if (aboutRef.current) aboutRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      // Grid items reveal on scroll
      gridItemRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            duration: 0.8,
            ease: "circ.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // About section reveal
      if (aboutRef.current) {
        gsap.fromTo(
          aboutRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: aboutRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Hero parallax
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: heroImageRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Brand name parallax (slower)
      if (brandRef.current) {
        gsap.to(brandRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: brandRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      <div style={{ background: "var(--bg)", minHeight: "100dvh" }}>

        {/* ═══ NAV (sticky) ═══ */}
        <header
          ref={navRef}
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 var(--margin)",
            background: scrolled ? "rgba(245, 241, 236, 0.9)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? "1px solid var(--fg-5)" : "1px solid transparent",
            transition: "background 300ms var(--ease), border-color 300ms var(--ease), backdrop-filter 300ms var(--ease)",
            opacity: 0,
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)",
          }}>
            HKJ
          </span>
          <nav style={{ display: "flex", gap: 28 }}>
            {["Work", "Lab", "About"].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--fg-2)", textDecoration: "none",
                transition: "color 200ms var(--ease)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-2)"; }}
              >{l}</Link>
            ))}
          </nav>
        </header>

        {/* ═══ HERO (100vh) ═══ */}
        <section
          id="main"
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            padding: "0 var(--margin)",
          }}
        >
          {/* Layer 1: Monumental brand name */}
          <h1
            ref={brandRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -55%)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(180px, 28vw, 480px)",
              fontWeight: 400,
              lineHeight: 0.82,
              letterSpacing: "-0.05em",
              color: "var(--fg)",
              opacity: 0,
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 1,
              whiteSpace: "nowrap",
            }}
          >
            HKJ
          </h1>

          {/* Layer 2: Featured image — all images stacked, crossfade via opacity */}
          <div
            ref={heroImageRef}
            style={{
              position: "absolute",
              left: "var(--margin)",
              top: "12%",
              width: "clamp(280px, 38vw, 560px)",
              height: "clamp(360px, 52vh, 660px)",
              overflow: "hidden",
              zIndex: 3,
              clipPath: "inset(100% 0 0 0)",
              backgroundColor: featuredBg,
              transition: "background-color 500ms var(--ease)",
            }}
          >
            {/* Stack all piece images — only active one is visible */}
            {pieces.map((p, i) => (
              p.image ? (
                <Image
                  key={p.slug}
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 38vw"
                  style={{
                    objectFit: "cover",
                    opacity: featuredIdx === i ? 1 : 0,
                    transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                    zIndex: featuredIdx === i ? 2 : 1,
                  }}
                  priority={i === 0}
                />
              ) : null
            ))}
            {/* Color field for imageless pieces */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: featuredBg,
                transition: "background-color 500ms var(--ease)",
                zIndex: 0,
              }}
            />
            {/* Grain */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.05,
                filter: "url(#grain)",
                background: "var(--bg)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          </div>

          {/* Layer 3: Project index (right side) */}
          <div
            style={{
              position: "absolute",
              right: "var(--margin)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-end",
            }}
          >
            {pieces.map((piece, i) => {
              const isActive = featuredIdx === i;
              return (
                <Link
                  key={piece.slug}
                  ref={(el) => { indexRefs.current[i] = el; }}
                  href={piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`}
                  onMouseEnter={() => setFeaturedIdx(i)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textAlign: "right",
                    textDecoration: "none",
                    color: isActive ? "var(--fg)" : "var(--fg-3)",
                    transition: "color 250ms var(--ease), letter-spacing 300ms var(--ease)",
                    padding: "4px 0",
                    opacity: 0,
                  }}
                >
                  {piece.title}
                </Link>
              );
            })}
          </div>

          {/* Tagline — bottom left */}
          <span
            ref={taglineRef}
            style={{
              position: "absolute",
              bottom: "clamp(24px, 4vh, 48px)",
              left: "var(--margin)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              opacity: 0,
              zIndex: 5,
            }}
          >
            Brand & product design studio — Seoul
          </span>

          {/* Scroll cue — bottom center, animated */}
          <div
            ref={scrollCueRef}
            style={{
              position: "absolute",
              bottom: "clamp(24px, 4vh, 48px)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              opacity: 0,
              zIndex: 5,
            }}
          >
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--fg-4)",
            }}>
              Scroll
            </span>
            <span
              style={{
                display: "block",
                width: 1,
                height: 24,
                backgroundColor: "var(--fg-4)",
                animation: "scrollPulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </section>

        {/* ═══ PROJECT GRID (scroll reveals) ═══ */}
        <section
          style={{
            padding: "clamp(80px, 12vh, 140px) var(--margin)",
          }}
        >
          {/* Section label */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "clamp(32px, 5vh, 56px)",
              borderBottom: "1px solid var(--fg-5)",
              paddingBottom: 16,
            }}
          >
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)",
            }}>
              Selected Work
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", color: "var(--fg-3)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {String(pieces.length).padStart(2, "0")} Pieces
            </span>
          </div>

          {/* Grid */}
          <div
            ref={gridRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(16px, 2.5vw, 32px)",
              rowGap: "clamp(40px, 6vh, 72px)",
            }}
          >
            {pieces.map((piece, i) => {
              const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
              const isHovered = gridHovered === i;
              const isDimmed = gridHovered !== null && gridHovered !== i;
              const dark = isDark(piece.cover.bg);
              const coverMuted = dark ? "rgba(255,252,245,0.35)" : "rgba(26,25,23,0.25)";
              const n = String(i + 1).padStart(2, "0");

              return (
                <div
                  key={piece.slug}
                  ref={(el) => { gridItemRefs.current[i] = el; }}
                  style={{
                    opacity: 0,
                    clipPath: "inset(100% 0 0 0)",
                    transition: "opacity 350ms var(--ease)",
                    ...(isDimmed ? { opacity: 0.4 } : {}),
                  }}
                >
                  <Link
                    href={href}
                    onMouseEnter={() => setGridHovered(i)}
                    onMouseLeave={() => setGridHovered(null)}
                    style={{
                      display: "block",
                      position: "relative",
                      aspectRatio: GRID_ASPECTS[i % GRID_ASPECTS.length],
                      backgroundColor: piece.cover.bg,
                      overflow: "hidden",
                      textDecoration: "none",
                    }}
                    aria-label={`View ${piece.title}`}
                  >
                    {piece.image && (
                      <Image
                        src={piece.image}
                        alt={piece.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{
                          objectFit: "cover",
                          transition: "transform 700ms var(--ease)",
                          transform: isHovered ? "scale(1.05)" : "scale(1)",
                        }}
                      />
                    )}
                    {/* Grain */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute", inset: 0, opacity: 0.05,
                        filter: "url(#grain)", background: piece.cover.bg,
                        mixBlendMode: "multiply", pointerEvents: "none",
                      }}
                    />
                    {/* Number */}
                    <span style={{
                      position: "absolute", top: 10, left: 12, zIndex: 2,
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      letterSpacing: "0.08em", color: coverMuted,
                    }}>{n}</span>
                  </Link>
                  {/* Caption */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "baseline", marginTop: 8, gap: 12,
                  }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>
                      {piece.title}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: 10,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "var(--fg-3)", flexShrink: 0,
                    }}>
                      {piece.tags[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ ABOUT + CONTACT ═══ */}
        <section
          ref={aboutRef}
          style={{
            padding: "clamp(64px, 10vh, 120px) var(--margin)",
            borderTop: "1px solid var(--fg-5)",
            opacity: 0,
          }}
        >
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 5vw, 80px)",
          }}>
            {/* Left: statement */}
            <div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2.5vw, 32px)",
                fontWeight: 400,
                lineHeight: 1.3,
                color: "var(--fg)",
                marginBottom: 24,
              }}>
                Designing brands, products, and the systems between them.
              </p>
              <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--fg-2)",
                maxWidth: 440,
              }}>
                HKJ is a design studio focused on brand identity, product design,
                and design engineering. Based in Seoul, working globally.
              </p>
            </div>

            {/* Right: contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-end" }}>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--fg-3)", display: "block", marginBottom: 8,
                }}>
                  Inquiries
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`} style={{
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  letterSpacing: "0.06em", color: "var(--fg)",
                  textDecoration: "none", transition: "color 200ms var(--ease)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg-2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg)"; }}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "var(--fg-3)", textDecoration: "none",
                    transition: "color 200ms var(--ease)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-3)"; }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 var(--margin)", height: 48,
          borderTop: "1px solid var(--fg-5)",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>
            HKJ Studio &copy; 2026
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-3)" }}>
            Seoul, KR
          </span>
        </footer>

        {/* Grain */}
        <div className="grain" />

        {/* Custom cursor */}
        <CustomCursor />
      </div>
    </PageTransition>
  );
}
