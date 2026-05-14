"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { GalleryTile } from "./GalleryTile";
import type { Piece } from "@/constants/pieces";

// ── World-unit constants ───────────────────────────────────────────────────
// Tile dims from the NaughtyDuk bundle. Inter-tile gap returned to the
// bundle's 0.05 (effectively flush). Camera pulled forward from the
// bundle's z=8 to z=6.5 so tiles dominate the viewport — NaughtyDuk's
// visual has tiles spanning ~50% of viewport width each with the sides
// cropped at viewport edges, which the bundle's z=8 + same tile dims
// doesn't reproduce on standard 16:9 (tiles read at ~42% width with
// large empty borders framing them).
const TILE_W = 5.6;
const TILE_H = 3.22;
const TILE_GAP_X = 0.05;
const TILE_GAP_Y = 0.1;
const STRIDE_X = TILE_W + TILE_GAP_X;
const STRIDE_Y = TILE_H + TILE_GAP_Y;
const CAMERA_Z = 6.5;
const CAMERA_FOV_DEG = 50;

// Smooth-scroll feel
const LERP_FACTOR = 0.12;
const VELOCITY_DAMPING = 0.92;
const DRAG_THRESHOLD_PX = 4;

// Wrap a world-space offset into [-span/2, span/2) so tile positions
// loop continuously past either end of the carousel.
function wrapWorld(v: number, span: number): number {
  const half = span / 2;
  let x = v % span;
  if (x > half) x -= span;
  else if (x < -half) x += span;
  return x;
}

type Props = {
  pieces: Piece[];
  onActiveChange: (index: number) => void;
  onTileClick: (slug: string) => void;
};

export function Gallery3D({ pieces, onActiveChange, onTileClick }: Props) {
  // Imperative mesh refs — each tile's position.x (or .y on mobile) is
  // written from useFrame each frame so we can wrap them through the
  // total span and produce an infinite loop without duplicating tiles.
  const tileMeshes = useRef<(THREE.Mesh | null)[]>([]);

  // Two-value smooth scroll: targetX = where we want to be, currentX =
  // where we actually are (lerps toward target each frame). Both
  // accumulate without bound — looping happens in the per-tile wrap.
  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const velocityRef = useRef(0);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const lastClientRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const { size, gl } = useThree();
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const mobileRef = useRef(mobile);

  const warpIntensityRef = useRef(0);
  const visibleWidthRef = useRef(16);

  useEffect(() => {
    mobileRef.current = mobile;
  }, [mobile]);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Intro warp animation — cylindrical bow-back on mount.
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const obj = { v: 0 };
    const tl = gsap.timeline();
    tl.to(obj, {
      v: 0.6,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: () => {
        warpIntensityRef.current = obj.v;
      },
    });
    tl.to(obj, {
      v: 0,
      duration: 0.9,
      ease: "power2.inOut",
      onUpdate: () => {
        warpIntensityRef.current = obj.v;
      },
    });
    return () => {
      tl.kill();
      warpIntensityRef.current = 0;
    };
  }, []);

  const visibleSpan = useCallback(() => {
    const h = 2 * CAMERA_Z * Math.tan((CAMERA_FOV_DEG * Math.PI) / 360);
    const w = h * (size.width / Math.max(size.height, 1));
    return { worldWidth: w, worldHeight: h };
  }, [size.width, size.height]);

  const pixelsPerUnit = useCallback(() => {
    return (
      size.height /
      (2 * CAMERA_Z * Math.tan((CAMERA_FOV_DEG * Math.PI) / 360))
    );
  }, [size.height]);

  const snapToNearest = useCallback((extraVelocity = 0) => {
    const stride = mobileRef.current ? STRIDE_Y : STRIDE_X;
    // Velocity-biased snap: a hard flick lands one tile further.
    const lookahead = extraVelocity * 0.1;
    const raw = (targetXRef.current + lookahead) / stride;
    const idx = Math.round(raw);
    targetXRef.current = idx * stride;
  }, []);

  // Pointer drag
  useEffect(() => {
    const canvas = gl.domElement;
    const section = canvas.closest<HTMLElement>(".webgl-gallery");

    const onDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      velocityRef.current = 0;
      const v = mobileRef.current ? e.clientY : e.clientX;
      dragStartRef.current = v;
      lastClientRef.current = v;
      lastTimestampRef.current = performance.now();
      section?.setAttribute("data-grabbing", "");
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const cur = mobileRef.current ? e.clientY : e.clientX;
      const dx = cur - lastClientRef.current;
      lastClientRef.current = cur;

      const now = performance.now();
      const dt = Math.max(now - lastTimestampRef.current, 1);
      lastTimestampRef.current = now;

      if (Math.abs(cur - dragStartRef.current) > DRAG_THRESHOLD_PX) {
        hasDraggedRef.current = true;
      }

      const ppu = pixelsPerUnit();
      const deltaWorld = -dx / ppu;
      targetXRef.current += deltaWorld;
      currentXRef.current += deltaWorld;
      velocityRef.current = deltaWorld / dt;
    };

    const onUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      section?.removeAttribute("data-grabbing");
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
      const velocityPerFrame = velocityRef.current * 16.67;
      snapToNearest(velocityPerFrame * 1000);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [gl, pixelsPerUnit, snapToNearest]);

  // Wheel scroll (desktop)
  useEffect(() => {
    if (mobile) return;
    const canvas = gl.domElement;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const ppu = pixelsPerUnit();
      const deltaPx =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetXRef.current += deltaPx / ppu;
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => snapToNearest(0), 140);
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", onWheel);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [gl, mobile, pixelsPerUnit, snapToNearest]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = document.activeElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      const stride = mobileRef.current ? STRIDE_Y : STRIDE_X;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        targetXRef.current -= stride;
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        targetXRef.current += stride;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Per-frame: lerp current → target, write tile positions with wrap,
  // update HUD active index. The wrap is what makes the carousel loop.
  useFrame(() => {
    const span = visibleSpan();
    visibleWidthRef.current = span.worldWidth;

    if (!isDraggingRef.current) {
      if (Math.abs(velocityRef.current) > 0.0001) {
        targetXRef.current += velocityRef.current * 1.0;
        velocityRef.current *= VELOCITY_DAMPING;
      }
      currentXRef.current +=
        (targetXRef.current - currentXRef.current) * LERP_FACTOR;
    }

    const stride = mobileRef.current ? STRIDE_Y : STRIDE_X;
    const totalSpan = pieces.length * stride;
    const axis: "x" | "y" = mobileRef.current ? "y" : "x";
    const otherAxis: "x" | "y" = mobileRef.current ? "x" : "y";
    const direction = mobileRef.current ? -1 : 1;

    for (let i = 0; i < pieces.length; i++) {
      const mesh = tileMeshes.current[i];
      if (!mesh) continue;
      const offsetWorld = wrapWorld(
        i * stride - currentXRef.current,
        totalSpan,
      );
      mesh.position[axis] = direction * offsetWorld;
      mesh.position[otherAxis] = 0;
    }

    // Active index from wrapped position
    const rawIdx = Math.round(currentXRef.current / stride);
    const idx = ((rawIdx % pieces.length) + pieces.length) % pieces.length;
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx;
      onActiveChange(idx);
    }
  });

  return (
    <>
      {pieces.map((piece, i) => {
        const stride = mobile ? STRIDE_Y : STRIDE_X;
        const totalSpan = pieces.length * stride;
        // Initial position uses the same wrap so the very first frame
        // doesn't flash with tiles stacked or strung out off-screen.
        const initialOffset = wrapWorld(i * stride, totalSpan);
        const initial: [number, number, number] = mobile
          ? [0, -initialOffset, 0]
          : [initialOffset, 0, 0];
        return (
          <GalleryTile
            key={piece.slug}
            piece={piece}
            initialPosition={initial}
            tileWidth={TILE_W}
            tileHeight={TILE_H}
            isMobile={mobile}
            warpIntensityRef={warpIntensityRef}
            visibleWidthRef={visibleWidthRef}
            meshRef={(el) => {
              tileMeshes.current[i] = el;
            }}
            onClick={() => {
              if (!hasDraggedRef.current) onTileClick(piece.slug);
            }}
          />
        );
      })}
    </>
  );
}
