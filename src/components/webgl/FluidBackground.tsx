"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLenis } from "lenis/react";

// We will use a custom shader material for the fluid background
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScrollVelocity;
  varying vec2 vUv;

  // Simple noise function for fluid simulation look
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // 2D Noise
  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

    vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step( a.y, a.x ); 
    vec2  o = vec2( m, 1.0 - m );
    vec2  b = a - o + K2;
    vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5 - vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
  }

  void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;

    // Time + Scroll influence
    float t = uTime * 0.15;
    
    // Distort UVs using noise and scroll velocity
    vec2 q = vec2(0.);
    q.x = noise(st + t);
    q.y = noise(st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = noise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
    r.y = noise(st + 1.0 * q + vec2(8.3, 2.8) + 0.12 * t);

    float f = noise(st + r * (2.0 + uScrollVelocity * 0.05));

    // Map noise value to monochrome color space (very dark, brutalist)
    // f goes from ~-1 to 1.
    f = (f * 0.5) + 0.5;
    
    // Core color
    vec3 color = mix(
      vec3(0.02, 0.02, 0.02), // Deep black-grey
      vec3(0.12, 0.12, 0.12), // Subtle light grey highlight
      clamp((f*f)*4.0, 0.0, 1.0)
    );

    // Add a very subtle structural scanline 
    float scanline = sin(vUv.y * 800.0) * 0.02;
    color -= scanline;

    // Apply vignette
    float dist = length(vUv - 0.5);
    color *= smoothstep(0.8, 0.2, dist);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function FluidBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  
  // Track targeted scroll velocity
  const targetVelocity = useRef(0);

  // Hook into Lenis scroll events
  useLenis((lenis) => {
    // Lenis velocity can be quite high, so we scale it down
    targetVelocity.current = lenis.velocity * 0.01;
  });

  // Create uniforms once
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uScrollVelocity: { value: 0 },
    }),
    [size.width, size.height]
  );

  // Hook into the render loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Smoothly interpolate the actual uniform towards the target velocity
      materialRef.current.uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uScrollVelocity.value,
        targetVelocity.current,
        0.1
      );

      // Also gently decay the target velocity back to 0 if we stop scrolling
      targetVelocity.current = THREE.MathUtils.lerp(targetVelocity.current, 0, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
