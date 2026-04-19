"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";

const TRACK_POSITIONS: Record<string, { x: number; y: number }> = {
  "gyeol": { x: 22, y: 32 },
  "sift": { x: 68, y: 58 },
  "clouds-at-sea": { x: 64, y: 24 },
  "pane": { x: 18, y: 68 },
};

export default function Home() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [pinnedSlug, setPinnedSlug] = useState<string | null>(null);
  const activeSlug = pinnedSlug ?? hoveredSlug;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash.slice(1);
    if (h && PIECES.some((p) => p.slug === h)) {
      setPinnedSlug(h);
    }
  }, []);
  const active = PIECES.find((p) => p.slug === activeSlug) ?? PIECES[0];
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const samplerRef = useRef<HTMLCanvasElement | null>(null);
  const luxRef = useRef<HTMLSpanElement | null>(null);
  const rgbRef = useRef<HTMLSpanElement | null>(null);
  const chromaRef = useRef<HTMLSpanElement | null>(null);
  const wbRef = useRef<HTMLSpanElement | null>(null);
  const velRef = useRef<HTMLSpanElement | null>(null);
  const uptimeRef = useRef<HTMLSpanElement | null>(null);
  const sceneRgbRef = useRef<{ r: number; g: number; b: number }>({ r: 128, g: 128, b: 128 });

  const trackRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const swatchRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const trackStateRef = useRef<Map<string, { x: number; y: number; tx: number; ty: number; t: number }>>(new Map());
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const chromaEventRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<SVGPolylineElement | null>(null);
  const waveHistoryRef = useRef<number[]>([]);
  const activeSlugRef = useRef<string | null>(null);

  useEffect(() => {
    activeSlugRef.current = activeSlug;
  }, [activeSlug]);

  const handleHover = (slug: string | null) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (slug === null) {
      hoverTimeoutRef.current = setTimeout(() => setHoveredSlug(null), 40);
      return;
    }
    hoverTimeoutRef.current = setTimeout(() => setHoveredSlug(slug), 80);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pinnedSlug) {
      window.history.replaceState(null, "", `#${pinnedSlug}`);
    } else {
      window.history.replaceState(null, "", "#");
    }
  }, [pinnedSlug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const idx = PIECES.findIndex((p) => p.slug === activeSlug);
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "j" ||
        e.key === "J"
      ) {
        e.preventDefault();
        setPinnedSlug(PIECES[(idx + 1 + PIECES.length) % PIECES.length].slug);
      }
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "k" ||
        e.key === "K"
      ) {
        e.preventDefault();
        setPinnedSlug(PIECES[(idx - 1 + PIECES.length) % PIECES.length].slug);
      }
      if (e.key === "Enter" && activeSlug) {
        e.preventDefault();
        window.location.href = `/work/${activeSlug}`;
      }
      if (e.key === "Escape") {
        setPinnedSlug(null);
        setHoveredSlug(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSlug]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    samplerRef.current = canvas;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let raf = 0;
    const sample = () => {
      if (video.readyState >= 2) {
        try {
          ctx.drawImage(video, 0, 0, 32, 32);
          const data = ctx.getImageData(16, 16, 1, 1).data;
          const r = data[0], g = data[1], b = data[2];
          const lux = Math.round((r + g + b) / 3);
          const chroma = Math.max(r, g, b) - Math.min(r, g, b);
          const wb = r - b;
          sceneRgbRef.current = { r, g, b };
          if (luxRef.current) luxRef.current.textContent = String(lux).padStart(3, "0");
          if (rgbRef.current) rgbRef.current.textContent = `${String(r).padStart(3, "0")}.${String(g).padStart(3, "0")}.${String(b).padStart(3, "0")}`;
          if (chromaRef.current) chromaRef.current.textContent = String(chroma).padStart(3, "0");
          if (wbRef.current) wbRef.current.textContent = `${wb >= 0 ? "+" : ""}${wb}`;
          const slug = activeSlugRef.current;
          if (slug) {
            const activeSwatch = swatchRefs.current.get(slug);
            if (activeSwatch) {
              activeSwatch.style.background = `rgb(${r}, ${g}, ${b})`;
            }
          }
          waveHistoryRef.current.push(lux);
          if (waveHistoryRef.current.length > 120) waveHistoryRef.current.shift();
          if (waveRef.current) {
            const points = waveHistoryRef.current
              .map((v, i) => `${(i / 120) * 100},${100 - (v / 255) * 100}`)
              .join(" ");
            waveRef.current.setAttribute("points", points);
          }
        } catch {
          /* CORS fallback */
        }
      }
      raf = requestAnimationFrame(sample);
    };
    raf = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    let lastX = 0, lastY = 0, lastT = performance.now();
    let smoothVel = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dt = Math.max(1, now - lastT);
      const v = (Math.sqrt(dx * dx + dy * dy) / dt) * 1000;
      smoothVel = smoothVel * 0.85 + v * 0.15;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };
    const loop = () => {
      smoothVel *= 0.92;
      if (velRef.current) velRef.current.textContent = String(Math.round(smoothVel)).padStart(4, "0");
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const loop = () => {
      const t = (performance.now() - start) / 1000;
      if (uptimeRef.current) uptimeRef.current.textContent = t.toFixed(3).padStart(9, "0");
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    PIECES.forEach((p) => {
      const pos = TRACK_POSITIONS[p.slug];
      if (!pos) return;
      trackStateRef.current.set(p.slug, {
        x: pos.x,
        y: pos.y,
        tx: pos.x,
        ty: pos.y,
        t: Math.random() * 1000,
      });
    });
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = () => {
      trackStateRef.current.forEach((state, slug) => {
        const base = TRACK_POSITIONS[slug];
        if (!base) return;
        state.t += 0.016;
        const nx = Math.sin(state.t * 0.7 + base.x * 0.1) * 1.4;
        const ny = Math.cos(state.t * 0.5 + base.y * 0.1) * 0.9;
        state.tx = base.x + (reduced ? 0 : nx);
        state.ty = base.y + (reduced ? 0 : ny);
        state.x += (state.tx - state.x) * 0.08;
        state.y += (state.ty - state.y) * 0.08;
        const el = trackRefs.current.get(slug);
        if (el) {
          el.style.left = `${state.x}%`;
          el.style.top = `${state.y}%`;
        }
      });
      if (spotlightRef.current) {
        const slug = activeSlugRef.current;
        if (slug) {
          const state = trackStateRef.current.get(slug);
          if (state) {
            spotlightRef.current.style.setProperty("--sx", `${state.x}%`);
            spotlightRef.current.style.setProperty("--sy", `${state.y}%`);
            spotlightRef.current.style.opacity = "1";
          }
        } else {
          spotlightRef.current.style.opacity = "0";
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!activeSlug) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = chromaEventRef.current;
    if (!el) return;
    el.style.transform = "translateX(-100%)";
    el.style.opacity = "1";
    el.animate(
      [
        { transform: "translateX(-100%)", opacity: 1 },
        { transform: "translateX(0%)", opacity: 1, offset: 0.5 },
        { transform: "translateX(100%)", opacity: 0 },
      ],
      { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }, [activeSlug]);

  return (
    <main
      id="main"
      className="viewfinder"
      data-active={activeSlug ? "true" : "false"}
    >
      <div className="scene">
        <video
          ref={videoRef}
          src="/assets/cloudsatsea.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        />
        <div className="scene__spotlight" ref={spotlightRef} aria-hidden />
        <div className="scene__chroma" ref={chromaEventRef} aria-hidden />
      </div>

      <div className="track-layer" aria-hidden>
        {PIECES.map((p) => {
          const pos = TRACK_POSITIONS[p.slug] ?? { x: 50, y: 50 };
          const isActive = activeSlug === p.slug;
          const isGhost = activeSlug && activeSlug !== p.slug;
          return (
            <div
              key={p.slug}
              ref={(el) => {
                if (el) trackRefs.current.set(p.slug, el);
              }}
              className={`track-box ${isActive ? "track-box--active" : ""} ${isGhost ? "track-box--ghost" : ""}`}
              style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
              aria-hidden
            >
              <span className="track-box__corner track-box__corner--tl" />
              <span className="track-box__corner track-box__corner--tr" />
              <span className="track-box__corner track-box__corner--bl" />
              <span className="track-box__corner track-box__corner--br" />
              <span
                className="track-box__swatch"
                ref={(el) => {
                  if (el) swatchRefs.current.set(p.slug, el);
                }}
              />
              <div className="track-box__coords">
                X {(pos.x / 100).toFixed(3)}  Y {(pos.y / 100).toFixed(3)}
              </div>
              <div className="track-box__label">
                <span className="track-box__num">[{p.number}]</span>
                <span>{p.title.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="top-chrome" aria-hidden={false}>
        <div className="top-chrome__row top-chrome__row--brand">
          <Link className="top-chrome__brand" href="/">
            <span className="top-chrome__brand-mark" />
            HYEONJOON
          </Link>
          <nav className="top-chrome__nav">
            <Link href="/about">ABOUT</Link>
            <Link href="/shelf">SHELF</Link>
            <a href="mailto:hyeonjunjun07@gmail.com">CONTACT</a>
          </nav>
        </div>
        <div className="top-chrome__row top-chrome__row--telem">
          <div className="top-chrome__stat">
            <span className="top-chrome__stat-label">LUX</span>
            <span className="top-chrome__stat-value" ref={luxRef}>000</span>
          </div>
          <div className="top-chrome__stat">
            <span className="top-chrome__stat-label">RGB</span>
            <span className="top-chrome__stat-value" ref={rgbRef}>000.000.000</span>
          </div>
          <div className="top-chrome__stat">
            <span className="top-chrome__stat-label">CHROMA</span>
            <span className="top-chrome__stat-value" ref={chromaRef}>000</span>
          </div>
          <div className="top-chrome__stat">
            <span className="top-chrome__stat-label">WB</span>
            <span className="top-chrome__stat-value" ref={wbRef}>+00</span>
          </div>
          <div className="top-chrome__stat">
            <span className="top-chrome__stat-label">VEL</span>
            <span className="top-chrome__stat-value" ref={velRef}>0000</span>
          </div>
          <div className="top-chrome__stat">
            <span className="top-chrome__stat-label">t</span>
            <span className="top-chrome__stat-value" ref={uptimeRef}>00000.000</span>
          </div>
        </div>
      </div>

      <div className="scene__wave" aria-hidden>
        <div className="scene__wave-label">
          <span className="scene__wave-label-text">LUX · 10s</span>
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="scene__wave-svg">
          <polyline
            ref={waveRef}
            points=""
            fill="none"
            stroke="rgba(91,137,181,0.7)"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="archive">
        <div className="archive__header">
          <span className="archive__indicator" />
          ARCHIVE · {String(PIECES.length).padStart(2, "0")} ENTRIES
        </div>
        <div className="archive__list">
          {PIECES.map((p, i) => {
            const isActive = activeSlug === p.slug;
            return (
              <button
                key={p.slug}
                className={`archive-item ${isActive ? "archive-item--active" : ""}`}
                onMouseEnter={() => handleHover(p.slug)}
                onMouseLeave={() => handleHover(null)}
                onClick={() =>
                  setPinnedSlug(pinnedSlug === p.slug ? null : p.slug)
                }
                data-reticle-lock
                data-reticle-label={`${p.number} ${p.title}`.toUpperCase()}
              >
                <div className="archive-item__thumb">
                  <div className="archive-item__thumb-corners" aria-hidden>
                    <span /><span /><span /><span />
                  </div>
                  {p.video ? (
                    <video src={p.video} autoPlay muted loop playsInline />
                  ) : p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="140px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="archive-item__thumb-placeholder">N/A</div>
                  )}
                </div>
                <div className="archive-item__label">
                  <span className="archive-item__num">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="archive-item__title">
                    {p.title.toUpperCase()}
                  </span>
                </div>
                <div className="archive-item__sector">
                  {p.sector.toUpperCase()}
                </div>
              </button>
            );
          })}
        </div>
        <div className="archive__hint">
          <span className="kbd">←</span>
          <span className="kbd">→</span> CYCLE ·{" "}
          <span className="kbd">⏎</span> OPEN ·{" "}
          <span className="kbd">ESC</span> CLOSE
        </div>
      </div>

      <aside
        className="detail-panel"
        data-state={activeSlug ? "in" : "out"}
        aria-hidden={!activeSlug}
        onMouseEnter={() => {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        }}
      >
        <div className="detail-panel__corners" aria-hidden>
          <span>┌</span>
          <span>┐</span>
          <span>└</span>
          <span>┘</span>
        </div>
        <div className="detail-panel__media">
          {active.video ? (
            <video
              src={active.video}
              autoPlay
              muted
              loop
              playsInline
              key={active.slug}
            />
          ) : active.image ? (
            <Image
              src={active.image}
              alt={active.title}
              fill
              priority
              sizes="400px"
              style={{ objectFit: "cover" }}
              key={active.slug}
            />
          ) : (
            <div className="detail-panel__placeholder">IN PROGRESS</div>
          )}
        </div>
        <div className="detail-panel__body">
          <div className="detail-panel__class">
            <span className="detail-panel__dot" />
            {active.sector.toUpperCase()} · {active.year}
          </div>
          <h2 className="detail-panel__title">{active.title}</h2>
          <p className="detail-panel__desc">{active.description}</p>
          <div className="detail-panel__stats">
            <div>
              <span>STATUS</span>
              <span>{active.status === "wip" ? "BUILDING" : "LIVE"}</span>
            </div>
            <div>
              <span>INDEX</span>
              <span>#{active.number}</span>
            </div>
          </div>
          <Link
            href={`/work/${active.slug}`}
            className="detail-panel__enter"
            data-reticle-lock
            data-reticle-label={`ENTER ${active.title}`.toUpperCase()}
          >
            <span>ENTER</span>
            <span>→</span>
          </Link>
        </div>
      </aside>

      <style>{`
        .viewfinder {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #1C1C1A;
        }

        .scene {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .scene video, .scene img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.92) contrast(1.02);
        }

        .scene__spotlight {
          --sx: 50%;
          --sy: 50%;
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          opacity: 0;
          transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1);
          background: radial-gradient(
            circle at var(--sx) var(--sy),
            transparent 0%,
            transparent 18%,
            rgba(28, 28, 26, 0.3) 40%,
            rgba(28, 28, 26, 0.6) 100%
          );
        }

        .scene__chroma {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(91,137,181,0.35) 48%,
            rgba(255,80,80,0.25) 50%,
            rgba(91,137,181,0.35) 52%,
            transparent 100%);
          transform: translateX(-100%);
          opacity: 0;
        }

        .track-layer {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }
        .track-box {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 90px;
          pointer-events: none;
          transition: opacity 240ms cubic-bezier(0.16, 1, 0.3, 1);
          color: rgba(255,255,255,0.85);
          font-family: var(--font-mono);
        }
        .track-box--ghost { opacity: 0.18; }
        .track-box--ghost .track-box__coords,
        .track-box--ghost .track-box__label {
          opacity: 0.7;
        }
        .track-box__corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border: 1px solid rgba(255,255,255,0.85);
          transition: border-color 240ms cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 240ms cubic-bezier(0.16, 1, 0.3, 1),
                      width 240ms cubic-bezier(0.16, 1, 0.3, 1),
                      height 240ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .track-box__corner--tl { top: 0; left: 0; border-right: none; border-bottom: none; }
        .track-box__corner--tr { top: 0; right: 0; border-left: none; border-bottom: none; }
        .track-box__corner--bl { bottom: 0; left: 0; border-right: none; border-top: none; }
        .track-box__corner--br { bottom: 0; right: 0; border-left: none; border-top: none; }
        .track-box--active .track-box__corner {
          width: 18px;
          height: 18px;
          border-width: 2px;
          border-color: var(--accent);
          box-shadow: 0 0 12px rgba(91,137,181,0.8);
        }
        .track-box--active {
          animation: track-breathe 2.2s ease-in-out infinite;
        }
        @keyframes track-breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .track-box__swatch {
          position: absolute;
          top: -14px;
          right: -14px;
          width: 10px;
          height: 10px;
          border: 1px solid rgba(255,255,255,0.9);
          background: #888;
          opacity: 0;
          transition: opacity 240ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .track-box--active .track-box__swatch { opacity: 1; }
        .track-box__label {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .track-box--active .track-box__label {
          color: rgba(255,255,255,1);
          text-shadow: 0 0 12px rgba(91,137,181,0.6), 0 1px 2px rgba(0,0,0,0.6);
        }
        .track-box__num { color: rgba(255,255,255,0.5); }
        .track-box__coords {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.5);
          white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .top-chrome {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 20px clamp(24px, 4vw, 64px);
          z-index: 20;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .top-chrome__row {
          display: grid;
          align-items: center;
        }
        .top-chrome__row--brand {
          grid-template-columns: 1fr auto;
          pointer-events: auto;
        }
        .top-chrome__row--telem {
          grid-template-columns: repeat(6, auto) 1fr;
          gap: 32px;
          justify-content: start;
        }
        .top-chrome__brand {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,1);
          letter-spacing: 0.22em;
          text-decoration: none;
          font-weight: 400;
          font-size: 11px;
        }
        .top-chrome__brand-mark {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px rgba(91,137,181,0.7);
        }
        .top-chrome__nav {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 28px;
        }
        .top-chrome__nav a {
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 160ms cubic-bezier(0.16, 1, 0.3, 1);
          letter-spacing: 0.18em;
        }
        .top-chrome__nav a:hover {
          color: rgba(255,255,255,1);
        }

        .top-chrome__stat {
          display: inline-flex;
          flex-direction: column;
          gap: 2px;
          font-family: var(--font-stack-mono);
        }
        .top-chrome__stat-label {
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .top-chrome__stat-value {
          font-size: 13px;
          letter-spacing: 0.06em;
          color: var(--accent);
          font-variant-numeric: tabular-nums;
          text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        }

        .scene__wave {
          position: absolute;
          left: clamp(24px, 4vw, 64px);
          right: clamp(24px, 4vw, 64px);
          bottom: 220px;
          height: 32px;
          z-index: 18;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.6;
        }
        .scene__wave-label-text {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          white-space: nowrap;
        }
        .scene__wave-svg {
          flex: 1;
          height: 100%;
        }

        .archive {
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          padding: 32px clamp(24px, 4vw, 64px) 72px;
          background: linear-gradient(to top, rgba(28,28,26,0.6) 0%, rgba(28,28,26,0) 100%);
          z-index: 20;
          color: rgba(255,255,255,0.8);
        }
        .archive__header {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .archive__indicator {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: arch-pulse 2.4s ease-in-out infinite;
          box-shadow: 0 0 8px var(--accent);
        }
        @keyframes arch-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .archive__list {
          display: flex;
          gap: 20px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .archive__list::-webkit-scrollbar { display: none; }
        .archive-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-mono);
          transition: color 180ms cubic-bezier(0.16, 1, 0.3, 1);
          width: 140px;
          flex-shrink: 0;
          text-align: left;
        }
        .archive-item:hover,
        .archive-item--active { color: rgba(255,255,255,1); }
        .archive-item:focus-visible { outline: 1px solid var(--accent); outline-offset: 4px; }

        .archive-item__thumb {
          position: relative;
          width: 140px;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          filter: grayscale(0.7) brightness(0.55) contrast(0.9);
          transition: filter 260ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 260ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .archive-item:hover .archive-item__thumb {
          filter: grayscale(0.3) brightness(0.85);
          transform: translateY(-2px);
        }
        .archive-item--active .archive-item__thumb {
          filter: grayscale(0) brightness(1) contrast(1);
          border-color: var(--accent);
          box-shadow:
            0 0 0 1px rgba(91,137,181,0.4),
            0 0 20px rgba(91,137,181,0.35),
            0 4px 16px -4px rgba(0,0,0,0.4);
          transform: translateY(-2px);
        }
        .archive-item__thumb video,
        .archive-item__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .archive-item__thumb-placeholder {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.5);
        }
        .archive-item__thumb-corners {
          position: absolute; inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .archive-item__thumb-corners span {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 1px solid rgba(255,255,255,0.9);
          opacity: 0;
          transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .archive-item--active .archive-item__thumb-corners span {
          opacity: 1;
          border-color: var(--accent);
          box-shadow: 0 0 6px rgba(91,137,181,0.6);
        }
        .archive-item__thumb-corners span:nth-child(1) { top: 4px; left: 4px; border-right: none; border-bottom: none; }
        .archive-item__thumb-corners span:nth-child(2) { top: 4px; right: 4px; border-left: none; border-bottom: none; }
        .archive-item__thumb-corners span:nth-child(3) { bottom: 4px; left: 4px; border-right: none; border-top: none; }
        .archive-item__thumb-corners span:nth-child(4) { bottom: 4px; right: 4px; border-left: none; border-top: none; }

        .archive-item__label {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .archive-item__num {
          color: rgba(255,255,255,0.5);
          font-variant-numeric: tabular-nums;
        }
        .archive-item__title {
          color: inherit;
          font-family: var(--font-mono);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 400;
        }
        .archive-item__sector {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }
        .archive__hint {
          margin-top: 16px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .kbd {
          display: inline-block;
          min-width: 20px;
          padding: 2px 6px;
          margin: 0 2px;
          border: 1px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.85);
          font-family: var(--font-mono);
          font-size: 10px;
          border-radius: 3px;
          text-align: center;
          letter-spacing: 0;
        }

        .detail-panel {
          position: absolute;
          top: 120px;
          right: 24px;
          bottom: 180px;
          width: 340px;
          z-index: 30;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: white;
          background: linear-gradient(180deg, rgba(28,28,26,0.78), rgba(28,28,26,0.62));
          backdrop-filter: blur(24px) saturate(1.1);
          -webkit-backdrop-filter: blur(24px) saturate(1.1);
          border: 1px solid rgba(255,255,255,0.1);
          border-left: 2px solid var(--accent);
          box-shadow:
            inset 0 0 0 1px rgba(91,137,181,0.1),
            -8px 0 24px -16px rgba(91,137,181,0.5),
            0 24px 60px -24px rgba(0,0,0,0.4);
          transform: translateX(calc(100% + 48px));
          opacity: 0;
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 200ms cubic-bezier(0.5, 0, 0.75, 0);
          pointer-events: none;
        }
        .detail-panel[data-state="in"] {
          transform: translateX(0);
          opacity: 1;
          pointer-events: auto;
          transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
                      opacity 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .detail-panel__corners {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }
        .detail-panel__corners span {
          position: absolute;
          font-family: var(--font-stack-mono);
          font-size: 16px;
          line-height: 1;
          color: var(--accent);
          opacity: 0.6;
        }
        .detail-panel__corners span:nth-child(1) { top: 6px; left: 8px; }
        .detail-panel__corners span:nth-child(2) { top: 6px; right: 8px; }
        .detail-panel__corners span:nth-child(3) { bottom: 6px; left: 8px; }
        .detail-panel__corners span:nth-child(4) { bottom: 6px; right: 8px; }
        .detail-panel__media {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .detail-panel__media img,
        .detail-panel__media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-panel__placeholder {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.5);
        }
        .detail-panel__body {
          flex: 1;
          padding: 24px 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 0;
          overflow-y: auto;
        }
        .detail-panel__class {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }
        .detail-panel__dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
        }
        .detail-panel__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.05;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: white;
          margin: 4px 0 0;
          word-spacing: -0.1em;
        }
        .detail-panel__desc {
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.6;
          color: rgba(255,255,255,0.88);
          margin: 0;
          max-width: 38ch;
        }
        .detail-panel__stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 16px;
          padding: 18px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin: 4px 0 8px;
        }
        .detail-panel__stats > div {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .detail-panel__stats span:first-child {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
        }
        .detail-panel__stats span:last-child {
          font-family: var(--font-stack-mono);
          font-size: 18px;
          line-height: 1;
          letter-spacing: 0.06em;
          color: var(--accent);
          text-shadow: 0 0 10px rgba(91,137,181,0.3);
        }
        .detail-panel__enter {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 11px 20px;
          align-self: flex-start;
          width: auto;
          border: 1px solid var(--accent);
          background: rgba(91,137,181,0.15);
          color: var(--accent);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 2px;
          transition: background 200ms cubic-bezier(0.16, 1, 0.3, 1),
                      gap 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .detail-panel__enter:hover {
          background: rgba(91,137,181,0.28);
          gap: 16px;
        }

        @media (max-width: 767px) {
          .track-layer { display: none; }
          .top-chrome__row--telem { display: none; }
          .scene__wave { display: none; }
          .top-chrome__nav {
            gap: 14px;
          }
          .top-chrome__nav a {
            letter-spacing: 0.12em;
          }
          .archive__list {
            gap: 16px;
            overflow-x: auto;
            flex-wrap: nowrap;
            scrollbar-width: none;
          }
          .archive__list::-webkit-scrollbar { display: none; }
          .archive-item {
            flex-shrink: 0;
          }
          .detail-panel {
            top: auto;
            bottom: 200px;
            right: 12px;
            left: 12px;
            width: auto;
            max-height: 50vh;
          }
          .archive { padding-bottom: 56px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .detail-panel {
            transition: opacity 160ms ease;
            transform: none;
          }
          .detail-panel[data-state="out"] { opacity: 0; }
          .scene video, .scene img { transition: none; }
          .archive__indicator { animation: none; }
          .track-box { transition: none; }
          .track-box--active { animation: none; }
          .archive-item:hover .archive-item__thumb,
          .archive-item--active .archive-item__thumb { transform: none; }
          .detail-panel__enter, .detail-panel__enter:hover { transition: none; }
        }
      `}</style>
    </main>
  );
}
