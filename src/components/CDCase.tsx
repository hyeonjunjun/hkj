"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Piece } from "@/constants/pieces";

interface DragState {
  isDragging: boolean;
  velocityX: number;
  velocityY: number;
}

interface CDCaseProps {
  piece: Piece;
  dragRef: React.MutableRefObject<DragState>;
}

const MAX_TILT = 0.1;
const LERP_FACTOR = 0.04;
const IDLE_SPEED = 0.08;

/**
 * Typographic poster layout for the front face of the CD case.
 * Real DOM text — selectable, styled with the design system fonts.
 */
function PosterFace({ piece }: { piece: Piece }) {
  const bg = piece.cover.bg;
  const fg = piece.cover.text;

  return (
    <div
      style={{
        width: 280,
        height: 280,
        background: bg,
        color: fg,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        userSelect: "text",
        cursor: "default",
        position: "relative",
      }}
    >
      {/* Top: number + type label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.5,
          }}
        >
          N. {String(piece.order).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 7,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.4,
            textAlign: "right",
          }}
        >
          {piece.year}
          <br />
          {piece.type === "project" ? "Project" : "Experiment"}
        </span>
      </div>

      {/* Center: Title — large, the visual anchor */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: piece.title.length > 8 ? 36 : 52,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            margin: 0,
            wordBreak: "break-word",
          }}
        >
          {piece.title}
        </h3>
      </div>

      {/* Bottom: tags + description excerpt */}
      <div>
        {/* Tags row */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          {piece.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 6,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                opacity: 0.45,
                border: `1px solid ${fg}`,
                borderColor: `color-mix(in srgb, ${fg} 25%, transparent)`,
                padding: "2px 5px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description — small, cropped */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 7,
            lineHeight: 1.5,
            opacity: 0.5,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {piece.description}
        </p>
      </div>

      {/* Decorative corner marks */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          width: 10,
          height: 10,
          borderTop: `1px solid ${fg}`,
          borderLeft: `1px solid ${fg}`,
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          width: 10,
          height: 10,
          borderBottom: `1px solid ${fg}`,
          borderRight: `1px solid ${fg}`,
          opacity: 0.1,
        }}
      />
    </div>
  );
}

export default function CDCase({ piece, dragRef }: CDCaseProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered ? 1.03 : 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (dragRef.current.isDragging) {
      meshRef.current.rotation.y += dragRef.current.velocityX;
      meshRef.current.rotation.x += dragRef.current.velocityY;
      meshRef.current.rotation.x = THREE.MathUtils.clamp(
        meshRef.current.rotation.x,
        -Math.PI / 3,
        Math.PI / 3
      );
    } else {
      meshRef.current.rotation.y += delta * IDLE_SPEED;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        pointer.y * MAX_TILT,
        LERP_FACTOR
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        -pointer.x * MAX_TILT,
        LERP_FACTOR
      );
      dragRef.current.velocityX *= 0.93;
      dragRef.current.velocityY *= 0.93;
    }

    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08);
    meshRef.current.scale.setScalar(s);
  });

  const edgeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: piece.cover.bg,
        roughness: 0.9,
        metalness: 0.02,
      }),
    [piece.cover.bg]
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: piece.cover.bg,
        roughness: 0.85,
        metalness: 0.03,
      }),
    [piece.cover.bg]
  );

  const materials = useMemo(
    () => [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, frontMaterial, edgeMaterial],
    [edgeMaterial, frontMaterial]
  );

  return (
    <group>
      <mesh
        ref={meshRef}
        material={materials}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2, 0.12]} />

        {/* HTML poster on front face */}
        <Html
          transform
          occlude
          position={[0, 0, 0.061]}
          scale={2 / 280}
          style={{ pointerEvents: "none" }}
        >
          <PosterFace piece={piece} />
        </Html>
      </mesh>
    </group>
  );
}
