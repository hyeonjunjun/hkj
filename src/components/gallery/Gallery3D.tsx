"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { GalleryTile } from "./GalleryTile";
import type { Piece } from "@/constants/pieces";

// ── World-unit constants ───────────────────────────────────────────────────
// Locked to verified NaughtyDuk bundle values.
const TILE_W = 5.6;
const TILE_H = 3.22;
const TILE_GAP_X = 0.05;
const TILE_GAP_Y = 0.05;
const STRIDE_X = TILE_W + TILE_GAP_X;
const STRIDE_Y = TILE_H + TILE_GAP_Y;
const CAMERA_Z = 8;
const CAMERA_FOV_DEG = 50;

const LERP_FACTOR = 0.10;
const VELOCITY_DAMPING = 0.95;
const PROJECT_MS = 220;
const DRAG_THRESHOLD_PX = 4;

// We render three side-by-side copies of the piece array so the carousel
// always has tiles visible on both sides of the viewport center. With a
// single copy plus per-tile imperative wrap there was a path where side
// tiles silently failed to render; this approach uses purely declarative
// positions via React props, eliminating that class of bug.
const COPY_INDICES = [-1, 0, 1] as const;

type Props = {
  pieces: Piece[];
  onActiveChange: (index: number) => void;
  onTileClick: (slug: string) => void;
};

export function Gallery3D({ pieces, onActiveChange, onTileClick }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

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

  const snapToNearest = useCallback((velocityWorldPerMs = 0) => {
    const stride = mobileRef.current ? STRIDE_Y : STRIDE_X;
    const projected = targetXRef.current + velocityWorldPerMs * PROJECT_MS;
    const idx = Math.round(projected / stride);
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
      snapToNearest(velocityRef.current);
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

  // Wheel
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

  // Keyboard
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
    const half = totalSpan / 2;

    // Modular wrap of currentX into [-half, half) so the carousel loops
    // through the three rendered copies indefinitely. Both target and
    // current stay in lockstep so the lerp doesn't fight the wrap.
    while (currentXRef.current > half) {
      currentXRef.current -= totalSpan;
      targetXRef.current -= totalSpan;
    }
    while (currentXRef.current < -half) {
      currentXRef.current += totalSpan;
      targetXRef.current += totalSpan;
    }

    if (groupRef.current) {
      if (mobileRef.current) {
        groupRef.current.position.y = -currentXRef.current;
        groupRef.current.position.x = 0;
      } else {
        groupRef.current.position.x = -currentXRef.current;
        groupRef.current.position.y = 0;
      }
    }

    const rawIdx = Math.round(currentXRef.current / stride);
    const idx = ((rawIdx % pieces.length) + pieces.length) % pieces.length;
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx;
      onActiveChange(idx);
    }
  });

  // Three copies of the piece array — left, center, right — at
  // offsets of (-length, 0, +length) strides. The single groupRef
  // moves them all together; the modular wrap of currentX guarantees
  // there's always at least one copy's content visible at the viewport.
  return (
    <group ref={groupRef}>
      {COPY_INDICES.map((copyIdx) =>
        pieces.map((piece, i) => {
          const stride = mobile ? STRIDE_Y : STRIDE_X;
          const offset = (i + copyIdx * pieces.length) * stride;
          const pos: [number, number, number] = mobile
            ? [0, -offset, 0]
            : [offset, 0, 0];
          return (
            <GalleryTile
              key={`${piece.slug}-${copyIdx}`}
              piece={piece}
              position={pos}
              tileWidth={TILE_W}
              tileHeight={TILE_H}
              isMobile={mobile}
              warpIntensityRef={warpIntensityRef}
              visibleWidthRef={visibleWidthRef}
              onClick={() => {
                if (!hasDraggedRef.current) onTileClick(piece.slug);
              }}
            />
          );
        }),
      )}
    </group>
  );
}
