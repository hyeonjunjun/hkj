"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useMemo, useRef } from "react";

/**
 * ProtostellarScene — dense WebGL particle recreation of a Herbig-Haro
 * protostellar jet. Four primary systems composed additively with bloom:
 *
 *   Starfield   — 28k pinpoint twinkling stars (background depth)
 *   DustCloud   — 16k soft particles, upper-left nebular mass
 *   Jet         — 18k particles along a diagonal axis, asymmetric brightness
 *   Protostar   — canvas-textured diffraction spike + halo + bright core
 *
 * All motion is driven by a single `uTime` uniform — no per-frame geometry
 * upload, so the scene scales to 60k+ particles at 60fps.
 */

// ─────────────────────────────────────────────────────────────────────────
// Shaders
// ─────────────────────────────────────────────────────────────────────────

const STAR_VERT = /* glsl */ `
  attribute float seed;
  attribute float baseSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vWarm;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = baseSize * uPixelRatio * (1.0 / -mv.z);

    // Async twinkle
    float tw = 0.55 + 0.45 * sin(uTime * 1.6 + seed * 43.0);
    vAlpha = (0.35 + 0.65 * tw) * mix(0.4, 1.0, seed);
    vWarm = seed; // used to tint a few stars warmer
  }
`;

const STAR_FRAG = /* glsl */ `
  varying float vAlpha;
  varying float vWarm;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d);
    // Cross-spike tiny: faint diffraction on the brightest stars only
    float spike = (1.0 - smoothstep(0.0, 0.03, min(abs(uv.x), abs(uv.y))))
                  * smoothstep(0.5, 0.0, max(abs(uv.x), abs(uv.y))) * 0.35;
    a = clamp(a + spike * step(0.93, vWarm), 0.0, 1.0) * vAlpha;
    if (a < 0.01) discard;
    // Most stars cool-white, a handful warm
    vec3 col = mix(vec3(0.94, 0.95, 1.0), vec3(1.0, 0.93, 0.82), step(0.92, vWarm));
    gl_FragColor = vec4(col, a);
  }
`;

const DUST_VERT = /* glsl */ `
  attribute float seed;
  attribute float baseSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;

  void main() {
    // Slow drift
    vec3 pos = position;
    pos.x += sin(uTime * 0.08 + seed * 30.0) * 0.012;
    pos.y += cos(uTime * 0.07 + seed * 19.0) * 0.010;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = baseSize * uPixelRatio * (1.0 / -mv.z);

    // Subtle flicker
    float fl = 0.75 + 0.25 * sin(uTime * 0.4 + seed * 12.0);
    vAlpha = mix(0.42, 1.25, seed) * fl;
  }
`;

const DUST_FRAG = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.005) discard;
    gl_FragColor = vec4(vec3(0.92, 0.95, 1.05) * 1.35, a);
  }
`;

const JET_VERT = /* glsl */ `
  attribute float seed;
  attribute float along;      // -1..1 along jet axis (positive = bright side)
  attribute float baseSize;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vAlong;

  void main() {
    // Slight clump displacement along the axis, advected by time
    vec3 pos = position;
    float advect = uTime * 0.12;
    float wobble = sin(along * 6.0 + seed * 8.0 + advect) * 0.01;
    pos.xy += wobble;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = baseSize * uPixelRatio * (1.0 / -mv.z);

    // Asymmetric brightness: bright toward +along (lower-right)
    float asym = mix(0.55, 1.0, smoothstep(-0.3, 0.3, along));
    // Clumpy modulation along the jet
    float clump = 0.55 + 0.45 * abs(sin(along * 9.0 + advect * 1.3) * cos(along * 17.0 - advect));
    // Radial falloff from axis handled by position density — additional taper with distance
    float taper = 1.0 - smoothstep(0.0, 1.5, abs(along));
    vAlpha = asym * clump * mix(0.55, 1.4, taper) * mix(0.55, 1.0, seed);
    vAlong = along;
  }
`;

const JET_FRAG = /* glsl */ `
  varying float vAlpha;
  varying float vAlong;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.01) discard;
    // Warm-white toward bright end, slightly blue toward dim end
    vec3 col = mix(vec3(0.88, 0.92, 1.05), vec3(1.05, 1.0, 0.9), smoothstep(-0.2, 0.6, vAlong));
    gl_FragColor = vec4(col * 1.6, a);
  }
`;

// ─────────────────────────────────────────────────────────────────────────
// Subsystems
// ─────────────────────────────────────────────────────────────────────────

// Box-Muller approximate
function randGauss() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function Starfield({ count }: { count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { positions, seeds, sizes } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Wide spread, pushed back for parallax depth
      p[i * 3 + 0] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 14;
      p[i * 3 + 2] = -6 - Math.random() * 8;
      s[i] = Math.random();
      // Occasional bright star
      sz[i] = Math.random() < 0.03 ? 2.6 + Math.random() * 1.8 : 0.7 + Math.random() * 0.8;
    }
    return { positions: p, seeds: s, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  const { size: viewport } = useThree();
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-baseSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={STAR_VERT}
        fragmentShader={STAR_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uPixelRatio: { value: dpr * (viewport.height / 900) },
        }}
      />
    </points>
  );
}

function DustCloud({ count }: { count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds, sizes } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const sz = new Float32Array(count);
    // Cloud centered upper-left of the jet's dim side
    const center = new THREE.Vector3(-1.6, 0.95, -1.6);
    for (let i = 0; i < count; i++) {
      // Tighter ellipsoid — higher local density so it reads as a cloud
      const r = Math.pow(Math.random(), 0.55) * 1.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      // Elongate along jet-axis direction (upper-left to lower-right)
      const axElong = 1.25;
      const axUx = 0.707, axUy = 0.707; // perpendicular to jet axis(1,-1), so (1,1)/sqrt2
      const baseX = r * Math.sin(phi) * Math.cos(theta);
      const baseY = r * Math.sin(phi) * Math.sin(theta);
      // Stretch along the (1, -1) axis by mapping basis
      const alongJet = baseX * 0.707 - baseY * 0.707;
      const perpJet = baseX * 0.707 + baseY * 0.707;
      const ex = (alongJet * axElong) * 0.707 + perpJet * 0.707;
      const ey = -(alongJet * axElong) * 0.707 + perpJet * 0.707;
      const ez = r * Math.cos(phi) * 0.55;
      p[i * 3 + 0] = center.x + ex;
      p[i * 3 + 1] = center.y + ey;
      p[i * 3 + 2] = center.z + ez;
      s[i] = Math.random();
      sz[i] = 2.6 + Math.random() * 3.0;
    }
    return { positions: p, seeds: s, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  const { size: viewport } = useThree();
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-baseSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={DUST_VERT}
        fragmentShader={DUST_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uPixelRatio: { value: dpr * (viewport.height / 900) },
        }}
      />
    </points>
  );
}

function Jet({ count }: { count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds, along, sizes } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const a = new Float32Array(count);
    const sz = new Float32Array(count);
    // Jet axis unit vector: diagonal (upper-left → lower-right)
    const ax = new THREE.Vector3(1, -1, 0).normalize();
    const perp = new THREE.Vector3(1, 1, 0).normalize();
    const up = new THREE.Vector3(0, 0, 1);

    for (let i = 0; i < count; i++) {
      // Asymmetric distribution: 72% on bright side, 28% on dim
      const bright = Math.random() < 0.72;
      const signedT = bright ? Math.pow(Math.random(), 1.35) : -Math.pow(Math.random(), 1.6);
      const alongDist = signedT * 4.2;

      // Perpendicular scatter (widens with distance)
      const widthRadius = 0.03 + 0.065 * Math.abs(alongDist);
      const r = Math.abs(randGauss()) * widthRadius;
      const theta = Math.random() * Math.PI * 2;

      const pt = ax.clone().multiplyScalar(alongDist);
      pt.add(perp.clone().multiplyScalar(r * Math.cos(theta)));
      pt.add(up.clone().multiplyScalar(r * Math.sin(theta) * 0.7));
      pt.z -= 1.5;

      p[i * 3 + 0] = pt.x;
      p[i * 3 + 1] = pt.y;
      p[i * 3 + 2] = pt.z;
      s[i] = Math.random();
      a[i] = alongDist;
      // Bigger particles near the core, smaller out toward the tails
      sz[i] = (bright ? 1.9 : 1.4) + Math.random() * 1.2 - Math.abs(alongDist) * 0.18;
    }
    return { positions: p, seeds: s, along: a, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  const { size: viewport } = useThree();
  const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-seed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-along" args={[along, 1]} />
        <bufferAttribute attach="attributes-baseSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={JET_VERT}
        fragmentShader={JET_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uPixelRatio: { value: dpr * (viewport.height / 900) },
        }}
      />
    </points>
  );
}

function Protostar() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      const breath = 1 + 0.04 * Math.sin(t * 0.6);
      coreRef.current.scale.setScalar(breath);
    }
  });

  // No sprite, no texture — the particle jet's own density at origin
  // forms the bright center. A tiny emissive core just feeds the bloom.
  return (
    <mesh ref={coreRef} position={[0, 0, -1]}>
      <sphereGeometry args={[0.018, 20, 20]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </mesh>
  );
}

function CursorParallax() {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    target.current.x = pointer.x * 0.25;
    target.current.y = pointer.y * 0.15;
    camera.position.x += (target.current.x - camera.position.x) * 0.025;
    camera.position.y += (target.current.y - camera.position.y) * 0.025;
    camera.lookAt(0, 0, -1);
  });
  return null;
}

function Scene() {
  return (
    <>
      <Starfield count={28000} />
      <DustCloud count={22000} />
      <Jet count={22000} />
      <Protostar />
      <CursorParallax />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────

export default function ProtostellarScene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 50 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#020308", 1);
      }}
    >
      <Scene />
      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.52} eskil={false} />
        <Noise
          opacity={0.09}
          blendFunction={BlendFunction.OVERLAY}
          premultiply
        />
      </EffectComposer>
    </Canvas>
  );
}
