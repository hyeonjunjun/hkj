"use client";

import { useRef, useMemo, useState, Suspense } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface CDCaseProps {
  textureUrl?: string;
  coverColor?: string;
}

const MAX_TILT = 0.14; // ~8 degrees
const LERP_FACTOR = 0.05;
const IDLE_SPEED = 0.1; // rad/s

function useCDCaseInteraction() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const targetScale = hovered ? 1.05 : 1;

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    lastPointer.current = { x: e.pointer.x, y: e.pointer.y };
    dragVelocity.current = { x: 0, y: 0 };
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    const dx = e.pointer.x - lastPointer.current.x;
    const dy = e.pointer.y - lastPointer.current.y;
    dragVelocity.current = { x: dx * 3, y: dy * 3 };
    lastPointer.current = { x: e.pointer.x, y: e.pointer.y };
  };

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (isDragging.current) {
      // User is dragging — apply drag velocity directly
      meshRef.current.rotation.y += dragVelocity.current.x;
      meshRef.current.rotation.x += dragVelocity.current.y;
      // Clamp vertical rotation
      meshRef.current.rotation.x = THREE.MathUtils.clamp(
        meshRef.current.rotation.x,
        -Math.PI / 3,
        Math.PI / 3
      );
    } else {
      // Idle: slow Y rotation + cursor tilt
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
      dragVelocity.current.x *= 0.95;
      dragVelocity.current.y *= 0.95;
    }

    // Smooth scale on hover
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
    meshRef.current.scale.setScalar(newScale);
  });

  return {
    meshRef,
    hovered,
    setHovered,
    onPointerDown,
    onPointerUp,
    onPointerMove,
  };
}

function CDCaseWithTexture({
  textureUrl,
  coverColor = "#1a1a1a",
}: {
  textureUrl: string;
  coverColor?: string;
}) {
  const texture = useTexture(textureUrl);
  const { meshRef, setHovered, onPointerDown, onPointerUp, onPointerMove } =
    useCDCaseInteraction();

  // Create materials array: [+x, -x, +y, -y, +z (front), -z (back)]
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: "#0d0d0d",
      roughness: 0.9,
      metalness: 0,
    });
    const front = new THREE.MeshStandardMaterial({
      map: texture,
      color: coverColor,
      roughness: 0.85,
      metalness: 0.05,
    });
    return [edge, edge, edge, edge, front, edge];
  }, [texture, coverColor]);

  return (
    <mesh
      ref={meshRef}
      material={materials}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 0.15]} />
    </mesh>
  );
}

function CDCaseWithColor({ coverColor = "#1a1a1a" }: { coverColor?: string }) {
  const { meshRef, setHovered, onPointerDown, onPointerUp, onPointerMove } =
    useCDCaseInteraction();

  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: "#0d0d0d",
      roughness: 0.9,
      metalness: 0,
    });
    const front = new THREE.MeshStandardMaterial({
      color: coverColor,
      roughness: 0.85,
      metalness: 0.05,
    });
    return [edge, edge, edge, edge, front, edge];
  }, [coverColor]);

  return (
    <mesh
      ref={meshRef}
      material={materials}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 0.15]} />
    </mesh>
  );
}

export default function CDCase({
  textureUrl,
  coverColor = "#1a1a1a",
}: CDCaseProps) {
  if (textureUrl) {
    return (
      <Suspense fallback={<CDCaseWithColor coverColor={coverColor} />}>
        <CDCaseWithTexture textureUrl={textureUrl} coverColor={coverColor} />
      </Suspense>
    );
  }
  return <CDCaseWithColor coverColor={coverColor} />;
}
