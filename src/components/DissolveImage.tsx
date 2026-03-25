"use client";

import { useRef, useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

const DISSOLVE_VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const DISSOLVE_FRAG = `
precision highp float;
varying vec2 v_uv;
uniform float u_progress;
uniform float u_time;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.0 + vec2(1.7, 3.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  float n = fbm(v_uv * 4.0 + u_time * 0.2);
  float threshold = u_progress * 1.3 - 0.15;
  float edge = smoothstep(threshold - 0.1, threshold + 0.05, n);
  float alpha = 1.0 - edge;
  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

interface DissolveImageProps extends Omit<ImageProps, "onLoad"> {
  revealDuration?: number;
}

export default function DissolveImage({ revealDuration = 1.2, style, ...imageProps }: DissolveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);
  // Keep a stable ref to animateDissolve so the intersection observer can call it
  const animateDissolveRef = useRef<() => void>(() => {});

  const animateDissolve = () => {
    const canvas = canvasRef.current;
    if (!canvas) { setRevealed(true); return; }

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) { setRevealed(true); return; }

    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vs = compileShader(gl, gl.VERTEX_SHADER, DISSOLVE_VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, DISSOLVE_FRAG);
    if (!vs || !fs) { setRevealed(true); return; }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setRevealed(true); return; }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prog);
    const uProgress = gl.getUniformLocation(prog, "u_progress");
    const uTime = gl.getUniformLocation(prog, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const duration = revealDuration * 1000;

    const render = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      progressRef.current = progress;

      gl.uniform1f(uProgress, progress);
      gl.uniform1f(uTime, elapsed / 1000);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (progress < 1) {
        requestAnimationFrame(render);
      } else {
        setRevealed(true);
        // Cleanup
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
      }
    };

    requestAnimationFrame(render);
  };

  // Keep animateDissolveRef in sync
  useEffect(() => {
    animateDissolveRef.current = animateDissolve;
  });

  // Intersection Observer to trigger reveal
  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imageLoaded) {
          startTimeRef.current = performance.now();
          observer.disconnect();
          // Start WebGL dissolve animation
          animateDissolveRef.current();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [imageLoaded]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <Image
        {...imageProps}
        onLoad={() => setImageLoaded(true)}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Dissolve overlay — covers the image, dissolves away */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
            background: "var(--bg)",
          }}
        />
      )}
    </div>
  );
}
