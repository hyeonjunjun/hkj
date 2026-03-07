"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * BlobVideoShader
 * ───────────────
 * Renders an HTML5 video as a WebGL texture and applies a custom
 * displacement/distortion shader based on mouse position.
 */

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_hoverState;

varying vec2 vUv;

// Add some noise for the blob edge distortion
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
    vec2 p = vUv;
    vec2 uv = p;
    
    // Normalize mouse coordinate to match aspect ratio
    vec2 mouse = u_mouse;
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Aspect ratio correction (assume widescreen video, e.g., 16:9)
    float aspect = u_resolution.x / u_resolution.y;
    st.x *= aspect;
    mouse.x *= aspect;

    // Calculate distance from modified pixel to mouse
    float dist = distance(st, mouse);

    // The blob size and depth
    float radius = 0.25;
    float depth = 0.8;

    // Smoothstep for a soft organic edge
    float influence = smoothstep(radius, 0.0, dist);

    // Add subtle wave distortion inside the blob based on time
    float waveX = sin(dist * 20.0 - u_time * 2.0) * 0.05 * influence;
    float waveY = cos(dist * 20.0 - u_time * 2.0) * 0.05 * influence;

    // UV distortion vector
    // Displace outward from the mouse center
    vec2 dir = normalize(st - mouse);
    // Multiply by influence and depth to curve the light like a glass lens
    vec2 distortion = dir * influence * depth * u_hoverState + vec2(waveX, waveY);

    // Sample texture with displaced UVs
    vec4 color = texture2D(u_texture, uv - distortion);

    gl_FragColor = color;
}
`;

function ShaderMaterial({ video }: { video: HTMLVideoElement | null }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size, viewport } = useThree();

    // Setup uniform data
    const uniforms = useMemo(
        () => ({
            u_texture: { value: null as THREE.Texture | null },
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_resolution: { value: new THREE.Vector2(0, 0) },
            u_time: { value: 0 },
            u_hoverState: { value: 0 },
        }),
        []
    );

    // Generate video texture once video is available
    const videoTexture = useMemo(() => {
        if (!video) return null;
        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        // Optionally set color space if using sRGB
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }, [video]);

    useEffect(() => {
        if (materialRef.current && videoTexture) {
            uniforms.u_texture.value = videoTexture;
        }
    }, [videoTexture, uniforms]);

    // Handle resize
    useEffect(() => {
        uniforms.u_resolution.value.set(size.width, size.height);
    }, [size, uniforms]);

    // Smooth trailing mouse position
    const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
    const currentMouse = useRef(new THREE.Vector2(0.5, 0.5));
    const targetHover = useRef(0);
    const currentHover = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalized coordinates (0 to 1) where bottom-left is (0,0) in GLSL
            const x = e.clientX / window.innerWidth;
            const y = 1.0 - (e.clientY / window.innerHeight);
            targetMouse.current.set(x, y);
            targetHover.current = 1.0;
        };

        const handleMouseLeave = () => {
            targetHover.current = 0.0;
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    useFrame((state) => {
        if (!materialRef.current) return;

        // Lerp mouse for organic feel
        currentMouse.current.lerp(targetMouse.current, 0.1);
        uniforms.u_mouse.value.copy(currentMouse.current);

        // Lerp hover state (fade in/out distortion)
        currentHover.current += (targetHover.current - currentHover.current) * 0.1;
        uniforms.u_hoverState.value = currentHover.current;

        // Update time
        uniforms.u_time.value = state.clock.getElapsedTime();
    });

    // Scale the plane to cover the viewport
    const scale = Math.max(viewport.width, viewport.height * (16 / 9));

    return (
        <mesh ref={meshRef} scale={[scale, scale * (9 / 16), 1]}>
            <planeGeometry args={[1, 1, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    );
}

export default function BlobVideoShader({ videoSrc }: { videoSrc: string }) {
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = document.createElement("video");
        video.src = videoSrc;
        video.crossOrigin = "Anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = true;
        video.play().catch(e => console.error("Video play failed", e));
        setVideoElement(video);

        return () => {
            video.pause();
            video.src = "";
            video.load();
        };
    }, [videoSrc]);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1], zoom: 1 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                {videoElement && <ShaderMaterial video={videoElement} />}
            </Canvas>
        </div>
    );
}
// Note: import { useState } from 'react' was missing above, fix in post or edit inline
