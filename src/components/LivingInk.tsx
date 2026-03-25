"use client";

import { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ── Shader sources ── */

const VERT_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_presence;  /* how long cursor has been nearby */

/* Palette — dusk through a window */
const vec3 PAPER     = vec3(0.969, 0.965, 0.953);   /* #f7f6f3 */
const vec3 AMBER     = vec3(0.76, 0.58, 0.36);      /* warm amber light */
const vec3 HONEY     = vec3(0.82, 0.65, 0.42);      /* honey glow */
const vec3 SHADOW    = vec3(0.28, 0.24, 0.22);      /* warm shadow */
const vec3 BLUSH     = vec3(0.72, 0.52, 0.44);      /* skin-warm undertone */
const vec3 DUSK      = vec3(0.48, 0.38, 0.42);      /* cool dusk violet */

/* ── Noise ── */

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

/* Soft warped noise — like light filtered through fabric */
float lightField(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.006),
    fbm(p + vec2(5.2, 1.3) + t * 0.004)
  );
  return fbm(p + 3.0 * q);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time;

  /* ── Light composition ── */

  /* Base light field — extremely slow drift */
  float light1 = lightField(p * 1.8, t);
  float light2 = lightField(p * 2.5 + vec2(3.1, 7.4), t * 0.7);

  /* Vertical gradient — light falls from top like a window */
  float windowGrad = smoothstep(0.0, 0.85, uv.y);
  windowGrad = windowGrad * 0.6 + 0.4;

  /* Soft diagonal light shaft */
  float shaft = smoothstep(0.3, 0.7, uv.x * 0.6 + uv.y * 0.4 + light1 * 0.15);

  /* Combine into a light intensity map */
  float lightIntensity = light1 * 0.5 + light2 * 0.3;
  lightIntensity *= windowGrad;
  lightIntensity = smoothstep(0.2, 0.75, lightIntensity);

  /* Cursor warmth — like holding a hand near a candle */
  vec2 mousePos = vec2(u_mouse.x * aspect, u_mouse.y);
  float mouseDist = length(p - mousePos);
  float warmth = exp(-mouseDist * mouseDist * 3.0) * u_presence * 0.15;

  /* ── Color mapping ── */

  /* Start with paper */
  vec3 color = PAPER;

  /* Lay down the shadow first — the dark shapes */
  float shadowMask = smoothstep(0.55, 0.35, lightIntensity);
  color = mix(color, SHADOW, shadowMask * 0.08);

  /* Dusk tone in the darker regions */
  color = mix(color, DUSK, shadowMask * 0.06 * smoothstep(0.3, 0.7, light2));

  /* Amber light where the light falls */
  float amberMask = smoothstep(0.4, 0.7, lightIntensity) * shaft;
  color = mix(color, AMBER, amberMask * 0.18);

  /* Honey glow in the brightest areas */
  float honeyMask = smoothstep(0.6, 0.85, lightIntensity) * shaft;
  color = mix(color, HONEY, honeyMask * 0.12);

  /* Blush warmth — subtle, in mid-tones */
  float blushMask = smoothstep(0.35, 0.55, lightIntensity) * smoothstep(0.65, 0.45, lightIntensity);
  color = mix(color, BLUSH, blushMask * 0.08);

  /* Cursor warmth — faint amber glow where you are */
  color = mix(color, HONEY, warmth);

  /* ── Paper texture ── */

  /* Fine grain — like cotton paper */
  float grain = noise(p * 18.0) * 0.012;
  color += grain;

  /* Soft vignette — light fades at edges like a photograph */
  vec2 vc = uv - 0.5;
  float vig = dot(vc, vc);
  color = mix(color, PAPER * 0.97, smoothstep(0.12, 0.5, vig) * 0.35);

  /* Ensure we never go too dark — this is about light, not shadow */
  color = mix(PAPER, color, 0.85);

  gl_FragColor = vec4(color, 1.0);
}
`;

/* ── WebGL helpers ── */

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(
  gl: WebGLRenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
): WebGLProgram | null {
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link:", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

/* ── Component ── */

interface LivingInkProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LivingInk({ className, style }: LivingInkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const presenceRef = useRef(0);
  const isOverRef = useRef(false);
  const startRef = useRef(0);
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - r.left) / r.width,
      y: 1 - (e.clientY - r.top) / r.height,
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    isOverRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isOverRef.current = false;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const c = canvasRef.current;
    if (!c || !e.touches[0]) return;
    const r = c.getBoundingClientRect();
    const t = e.touches[0];
    mouseRef.current = {
      x: (t.clientX - r.left) / r.width,
      y: 1 - (t.clientY - r.top) / r.height,
    };
    isOverRef.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isOverRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;
    const prog = linkProgram(gl, vs, fs);
    if (!prog) return;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(prog);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uPresence = gl.getUniformLocation(prog, "u_presence");

    startRef.current = performance.now() / 1000;

    const render = () => {
      const now = performance.now() / 1000;
      const t = now - startRef.current;

      /* Presence fades in/out slowly — like warmth accumulating */
      const target = isOverRef.current ? 1 : 0;
      presenceRef.current += (target - presenceRef.current) * 0.015;

      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uPresence, presenceRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    if (prefersReduced) {
      render();
    } else {
      rafRef.current = requestAnimationFrame(render);
    }

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [prefersReduced, handleMouseMove, handleMouseEnter, handleMouseLeave, handleTouchMove, handleTouchEnd]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        ...style,
      }}
      aria-label="Dusk light study — a quiet warm glow that responds to your presence"
      role="img"
    />
  );
}
