"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

type SiteRow = { idx: string; path: string; title: string; desc: string };
type TypeRow = { name: string; specimen: string; family: string; italic?: boolean };
type StackRow = { name: string; version: string };

const SITEMAP: SiteRow[] = [
  { idx: "01", path: "/", title: "HOME", desc: "4 WORKS" },
  { idx: "02", path: "/about", title: "ABOUT", desc: "THE PRACTICE" },
  { idx: "03", path: "/work/gyeol", title: "GYEOL: 결", desc: "MATERIAL SCIENCE" },
  { idx: "04", path: "/work/sift", title: "SIFT", desc: "MOBILE / AI" },
  { idx: "05", path: "/work/pane", title: "PANE", desc: "AMBIENT COMPUTING" },
  { idx: "06", path: "/work/clouds-at-sea", title: "CLOUDS AT SEA", desc: "WEBGL / GENERATIVE" },
  { idx: "07", path: "/shelf", title: "SHELF", desc: "OBJECTS · FIELD NOTES" },
  { idx: "08", path: "/writing", title: "WRITING", desc: "READING-FIRST ESSAYS" },
];

const TYPES: TypeRow[] = [
  { name: "Fragment Mono", specimen: "ABC 012 abc 345", family: "var(--font-stack-mono)" },
  { name: "Newsreader", specimen: "A quiet italic specimen", family: "var(--font-stack-serif)", italic: true },
  { name: "General Sans", specimen: "The studio, in regular", family: "var(--font-stack-sans)" },
];

const STACK: StackRow[] = [
  { name: "next", version: "16.1.6" },
  { name: "react", version: "19.2.3" },
  { name: "gsap", version: "3.14.2" },
  { name: "lenis", version: "1.3.17" },
  { name: "framer-motion", version: "12.38.0" },
  { name: "tailwind", version: "4.1.18" },
];

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function pad(n: number, len = 2) {
  return String(Math.max(0, Math.floor(n))).padStart(len, "0");
}

function formatUptime(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatClock(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function moonPhase(d: Date) {
  const lp = 2551443; // lunar period in seconds
  const now = d.getTime() / 1000;
  const newMoon = new Date(1970, 0, 7, 20, 35, 0).getTime() / 1000;
  const phase = ((now - newMoon) % lp) / lp; // 0..1
  const phases = [
    { range: 0.03, glyph: "●", name: "NEW" },
    { range: 0.22, glyph: "◐", name: "WAXING CRESCENT" },
    { range: 0.28, glyph: "◓", name: "FIRST QUARTER" },
    { range: 0.47, glyph: "◑", name: "WAXING GIBBOUS" },
    { range: 0.53, glyph: "○", name: "FULL" },
    { range: 0.72, glyph: "◒", name: "WANING GIBBOUS" },
    { range: 0.78, glyph: "◐", name: "LAST QUARTER" },
    { range: 0.97, glyph: "◓", name: "WANING CRESCENT" },
    { range: 1.01, glyph: "●", name: "NEW" },
  ];
  for (const p of phases) {
    if (phase < p.range) return { glyph: p.glyph, name: p.name, pct: (phase * 100).toFixed(1) };
  }
  return { glyph: phases[0].glyph, name: phases[0].name, pct: (phase * 100).toFixed(1) };
}

function daylightInfo(d: Date) {
  const sunriseMin = 6 * 60 + 30; // 06:30
  const sunsetMin = 19 * 60 + 30; // 19:30
  const nowMin = d.getHours() * 60 + d.getMinutes();
  const isDay = nowMin >= sunriseMin && nowMin < sunsetMin;
  let delta: number;
  let target: "sunset" | "sunrise";
  if (isDay) {
    delta = sunsetMin - nowMin;
    target = "sunset";
  } else {
    const nextSunrise = nowMin < sunriseMin ? sunriseMin : sunriseMin + 24 * 60;
    delta = nextSunrise - nowMin;
    target = "sunrise";
  }
  const h = Math.floor(delta / 60);
  const m = delta % 60;
  const state = isDay ? "DAYTIME" : "NIGHT";
  return `${state} · ${h}h ${m}m until ${target}`;
}

export default function ColophonOverlay() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [clock, setClock] = useState("--:--:--");
  const [uptime, setUptime] = useState("00:00:00");
  const [scrollPos, setScrollPos] = useState("0.00");
  const [cursor, setCursor] = useState("0000,0000");
  const [viewport, setViewport] = useState("0000x0000");
  const [reducedMotion, setReducedMotion] = useState("false");
  const [pointer, setPointer] = useState("fine");
  const [moon, setMoon] = useState<{ glyph: string; name: string; pct: string }>({
    glyph: "●",
    name: "NEW",
    pct: "0.0",
  });
  const [daylight, setDaylight] = useState("—");

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<number>(Date.now());
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    mountRef.current = Date.now();
  }, []);

  const prefersReduced = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const getButtonCenter = useCallback(() => {
    const el = buttonRef.current;
    if (!el) {
      return { x: window.innerWidth - 40, y: window.innerHeight - 52 };
    }
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, []);

  const animateOpen = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const { x, y } = getButtonCenter();
    overlay.style.pointerEvents = "auto";
    if (prefersReduced()) {
      gsap.fromTo(
        overlay,
        { opacity: 0, clipPath: "none" },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      return;
    }
    gsap.fromTo(
      overlay,
      { clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 },
      {
        clipPath: `circle(150vmax at ${x}px ${y}px)`,
        duration: 0.7,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      }
    );
  }, [getButtonCenter, prefersReduced]);

  const animateClose = useCallback(
    (done: () => void) => {
      const overlay = overlayRef.current;
      if (!overlay) {
        done();
        return;
      }
      const { x, y } = getButtonCenter();
      if (prefersReduced()) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            overlay.style.pointerEvents = "none";
            done();
          },
        });
        return;
      }
      gsap.to(overlay, {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          overlay.style.pointerEvents = "none";
          done();
        },
      });
    },
    [getButtonCenter, prefersReduced]
  );

  const openOverlay = useCallback(() => {
    if (open || closingRef.current) return;
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, [open]);

  const closeOverlay = useCallback(() => {
    if (!open || closingRef.current) return;
    closingRef.current = true;
    animateClose(() => {
      closingRef.current = false;
      setOpen(false);
    });
  }, [open, animateClose]);

  useLayoutEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    animateOpen();
    const t = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    }, 50);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
      const btn = buttonRef.current;
      if (btn && prevFocusRef.current !== btn) {
        btn.focus();
      }
    };
  }, [open, animateOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        closeOverlay();
        return;
      }
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
        e.preventDefault();
        if (open) closeOverlay();
        else openOverlay();
      }
      if (e.key === "Tab" && open && panelRef.current) {
        const nodes = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((n) => !n.hasAttribute("disabled"));
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOverlay, openOverlay]);

  useEffect(() => {
    if (!mounted) return;
    const tick = () => {
      const now = new Date();
      setClock(formatClock(now));
      setUptime(formatUptime(Date.now() - mountRef.current));
      if (typeof window !== "undefined") {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setScrollPos(Math.max(0, Math.min(1, p)).toFixed(2));
        setViewport(`${window.innerWidth}x${window.innerHeight}`);
        setReducedMotion(
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "true" : "false"
        );
        setPointer(window.matchMedia("(pointer: coarse)").matches ? "coarse" : "fine");
      }
    };
    const slowTick = () => {
      const now = new Date();
      setMoon(moonPhase(now));
      setDaylight(daylightInfo(now));
    };
    tick();
    slowTick();
    const id = window.setInterval(tick, 500);
    const slowId = window.setInterval(slowTick, 60000);
    return () => {
      window.clearInterval(id);
      window.clearInterval(slowId);
    };
  }, [mounted]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursor(`${pad(e.clientX, 4)},${pad(e.clientY, 4)}`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeOverlay();
  };

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (pathname === href) {
      closeOverlay();
      return;
    }
    closingRef.current = true;
    animateClose(() => {
      closingRef.current = false;
      setOpen(false);
      router.push(href);
    });
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="co-btn"
        aria-label="Open colophon"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => (open ? closeOverlay() : openOverlay())}
      >
        ?
      </button>

      <div
        ref={overlayRef}
        className="co-overlay"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label="Colophon"
        onMouseDown={handleBackdrop}
        style={{
          pointerEvents: open ? "auto" : "none",
          clipPath: "circle(0px at 100% 100%)",
          opacity: open ? 1 : 1,
        }}
      >
        <div className="co-dots" aria-hidden="true" />
        <div className="co-scanline" aria-hidden="true" />
        <div ref={panelRef} className="co-panel">
          <span className="co-slate-corner co-slate-corner--tl" aria-hidden="true">┌</span>
          <span className="co-slate-corner co-slate-corner--tr" aria-hidden="true">┐</span>
          <span className="co-slate-corner co-slate-corner--bl" aria-hidden="true">└</span>
          <span className="co-slate-corner co-slate-corner--br" aria-hidden="true">┘</span>
          <header className="co-header">
            <span className="co-slate-indicator" aria-hidden="true" />
            <span className="co-h-left">COLOPHON / HYEONJOON &middot; OPERATIONS MANUAL</span>
            <span className="co-h-right">
              PATH {pathname || "/"} &middot; {clock} EST
            </span>
          </header>

          <section className="co-grid">
            <div className="co-block co-block-sitemap">
              <div className="co-label">&#9656; SITEMAP</div>
              <div className="co-sitemap">
                {SITEMAP.map((r) => (
                  <Link
                    key={r.path}
                    href={r.path}
                    className="co-row"
                    onClick={(e) => handleNav(e, r.path)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px minmax(140px, 1.2fr) minmax(120px, 1.3fr) minmax(100px, 1fr)",
                      alignItems: "baseline",
                      gap: 24,
                      padding: "12px 10px",
                      fontFamily: "var(--font-stack-mono)",
                      fontSize: 12,
                      color: "var(--ink)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--ink-ghost)",
                      transition: "background 160ms var(--ease)",
                    }}
                  >
                    <span style={{ color: "var(--ink-faint)", minWidth: 0 }}>[ {r.idx} ]</span>
                    <span style={{ color: "var(--ink)", minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.path}</span>
                    <span style={{ color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</span>
                    <span style={{ color: "var(--ink-muted)", textAlign: "right", minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="co-block co-block-types">
              <div className="co-label">&#9656; TYPEFACES</div>
              <div className="co-types">
                {TYPES.map((t, i) => (
                  <div key={t.name} className={`co-type${i < TYPES.length - 1 ? " co-type-div" : ""}`}>
                    <div className="co-type-name">{t.name}</div>
                    <div
                      className="co-type-specimen"
                      style={{
                        fontFamily: t.family,
                        fontStyle: t.italic ? "italic" : "normal",
                      }}
                    >
                      {t.specimen}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="co-block co-block-stack">
              <div className="co-label">&#9656; STACK</div>
              <div className="co-stack">
                {STACK.map((s) => (
                  <div key={s.name} className="co-stack-row">
                    <span className="co-stack-name">{s.name}</span>
                    <span className="co-stack-ver">{s.version}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="co-block co-block-tele">
              <div className="co-label">&#9656; TELEMETRY</div>
              <div className="co-tele">
                <div className="co-tele-row"><span>SESSION UPTIME</span><span>{uptime}</span></div>
                <div className="co-tele-row"><span>SCROLL POSITION</span><span>{scrollPos} / 1.00</span></div>
                <div className="co-tele-row"><span>CURSOR POS</span><span>{cursor}</span></div>
                <div className="co-tele-row"><span>VIEWPORT</span><span>{viewport}</span></div>
                <div className="co-tele-row"><span>REDUCED MOTION</span><span>{reducedMotion}</span></div>
                <div className="co-tele-row"><span>POINTER</span><span>{pointer}</span></div>
                <div className="co-tele-row">
                  <span>MOON PHASE</span>
                  <span>
                    <span style={{ color: "var(--accent)" }}>{moon.glyph}</span>
                    <span style={{ color: "var(--ink-muted)" }}> {moon.name} · {moon.pct}%</span>
                  </span>
                </div>
                <div className="co-tele-row"><span>DAYLIGHT</span><span>{daylight}</span></div>
              </div>
            </div>

            <div className="co-block co-block-foot">
              <span className="co-contact">
                CONTACT{" "}
                <a href="mailto:hyeonjunjun07@gmail.com" className="co-mail">
                  hyeonjunjun07@gmail.com
                </a>
              </span>
              <span className="co-hint">
                <span className="co-key">ESC</span>
                <span className="co-hint-sep">TO CLOSE</span>
                &middot;{" "}
                <span className="co-key">?</span>
                <span className="co-hint-sep">TO TOGGLE</span>
              </span>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .co-btn {
          position: fixed;
          right: 20px;
          bottom: 52px;
          z-index: 80;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(28, 28, 26, 0.55);
          backdrop-filter: blur(8px);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(91, 137, 181, 0.4);
          font-family: var(--font-stack-mono);
          font-size: 18px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 200ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 200ms cubic-bezier(0.16, 1, 0.3, 1);
          padding: 0;
          user-select: none;
        }
        .co-btn:hover {
          background: rgba(91, 137, 181, 0.35);
          border-color: var(--accent);
          color: white;
          transform: scale(1.06);
        }
        .co-btn:focus-visible {
          outline: 1px solid var(--accent);
          outline-offset: 3px;
        }

        .co-overlay {
          position: fixed;
          inset: 0;
          z-index: 85;
          background: #F2F0EA;
          will-change: clip-path, opacity;
          overflow: auto;
        }
        .co-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle,
            rgba(28, 28, 26, 0.12) 1px,
            transparent 1.5px
          );
          background-size: 10px 10px;
          pointer-events: none;
        }
        .co-scanline {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            transparent 0,
            transparent 3px,
            rgba(28, 28, 26, 0.015) 3px,
            rgba(28, 28, 26, 0.015) 4px
          );
          pointer-events: none;
          mix-blend-mode: multiply;
        }
        .co-panel {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(48px, 8vw, 96px);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 40px;
          background:
            linear-gradient(
              180deg,
              rgba(91, 137, 181, 0.04) 0%,
              transparent 30%,
              transparent 70%,
              rgba(91, 137, 181, 0.04) 100%
            );
          box-shadow:
            inset 0 0 0 1px rgba(28, 28, 26, 0.06),
            inset 0 2px 8px rgba(28, 28, 26, 0.03),
            0 0 40px rgba(91, 137, 181, 0.05);
        }

        .co-slate-corner {
          position: absolute;
          font-family: var(--font-stack-mono);
          font-size: 18px;
          color: var(--ink);
          opacity: 0.5;
          pointer-events: none;
          user-select: none;
          line-height: 1;
        }
        .co-slate-corner--tl { top: 24px; left: 24px; }
        .co-slate-corner--tr { top: 24px; right: 24px; }
        .co-slate-corner--bl { bottom: 24px; left: 24px; }
        .co-slate-corner--br { bottom: 24px; right: 24px; }

        .co-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          margin-bottom: 4px;
          border-bottom: 1px solid var(--ink-ghost);
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          gap: 16px;
          position: relative;
        }
        .co-header::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 1px;
          background: var(--ink-ghost);
          opacity: 0.4;
        }
        .co-slate-indicator {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px rgba(91, 137, 181, 0.6);
          margin-right: 10px;
          flex-shrink: 0;
          animation: co-slate-pulse 2.4s ease-in-out infinite;
        }
        @keyframes co-slate-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        .co-h-left { color: var(--ink); }
        .co-h-right { color: var(--ink-muted); text-align: right; }

        .co-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 40px 32px;
        }
        .co-block-sitemap { grid-column: 1 / span 7; }
        .co-block-types   { grid-column: 8 / span 5; }
        .co-block-stack   { grid-column: 1 / span 5; margin-top: 56px; }
        .co-block-tele    { grid-column: 6 / span 7; margin-top: 56px; }
        .co-block-foot {
          grid-column: 1 / span 12;
          margin-top: 72px;
          margin-bottom: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid var(--ink-ghost);
        }

        .co-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 18px;
        }

        .co-sitemap { display: flex; flex-direction: column; }
        .co-row {
          display: grid !important;
          grid-template-columns: 56px minmax(140px, 1.2fr) minmax(120px, 1.3fr) minmax(100px, 1fr);
          align-items: baseline;
          gap: 24px;
          padding: 12px 10px;
          font-family: var(--font-stack-mono);
          font-size: 12px;
          color: var(--ink);
          text-decoration: none;
          transition: background 160ms var(--ease);
          border-bottom: 1px solid var(--ink-ghost);
        }
        .co-row > * { min-width: 0; }
        .co-row:hover { background: var(--accent-soft); }
        .co-row-idx { color: var(--ink-faint); }
        .co-row-path { color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .co-row-title { color: var(--ink); text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .co-row-desc { color: var(--ink-muted); text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .co-types { display: flex; flex-direction: column; }
        .co-type { padding: 14px 0; }
        .co-type-div { border-bottom: 1px solid var(--ink-ghost); }
        .co-type-name {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          color: var(--ink-muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .co-type-specimen {
          font-size: 18px;
          color: var(--ink);
          line-height: 1.3;
        }

        .co-stack { display: flex; flex-direction: column; }
        .co-stack-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-family: var(--font-stack-mono);
          font-size: 12px;
          border-bottom: 1px solid var(--ink-ghost);
        }
        .co-stack-name { color: var(--ink); }
        .co-stack-ver { color: var(--ink-muted); }

        .co-tele { display: flex; flex-direction: column; }
        .co-tele-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-family: var(--font-stack-mono);
          font-size: 12px;
          border-bottom: 1px solid var(--ink-ghost);
          letter-spacing: 0.06em;
        }
        .co-tele-row span:first-child { color: var(--ink-muted); text-transform: uppercase; }
        .co-tele-row span:last-child { color: var(--ink); }

        .co-contact {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .co-mail {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .co-mail:hover { color: var(--accent-deep); }
        .co-hint {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-faint);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .co-hint-sep { color: var(--ink-faint); }
        .co-key {
          display: inline-block;
          padding: 2px 6px;
          border: 1px solid var(--accent);
          border-radius: 3px;
          color: var(--accent);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          background: rgba(91, 137, 181, 0.08);
          margin: 0 2px;
          line-height: 1.2;
        }

        @media (max-width: 820px) {
          .co-block-sitemap,
          .co-block-types,
          .co-block-stack,
          .co-block-tele { grid-column: 1 / span 12; margin-top: 32px; }
          .co-block-types { margin-top: 32px; }
          .co-header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .co-h-right { text-align: left; }
          .co-block-foot { flex-direction: column; align-items: flex-start; }
          .co-row { grid-template-columns: 44px 1fr 1fr; }
          .co-row-desc { grid-column: 1 / -1; text-align: left; }
        }
      `}</style>
    </>
  );
}
