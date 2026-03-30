"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap, SplitText } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false, loading: () => null,
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
  const brandRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const footerRef = useRef<HTMLElement>(null);

  const scrollX = useRef(0);
  const targetX = useRef(0);
  const maxScroll = useRef(0);
  const activeRef = useRef(0);

  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState(0);

  /* ── Entrance ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      [navRef, footerRef].forEach(r => { if (r.current) r.current.style.opacity = "1"; });
      if (brandRef.current) brandRef.current.style.opacity = "1";
      if (taglineRef.current) taglineRef.current.style.opacity = "1";
      itemRefs.current.forEach(el => { if (el) { el.style.opacity = "1"; el.style.clipPath = "none"; } });
      return;
    }

    const tl = gsap.timeline();

    // Phase 1: Brand name — chars rise from center outward (tighter: 1s total)
    if (brandRef.current) {
      brandRef.current.style.opacity = "1";
      const split = new SplitText(brandRef.current, { type: "chars" });
      tl.fromTo(split.chars,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, stagger: { each: 0.03, from: "center" }, ease: "power3.out" },
        0.1
      );
    }

    // Phase 2: Tagline + nav + footer — simultaneous (0.5s after brand starts)
    tl.fromTo(taglineRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      0.5
    );
    tl.fromTo([navRef.current, footerRef.current],
      { opacity: 0 },
      { opacity: 1, duration: 0.4, stagger: 0.05 },
      0.6
    );

    // Phase 3: Gallery items — clip-path + subtle scale (0.7s after brand starts)
    const items = itemRefs.current.filter(Boolean);
    tl.fromTo(items,
      { clipPath: "inset(100% 0 0 0)", scale: 1.02 },
      { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.8, stagger: 0.05, ease: "circ.inOut" },
      0.7
    );
  }, []);

  /* ── Horizontal scroll ── */
  useEffect(() => {
    const gallery = galleryRef.current;
    const track = trackRef.current;
    if (!gallery || !track) return;

    const updateBounds = () => {
      maxScroll.current = Math.max(0, track.scrollWidth - gallery.clientWidth);
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);

    let raf: number;
    const loop = () => {
      const prev = scrollX.current;
      scrollX.current += (targetX.current - scrollX.current) * 0.07;
      const v = scrollX.current - prev;
      const skew = gsap.utils.clamp(-1.5, 1.5, v * 0.15);
      track.style.transform = `translateX(${-scrollX.current}px) skewX(${skew}deg)`;

      // Active detection
      const cx = gallery.clientWidth / 2 + scrollX.current;
      let best = 0, bestDist = Infinity;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - cx);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetX.current = gsap.utils.clamp(0, maxScroll.current, targetX.current + (e.deltaY || e.deltaX));
    };
    let t0x = 0, t0s = 0;
    const onTS = (e: TouchEvent) => { t0x = e.touches[0].clientX; t0s = targetX.current; };
    const onTM = (e: TouchEvent) => {
      e.preventDefault();
      targetX.current = gsap.utils.clamp(0, maxScroll.current, t0s + (t0x - e.touches[0].clientX));
    };

    gallery.addEventListener("wheel", onWheel, { passive: false });
    gallery.addEventListener("touchstart", onTS, { passive: true });
    gallery.addEventListener("touchmove", onTM, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateBounds);
      gallery.removeEventListener("wheel", onWheel);
      gallery.removeEventListener("touchstart", onTS);
      gallery.removeEventListener("touchmove", onTM);
    };
  }, []);

  const current = pieces[active];

  // Heights alternate for wave rhythm
  const heights = ["54vh", "70vh", "42vh", "64vh", "48vh", "73vh"];
  // Widths vary dramatically
  const widths = [
    "clamp(200px, 24vw, 360px)",
    "clamp(300px, 36vw, 520px)",
    "clamp(160px, 18vw, 260px)",
    "clamp(260px, 30vw, 440px)",
    "clamp(190px, 22vw, 320px)",
    "clamp(320px, 38vw, 540px)",
  ];
  // Vertical alignment alternates
  const aligns: Array<"flex-start" | "flex-end" | "center"> = [
    "flex-end", "flex-start", "center", "flex-end", "flex-start", "center",
  ];

  return (
    <PageTransition>
      <div style={{
        height: "100dvh", display: "grid",
        gridTemplateRows: "auto 1fr auto",
        background: "var(--bg)", overflow: "hidden",
      }}>

        {/* ═══ NAV ═══ */}
        <header ref={navRef} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px var(--margin) 0", opacity: 0,
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg)" }}>
            HKJ
          </span>
          <nav style={{ display: "flex", gap: 24 }}>
            {["Work", "Lab", "About"].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{
                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--fg-2)", textDecoration: "none",
                transition: "color 200ms var(--ease)",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--fg)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--fg-2)"; }}
              >{l}</Link>
            ))}
          </nav>
        </header>

        {/* ═══ MAIN — brand + gallery ═══ */}
        <main style={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>

          {/* Brand */}
          <div style={{
            padding: "clamp(8px, 1.5vh, 24px) var(--margin) 0",
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            flexWrap: "wrap", gap: "8px 32px",
          }}>
            <h1 ref={brandRef} style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(56px, 15vw, 220px)",
              fontWeight: 400, lineHeight: 0.85, letterSpacing: "-0.04em",
              color: "var(--fg)", overflow: "hidden", opacity: 0,
            }}>
              HKJ
            </h1>
            <p ref={taglineRef} style={{
              fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--fg-3)", opacity: 0,
              maxWidth: 280, lineHeight: 1.5,
            }}>
              Brand & product design studio — Seoul
            </p>
          </div>

          {/* Gallery */}
          <div ref={galleryRef} id="main" style={{
            flex: 1, minHeight: 0, overflow: "hidden",
            cursor: "grab", userSelect: "none",
          }}>
            <div ref={trackRef} style={{
              display: "flex", gap: "clamp(12px, 1.5vw, 20px)",
              height: "100%", alignItems: "center",
              padding: "0 var(--margin)",
              paddingBottom: "clamp(8px, 1.5vh, 20px)",
              willChange: "transform",
            }}>
              {pieces.map((piece, i) => {
                const isHovered = hovered === i;
                const isDimmed = hovered !== null && hovered !== i;
                const dark = isDark(piece.cover.bg);
                const coverMuted = dark ? "rgba(255,252,245,0.35)" : "rgba(26,25,23,0.25)";
                const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;
                const n = String(i + 1).padStart(2, "0");

                return (
                  <div key={piece.slug}
                    ref={el => { itemRefs.current[i] = el; }}
                    style={{
                      flexShrink: 0, width: widths[i % 6],
                      alignSelf: aligns[i % 6],
                      display: "flex", flexDirection: "column", gap: 6,
                      clipPath: "inset(100% 0 0 0)",
                      opacity: isDimmed ? 0.35 : 1,
                      transition: "opacity 350ms var(--ease)",
                    }}
                  >
                    <Link href={href}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={(e) => {
                        setHovered(null);
                        // Reset magnetic offset
                        gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
                      }}
                      onMouseMove={(e) => {
                        // Magnetic hover — card follows cursor within bounds
                        const rect = e.currentTarget.getBoundingClientRect();
                        const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
                        const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
                        gsap.to(e.currentTarget, {
                          x: cx * 8,  // ±8px max
                          y: cy * 6,  // ±6px max
                          duration: 0.3,
                          ease: "power2.out",
                        });
                      }}
                      aria-label={`View ${piece.title}`}
                      style={{
                        display: "block", width: "100%", height: heights[i % 6],
                        position: "relative", backgroundColor: piece.cover.bg,
                        overflow: "hidden", textDecoration: "none",
                      }}
                    >
                      {piece.image && (
                        <Image src={piece.image} alt={piece.title} fill
                          sizes="(max-width:768px) 60vw, 30vw"
                          style={{
                            objectFit: "cover",
                            transition: "transform 700ms var(--ease)",
                            transform: isHovered ? "scale(1.06)" : "scale(1)",
                          }}
                          priority={i < 3}
                        />
                      )}
                      {/* Number */}
                      <span style={{
                        position: "absolute", top: 10, left: 12, zIndex: 2,
                        fontFamily: "var(--font-mono)", fontSize: 10,
                        letterSpacing: "0.08em", color: coverMuted,
                      }}>{n}</span>
                      {/* Hover title overlay */}
                      <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        padding: "32px 12px 10px",
                        background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 350ms var(--ease)",
                        zIndex: 2,
                      }}>
                        <span style={{
                          fontFamily: "var(--font-display)", fontSize: "clamp(16px, 1.8vw, 24px)",
                          fontWeight: 400, color: "rgba(255,252,245,0.92)",
                          lineHeight: 1.1,
                        }}>{piece.title}</span>
                      </div>
                    </Link>
                    {/* Caption */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--fg)" }}>
                        {piece.title}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-mono)", fontSize: 10,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: "var(--fg-3)",
                      }}>{piece.year}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* ═══ FOOTER ═══ */}
        <footer ref={footerRef} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 var(--margin)", height: 36,
          borderTop: "1px solid var(--fg-5)", opacity: 0,
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-3)" }}>
            {current?.title}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums", color: "var(--fg-2)" }}>
            {String(active + 1).padStart(2, "0")}/{String(pieces.length).padStart(2, "0")}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-3)" }}>
            {current?.tags[0]}
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
