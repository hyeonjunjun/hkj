"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { NOW_PLAYING } from "@/constants/now-playing";

const VINYL_SIZE = 420; // canvas logical size
const CAT_SIZE = 28;
const GROOVE_COUNT = 35;
const LABEL_RADIUS = 0.22; // proportion of vinyl radius

// Simple pixel cat sprite (8x8 grid, drawn procedurally)
function drawPixelCat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  angle: number,
  frame: number,
  cursorAngle: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const px = size / 8;
  const color = "rgba(240, 235, 227, 0.9)";
  const dark = "rgba(35, 32, 28, 0.85)";
  const accent = "rgba(200, 160, 80, 0.7)";

  // Body (simplified pixel cat viewed from above)
  const body: [number, number, string][] = [
    // Ears
    [-3, -3, color], [-2, -3, color], [2, -3, color], [3, -3, color],
    [-3, -2, color], [-2, -2, dark], [2, -2, dark], [3, -2, color],
    // Head
    [-2, -1, color], [-1, -1, color], [0, -1, color], [1, -1, color], [2, -1, color],
    // Eyes — direction based on cursor
    [-1, 0, accent], [1, 0, accent],
    // Nose
    [0, 0, dark],
    // Body
    [-2, 1, color], [-1, 1, color], [0, 1, color], [1, 1, color], [2, 1, color],
    [-1, 2, color], [0, 2, color], [1, 2, color],
    [-1, 3, color], [0, 3, color], [1, 3, color],
  ];

  // Tail (animated)
  const tailWag = Math.sin(frame * 0.15) * 0.5;
  const tail: [number, number, string][] = [
    [0, 4, color],
    [Math.round(tailWag), 5, color],
    [Math.round(tailWag * 1.5), 6, color],
  ];

  [...body, ...tail].forEach(([bx, by, c]) => {
    ctx.fillStyle = c;
    ctx.fillRect(bx * px - px / 2, by * px - px / 2, px, px);
  });

  ctx.restore();
}

export default function Vinyl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const angleRef = useRef(0);
  const velocityRef = useRef(0.008); // natural slow spin (rad/frame)
  const isDraggingRef = useRef(false);
  const lastMouseAngleRef = useRef(0);
  const mouseAngleRef = useRef(0);
  const frameRef = useRef(0);
  const [albumImg, setAlbumImg] = useState<HTMLImageElement | null>(null);

  // Load album art
  useEffect(() => {
    if (!NOW_PLAYING.art) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setAlbumImg(img);
    img.src = NOW_PLAYING.art;
  }, []);

  const getAngleFromMouse = useCallback((e: MouseEvent | Touch) => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx);
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseAngleRef.current = getAngleFromMouse(e);
    velocityRef.current = 0;
  }, [getAngleFromMouse]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseAngleRef.current = getAngleFromMouse(e);
    if (!isDraggingRef.current) return;
    const newAngle = getAngleFromMouse(e);
    let delta = newAngle - lastMouseAngleRef.current;
    // Handle wrapping
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    angleRef.current += delta;
    velocityRef.current = delta;
    lastMouseAngleRef.current = newAngle;
  }, [getAngleFromMouse]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Touch handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!e.touches[0]) return;
    isDraggingRef.current = true;
    lastMouseAngleRef.current = getAngleFromMouse(e.touches[0]);
    velocityRef.current = 0;
  }, [getAngleFromMouse]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || !e.touches[0]) return;
    const newAngle = getAngleFromMouse(e.touches[0]);
    let delta = newAngle - lastMouseAngleRef.current;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    angleRef.current += delta;
    velocityRef.current = delta;
    lastMouseAngleRef.current = newAngle;
  }, [getAngleFromMouse]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VINYL_SIZE * dpr;
    canvas.height = VINYL_SIZE * dpr;
    ctx.scale(dpr, dpr);

    const cx = VINYL_SIZE / 2;
    const cy = VINYL_SIZE / 2;
    const radius = VINYL_SIZE / 2 - 4;

    const render = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, VINYL_SIZE, VINYL_SIZE);

      // Physics: momentum decay toward natural speed
      if (!isDraggingRef.current) {
        const naturalSpeed = 0.008;
        velocityRef.current += (naturalSpeed - velocityRef.current) * 0.02;
      }
      angleRef.current += velocityRef.current;

      const angle = angleRef.current;

      // ── Draw vinyl record ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Outer edge
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20, 18, 16, 0.95)";
      ctx.fill();

      // Grooves
      for (let i = 0; i < GROOVE_COUNT; i++) {
        const t = LABEL_RADIUS + (1 - LABEL_RADIUS) * (i / GROOVE_COUNT);
        const r = t * radius;
        const grooveOpacity = 0.03 + Math.sin(i * 0.7 + angle * 2) * 0.02;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 170, 155, ${grooveOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Light reflection on grooves (follows WallLight time of day)
      const reflectAngle = -angle + Math.PI * 0.3;
      const gradient = ctx.createLinearGradient(
        Math.cos(reflectAngle) * radius,
        Math.sin(reflectAngle) * radius,
        Math.cos(reflectAngle + Math.PI) * radius,
        Math.sin(reflectAngle + Math.PI) * radius
      );
      gradient.addColorStop(0, "rgba(200, 170, 120, 0.06)");
      gradient.addColorStop(0.5, "rgba(200, 170, 120, 0)");
      gradient.addColorStop(1, "rgba(200, 170, 120, 0.03)");
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Center label
      const labelR = radius * LABEL_RADIUS;
      ctx.beginPath();
      ctx.arc(0, 0, labelR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(60, 55, 48, 0.9)";
      ctx.fill();

      // Album art in label (circular clip)
      if (albumImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, labelR - 2, 0, Math.PI * 2);
        ctx.clip();
        const imgSize = labelR * 2 - 4;
        ctx.drawImage(albumImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();
      }

      // Center spindle hole
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(35, 32, 28, 1)";
      ctx.fill();

      ctx.restore();

      // ── Draw pixel cat ──
      const catDistance = radius * 0.62;
      const catAngle = angle + Math.PI * 0.25; // offset from 12 o'clock
      const catX = cx + Math.cos(catAngle) * catDistance;
      const catY = cy + Math.sin(catAngle) * catDistance;

      // Cat rotates with the record but faces "up" relative to the record surface
      const catFaceAngle = catAngle + Math.PI / 2;

      drawPixelCat(
        ctx,
        catX,
        catY,
        CAT_SIZE,
        catFaceAngle,
        frameRef.current,
        mouseAngleRef.current - catAngle,
      );

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    // Event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [albumImg, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "clamp(260px, 30vw, 420px)",
        height: "clamp(260px, 30vw, 420px)",
        cursor: "grab",
        touchAction: "none",
      }}
      aria-label="Interactive vinyl record — drag to spin"
      role="img"
    />
  );
}
