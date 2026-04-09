"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   Star generation — density flows toward an off-center
   "galactic core" (upper-right quadrant) so the field
   feels composed, not random.
   ──────────────────────────────────────────────────────────── */

function generateStars(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  // Galactic center bias — upper-right, slightly behind camera
  const coreX = 15;
  const coreY = 8;
  const coreZ = -30;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // 60% stars cluster near core, 40% are scattered broadly
    const nearCore = Math.random() < 0.6;

    if (nearCore) {
      // Gaussian-ish distribution around core
      const r = Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = coreX + r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = coreY + r * Math.sin(phi) * Math.sin(theta) * 0.4; // flatten vertically
      positions[i3 + 2] = coreZ + r * Math.cos(phi);
    } else {
      // Broad scatter across the hemisphere
      positions[i3] = (Math.random() - 0.5) * 120;
      positions[i3 + 1] = (Math.random() - 0.3) * 80; // slight upward bias
      positions[i3 + 2] = -10 - Math.random() * 80;
    }
  }
  return positions;
}

function generateStarAttributes(count: number) {
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const twinklePhase = new Float32Array(count);
  const twinkleSpeed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Size distribution: most stars are tiny, a few are bright
    const brightness = Math.random();
    sizes[i] = brightness < 0.92 ? 0.3 + Math.random() * 0.8 : 1.5 + Math.random() * 2.5;

    // Color temperature: blue-white (hot) to warm gold (cool)
    const temp = Math.random();
    const i3 = i * 3;
    if (temp < 0.3) {
      // Cool blue-white
      colors[i3] = 0.75 + Math.random() * 0.25;
      colors[i3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i3 + 2] = 0.95 + Math.random() * 0.05;
    } else if (temp < 0.7) {
      // Neutral white
      colors[i3] = 0.9 + Math.random() * 0.1;
      colors[i3 + 1] = 0.88 + Math.random() * 0.12;
      colors[i3 + 2] = 0.85 + Math.random() * 0.15;
    } else {
      // Warm gold
      colors[i3] = 0.95 + Math.random() * 0.05;
      colors[i3 + 1] = 0.8 + Math.random() * 0.15;
      colors[i3 + 2] = 0.5 + Math.random() * 0.2;
    }

    twinklePhase[i] = Math.random() * Math.PI * 2;
    twinkleSpeed[i] = 0.3 + Math.random() * 1.2;
  }

  return { sizes, colors, twinklePhase, twinkleSpeed };
}

/* ────────────────────────────────────────────────────────────
   Star Points — the main star field
   ──────────────────────────────────────────────────────────── */

const starVertexShader = `
  attribute float size;
  attribute float twinklePhase;
  attribute float twinkleSpeed;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    // Twinkle: subtle brightness oscillation
    float twinkle = 0.6 + 0.4 * sin(uTime * twinkleSpeed + twinklePhase);
    vAlpha = twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Size attenuation
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 0.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circle with glow falloff
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Core is bright, edge fades with a glow curve
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    float alpha = (core * 0.8 + glow * 0.35) * vAlpha;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

function Stars({ count = 2500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const positions = useMemo(() => generateStars(count), [count]);
  const { sizes, colors, twinklePhase, twinkleSpeed } = useMemo(
    () => generateStarAttributes(count),
    [count]
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-twinklePhase" args={[twinklePhase, 1]} />
        <bufferAttribute attach="attributes-twinkleSpeed" args={[twinkleSpeed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

/* ────────────────────────────────────────────────────────────
   Moon — a softly lit sphere with atmospheric glow
   ──────────────────────────────────────────────────────────── */

function Moon() {
  const moonRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (moonRef.current) {
      // Very slow rotation — the moon barely moves
      moonRef.current.rotation.y = clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <group ref={moonRef} position={[18, 12, -45]}>
      {/* Moon body — subtle, not fully lit */}
      <mesh>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#d4cfc8"
          emissive="#2a2520"
          emissiveIntensity={0.15}
          roughness={0.95}
          metalness={0.0}
        />
      </mesh>

      {/* Inner glow — tight halo around the moon */}
      <mesh ref={glowRef} scale={[1.15, 1.15, 1.15]}>
        <sphereGeometry args={[3, 32, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mvp = modelViewMatrix * vec4(position, 1.0);
              vViewPosition = -mvp.xyz;
              gl_Position = projectionMatrix * mvp;
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              float rim = 1.0 - max(0.0, dot(normalize(vViewPosition), vNormal));
              float glow = pow(rim, 2.5) * 0.6;
              // Warm moonlight color
              vec3 moonColor = vec3(0.85, 0.8, 0.7);
              gl_FragColor = vec4(moonColor, glow);
            }
          `}
        />
      </mesh>

      {/* Outer atmospheric glow — larger, softer */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[3, 16, 16]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vec4 mvp = modelViewMatrix * vec4(position, 1.0);
              vViewPosition = -mvp.xyz;
              gl_Position = projectionMatrix * mvp;
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              float rim = 1.0 - max(0.0, dot(normalize(vViewPosition), vNormal));
              float glow = pow(rim, 4.0) * 0.12;
              vec3 haze = vec3(0.7, 0.65, 0.55);
              gl_FragColor = vec4(haze, glow);
            }
          `}
        />
      </mesh>

      {/* Moon's directional light — casts subtle illumination */}
      <pointLight
        color="#d4cfc8"
        intensity={0.3}
        distance={80}
        decay={2}
      />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────
   Nebula planes — soft color atmospheres at depth
   ──────────────────────────────────────────────────────────── */

function NebulaPlane({
  position,
  color,
  scale,
  opacity,
  rotation,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  opacity: number;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[scale, scale]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            vec2 center = vUv - 0.5;
            float dist = length(center);
            // Soft radial falloff with irregular edges
            float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;
            // Slight noise variation
            float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
            alpha *= 0.8 + noise * 0.2;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

/* ────────────────────────────────────────────────────────────
   Camera controller — subtle parallax from mouse movement
   ──────────────────────────────────────────────────────────── */

function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalize to -1...1
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    // Smooth follow — very subtle
    target.current.x += (mouse.current.x - target.current.x) * 0.02;
    target.current.y += (mouse.current.y - target.current.y) * 0.02;

    camera.position.x = target.current.x * 1.5;
    camera.position.y = target.current.y * 0.8;
    camera.lookAt(0, 0, -40);
  });

  return null;
}

/* ────────────────────────────────────────────────────────────
   Assembled scene
   ──────────────────────────────────────────────────────────── */

function Scene() {
  return (
    <>
      <color attach="background" args={["#0D0D0D"]} />
      <ambientLight intensity={0.03} />

      <CameraRig />
      <Stars count={2500} />
      <Moon />

      {/* Nebula atmospheres — very subtle color washes */}
      <NebulaPlane
        position={[20, 10, -55]}
        color="#3a2a1a"
        scale={40}
        opacity={0.04}
        rotation={[0, 0, 0.3]}
      />
      <NebulaPlane
        position={[-15, -5, -60]}
        color="#1a1a2a"
        scale={50}
        opacity={0.03}
        rotation={[0, 0, -0.2]}
      />
      <NebulaPlane
        position={[5, 15, -70]}
        color="#2a2015"
        scale={35}
        opacity={0.025}
        rotation={[0.1, 0, 0.5]}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   Export — fixed fullscreen canvas behind all content
   ──────────────────────────────────────────────────────────── */

export default function StarField() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ pointerEvents: "auto" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
