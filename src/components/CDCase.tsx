"use client";

import { useRef, useMemo, useState, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface DragState {
  isDragging: boolean;
  velocityX: number;
  velocityY: number;
}

interface CDCaseProps {
  textureUrl?: string;
  coverColor?: string;
  dragRef: React.MutableRefObject<DragState>;
}

const MAX_TILT = 0.1;
const LERP_FACTOR = 0.04;
const IDLE_SPEED = 0.08;

function useCDCaseRotation(dragRef: React.MutableRefObject<DragState>) {
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
      // Idle rotation + cursor tilt
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

      // Decay drag velocity
      dragRef.current.velocityX *= 0.93;
      dragRef.current.velocityY *= 0.93;
    }

    // Smooth hover scale
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.08);
    meshRef.current.scale.setScalar(s);
  });

  return { meshRef, setHovered };
}

function CDCaseWithTexture({
  textureUrl,
  coverColor = "#1a1a1a",
  dragRef,
}: {
  textureUrl: string;
  coverColor?: string;
  dragRef: React.MutableRefObject<DragState>;
}) {
  const texture = useTexture(textureUrl);
  const { meshRef, setHovered } = useCDCaseRotation(dragRef);

  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      roughness: 0.85,
      metalness: 0.02,
    });
    const front = new THREE.MeshStandardMaterial({
      map: texture,
      color: "#ffffff", // White so texture renders at full brightness
      roughness: 0.8,
      metalness: 0.03,
    });
    return [edge, edge, edge, edge, front, edge];
  }, [texture]);

  return (
    <mesh
      ref={meshRef}
      material={materials}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 0.12]} />
    </mesh>
  );
}

function CDCaseWithColor({
  coverColor = "#1a1a1a",
  dragRef,
}: {
  coverColor?: string;
  dragRef: React.MutableRefObject<DragState>;
}) {
  const { meshRef, setHovered } = useCDCaseRotation(dragRef);

  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      roughness: 0.85,
      metalness: 0.02,
    });
    const front = new THREE.MeshStandardMaterial({
      color: coverColor,
      roughness: 0.8,
      metalness: 0.03,
    });
    return [edge, edge, edge, edge, front, edge];
  }, [coverColor]);

  return (
    <mesh
      ref={meshRef}
      material={materials}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 0.12]} />
    </mesh>
  );
}

export default function CDCase({
  textureUrl,
  coverColor = "#1a1a1a",
  dragRef,
}: CDCaseProps) {
  if (textureUrl) {
    return (
      <Suspense fallback={<CDCaseWithColor coverColor={coverColor} dragRef={dragRef} />}>
        <CDCaseWithTexture textureUrl={textureUrl} coverColor={coverColor} dragRef={dragRef} />
      </Suspense>
    );
  }
  return <CDCaseWithColor coverColor={coverColor} dragRef={dragRef} />;
}
