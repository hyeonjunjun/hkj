"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useTheaterStore } from "@/store/useTheaterStore";
import { PIECES } from "@/constants/pieces";
import CDCase from "./CDCase";

export default function Scene3D() {
  const selectedSlug = useTheaterStore((s) => s.selectedSlug);

  const piece = PIECES.find((p) => p.slug === selectedSlug);
  const textureUrl = piece?.coverArt ?? piece?.image;
  const coverColor = piece?.cover.bg ?? "#1a1a1a";

  return (
    <motion.div
      layoutId="scene3d"
      className="w-full h-full"
      transition={{ type: "spring" as const, stiffness: 200, damping: 28 }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => {
          // Click on empty space — do nothing, but allows R3F to handle pointer events
        }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={0.7}
          color="#f0eee8"
        />
        {/* Fill light from opposite side */}
        <directionalLight
          position={[-2, -1, 3]}
          intensity={0.15}
          color="#e0ddd5"
        />

        <Suspense fallback={null}>
          <CDCase
            key={selectedSlug}
            textureUrl={textureUrl}
            coverColor={coverColor}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
