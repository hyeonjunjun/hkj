"use client";

import { useRef, useEffect } from "react";
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
uniform vec2  u_resolution;
uniform float u_dayPhase;
uniform vec3  u_lightColor;
uniform float u_lightAngle;
uniform float u_lightIntensity;
uniform vec3  u_shadowTone;
uniform vec3  u_bgColor;
uniform float u_lightAmt;

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
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  /* Paper base — driven by time-of-day uniform */
  vec3 paper = u_bgColor;

  /* ── Light shafts ── */

  /* Rotation matrix from light angle */
  float ca = cos(u_lightAngle);
  float sa = sin(u_lightAngle);

  /* Project UV along light direction */
  float lightAxis = uv.x * ca + uv.y * sa;

  /* Drift — imperceptible movement over time */
  float drift = u_time * 0.0003;

  /* Three overlapping soft shafts at different scales */
  float shaft1 = fbm(vec2(lightAxis * 2.0 + drift, 0.5)) ;
  float shaft2 = fbm(vec2(lightAxis * 3.5 + drift * 0.7, 1.8));
  float shaft3 = fbm(vec2(lightAxis * 1.2 + drift * 1.3, 3.2));

  /* Combine into soft light pattern */
  float light = shaft1 * 0.5 + shaft2 * 0.3 + shaft3 * 0.2;

  /* Shape the light — soft gaussian-like falloff */
  light = smoothstep(0.3, 0.7, light);

  /* Apply intensity from time of day */
  light *= u_lightIntensity;

  /* Vertical gradient — sky at top, wall at bottom */
  /* skyAmount: 1.0 at top of viewport, fading to 0.0 at ~40% down */
  float skyAmount = smoothstep(0.35, 0.85, uv.y);
  /* wallAmount: subtle everywhere, slightly stronger in lower half */
  float wallAmount = smoothstep(0.9, 0.2, uv.y) * 0.3;

  light *= (wallAmount + 0.7);

  /* ── Color mixing ── */

  vec3 color = paper;

  /* SKY LAYER — strong at top, fades to nothing below roofline */
  /* Sky base color — blend of light color and a blue-shifted version */
  vec3 skyBase = mix(u_lightColor, vec3(0.82, 0.86, 0.92), 0.3);
  /* Add cloud-like variation to sky */
  float skyNoise = fbm(p * 1.5 + u_time * 0.001);
  float skyPattern = smoothstep(0.35, 0.65, skyNoise);
  /* Sky gets lighter where clouds are */
  vec3 skyColor = mix(skyBase, paper, skyPattern * 0.3);
  /* Mix sky strongly at top */
  color = mix(color, skyColor, skyAmount * 0.35 * u_lightIntensity);

  /* WALL LAYER — subtle light on the building surface below */
  /* Shadow tone in dark areas */
  float shadowAmt = (1.0 - light) * 0.06;
  color = mix(color, u_shadowTone, shadowAmt * (1.0 - skyAmount));

  /* Light color in bright areas of the wall */
  float lightAmt = light * u_lightAmt;
  color = mix(color, u_lightColor, lightAmt * (1.0 - skyAmount * 0.7));

  /* Warmth boost in brightest wall spots */
  float peak = smoothstep(0.6, 0.9, light);
  color = mix(color, u_lightColor * 1.05, peak * 0.08 * (1.0 - skyAmount));

  /* ── Paper grain ── */
  float grain = noise(p * 18.0) * 0.012;
  color += grain;

  /* ── Vignette — only on sides, not top ── */
  float vigX = abs(uv.x - 0.5) * 2.0;
  float vig = vigX * vigX;
  color = mix(color, paper * 0.97, smoothstep(0.5, 1.0, vig) * 0.15);

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

/* ── Time-of-day system ── */

interface LightState {
  color: [number, number, number];
  angle: number;
  intensity: number;
  shadow: [number, number, number];
  bgColor: [number, number, number];
  lightAmt: number;
}

function getLightState(hour: number, minute: number): LightState {
  const t = hour + minute / 60;

  /* Key light states across the day */
  const states: { time: number; state: LightState }[] = [
    {
      time: 0,
      state: {
        color: [0.82, 0.84, 0.9],
        angle: Math.PI * 0.5,
        intensity: 0.15,
        shadow: [0.42, 0.40, 0.48],
        bgColor: [0.102, 0.094, 0.082],
        lightAmt: 0.20,
      },
    },
    {
      time: 6,
      state: {
        color: [0.9, 0.91, 0.95],
        angle: Math.PI * 0.15,
        intensity: 0.45,
        shadow: [0.45, 0.45, 0.52],
        bgColor: [0.969, 0.965, 0.953],
        lightAmt: 0.15,
      },
    },
    {
      time: 9,
      state: {
        color: [0.95, 0.92, 0.88],
        angle: Math.PI * 0.28,
        intensity: 0.75,
        shadow: [0.48, 0.45, 0.44],
        bgColor: [0.969, 0.965, 0.953],
        lightAmt: 0.15,
      },
    },
    {
      time: 12,
      state: {
        color: [0.96, 0.94, 0.9],
        angle: Math.PI * 0.38,
        intensity: 0.85,
        shadow: [0.5, 0.47, 0.45],
        bgColor: [0.969, 0.965, 0.953],
        lightAmt: 0.15,
      },
    },
    {
      time: 15,
      state: {
        color: [0.88, 0.72, 0.50],
        angle: Math.PI * 0.62,
        intensity: 0.8,
        shadow: [0.5, 0.44, 0.42],
        bgColor: [0.969, 0.965, 0.953],
        lightAmt: 0.15,
      },
    },
    {
      time: 16,
      state: {
        color: [0.85, 0.65, 0.45],
        angle: Math.PI * 0.68,
        intensity: 0.7,
        shadow: [0.51, 0.43, 0.43],
        bgColor: [0.969, 0.965, 0.953],
        lightAmt: 0.15,
      },
    },
    {
      time: 19,
      state: {
        color: [0.78, 0.55, 0.40],
        angle: Math.PI * 0.78,
        intensity: 0.5,
        shadow: [0.52, 0.42, 0.44],
        bgColor: [0.102, 0.094, 0.082],
        lightAmt: 0.20,
      },
    },
    {
      time: 21,
      state: {
        color: [0.84, 0.85, 0.9],
        angle: Math.PI * 0.5,
        intensity: 0.2,
        shadow: [0.44, 0.42, 0.5],
        bgColor: [0.102, 0.094, 0.082],
        lightAmt: 0.20,
      },
    },
    {
      time: 24,
      state: {
        color: [0.82, 0.84, 0.9],
        angle: Math.PI * 0.5,
        intensity: 0.15,
        shadow: [0.42, 0.40, 0.48],
        bgColor: [0.102, 0.094, 0.082],
        lightAmt: 0.20,
      },
    },
  ];

  /* Find surrounding keyframes and interpolate */
  let lower = states[0];
  let upper = states[1];
  for (let i = 0; i < states.length - 1; i++) {
    if (t >= states[i].time && t < states[i + 1].time) {
      lower = states[i];
      upper = states[i + 1];
      break;
    }
  }

  const range = upper.time - lower.time;
  const f = range > 0 ? (t - lower.time) / range : 0;

  /* Smooth interpolation */
  const sf = f * f * (3 - 2 * f);

  const lerp = (a: number, b: number) => a + (b - a) * sf;

  return {
    color: [
      lerp(lower.state.color[0], upper.state.color[0]),
      lerp(lower.state.color[1], upper.state.color[1]),
      lerp(lower.state.color[2], upper.state.color[2]),
    ],
    angle: lerp(lower.state.angle, upper.state.angle),
    intensity: lerp(lower.state.intensity, upper.state.intensity),
    shadow: [
      lerp(lower.state.shadow[0], upper.state.shadow[0]),
      lerp(lower.state.shadow[1], upper.state.shadow[1]),
      lerp(lower.state.shadow[2], upper.state.shadow[2]),
    ],
    bgColor: [
      lerp(lower.state.bgColor[0], upper.state.bgColor[0]),
      lerp(lower.state.bgColor[1], upper.state.bgColor[1]),
      lerp(lower.state.bgColor[2], upper.state.bgColor[2]),
    ],
    lightAmt: lerp(lower.state.lightAmt, upper.state.lightAmt),
  };
}

/* ── Component ── */

export default function WallLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const lightRef = useRef<LightState>(getLightState(new Date().getHours(), new Date().getMinutes()));
  const prefersReduced = useReducedMotion();

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

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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
    const uDayPhase = gl.getUniformLocation(prog, "u_dayPhase");
    const uLightColor = gl.getUniformLocation(prog, "u_lightColor");
    const uLightAngle = gl.getUniformLocation(prog, "u_lightAngle");
    const uLightIntensity = gl.getUniformLocation(prog, "u_lightIntensity");
    const uShadowTone = gl.getUniformLocation(prog, "u_shadowTone");
    const uBgColor = gl.getUniformLocation(prog, "u_bgColor");
    const uLightAmt = gl.getUniformLocation(prog, "u_lightAmt");

    startRef.current = performance.now() / 1000;

    /* Update light state once per minute */
    const updateLight = () => {
      const now = new Date();
      lightRef.current = getLightState(now.getHours(), now.getMinutes());
    };
    updateLight();
    const lightInterval = setInterval(updateLight, 60000);

    /* 30fps render loop */
    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const render = (timestamp: number) => {
      if (timestamp - lastFrame < FRAME_INTERVAL) {
        if (!prefersReduced) {
          rafRef.current = requestAnimationFrame(render);
        }
        return;
      }
      lastFrame = timestamp;

      const now = performance.now() / 1000;
      const t = now - startRef.current;
      const light = lightRef.current;

      const date = new Date();
      const dayPhase = (date.getHours() + date.getMinutes() / 60) / 24;

      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uDayPhase, dayPhase);
      gl.uniform3f(uLightColor, light.color[0], light.color[1], light.color[2]);
      gl.uniform1f(uLightAngle, light.angle);
      gl.uniform1f(uLightIntensity, light.intensity);
      gl.uniform3f(uShadowTone, light.shadow[0], light.shadow[1], light.shadow[2]);
      gl.uniform3f(uBgColor, light.bgColor[0], light.bgColor[1], light.bgColor[2]);
      gl.uniform1f(uLightAmt, light.lightAmt);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!prefersReduced) {
        rafRef.current = requestAnimationFrame(render);
      }
    };

    if (prefersReduced) {
      render(performance.now());
    } else {
      rafRef.current = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(lightInterval);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
