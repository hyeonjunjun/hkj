"use client";

import { Suspense, useRef, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import CDCase from "./CDCase";
import * as THREE from "three";

/**
 * Invisible plane that fills the canvas and captures all drag events.
 * Passes drag rotation to the CDCase via a shared ref.
 */
function DragController({
  dragRef,
}: {
  dragRef: React.MutableRefObject<{
    isDragging: boolean;
    velocityX: number;
    velocityY: number;
  }>;
}) {
  const lastPointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const onPointerDown = useCallback(
    (e: THREE.Event & { clientX?: number; clientY?: number; nativeEvent?: PointerEvent }) => {
      const ne = (e as unknown as { nativeEvent: PointerEvent }).nativeEvent;
      if (!ne) return;
      dragRef.current.isDragging = true;
      lastPointer.current = { x: ne.clientX, y: ne.clientY };
      dragRef.current.velocityX = 0;
      dragRef.current.velocityY = 0;
    },
    [dragRef]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current.isDragging = false;
  }, [dragRef]);

  const onPointerMove = useCallback(
    (e: THREE.Event & { nativeEvent?: PointerEvent }) => {
      if (!dragRef.current.isDragging) return;
      const ne = (e as unknown as { nativeEvent: PointerEvent }).nativeEvent;
      if (!ne) return;
      const dx = (ne.clientX - lastPointer.current.x) / size.width;
      const dy = (ne.clientY - lastPointer.current.y) / size.height;
      dragRef.current.velocityX = dx * 4;
      dragRef.current.velocityY = dy * 4;
      lastPointer.current = { x: ne.clientX, y: ne.clientY };
    },
    [dragRef, size]
  );

  return (
    <mesh
      visible={false}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerMove={onPointerMove}
    >
      {/* Large invisible plane to catch all pointer events */}
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

export default function Scene3D() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);

  const piece = PIECES.find((p) => p.slug === selectedSlug);
  const textureUrl = piece?.coverArt ?? piece?.image;
  const coverColor = piece?.cover.bg ?? "#1a1a1a";

  const dragRef = useRef({
    isDragging: false,
    velocityX: 0,
    velocityY: 0,
  });

  return (
    <motion.div
      layoutId="scene3d"
      className="w-full h-full"
      transition={{ type: "spring" as const, stiffness: 200, damping: 28 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 2]}
        frameloop="always"
        style={{ background: "transparent", cursor: "grab" }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Studio lighting — 3-point */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[3, 4, 5]} intensity={0.8} color="#f0eee8" />
        <directionalLight position={[-3, 0, 3]} intensity={0.25} color="#e0ddd5" />
        <directionalLight position={[0, -2, -4]} intensity={0.15} color="#ffffff" />

        {/* Contact shadow */}
        <ContactShadows
          position={[0, -1.1, 0]}
          opacity={0.3}
          blur={2}
          far={4}
          color="#000000"
        />

        <DragController dragRef={dragRef} />

        <Suspense fallback={null}>
          <CDCase
            key={selectedSlug}
            textureUrl={textureUrl}
            coverColor={coverColor}
            dragRef={dragRef}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
