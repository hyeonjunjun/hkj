"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Piece } from "@/constants/pieces";

// ── Shaders ────────────────────────────────────────────────────────────────
// Single-texture variant of the NaughtyDuk shaders — image/video/canvas
// all bind to uMainTexture. Cylindrical warp on the vertex side, rounded-
// corner SDF + UV cover-fit on the fragment side.

const VERT = /* glsl */ `
  uniform float uWarpIntensity;
  uniform float uVisibleWidth;
  uniform float uIsMobile;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    float axis = uIsMobile > 0.5 ? worldPos.y : worldPos.x;
    float n = axis / (uVisibleWidth * 0.5);
    float z = -uWarpIntensity * n * n * 2.0;
    worldPos.z += z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos.xyz, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D uMainTexture;
  uniform vec2 uUvScale;
  uniform vec2 uUvOffset;
  uniform vec2 uTileSize;
  uniform float uCornerRadius;
  varying vec2 vUv;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) - r;
  }

  void main() {
    vec2 pixelPos = (vUv - 0.5) * uTileSize;
    float dist = roundedBoxSDF(pixelPos, uTileSize * 0.5, uCornerRadius);
    if (dist > 0.0) discard;

    vec2 uv = vUv * uUvScale + uUvOffset;
    gl_FragColor = texture2D(uMainTexture, uv);
  }
`;

const PLANE_SEGMENTS = 32;

// Generated typographic plate for concept-only pieces — black ground +
// paper text so the tile reads as a distinct card against the body bg
// in both themes. Same 16:9 aspect as the tile so cover-fit is identity.
function makeConceptTexture(piece: Piece): THREE.CanvasTexture {
  const w = 1024;
  const h = 576;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "rgba(248, 248, 248, 0.55)";
  ctx.font = "500 22px ui-monospace, 'Geist Mono', monospace";
  ctx.textBaseline = "top";
  ctx.fillText(`§${piece.number}`, 32, 28);

  const status =
    piece.status === "wip" ? "LIVE" : piece.status.toUpperCase();
  const sw = ctx.measureText(status).width;
  ctx.fillStyle =
    piece.status === "wip" ? "#E8B25A" : "rgba(248, 248, 248, 0.55)";
  ctx.fillText(status, w - 32 - sw, 28);

  ctx.fillStyle = "#F8F8F8";
  ctx.font = "500 96px ui-monospace, 'Geist Mono', monospace";
  ctx.textBaseline = "middle";
  const lines = wrap(ctx, piece.title.toUpperCase(), w - 64);
  const lineH = 100;
  const totalH = lines.length * lineH;
  let y = h / 2 - totalH / 2 + lineH / 2;
  for (const line of lines) {
    ctx.fillText(line, 32, y);
    y += lineH;
  }

  if (piece.sector) {
    ctx.fillStyle = "rgba(248, 248, 248, 0.55)";
    ctx.font = "400 18px ui-monospace, 'Geist Mono', monospace";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(piece.sector, 32, h - 32);
  }

  const tex = new THREE.CanvasTexture(cv);
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

// UV cover-fit: scale + offset so the texture renders cropped-to-fill.
function coverUv(
  srcW: number,
  srcH: number,
  tileW: number,
  tileH: number,
): { scale: [number, number]; offset: [number, number] } {
  const srcAspect = srcW / srcH;
  const tileAspect = tileW / tileH;
  if (srcAspect > tileAspect) {
    const s = tileAspect / srcAspect;
    return { scale: [s, 1], offset: [(1 - s) / 2, 0] };
  } else {
    const s = srcAspect / tileAspect;
    return { scale: [1, s], offset: [0, (1 - s) / 2] };
  }
}

type Props = {
  piece: Piece;
  initialPosition: [number, number, number];
  tileWidth: number;
  tileHeight: number;
  isMobile: boolean;
  warpIntensityRef: React.RefObject<number>;
  visibleWidthRef: React.RefObject<number>;
  meshRef: (el: THREE.Mesh | null) => void;
  onClick: () => void;
};

export function GalleryTile({
  piece,
  initialPosition,
  tileWidth,
  tileHeight,
  isMobile,
  warpIntensityRef,
  visibleWidthRef,
  meshRef,
  onClick,
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { size } = useThree();

  // Build the bound texture once per piece. Videos autoplay (muted),
  // images load via TextureLoader, concept-only pieces get a generated
  // black-plate canvas texture.
  const { tex, videoEl, srcW, srcH } = useMemo(() => {
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
      // We don't know intrinsic dims until loadedmetadata — use the
      // piece's declared aspect, which we've verified matches sources.
      return { tex: t, videoEl: v, srcW: 16, srcH: 9 };
    }
    if (piece.cover?.kind === "image") {
      const loader = new THREE.TextureLoader();
      const t = loader.load(piece.cover.src);
      t.colorSpace = THREE.SRGBColorSpace;
      const [aw, ah] = (piece.coverAspect ?? "16 / 9")
        .split("/")
        .map((s) => parseFloat(s.trim()));
      return { tex: t, videoEl: null as HTMLVideoElement | null, srcW: aw, srcH: ah };
    }
    return {
      tex: makeConceptTexture(piece),
      videoEl: null as HTMLVideoElement | null,
      srcW: 16,
      srcH: 9,
    };
  }, [piece]);

  const uv = useMemo(
    () => coverUv(srcW, srcH, tileWidth, tileHeight),
    [srcW, srcH, tileWidth, tileHeight],
  );

  const uniforms = useMemo<Record<string, THREE.IUniform>>(
    () => ({
      uMainTexture: { value: tex },
      uUvScale: { value: new THREE.Vector2(...uv.scale) },
      uUvOffset: { value: new THREE.Vector2(...uv.offset) },
      uWarpIntensity: { value: 0 },
      uVisibleWidth: { value: visibleWidthRef.current ?? 16 },
      uIsMobile: { value: isMobile ? 1 : 0 },
      uTileSize: {
        value: new THREE.Vector2(
          size.width * 0.35,
          size.height * 0.35,
        ),
      },
      uCornerRadius: { value: 12 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tex, uv],
  );

  // Sync dynamic uniforms each frame.
  useFrame(() => {
    if (!matRef.current) return;
    matRef.current.uniforms.uWarpIntensity.value = warpIntensityRef.current ?? 0;
    matRef.current.uniforms.uVisibleWidth.value = visibleWidthRef.current ?? 16;
    matRef.current.uniforms.uIsMobile.value = isMobile ? 1 : 0;
    matRef.current.uniforms.uTileSize.value.set(
      size.width * 0.35,
      size.height * 0.35,
    );
    if (videoEl && tex instanceof THREE.VideoTexture) {
      tex.needsUpdate = true;
    }
  });

  useEffect(() => {
    return () => {
      tex.dispose();
      if (videoEl) {
        videoEl.pause();
        videoEl.src = "";
      }
    };
  }, [tex, videoEl]);

  const handleEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
  };
  const handleLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
  };

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onClick={onClick}
    >
      <planeGeometry
        args={[tileWidth, tileHeight, PLANE_SEGMENTS, PLANE_SEGMENTS]}
      />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
