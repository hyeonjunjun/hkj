"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";
import { PIECES } from "@/constants/pieces";
import PageTransition from "@/components/PageTransition";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
  loading: () => null,
});

const pieces = [...PIECES].sort((a, b) => a.order - b.order);
const N = pieces.length;

// ── Carousel geometry ──
const ITEM_SPACING = 300; // px between item centers
const TRACK = N * ITEM_SPACING;
const MAX_ROTATION = 40;
const MAX_DEPTH = 180;
const MIN_SCALE = 0.55;
const SCALE_RANGE = 0.45;
const MIN_OPACITY = 0.25;
const OPACITY_RANGE = 0.75;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function adjustBrightness(hex: string, percent: number): string {
  const c = hex.replace("#", "");
  if (c.length < 6) return hex;
  const r = Math.max(0, Math.min(255, parseInt(c.slice(0, 2), 16) + Math.round(255 * percent / 100)));
  const g = Math.max(0, Math.min(255, parseInt(c.slice(2, 4), 16) + Math.round(255 * percent / 100)));
  const b = Math.max(0, Math.min(255, parseInt(c.slice(4, 6), 16) + Math.round(255 * percent / 100)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function isDark(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

export default function Home() {
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Scroll position is animated via GSAP tween for smooth snapping
  const scrollObj = useRef({ x: 0 });
  const targetIdx = useRef(0);
  const animating = useRef(false);
  const rafRef = useRef(0);

  const [centerIdx, setCenterIdx] = useState(0);

  const piece = pieces[centerIdx];
  const dark = isDark(piece.cover.bg);
  const textColor = dark ? "rgba(255,252,245,0.92)" : "var(--fg)";
  const mutedColor = dark ? "rgba(255,252,245,0.40)" : "var(--fg-3)";
  const faintColor = dark ? "rgba(255,252,245,0.18)" : "var(--fg-4)";

  // ── Navigate to a specific item index ──
  const goTo = (idx: number) => {
    if (animating.current) return;
    animating.current = true;

    const wrapped = ((idx % N) + N) % N;
    targetIdx.current = wrapped;

    const targetScroll = wrapped * ITEM_SPACING;

    // Find shortest path (handle wrapping)
    let diff = targetScroll - scrollObj.current.x;
    if (diff > TRACK / 2) diff -= TRACK;
    if (diff < -TRACK / 2) diff += TRACK;

    gsap.to(scrollObj.current, {
      x: scrollObj.current.x + diff,
      duration: 0.7,
      ease: "power3.out",
      onUpdate: () => {
        scrollObj.current.x = mod(scrollObj.current.x, TRACK);
      },
      onComplete: () => {
        scrollObj.current.x = mod(targetScroll, TRACK);
        animating.current = false;
      },
    });
  };

  // ── Render loop — updates transforms every frame ──
  useEffect(() => {
    let vw = window.innerWidth;
    let vwHalf = vw / 2;

    const onResize = () => { vw = window.innerWidth; vwHalf = vw / 2; };
    window.addEventListener("resize", onResize);

    const loop = () => {
      const sx = scrollObj.current.x;

      let closestDist = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < N; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;

        const baseX = i * ITEM_SPACING;
        let screenX = baseX - sx;
        if (screenX > TRACK / 2) screenX -= TRACK;
        if (screenX < -TRACK / 2) screenX += TRACK;

        const norm = Math.max(-1, Math.min(1, screenX / (vwHalf * 1.0)));
        const absNorm = Math.abs(norm);
        const invNorm = 1 - absNorm;

        const z = invNorm * MAX_DEPTH;
        const rotY = -norm * MAX_ROTATION;
        const scale = MIN_SCALE + invNorm * SCALE_RANGE;
        const opacity = MIN_OPACITY + invNorm * OPACITY_RANGE;

        el.style.transform = `translate(-50%, -50%) translateX(${screenX}px) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(invNorm * 100));

        const dist = Math.abs(screenX);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      }

      if (closestIdx !== targetIdx.current && !animating.current) {
        // Only update during free state
      }
      setCenterIdx(closestIdx);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ── Input: wheel snaps one item at a time ──
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let wheelAccum = 0;
    const WHEEL_THRESHOLD = 50;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum += e.deltaY;
      if (Math.abs(wheelAccum) > WHEEL_THRESHOLD) {
        const dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        goTo(targetIdx.current + dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goTo(targetIdx.current + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(targetIdx.current - 1);
      }
    };

    // Touch/drag: snap on release
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) {
        goTo(targetIdx.current + (dx > 0 ? 1 : -1));
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // ── Progress bar update ──
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${((centerIdx + 1) / N) * 100}%`,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [centerIdx]);

  // ── Info crossfade ──
  useEffect(() => {
    if (!infoRef.current) return;
    const tl = gsap.timeline();
    tl.to(infoRef.current, { opacity: 0, y: 4, duration: 0.12, ease: "power2.in" });
    tl.to(infoRef.current, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" });
  }, [centerIdx]);

  // ── Entrance choreography ──
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      [navRef, footerRef].forEach(r => { if (r.current) r.current.style.opacity = "1"; });
      if (infoRef.current) infoRef.current.style.opacity = "1";
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Phase 1: Nav + footer
    tl.fromTo([navRef.current, footerRef.current],
      { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 }, 0.1);

    // Phase 2: Carousel items stagger from center
    const items = itemRefs.current.filter(Boolean);
    if (items.length) {
      tl.fromTo(items,
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          stagger: { each: 0.08, from: "center" },
          ease: "power3.out",
        },
        0.2
      );
    }

    // Phase 3: Info area
    tl.fromTo(infoRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      0.6
    );
  }, []);

  const href = piece.type === "project" ? `/work/${piece.slug}` : `/lab/${piece.slug}`;

  return (
    <PageTransition>
      <div style={{
        height: "100dvh",
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "48px 1fr auto auto",
        background: `radial-gradient(ellipse at center, ${piece.cover.bg} 0%, ${adjustBrightness(piece.cover.bg, -15)} 100%)`,
        transition: "background 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        position: "relative",
      }}>

        {/* ═══ NAV ═══ */}
        <header ref={navRef} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 var(--margin)", opacity: 0, position: "relative", zIndex: 20,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: textColor, transition: "color 500ms ease",
          }}>HKJ</span>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>Brand & Product Studio</span>
            <Link href="/about" style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, textDecoration: "none",
              transition: "color 200ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = textColor; }}
            onMouseLeave={e => { e.currentTarget.style.color = mutedColor; }}
            >About</Link>
          </div>
        </header>

        {/* ═══ 3D CAROUSEL — smaller items, more whitespace ═══ */}
        <div ref={stageRef} className="carousel-stage" style={{ cursor: "grab" }}>
          {pieces.map((p, i) => {
            const hasDarkBg = isDark(p.cover.bg);
            const coverMuted = hasDarkBg ? "rgba(255,252,245,0.25)" : "rgba(26,25,23,0.18)";

            return (
              <div
                key={p.slug}
                ref={el => { itemRefs.current[i] = el; }}
                className="carousel-item"
                style={{
                  width: "clamp(140px, 16vw, 240px)",
                  aspectRatio: "3/4",
                  opacity: 0,
                }}
              >
                <Link
                  href={p.type === "project" ? `/work/${p.slug}` : `/lab/${p.slug}`}
                  data-cursor-view
                  style={{
                    display: "block", width: "100%", height: "100%",
                    position: "relative", backgroundColor: p.cover.bg,
                    overflow: "hidden", textDecoration: "none",
                    transition: "box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {p.image && (
                    <Image src={p.image} alt={p.title} fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      style={{ objectFit: "cover" }}
                      priority={i < 3}
                    />
                  )}
                  <div aria-hidden="true" style={{
                    position: "absolute", inset: 0, opacity: 0.04,
                    filter: "url(#grain)", background: "var(--bg)",
                    mixBlendMode: "multiply", pointerEvents: "none", zIndex: 1,
                  }} />
                  <span style={{
                    position: "absolute", top: 8, left: 10, zIndex: 2,
                    fontFamily: "var(--font-mono)", fontSize: 9,
                    letterSpacing: "0.06em", color: coverMuted,
                  }}>{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ═══ DECORATED PROJECT INFO ═══ */}
        <div ref={infoRef} style={{
          padding: "0 var(--margin)",
          paddingTop: "clamp(16px, 3vh, 32px)",
          paddingBottom: "clamp(12px, 2vh, 24px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: 0,
          position: "relative",
          zIndex: 20,
        }}>
          {/* Title — large display serif */}
          <Link href={href} style={{
            textDecoration: "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          }}>
            {/* Project number + title */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "clamp(10px, 1.2vw, 14px)",
                letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums",
                color: faintColor, transition: "color 500ms ease",
              }}>
                {String(centerIdx + 1).padStart(2, "0")}
              </span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 56px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1.0,
                color: textColor,
                transition: "color 500ms ease",
                textAlign: "center",
              }}>
                {piece.title}
              </h2>
            </div>

            {/* Description — body text */}
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              lineHeight: 1.5,
              color: mutedColor,
              transition: "color 500ms ease",
              textAlign: "center",
              maxWidth: 400,
            }}>
              {piece.description}
            </p>

            {/* Meta row */}
            <div style={{
              display: "flex", gap: 16, alignItems: "center",
              marginTop: 4,
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: faintColor, transition: "color 500ms ease",
              }}>{piece.tags.slice(0, 2).join(" · ")}</span>
              <span style={{
                width: 3, height: 3, borderRadius: "50%",
                backgroundColor: faintColor,
                transition: "background-color 500ms ease",
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.08em",
                color: faintColor, transition: "color 500ms ease",
              }}>{piece.year}</span>
              <span style={{
                width: 3, height: 3, borderRadius: "50%",
                backgroundColor: faintColor,
                transition: "background-color 500ms ease",
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 10,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: textColor, transition: "color 500ms ease",
              }}>View →</span>
            </div>
          </Link>
        </div>

        {/* ═══ FOOTER + PROGRESS ═══ */}
        <footer ref={footerRef} style={{
          padding: "0 var(--margin)", paddingBottom: 14,
          opacity: 0, position: "relative", zIndex: 20,
        }}>
          <div style={{
            height: 1, marginBottom: 10,
            backgroundColor: dark ? "rgba(255,252,245,0.08)" : "rgba(26,25,23,0.05)",
            position: "relative", transition: "background-color 500ms ease",
          }}>
            <div ref={progressRef} style={{
              position: "absolute", top: 0, left: 0, height: "100%",
              width: `${((centerIdx + 1) / N) * 100}%`,
              backgroundColor: textColor,
              transition: "background-color 500ms ease",
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>Brand & Product Design</span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums",
              color: textColor, transition: "color 500ms ease",
            }}>
              {String(centerIdx + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: mutedColor, transition: "color 500ms ease",
            }}>© 2026 HKJ</span>
          </div>
        </footer>

        <div className="grain" />
        <CustomCursor />
      </div>
    </PageTransition>
  );
}
