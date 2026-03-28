"use client";

import { useEffect, useRef } from "react";

interface LivingInkProps {
  style?: React.CSSProperties;
}

export default function LivingInk({ style }: LivingInkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    let raf: number;
    let t = 0;

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      // Subtle ink grain — scattered dots that drift slowly
      const cols = Math.ceil(w / 24);
      const rows = Math.ceil(h / 24);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * 24 + Math.sin(t * 0.3 + i * 0.7 + j * 0.5) * 4;
          const y = j * 24 + Math.cos(t * 0.25 + j * 0.6 + i * 0.4) * 4;
          const alpha = 0.15 + 0.1 * Math.sin(t * 0.4 + i * j * 0.01);
          ctx.fillStyle = `rgba(0,0,0,${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      t += 0.01;
      raf = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
