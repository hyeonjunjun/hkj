"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ─── Starfield — distant bright pinpricks, additive ─────────────────────── */
function Starfield() {
  const ref = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) * 0.9;

      sizes[i] = Math.random() < 0.04 ? 0.18 : Math.random() < 0.25 ? 0.09 : 0.04;
      alphas[i] = 0.35 + Math.random() * 0.55;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;
        uniform float uTime;
        void main() {
          vAlpha = alpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float twinkle = 0.7 + 0.3 * sin(uTime * 1.1 + position.x * 11.0 + position.y * 7.0);
          gl_PointSize = size * twinkle * (300.0 / -mv.z);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(0.98, 0.96, 0.92, a);
        }
      `,
      uniforms: { uTime: { value: 0 } },
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((state) => {
    const m = material as THREE.ShaderMaterial;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.004;
    }
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

/* ─── Dust cloud — volumetric-looking nebulous smear (blue) ────────────────── */
function DustCloud({
  origin,
  count,
  radius,
  color,
  density = 1.0,
  stretch = [1, 1, 1],
}: {
  origin: [number, number, number];
  count: number;
  radius: number;
  color: string;
  density?: number;
  stretch?: [number, number, number];
}) {
  const ref = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);

    const threshold = 0.25;
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < count * 8) {
      attempts++;
      // Gaussian-like distribution — sum of two randoms for smoother density
      const gx = (Math.random() - 0.5 + Math.random() - 0.5);
      const gy = (Math.random() - 0.5 + Math.random() - 0.5);
      const gz = (Math.random() - 0.5 + Math.random() - 0.5);
      const r = Math.sqrt(gx * gx + gy * gy + gz * gz);
      // Noise-driven density — reject points in sparse regions
      const n =
        Math.sin(gx * 4.3 + gy * 2.1) * 0.5 +
        Math.sin(gy * 5.2 + gz * 3.7) * 0.5;
      if (n < threshold - density * 0.6) continue;

      positions[placed * 3] = origin[0] + gx * radius * stretch[0];
      positions[placed * 3 + 1] = origin[1] + gy * radius * stretch[1];
      positions[placed * 3 + 2] = origin[2] + gz * radius * stretch[2];
      alphas[placed] = Math.max(0, 0.5 - r * 0.5) * density;
      sizes[placed] = 0.45 + Math.random() * 0.65;
      placed++;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.slice(0, placed * 3), 3),
    );
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas.slice(0, placed), 1));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes.slice(0, placed), 1));

    // Dust — bright additive particles forming volumetric haze
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float alpha;
        attribute float size;
        varying float vAlpha;
        uniform float uTime;
        void main() {
          vAlpha = alpha;
          vec3 p = position;
          p.x += sin(uTime * 0.08 + position.y * 3.0) * 0.04;
          p.y += cos(uTime * 0.07 + position.x * 3.0) * 0.04;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (420.0 / -mv.z);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = pow(max(0.0, 1.0 - d * 2.0), 2.2) * vAlpha * 0.32;
          gl_FragColor = vec4(0.92, 0.94, 0.98, a);
        }
      `,
    });
    return { geometry: geo, material: mat };
  }, [count, radius, color, density, stretch, origin]);

  useFrame((state) => {
    const m = material as THREE.ShaderMaterial;
    m.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

/* ─── Bipolar jet — elongated particle stream from origin in a direction ───── */
function Jet({
  direction,
  count,
  length,
  color,
  origin = [0, 0, 0],
  coreColor = "#ffffff",
}: {
  direction: [number, number, number];
  count: number;
  length: number;
  color: string;
  coreColor?: string;
  origin?: [number, number, number];
}) {
  const { geometry, material } = useMemo(() => {
    // Normalize direction
    const dir = new THREE.Vector3(...direction).normalize();
    // Pick an arbitrary perpendicular
    const tmp =
      Math.abs(dir.y) < 0.9
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(1, 0, 0);
    const perp1 = new THREE.Vector3().crossVectors(dir, tmp).normalize();
    const perp2 = new THREE.Vector3().crossVectors(dir, perp1).normalize();

    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const tRaw = Math.random();
      const t = Math.pow(tRaw, 1.6);
      const axisDist = t * length;

      // Tighter spread — jet reads as a focused beam, not a cone
      const spread = 0.015 + t * 0.18;
      const radAngle = Math.random() * Math.PI * 2;
      const radMag = Math.pow(Math.random(), 0.8) * spread;

      const px =
        origin[0] + dir.x * axisDist +
        perp1.x * Math.cos(radAngle) * radMag +
        perp2.x * Math.sin(radAngle) * radMag;
      const py =
        origin[1] + dir.y * axisDist +
        perp1.y * Math.cos(radAngle) * radMag +
        perp2.y * Math.sin(radAngle) * radMag;
      const pz =
        origin[2] + dir.z * axisDist +
        perp1.z * Math.cos(radAngle) * radMag +
        perp2.z * Math.sin(radAngle) * radMag;

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      // Bright additive — denser near core, sparser at tip
      alphas[i] = Math.pow(1 - t, 0.5) * 0.75;
      sizes[i] = 0.18 + (1 - t) * 0.42;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uDir: { value: new THREE.Vector3(...direction).normalize() },
      },
      vertexShader: `
        attribute float alpha;
        attribute float size;
        varying float vAlpha;
        uniform float uTime;
        uniform vec3 uDir;
        void main() {
          vAlpha = alpha;
          vec3 p = position + uDir * (sin(uTime * 0.25 + position.x * 8.0 + position.y * 6.0) * 0.05);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (420.0 / -mv.z);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = pow(max(0.0, 1.0 - d * 2.0), 1.6) * vAlpha;
          gl_FragColor = vec4(0.95, 0.96, 0.98, a);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, [direction, count, length, color, coreColor, origin]);

  useFrame((state) => {
    const m = material as THREE.ShaderMaterial;
    m.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} />;
}

/* ─── Protostar core — intense central point + diffraction spikes ───────── */
function Protostar() {
  const ref = useRef<THREE.Mesh>(null);
  const spikeTex = useDiffractionSpikeTexture();
  const glowTex = useRadialGradientTexture("#ffffff");

  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <>
      {/* Outer diffuse halo */}
      <sprite position={[0, 0, 0.01]} scale={[3.2, 3.2, 1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      {/* Tight inner glow */}
      <sprite position={[0, 0, 0.02]} scale={[0.7, 0.7, 1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      {/* Diffraction spikes — the signature telescope-optical cross */}
      <sprite position={[0, 0, 0.03]} scale={[6.0, 6.0, 1]}>
        <spriteMaterial
          map={spikeTex}
          transparent
          depthWrite={false}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      {/* Core bright point */}
      <mesh ref={ref} position={[0, 0, 0.04]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </>
  );
}

/* ─── Diffraction spike sprite — telescope-optical star pattern ──────────── */
function useDiffractionSpikeTexture() {
  return useMemo(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d");
    if (!ctx) return new THREE.Texture();

    ctx.clearRect(0, 0, size, size);
    const cx = size / 2;
    const cy = size / 2;

    // Primary 4-point cross — thin long spikes (horiz + vert)
    const drawSpike = (angleRad: number, len: number, thick: number, alpha: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRad);
      // Gradient along the length
      const g = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
      g.addColorStop(0, `rgba(255,255,255,0)`);
      g.addColorStop(0.45, `rgba(255,255,255,${alpha * 0.5})`);
      g.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.55, `rgba(255,255,255,${alpha * 0.5})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = g;
      // Soft elliptical brush along x-axis
      ctx.beginPath();
      ctx.ellipse(0, 0, len / 2, thick / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Main cross — horizontal + vertical (longer, thinner)
    drawSpike(0, size * 0.92, size * 0.012, 1.0);           // horizontal
    drawSpike(Math.PI / 2, size * 0.92, size * 0.012, 1.0); // vertical
    // Diagonal spikes — shorter, thinner, lower alpha (typical Hubble pattern)
    drawSpike(Math.PI / 4, size * 0.55, size * 0.008, 0.55);
    drawSpike(-Math.PI / 4, size * 0.55, size * 0.008, 0.55);

    // Central bright disk
    const disk = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.08);
    disk.addColorStop(0, "rgba(255,255,255,1)");
    disk.addColorStop(0.4, "rgba(255,255,255,0.6)");
    disk.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = disk;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* ─── Radial gradient sprite helper ──────────────────────────────────────── */
function useRadialGradientTexture(color: string) {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2,
    );
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, color.replace(")", ", 0.35)").replace("rgb", "rgba"));
    grad.addColorStop(1, "rgba(0,0,0,0)");
    // Fallback if string replacement failed
    const c = new THREE.Color(color);
    const hex = `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
    ctx.clearRect(0, 0, size, size);
    const grad2 = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2,
    );
    grad2.addColorStop(0, `${hex},1)`);
    grad2.addColorStop(0.4, `${hex},0.4)`);
    grad2.addColorStop(1, `${hex},0)`);
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [color]);
}

/* ─── Scene root ─────────────────────────────────────────────────────────── */
function Scene() {
  const { camera, gl } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Set clear color explicitly — pure near-black deep space
  useMemo(() => {
    gl.setClearColor("#030408", 1);
  }, [gl]);

  useFrame((state) => {
    // Very subtle camera parallax on mouse
    const t = state.clock.elapsedTime;
    const target = {
      x: state.pointer.x * 0.12,
      y: state.pointer.y * 0.08,
    };
    mouseRef.current.x += (target.x - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (target.y - mouseRef.current.y) * 0.02;
    camera.position.x = mouseRef.current.x;
    camera.position.y = mouseRef.current.y + Math.sin(t * 0.08) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Distant stars */}
      <Starfield />

      {/* Main dust haze — upper-left nebulous smear, bright bluish-white */}
      <DustCloud
        origin={[-1.4, 1.0, -0.5]}
        count={700}
        radius={1.9}
        color="#e8eef8"
        density={1.0}
        stretch={[1.3, 1.0, 0.9]}
      />

      {/* Tighter inner dust around the core */}
      <DustCloud
        origin={[0, 0, 0]}
        count={320}
        radius={0.55}
        color="#f0f2f8"
        density={1.3}
        stretch={[1.1, 0.85, 0.9]}
      />

      {/* Bipolar jets — bright additive streams, grayscale */}
      <Jet
        direction={[1, -1.1, 0.1]}
        count={520}
        length={3.8}
        color="#ffffff"
        coreColor="#ffffff"
      />
      {/* Opposing jet — fainter, shorter (matches reference asymmetry) */}
      <Jet
        direction={[-1, 1.1, -0.1]}
        count={320}
        length={2.4}
        color="#d8dde8"
        coreColor="#ffffff"
      />

      {/* Central protostar */}
      <Protostar />
    </>
  );
}

/* ─── Exported component ─────────────────────────────────────────────────── */
export default function CosmosScene() {
  return (
    <div className="cosmos-scene-wrap" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        style={{ background: "#030408" }}
      >
        <Scene />
        <EffectComposer>
          {/* Subtle bloom — only blows out the central bright core + spikes */}
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.92}
            mipmapBlur
          />
          <Vignette offset={0.32} darkness={0.52} eskil={false} />
          <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.22} />
        </EffectComposer>
      </Canvas>

      <style>{`
        .cosmos-scene-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #030408;
        }
        .cosmos-scene-wrap canvas {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
