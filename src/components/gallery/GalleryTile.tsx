"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { Piece } from "@/constants/pieces";

// ── Concept-piece fallback ─────────────────────────────────────────────────
// Editorial-slug placeholder for pieces without cover media. Drawn at 2×
// density (2048×1152) so type reads sharp on DPR-2. The register flips
// the old "system display" pattern (dark plate, billboard caps title)
// into a paper-tone card with proper-case title — feels like a "to be
// published" placeholder in an editorial layout, not a missing-asset
// warning. Components arranged as: §code | status at top, title centered
// vertically with proper case, sector + year as small meta below.
function makeConceptTexture(piece: Piece): THREE.CanvasTexture {
  const w = 2048;
  const h = 1152;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;

  // Paper-2 ground — slightly darker than body --paper so the tile
  // reads as a card without needing strong contrast.
  ctx.fillStyle = "#F4F3EE";
  ctx.fillRect(0, 0, w, h);

  // Hairline inset border (matches --ink-hair at 14% ink). Defines
  // the card edge against the body paper bg.
  ctx.strokeStyle = "rgba(26, 24, 22, 0.14)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);

  const pad = 80;

  // ── Top row: §code | status ────────────────────────────────────────────
  ctx.fillStyle = "rgba(26, 24, 22, 0.55)"; // --ink-3
  ctx.font = "500 36px ui-monospace, 'Geist Mono', monospace";
  ctx.textBaseline = "top";
  ctx.fillText(`§${piece.number}`, pad, pad);

  const status =
    piece.status === "wip" ? "LIVE" : piece.status.toUpperCase();
  const sw = ctx.measureText(status).width;
  ctx.fillStyle =
    piece.status === "wip" ? "#E8B25A" : "rgba(26, 24, 22, 0.55)";
  ctx.fillText(status, w - pad - sw, pad);

  // ── Hero: proper-case title, left-aligned, vertically centered ─────────
  ctx.fillStyle = "#1a1816"; // --ink
  ctx.font = "500 124px ui-monospace, 'Geist Mono', monospace";
  ctx.textBaseline = "middle";
  const lines = wrap(ctx, piece.title, w - pad * 2);
  const lineH = 140;
  const totalH = lines.length * lineH;
  const titleStartY = h / 2 - totalH / 2 + lineH / 2;
  let y = titleStartY;
  for (const line of lines) {
    ctx.fillText(line, pad, y);
    y += lineH;
  }

  // ── Sector — small mono caps under the title ───────────────────────────
  if (piece.sector) {
    ctx.fillStyle = "rgba(26, 24, 22, 0.55)";
    ctx.font = "400 32px ui-monospace, 'Geist Mono', monospace";
    ctx.textBaseline = "top";
    const sectorY = titleStartY + (lines.length - 0.5) * lineH + 36;
    ctx.fillText(piece.sector.toUpperCase(), pad, sectorY);
  }

  // ── Bottom-left: year ──────────────────────────────────────────────────
  ctx.fillStyle = "rgba(26, 24, 22, 0.35)"; // --ink-4
  ctx.font = "400 28px ui-monospace, 'Geist Mono', monospace";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(String(piece.year), pad, h - pad);

  const tex = new THREE.CanvasTexture(cv);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= max) current = test;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

type Props = {
  piece: Piece;
  position: [number, number, number];
  tileWidth: number;
  tileHeight: number;
  isMobile: boolean;
  warpIntensityRef: React.RefObject<number>;
  visibleWidthRef: React.RefObject<number>;
  onClick: () => void;
};

// Stripped-down version: dead-simple meshBasicMaterial with a texture.
// No shader, no warp, no SDF rounded corners — this is a debug-friendly
// baseline to isolate whether the multi-tile bug lives in the shader/
// uniforms path or somewhere structural. If three tiles render with
// this, the previous shader code was the bug. If still one, the issue
// is deeper (React, R3F reconciler, scene graph, etc.).
export function GalleryTile({
  piece,
  position,
  tileWidth,
  tileHeight,
  onClick,
}: Props) {
  const { tex, videoEl } = useMemo(() => {
    if (piece.cover?.kind === "video") {
      const v = document.createElement("video");
      v.src = piece.cover.src;
      v.loop = true;
      v.muted = true;
      v.playsInline = true;
      v.autoplay = true;
      v.preload = "auto";
      v.crossOrigin = "anonymous";
      v.play().catch(() => {});
      const t = new THREE.VideoTexture(v);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.colorSpace = THREE.SRGBColorSpace;
      return { tex: t as THREE.Texture, videoEl: v as HTMLVideoElement | null };
    }
    if (piece.cover?.kind === "image") {
      const loader = new THREE.TextureLoader();
      const t = loader.load(piece.cover.src);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      t.colorSpace = THREE.SRGBColorSpace;
      return { tex: t as THREE.Texture, videoEl: null as HTMLVideoElement | null };
    }
    return {
      tex: makeConceptTexture(piece) as THREE.Texture,
      videoEl: null as HTMLVideoElement | null,
    };
  }, [piece]);

  useEffect(() => {
    return () => {
      tex.dispose();
      if (videoEl) {
        videoEl.pause();
        videoEl.src = "";
      }
    };
  }, [tex, videoEl]);

  return (
    <mesh position={position} onClick={onClick}>
      <planeGeometry args={[tileWidth, tileHeight]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}
