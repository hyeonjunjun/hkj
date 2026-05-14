"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PIECES, type Piece } from "@/constants/pieces";
import { Gallery3D } from "./Gallery3D";
import { useRouteTransition } from "@/components/transition/useRouteTransition";

/**
 * WebGLGallery — R3F carousel of project tiles. Drag-snap horizontally
 * (or vertically on mobile <768px). Tile constants and shaders match
 * NaughtyDuk's bundle: tile 5.6 × 3.22 world units, stride 5.65, 30px
 * snap threshold, 0.35s power2.out snap tween, camera fov 50°/z=8.
 *
 * Pieces without cover media render a generated typographic plate
 * (paper background, mono title) so concept-only entries still appear.
 *
 * The crosshair overlay sits on top of the canvas at low opacity.
 */

const TILES: Piece[] = PIECES.filter((p) => !p.placeholder);

export function WebGLGallery() {
  const { startTransition } = useRouteTransition();
  const [active, setActive] = useState(0);

  const onTileClick = useCallback(
    (slug: string) => {
      startTransition(`/work/${slug}`);
    },
    [startTransition],
  );

  return (
    <section className="webgl-gallery" aria-label="Work carousel">
      {/* Crosshair overlay — soft X across the viewport. Pure CSS via
          existing CrosshairLines pattern but rebuilt inline here so the
          z-stack is local to the gallery. */}
      <svg
        className="webgl-gallery__crosshair"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="0" y1="0" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="100" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="100" x2="50" y2="50" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      <Canvas
        className="webgl-gallery__canvas"
        data-active={active}
        camera={{ fov: 50, position: [0, 0, 6.5], near: 0.1, far: 100 }}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Gallery3D
            pieces={TILES}
            onActiveChange={setActive}
            onTileClick={onTileClick}
          />
        </Suspense>
      </Canvas>

      <style>{`
        .webgl-gallery {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          cursor: grab;
        }
        .webgl-gallery[data-grabbing] {
          cursor: grabbing;
        }
        .webgl-gallery__crosshair {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.06;
          pointer-events: none;
          z-index: 0;
        }
        .webgl-gallery__canvas {
          position: absolute !important;
          inset: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 1;
          /* The canvas occupies the full gallery box and listens for
             pointer events globally via the R3F event system. */
        }
      `}</style>
    </section>
  );
}
