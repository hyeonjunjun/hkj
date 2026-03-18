"use client";

import { useRef, useEffect } from "react";
import { useStudioStore } from "@/lib/store";
import type { TimePeriod } from "@/lib/time";

const SIZE = 16;
const SCALE = 2;
const T = ""; // transparent

/**
 * 16x16 sprite data for each time period.
 * Each row is 16 hex color strings (or "" for transparent).
 */

const SPRITES: Record<TimePeriod, string[][]> = {
  dawn: [
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#D4917A",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,"#D4917A","#E8A88E","#D4917A",T,T,T,T,T,T,T],
    [T,T,T,T,T,"#D4917A","#E8A88E","#F0BCA6","#E8A88E","#D4917A",T,T,T,T,T,T],
    [T,T,T,T,"#D4917A","#E8A88E","#F0BCA6","#F0BCA6","#F0BCA6","#E8A88E","#D4917A",T,T,T,T,T],
    [T,T,T,"#C4816A","#E8A88E","#F0BCA6","#F0BCA6","#F0BCA6","#F0BCA6","#F0BCA6","#E8A88E","#C4816A",T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    ["#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468"],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    ["#706058","#706058",T,T,"#706058","#706058",T,T,T,"#706058","#706058",T,T,T,"#706058","#706058"],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
  day: [
    [T,T,T,T,T,T,T,"#C8A060",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#C8A060",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,"#C8A060",T,T,T,T,T,T,T,T,T,T,"#C8A060",T,T],
    [T,T,T,"#C8A060",T,T,T,T,T,T,T,T,"#C8A060",T,T,T],
    [T,T,T,T,T,"#D4AA60","#E8C078","#E8C078","#D4AA60",T,T,T,T,T,T,T],
    [T,T,T,T,"#D4AA60","#E8C078","#F0D090","#F0D090","#E8C078","#D4AA60",T,T,T,T,T,T],
    ["#C8A060",T,T,T,"#E8C078","#F0D090","#F8E0A8","#F8E0A8","#F0D090","#E8C078",T,T,T,T,"#C8A060",T],
    [T,T,T,T,"#D4AA60","#E8C078","#F0D090","#F0D090","#E8C078","#D4AA60",T,T,T,T,T,T],
    [T,T,T,T,T,"#D4AA60","#E8C078","#E8C078","#D4AA60",T,T,T,T,T,T,T],
    [T,T,T,"#C8A060",T,T,T,T,T,T,T,T,"#C8A060",T,T,T],
    [T,T,"#C8A060",T,T,T,T,T,T,T,T,T,T,"#C8A060",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#C8A060",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#C8A060",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
  dusk: [
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,"#8A6548","#8A6548","#8A6548",T,T,T,T,T,T,"#8A6548","#8A6548","#8A6548",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,"#C88A4A","#D8A060","#D8A060","#C88A4A",T,T,T,T,T,T,T],
    [T,T,T,T,"#C88A4A","#D8A060","#E8B878","#E8B878","#D8A060","#C88A4A",T,T,T,T,T,T],
    [T,T,T,"#B87A3A","#C88A4A","#D8A060","#E8B878","#E8B878","#D8A060","#C88A4A","#B87A3A",T,T,T,T,T],
    [T,T,"#A06A30","#B87A3A","#C88A4A","#D8A060","#E8B878","#E8B878","#D8A060","#C88A4A","#B87A3A","#A06A30",T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    ["#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40"],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
  night: [
    [T,T,T,T,T,T,T,T,T,T,T,T,T,"#E8E0D0",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,"#D8D0C0","#E8E0D0",T,T,T,T,T,T,T,T,T],
    [T,T,T,T,"#D8D0C0","#E8E0D0","#F0EBE0","#E8E0D0",T,T,T,T,T,T,T,T],
    [T,T,T,"#D8D0C0","#E8E0D0","#F0EBE0","#F0EBE0",T,T,T,T,T,T,T,T,T],
    [T,T,T,"#D8D0C0","#E8E0D0","#F0EBE0",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,"#D8D0C0","#E8E0D0",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,"#D8D0C0",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,"#E8E0D0",T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,"#E8E0D0",T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
};

/** Pixel positions that animate (twinkle/pulse). */
const ANIM_PIXELS: Record<TimePeriod, Array<{ r: number; c: number }>> = {
  dawn: [{ r: 5, c: 7 }, { r: 7, c: 7 }], // sun body pulses
  day: [
    { r: 0, c: 7 }, { r: 1, c: 7 }, // top ray
    { r: 13, c: 7 }, { r: 14, c: 7 }, // bottom ray
    { r: 7, c: 0 }, { r: 7, c: 14 }, // side rays
    { r: 3, c: 2 }, { r: 3, c: 13 }, // diagonal rays
    { r: 10, c: 3 }, { r: 10, c: 12 }, // diagonal rays lower
    { r: 4, c: 12 }, { r: 11, c: 2 }, { r: 11, c: 13 },
  ],
  dusk: [{ r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 11 }, { r: 4, c: 12 }, { r: 4, c: 13 }], // cloud streaks
  night: [{ r: 0, c: 13 }, { r: 10, c: 2 }, { r: 13, c: 10 }], // stars
};

export default function PixelArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timePeriod = useStudioStore((s) => s.timePeriod);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, SIZE * SCALE, SIZE * SCALE);

      const sprite = SPRITES[timePeriod];
      const animPixels = ANIM_PIXELS[timePeriod];
      const frame = frameRef.current;

      // Determine which animated pixels are "on" this frame
      const animOff = new Set<string>();

      if (timePeriod === "night") {
        // Stars twinkle: each star has its own phase
        animPixels.forEach((p, i) => {
          const phase = Math.floor(frame / 40 + i * 13) % 3;
          if (phase === 0) animOff.add(`${p.r},${p.c}`);
        });
      } else if (timePeriod === "day") {
        // Rays pulse: toggle visibility on slow cycle
        const rayPhase = Math.floor(frame / 50) % 2;
        if (rayPhase === 1) {
          animPixels.forEach((p) => animOff.add(`${p.r},${p.c}`));
        }
      } else if (timePeriod === "dusk") {
        // Clouds shift: offset column by 1 on alternate frames
        const shift = Math.floor(frame / 60) % 2;
        if (shift === 1) {
          animPixels.forEach((p) => animOff.add(`${p.r},${p.c}`));
        }
      } else if (timePeriod === "dawn") {
        // Sun body brightens/dims
        const pulse = Math.floor(frame / 45) % 2;
        if (pulse === 1) {
          animPixels.forEach((p) => animOff.add(`${p.r},${p.c}`));
        }
      }

      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const color = sprite[r]?.[c];
          if (!color) continue;
          if (animOff.has(`${r},${c}`)) continue;
          ctx.fillStyle = color;
          ctx.fillRect(c * SCALE, r * SCALE, SCALE, SCALE);
        }
      }
    }

    let lastDrawFrame = -1;

    function tick() {
      frameRef.current += 1;

      // Redraw at ~15fps (every 4 frames at 60fps)
      if (frameRef.current - lastDrawFrame >= 4) {
        lastDrawFrame = frameRef.current;
        draw();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    draw();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [timePeriod]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE * SCALE}
      height={SIZE * SCALE}
      style={{
        width: SIZE * SCALE,
        height: SIZE * SCALE,
        imageRendering: "pixelated",
        display: "block",
      }}
    />
  );
}
