"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const PARA =
  "Clouds keep no record of themselves. They assemble from nothing we can point to, hold a shape for the length of a thought, and leave without apology. A cloud you loved at seven is somewhere still, redistributed through every rain since. The sky has been patient with us in ways we have not deserved, offering the same white language to every upturned face: look, look, this is what softness looks like when it is permitted to be enormous. We move through our days beneath an ongoing act of forgiveness. Most of us never once glance up. ";

type PretextHeroProps = {
  title?: string;
  tagline?: string;
  meta?: string;
  body?: string;
  showNav?: boolean;
};

export default function PretextHero({
  title = "Hyeonjoon Jun",
  tagline = "design engineering · interactive typography · reading-first tools",
  meta = "writing · 2026",
  body = PARA,
  showNav = true,
}: PretextHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const grainRef = useRef<HTMLDivElement | null>(null);
  const errRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const errEl = errRef.current;
    const showErr = (label: string, e: unknown) => {
      const msg =
        e && typeof e === "object" && ("stack" in e || "message" in e)
          ? ((e as { stack?: string; message?: string }).stack ||
            (e as { message?: string }).message ||
            String(e))
          : String(e);
      if (errEl) errEl.textContent += `[${label}] ${msg}\n`;
      // eslint-disable-next-line no-console
      console.error(label, e);
    };
    const onWinError = (e: ErrorEvent) => showErr("window.error", e.error || e.message);
    const onUnhandled = (e: PromiseRejectionEvent) => showErr("unhandled", e.reason);
    window.addEventListener("error", onWinError);
    window.addEventListener("unhandledrejection", onUnhandled);

    const canvas = canvasRef.current;
    const statsEl = statsRef.current;
    const grainEl = grainRef.current;
    if (!canvas || !statsEl || !grainEl) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const TEXT = body.repeat(16).trim();

    const CFG = {
      FONT_SIZE: 14,
      LINE_HEIGHT: 1.3,
      MARGIN: 36,
      MIN_SEGMENT_WIDTH: 32,
      MEDIA_W: 240,
      MEDIA_H: 140,
      LUMA_THRESHOLD: 80,
      LOOP_PERIOD_MS: 45000,
      CURSOR_RADIUS: 85,
      CURSOR_EASE: 0.22,
      CURSOR_IDLE_MS: 1400,
      MEDIA_ALPHA: 0.42,
      MEDIA_TINT: [170, 195, 225],
      BG: "#0a0d14",
      INK: "#eae2d4",
      INK_MUTE: "rgba(234, 226, 212, 0.55)",
      ACCENT: "rgba(234, 208, 176, 0.95)",
      FROZEN_LOOP_T: 0.18,
      GRAIN_ALPHA: 0.035,
      GRAIN_SIZE: 220,
    };

    type HeadlineRect = { x: number; y: number; w: number; h: number; font: string };
    type BlockRect = { left: number; top: number; right: number; bottom: number };
    interface Headline {
      name: string;
      tagline: string;
      meta: string;
      nameRect: HeadlineRect | null;
      taglineRect: HeadlineRect | null;
      metaRect: HeadlineRect | null;
      blockRect: BlockRect | null;
    }

    const HEADLINE: Headline = {
      name: title,
      tagline,
      meta,
      nameRect: null,
      taglineRect: null,
      metaRect: null,
      blockRect: null,
    };

    const mediaCanvas = document.createElement("canvas");
    mediaCanvas.width = CFG.MEDIA_W;
    mediaCanvas.height = CFG.MEDIA_H;
    const mediaCtx = mediaCanvas.getContext("2d", { willReadFrequently: true });
    if (!mediaCtx) return;

    const mediaTintedCanvas = document.createElement("canvas");
    mediaTintedCanvas.width = CFG.MEDIA_W;
    mediaTintedCanvas.height = CFG.MEDIA_H;
    const mediaTintedCtx = mediaTintedCanvas.getContext("2d");
    if (!mediaTintedCtx) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
    const onReducedChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener?.("change", onReducedChange);

    (function installGrain() {
      const c = document.createElement("canvas");
      c.width = c.height = CFG.GRAIN_SIZE;
      const g = c.getContext("2d");
      if (!g) return;
      const img = g.createImageData(CFG.GRAIN_SIZE, CFG.GRAIN_SIZE);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 120 + Math.random() * 90;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      const url = c.toDataURL("image/png");
      if (grainEl) grainEl.style.backgroundImage = `url(${url})`;
    })();

    const CLOUDS = Array.from({ length: 7 }, (_, i) => {
      const s = (n: number, k: number) =>
        (Math.sin(i * 12.9898 + k * 78.233 + n) * 43758.5453) % 1;
      const frac = (x: number) => x - Math.floor(x);
      return {
        cx: 0.15 + frac(s(1.1, 0.3)) * 0.7,
        cy: 0.15 + frac(s(2.3, 1.7)) * 0.7,
        rx: 0.28 + frac(s(3.5, 2.1)) * 0.35,
        ry: 0.12 + frac(s(4.7, 3.4)) * 0.18,
        size: 0.18 + frac(s(5.9, 4.6)) * 0.14,
        phase: frac(s(6.1, 5.8)) * Math.PI * 2,
        orbitRate: (i % 2 === 0 ? 1 : -1) * (0.8 + frac(s(7.3, 6.7)) * 0.6),
        wobbleRate: 1.5 + frac(s(8.5, 7.9)) * 2.0,
        wobbleAmp: 0.04 + frac(s(9.7, 9.1)) * 0.06,
      };
    });

    function applyResponsiveConfig() {
      if (W < 720) {
        CFG.FONT_SIZE = 12;
        CFG.LINE_HEIGHT = 1.28;
        CFG.MARGIN = 20;
        CFG.CURSOR_RADIUS = 60;
      } else if (W < 1100) {
        CFG.FONT_SIZE = 13;
        CFG.LINE_HEIGHT = 1.3;
        CFG.MARGIN = 28;
        CFG.CURSOR_RADIUS = 75;
      } else {
        CFG.FONT_SIZE = 14;
        CFG.LINE_HEIGHT = 1.3;
        CFG.MARGIN = 36;
        CFG.CURSOR_RADIUS = 85;
      }
    }

    function headlineFonts() {
      const nameSize = W < 720 ? 44 : W < 1100 ? 58 : 74;
      const taglineSize = W < 720 ? 11 : 12;
      const metaSize = 10;
      return {
        nameSize,
        taglineSize,
        metaSize,
        name: `italic ${nameSize}px "Instrument Serif", serif`,
        tagline: `${taglineSize}px "Inter", system-ui, sans-serif`,
        meta: `${metaSize}px "Inter", system-ui, sans-serif`,
      };
    }

    function layoutHeadline() {
      if (!ctx) return;
      const fonts = headlineFonts();
      const x = CFG.MARGIN + 10;
      const nameY = Math.max(CFG.MARGIN + fonts.nameSize * 0.9, H * 0.38);
      const taglineY = nameY + fonts.taglineSize * 2.2;
      const metaY = taglineY + fonts.metaSize * 2.0;

      ctx.font = fonts.name;
      const nameW = ctx.measureText(HEADLINE.name).width;
      ctx.font = fonts.tagline;
      const tagW = ctx.measureText(HEADLINE.tagline).width;
      ctx.font = fonts.meta;
      const metaW = ctx.measureText(HEADLINE.meta).width;

      HEADLINE.nameRect = { x, y: nameY, w: nameW, h: fonts.nameSize, font: fonts.name };
      HEADLINE.taglineRect = { x, y: taglineY, w: tagW, h: fonts.taglineSize, font: fonts.tagline };
      HEADLINE.metaRect = { x, y: metaY, w: metaW, h: fonts.metaSize, font: fonts.meta };

      const pad = 12;
      HEADLINE.blockRect = {
        left: x - pad,
        top: nameY - fonts.nameSize - pad,
        right: x + Math.max(nameW, tagW, metaW) + pad,
        bottom: metaY + 6 + pad,
      };
    }

    function renderHeadline() {
      if (!ctx) return;
      if (!HEADLINE.nameRect || !HEADLINE.taglineRect || !HEADLINE.metaRect) return;
      ctx.fillStyle = CFG.ACCENT;
      ctx.font = HEADLINE.nameRect.font;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(HEADLINE.name, HEADLINE.nameRect.x, HEADLINE.nameRect.y);
      ctx.fillStyle = CFG.INK_MUTE;
      ctx.font = HEADLINE.taglineRect.font;
      ctx.fillText(HEADLINE.tagline, HEADLINE.taglineRect.x, HEADLINE.taglineRect.y);
      ctx.font = HEADLINE.metaRect.font;
      ctx.fillStyle = "rgba(234, 226, 212, 0.4)";
      ctx.fillText(HEADLINE.meta, HEADLINE.metaRect.x, HEADLINE.metaRect.y);
    }

    function renderClouds(loopT: number) {
      const mw = mediaCanvas.width;
      const mh = mediaCanvas.height;
      mediaCtx!.fillStyle = "#000";
      mediaCtx!.fillRect(0, 0, mw, mh);
      mediaCtx!.globalCompositeOperation = "lighter";
      const theta0 = loopT * Math.PI * 2;
      for (const c of CLOUDS) {
        const theta = theta0 * c.orbitRate + c.phase;
        const wob = Math.sin(theta0 * c.wobbleRate + c.phase * 2) * c.wobbleAmp;
        const cx = (c.cx + c.rx * Math.cos(theta) + wob) * mw;
        const cy = (c.cy + c.ry * Math.sin(theta)) * mh;
        const r = c.size * mw;
        const g = mediaCtx!.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0.0, "rgba(255,255,255,0.78)");
        g.addColorStop(0.45, "rgba(255,255,255,0.30)");
        g.addColorStop(1.0, "rgba(255,255,255,0.0)");
        mediaCtx!.fillStyle = g;
        mediaCtx!.fillRect(0, 0, mw, mh);
      }
      mediaCtx!.globalCompositeOperation = "source-over";
    }

    let mediaImageData: ImageData | null = null;
    function sampleMedia() {
      mediaImageData = mediaCtx!.getImageData(0, 0, CFG.MEDIA_W, CFG.MEDIA_H);
    }

    type Block = { l: number; r: number };
    function intervalsAtRow(
      y: number,
      colL: number,
      colR: number,
      cursorObs: { x: number; y: number; r: number } | null,
      headlineRect: BlockRect | null
    ): Block[] {
      if (!mediaImageData) return [];
      const mw = CFG.MEDIA_W;
      const mh = CFG.MEDIA_H;
      const my = Math.floor((y / H) * mh);
      const data = mediaImageData.data;
      const threshold = CFG.LUMA_THRESHOLD;
      const blocks: Block[] = [];

      if (my >= 0 && my < mh) {
        let inBlock = false;
        let blockStart = 0;
        for (let mx = 0; mx < mw; mx++) {
          const L = data[(my * mw + mx) * 4];
          const bright = L > threshold;
          if (bright && !inBlock) {
            inBlock = true;
            blockStart = mx;
          } else if (!bright && inBlock) {
            inBlock = false;
            const sL = (blockStart / mw) * W;
            const sR = (mx / mw) * W;
            blocks.push({ l: sL, r: sR });
          }
        }
        if (inBlock) {
          const sL = (blockStart / mw) * W;
          blocks.push({ l: sL, r: W });
        }
      }

      if (cursorObs) {
        const dy = y - cursorObs.y;
        if (Math.abs(dy) < cursorObs.r) {
          const half = Math.sqrt(cursorObs.r * cursorObs.r - dy * dy);
          blocks.push({ l: cursorObs.x - half, r: cursorObs.x + half });
        }
      }

      if (headlineRect && y >= headlineRect.top && y <= headlineRect.bottom) {
        blocks.push({ l: headlineRect.left, r: headlineRect.right });
      }

      if (blocks.length === 0) return [];

      blocks.sort((a, b) => a.l - b.l);
      const merged: Block[] = [];
      for (const b of blocks) {
        const lb = Math.max(colL, b.l);
        const rb = Math.min(colR, b.r);
        if (rb <= lb) continue;
        if (merged.length && lb <= merged[merged.length - 1].r + 2) {
          merged[merged.length - 1].r = Math.max(merged[merged.length - 1].r, rb);
        } else {
          merged.push({ l: lb, r: rb });
        }
      }
      return merged;
    }

    const fontString = () => `${CFG.FONT_SIZE}px "Instrument Serif", serif`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let pretext: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let prepared: any = null;
    function prepareText() {
      if (!pretext) return;
      prepared = pretext.prepareWithSegments(TEXT, fontString());
    }

    type Seg = { text: string; x: number; y: number; width: number };
    function layoutFrame(
      cursorObs: { x: number; y: number; r: number } | null,
      headlineRect: BlockRect | null
    ): Seg[] {
      if (!pretext || !prepared) return [];
      const colL = CFG.MARGIN;
      const colR = W - CFG.MARGIN;
      const lineH = CFG.FONT_SIZE * CFG.LINE_HEIGHT;
      const minSeg = CFG.MIN_SEGMENT_WIDTH;

      let cursor = { segmentIndex: 0, graphemeIndex: 0 };
      const segs: Seg[] = [];
      let y = CFG.MARGIN + CFG.FONT_SIZE;

      let iter = 0;
      while (y < H - CFG.MARGIN && iter < 800) {
        iter++;

        const blocks = intervalsAtRow(y, colL, colR, cursorObs, headlineRect);

        let regions: Block[];
        if (blocks.length === 0) {
          regions = [{ l: colL, r: colR }];
        } else {
          regions = [];
          let x = colL;
          for (const b of blocks) {
            if (b.l > x) regions.push({ l: x, r: b.l });
            x = Math.max(x, b.r);
          }
          if (x < colR) regions.push({ l: x, r: colR });
        }

        let placedAny = false;
        for (const reg of regions) {
          const w = reg.r - reg.l;
          if (w < minSeg) continue;
          const range = pretext.layoutNextLineRange(prepared, cursor, w);
          if (!range) {
            y = Infinity;
            break;
          }
          const ln = pretext.materializeLineRange(prepared, range);
          segs.push({ text: ln.text, x: reg.l, y, width: ln.width });
          cursor = range.end;
          placedAny = true;
        }

        y += lineH;
        if (!placedAny) continue;
      }

      return segs;
    }

    const pointer = { rawX: -9999, rawY: -9999, x: -9999, y: -9999, lastMove: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.rawX = e.clientX;
      pointer.rawY = e.clientY;
      pointer.lastMove = performance.now();
    };
    const onPointerLeave = () => {
      pointer.rawX = -9999;
      pointer.rawY = -9999;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    function renderTintedMedia() {
      const mw = CFG.MEDIA_W;
      const mh = CFG.MEDIA_H;
      mediaTintedCtx!.clearRect(0, 0, mw, mh);
      mediaTintedCtx!.globalCompositeOperation = "source-over";
      mediaTintedCtx!.drawImage(mediaCanvas, 0, 0);
      mediaTintedCtx!.globalCompositeOperation = "source-in";
      const [r, g, b] = CFG.MEDIA_TINT;
      mediaTintedCtx!.fillStyle = `rgb(${r},${g},${b})`;
      mediaTintedCtx!.fillRect(0, 0, mw, mh);
      mediaTintedCtx!.globalCompositeOperation = "source-over";
    }

    function drawVignette() {
      if (!ctx) return;
      const g = ctx.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.45,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.75
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.floor(W * DPR);
      canvas!.height = Math.floor(H * DPR);
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      applyResponsiveConfig();
      prepareText();
      layoutHeadline();
    }
    window.addEventListener("resize", resize);

    const bootTime = performance.now();
    let fpsT = bootTime;
    let fpsN = 0;
    let lastLayoutMs = 0;
    let lastSegs = 0;
    let rafId = 0;

    function frame(now: number) {
      const loopT = reducedMotion
        ? CFG.FROZEN_LOOP_T
        : ((now - bootTime) % CFG.LOOP_PERIOD_MS) / CFG.LOOP_PERIOD_MS;
      renderClouds(loopT);
      sampleMedia();

      const idle = now - pointer.lastMove > CFG.CURSOR_IDLE_MS;
      let cursorObs: { x: number; y: number; r: number } | null = null;
      if (!idle && pointer.rawX > -9000) {
        if (pointer.x < -9000) {
          pointer.x = pointer.rawX;
          pointer.y = pointer.rawY;
        }
        pointer.x += (pointer.rawX - pointer.x) * CFG.CURSOR_EASE;
        pointer.y += (pointer.rawY - pointer.y) * CFG.CURSOR_EASE;
        cursorObs = { x: pointer.x, y: pointer.y, r: CFG.CURSOR_RADIUS };
      } else {
        pointer.x = -9999;
      }

      const t0 = performance.now();
      const segs = layoutFrame(cursorObs, HEADLINE.blockRect);
      lastLayoutMs = performance.now() - t0;
      lastSegs = segs.length;

      ctx!.fillStyle = CFG.BG;
      ctx!.fillRect(0, 0, W, H);

      renderTintedMedia();
      ctx!.globalAlpha = CFG.MEDIA_ALPHA;
      ctx!.imageSmoothingEnabled = true;
      ctx!.imageSmoothingQuality = "high";
      ctx!.drawImage(mediaTintedCanvas, 0, 0, W, H);
      ctx!.globalAlpha = 1;

      ctx!.fillStyle = CFG.INK;
      ctx!.font = fontString();
      ctx!.textBaseline = "alphabetic";
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        ctx!.fillText(s.text, s.x, s.y);
      }

      renderHeadline();
      drawVignette();

      fpsN++;
      if (now - fpsT > 500) {
        const fps = Math.round((fpsN * 1000) / (now - fpsT));
        if (statsEl)
          statsEl.textContent = `${fps} fps · ${lastSegs} segs · ${lastLayoutMs.toFixed(1)}ms layout · loop ${(
            loopT * 100
          ).toFixed(0)}%`;
        fpsT = now;
        fpsN = 0;
      }

      rafId = window.requestAnimationFrame(frame);
    }

    let cancelled = false;

    (async () => {
      try {
        const dynImport = new Function(
          "return import('https://esm.sh/@chenglou/pretext@0.0.5')"
        ) as () => Promise<unknown>;
        pretext = await dynImport();
        if (cancelled) return;

        resize();

        if (document.fonts && document.fonts.ready) {
          try {
            await document.fonts.ready;
          } catch {}
        }
        if (cancelled) return;
        prepareText();
        layoutHeadline();
        rafId = window.requestAnimationFrame(frame);
      } catch (e) {
        showErr("init", e);
      }
    })();

    return () => {
      cancelled = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("error", onWinError);
      window.removeEventListener("unhandledrejection", onUnhandled);
      reducedMotionQuery.removeEventListener?.("change", onReducedChange);
    };
  }, [title, tagline, meta, body]);

  return (
    <main className="pretext-hero" id="main">
      <canvas className="pt-stage" ref={canvasRef} />
      <div className="pt-chrome pt-chrome--title">
        <Link href="/">hyeonjoon</Link>
      </div>
      {showNav && (
        <nav className="pt-chrome pt-chrome--hint" aria-label="Primary">
          <Link href="/">works</Link>
          <span className="pt-sep">·</span>
          <Link href="/shelf">shelf</Link>
          <span className="pt-sep">·</span>
          <Link href="/about">about</Link>
        </nav>
      )}
      <div className="pt-chrome pt-chrome--byline">index · writing</div>
      <div className="pt-chrome pt-chrome--stats" ref={statsRef}>— fps</div>
      <div className="pt-grain" ref={grainRef} />
      <div className="pt-err" ref={errRef} />
      <p className="pt-sr-only">{body}</p>

      <style>{`
        .pretext-hero {
          position: fixed;
          inset: 0;
          background: #0a0d14;
          color: #eae2d4;
          overflow: hidden;
          cursor: crosshair;
          font-family: var(--font-instrument), "Instrument Serif", serif;
        }
        .pt-stage {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          display: block;
          opacity: 0;
          animation: pt-hero-fade-in 1400ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes pt-hero-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .pt-chrome {
          position: fixed;
          z-index: 2;
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5a6372;
          user-select: none;
        }
        .pt-chrome--title { top: 22px; left: 28px; opacity: 0.7; }
        .pt-chrome--title a { color: inherit; text-decoration: none; transition: color 180ms cubic-bezier(0.16, 1, 0.3, 1); }
        .pt-chrome--title a:hover { color: #eae2d4; }
        .pt-chrome--hint {
          top: 22px;
          right: 28px;
          opacity: 0.7;
          display: inline-flex;
          gap: 10px;
          align-items: baseline;
        }
        .pt-chrome--hint a {
          color: inherit;
          text-decoration: none;
          transition: color 180ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pt-chrome--hint a:hover { color: #eae2d4; }
        .pt-sep { opacity: 0.55; }
        .pt-chrome--byline { bottom: 22px; left: 28px; opacity: 0.55; pointer-events: none; }
        .pt-chrome--stats {
          bottom: 22px;
          right: 28px;
          opacity: 0.28;
          font-variant-numeric: tabular-nums;
          pointer-events: none;
        }
        .pt-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          opacity: 0.045;
          background-repeat: repeat;
          background-size: 220px 220px;
        }
        .pt-err {
          position: fixed;
          z-index: 10;
          bottom: 48px;
          left: 22px;
          right: 22px;
          color: #ff8888;
          font-family: monospace;
          font-size: 12px;
          white-space: pre-wrap;
          max-height: 40vh;
          overflow: auto;
          pointer-events: none;
        }
        .pt-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .pt-stage { animation: none; opacity: 1; }
          .pt-grain { opacity: 0.03; }
        }
      `}</style>
    </main>
  );
}
