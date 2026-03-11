"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import FluidBackground from "./FluidBackground";

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]} // Support retina but cap at 2 for performance
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <FluidBackground />
        </Suspense>
      </Canvas>
    </div>
  );
}
