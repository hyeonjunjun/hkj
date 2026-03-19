"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useStudioStore } from "@/lib/store";
import type { TimePeriod } from "@/lib/time";

const SIZE = 20;
const SCALE = 2.5;
const PX = SIZE * SCALE; // 50
const T = ""; // transparent

/* ─── Animated pixel definition ─── */
interface AnimPixel {
  r: number;
  c: number;
  minAlpha: number;
  maxAlpha: number;
  speed: number;   // radians per frame
  phase: number;   // offset
}

/* ─── 20×20 sprite data ─── */
const SPRITES: Record<TimePeriod, string[][]> = {
  dawn: [
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,"#E8C0A0",T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,"#E8C0A0","#E8C0A0",T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,"#F0BCA6",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,"#F0BCA6","#F0BCA6","#F0BCA6",T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#E8A88E","#F0BCA6","#F5D0BA","#F0BCA6","#E8A88E",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,"#D4917A","#E8A88E","#F0BCA6","#F5D0BA","#F5D0BA","#F0BCA6","#E8A88E","#D4917A",T,T,T,T,T,T],
    [T,T,T,T,T,"#C4816A","#D4917A","#E8A88E","#F0BCA6","#F5D0BA","#F5D0BA","#F0BCA6","#E8A88E","#D4917A","#C4816A",T,T,T,T,T],
    [T,T,T,T,"#B07060","#C4816A","#D4917A","#E8A88E","#F0BCA6","#F5D0BA","#F5D0BA","#F0BCA6","#E8A88E","#D4917A","#C4816A","#B07060",T,T,T,T],
    ["#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468","#8B7468"],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    ["#706058","#706058",T,T,T,"#706058","#706058",T,T,T,T,"#706058","#706058",T,T,T,"#706058","#706058",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    ["#605048",T,T,"#605048","#605048",T,T,T,"#605048",T,T,T,T,"#605048","#605048",T,T,T,"#605048",T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
  day: [
    [T,T,T,T,T,T,T,T,T,"#C8A060",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,"#D4AA60",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,"#C8A060",T,T,T,T,T,T,T,T,T,T,T,"#C8A060",T,T,T,T],
    [T,T,T,T,"#D4AA60",T,T,T,T,T,T,T,T,T,"#D4AA60",T,T,T,T,T],
    [T,T,T,T,T,T,T,"#D4AA60","#E8C078","#E8C078","#D4AA60",T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,"#D4AA60","#E8C078","#F0D090","#F0D090","#E8C078","#D4AA60",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,"#D4AA60","#E8C078","#F0D090","#F8E0A8","#F8E0A8","#F0D090","#E8C078","#D4AA60",T,T,T,T,T,T,T],
    [T,"#C8A060",T,T,"#E8C078","#E8C078","#F0D090","#F8E0A8","#FFF0C0","#FFF0C0","#F8E0A8","#F0D090","#E8C078","#E8C078",T,T,T,"#C8A060",T,T],
    [T,T,T,T,"#E8C078","#E8C078","#F0D090","#F8E0A8","#FFF0C0","#FFF0C0","#F8E0A8","#F0D090","#E8C078","#E8C078",T,T,T,T,T,T],
    [T,T,T,T,T,"#D4AA60","#E8C078","#F0D090","#F8E0A8","#F8E0A8","#F0D090","#E8C078","#D4AA60",T,T,T,T,T,T,T],
    [T,T,T,T,T,T,"#D4AA60","#E8C078","#F0D090","#F0D090","#E8C078","#D4AA60",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#D4AA60","#E8C078","#E8C078","#D4AA60",T,T,T,T,T,T,T,T,T],
    [T,T,T,T,"#D4AA60",T,T,T,T,T,T,T,T,T,"#D4AA60",T,T,T,T,T],
    [T,T,T,"#C8A060",T,T,T,T,T,T,T,T,T,T,T,"#C8A060",T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,"#D4AA60",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,"#C8A060",T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
  dusk: [
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,"#8A6548","#8A6548","#8A6548","#8A6548",T,T,T,T,T,T,"#8A6548","#8A6548","#8A6548","#8A6548",T,T,T],
    [T,T,"#A06A30","#A06A30","#A06A30","#A06A30","#A06A30","#A06A30",T,T,T,T,"#A06A30","#A06A30","#A06A30","#A06A30","#A06A30","#A06A30",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#B87A3A","#B87A3A","#B87A3A","#B87A3A","#B87A3A","#B87A3A",T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,"#D8A060","#D8A060","#D8A060",T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#C88A4A","#D8A060","#E8B878","#D8A060","#C88A4A",T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,"#B87A3A","#C88A4A","#D8A060","#E8B878","#E8B878","#D8A060","#C88A4A","#B87A3A",T,T,T,T,T,T],
    ["#7A5A40","#7A5A40","#7A5A40","#7A5A40","#A06A30","#B87A3A","#C88A4A","#D8A060","#E8B878","#F0CCA0","#E8B878","#D8A060","#C88A4A","#B87A3A","#A06A30","#7A5A40","#7A5A40","#7A5A40","#7A5A40","#7A5A40"],
    ["#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30","#6A4A30"],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    ["#5A3A20","#5A3A20",T,T,"#5A3A20","#5A3A20",T,T,T,"#5A3A20","#5A3A20","#5A3A20",T,T,"#5A3A20","#5A3A20",T,T,"#5A3A20","#5A3A20"],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    ["#4A2A18",T,T,"#4A2A18",T,T,"#4A2A18","#4A2A18",T,T,T,T,"#4A2A18","#4A2A18",T,T,"#4A2A18",T,T,"#4A2A18"],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
  night: [
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,"#F0EBE0",T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,"#F0EBE0","#F0EBE0",T,T,T,T,T],
    [T,T,"#E8E0D0",T,T,T,T,T,T,T,T,T,"#E8E0D0","#F0EBE0","#F0EBE0","#E8E0D0",T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,"#E8E0D0","#F0EBE0","#F0EBE0","#E8E0D0",T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,"#E8E0D0","#F0EBE0","#F0EBE0",T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,"#E8E0D0","#F0EBE0","#E8E0D0",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,"#E8E0D0","#F0EBE0",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,"#D8D0C0",T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,"#E8E0D0",T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,"#E8E0D0","#F0EBE0","#E8E0D0",T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,"#E8E0D0",T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,"#F0EBE0",T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,"#E8E0D0","#F0EBE0","#E8E0D0",T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,"#E8E0D0",T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,"#E8E0D0",T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,"#D8D0C0",T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  ],
};

/* ─── Cloud wisp overlay for night (rendered separately with low alpha) ─── */
const NIGHT_WISP: Array<{ r: number; c: number; color: string }> = [
  { r: 10, c: 7, color: "#3A3830" },
  { r: 10, c: 8, color: "#3A3830" },
  { r: 10, c: 9, color: "#3A3830" },
  { r: 9, c: 8, color: "#3A3830" },
  { r: 9, c: 9, color: "#3A3830" },
  { r: 9, c: 10, color: "#3A3830" },
];

/* ─── Per-period animated pixels ─── */
const ANIM_PIXELS: Record<TimePeriod, AnimPixel[]> = {
  dawn: [
    // Sun body breathing
    { r: 9, c: 9, minAlpha: 0.7, maxAlpha: 1.0, speed: 0.1, phase: 0 },
    { r: 10, c: 9, minAlpha: 0.7, maxAlpha: 1.0, speed: 0.1, phase: 0.5 },
    { r: 9, c: 8, minAlpha: 0.7, maxAlpha: 1.0, speed: 0.1, phase: 1.0 },
    { r: 10, c: 8, minAlpha: 0.7, maxAlpha: 1.0, speed: 0.1, phase: 1.5 },
    // Clouds catching light
    { r: 5, c: 14, minAlpha: 0.3, maxAlpha: 0.8, speed: 0.15, phase: 0 },
    { r: 6, c: 12, minAlpha: 0.3, maxAlpha: 0.8, speed: 0.15, phase: 1.0 },
    { r: 6, c: 13, minAlpha: 0.3, maxAlpha: 0.8, speed: 0.15, phase: 1.5 },
  ],
  day: [
    // Ray tips pulse
    { r: 0, c: 9, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.15, phase: 0 },
    { r: 1, c: 9, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.15, phase: 0.3 },
    { r: 16, c: 9, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.15, phase: Math.PI },
    { r: 17, c: 9, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.15, phase: Math.PI + 0.3 },
    { r: 8, c: 1, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.15, phase: Math.PI / 2 },
    { r: 8, c: 17, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.15, phase: Math.PI * 1.5 },
    // Diagonal rays
    { r: 3, c: 3, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.12, phase: 0.8 },
    { r: 4, c: 4, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.12, phase: 1.1 },
    { r: 3, c: 15, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.12, phase: 2.0 },
    { r: 4, c: 14, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.12, phase: 2.3 },
    { r: 13, c: 4, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.12, phase: 3.2 },
    { r: 14, c: 3, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.12, phase: 3.5 },
    { r: 13, c: 14, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.12, phase: 4.4 },
    { r: 14, c: 15, minAlpha: 0.4, maxAlpha: 1.0, speed: 0.12, phase: 4.7 },
  ],
  dusk: [
    // Cloud band shimmer
    { r: 4, c: 3, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 0 },
    { r: 4, c: 4, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 0.5 },
    { r: 4, c: 5, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 1.0 },
    { r: 4, c: 6, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 1.5 },
    { r: 4, c: 13, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 2.0 },
    { r: 4, c: 14, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 2.5 },
    { r: 4, c: 15, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 3.0 },
    { r: 4, c: 16, minAlpha: 0.5, maxAlpha: 1.0, speed: 0.08, phase: 3.5 },
    // Lower cloud band
    { r: 5, c: 2, minAlpha: 0.4, maxAlpha: 0.9, speed: 0.06, phase: 1.0 },
    { r: 5, c: 3, minAlpha: 0.4, maxAlpha: 0.9, speed: 0.06, phase: 1.5 },
    { r: 5, c: 12, minAlpha: 0.4, maxAlpha: 0.9, speed: 0.06, phase: 3.0 },
    { r: 5, c: 13, minAlpha: 0.4, maxAlpha: 0.9, speed: 0.06, phase: 3.5 },
    // Sun glow
    { r: 9, c: 8, minAlpha: 0.7, maxAlpha: 1.0, speed: 0.1, phase: 0 },
    { r: 9, c: 9, minAlpha: 0.7, maxAlpha: 1.0, speed: 0.1, phase: 0.5 },
    { r: 9, c: 10, minAlpha: 0.7, maxAlpha: 1.0, speed: 0.1, phase: 1.0 },
  ],
  night: [
    // Stars — gentle independent twinkling
    { r: 1, c: 14, minAlpha: 0.2, maxAlpha: 1.0, speed: 0.5, phase: 0 },
    { r: 3, c: 2, minAlpha: 0.2, maxAlpha: 1.0, speed: 0.3, phase: 2.1 },
    // Star cluster (bottom-left)
    { r: 10, c: 3, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.4, phase: 1.0 },
    { r: 11, c: 2, minAlpha: 0.15, maxAlpha: 0.8, speed: 0.35, phase: 1.8 },
    { r: 11, c: 3, minAlpha: 0.2, maxAlpha: 0.9, speed: 0.45, phase: 2.5 },
    { r: 11, c: 4, minAlpha: 0.15, maxAlpha: 0.8, speed: 0.35, phase: 3.2 },
    { r: 12, c: 3, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.4, phase: 0.5 },
    // Star cluster (bottom-right)
    { r: 14, c: 12, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.6, phase: 3.8 },
    { r: 15, c: 11, minAlpha: 0.15, maxAlpha: 0.8, speed: 0.3, phase: 4.5 },
    { r: 15, c: 12, minAlpha: 0.2, maxAlpha: 0.9, speed: 0.5, phase: 5.0 },
    { r: 15, c: 13, minAlpha: 0.15, maxAlpha: 0.8, speed: 0.35, phase: 5.8 },
    { r: 16, c: 12, minAlpha: 0.3, maxAlpha: 1.0, speed: 0.45, phase: 1.5 },
    // Lone stars
    { r: 17, c: 7, minAlpha: 0.2, maxAlpha: 1.0, speed: 0.8, phase: 4.0 },
    { r: 18, c: 16, minAlpha: 0.15, maxAlpha: 0.7, speed: 0.3, phase: 0.7 },
    // Cloud wisp drift
    ...NIGHT_WISP.map((p, i) => ({
      r: p.r,
      c: p.c,
      minAlpha: 0.08,
      maxAlpha: 0.25,
      speed: 0.05,
      phase: i * 0.4,
    })),
  ],
};

/* ─── Time period cycle order ─── */
const PERIOD_ORDER: TimePeriod[] = ["dawn", "day", "dusk", "night"];

function nextPeriod(current: TimePeriod): TimePeriod {
  const idx = PERIOD_ORDER.indexOf(current);
  return PERIOD_ORDER[(idx + 1) % PERIOD_ORDER.length];
}

/* ─── Build a lookup for animated pixels ─── */
function buildAnimLookup(pixels: AnimPixel[]): Map<string, AnimPixel> {
  const map = new Map<string, AnimPixel>();
  for (const p of pixels) {
    map.set(`${p.r},${p.c}`, p);
  }
  return map;
}

/* ─── Component ─── */

interface PixelArtProps {
  onCycleTime?: () => void;
}

export default function PixelArt({ onCycleTime }: PixelArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timePeriod = useStudioStore((s) => s.timePeriod);
  const timeOverride = useStudioStore((s) => s.timeOverride);
  const setTimeOverride = useStudioStore((s) => s.setTimeOverride);

  const effectivePeriod = timeOverride ?? timePeriod;

  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const speedMultRef = useRef(1);
  const targetSpeedRef = useRef(1);
  const [hovered, setHovered] = useState(false);
  const revertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cross-fade state
  const crossFadeRef = useRef<{
    from: TimePeriod;
    to: TimePeriod;
    progress: number; // 0 → 1
  } | null>(null);
  const prevPeriodRef = useRef(effectivePeriod);

  // Detect period change → start cross-fade
  useEffect(() => {
    if (prevPeriodRef.current !== effectivePeriod) {
      crossFadeRef.current = {
        from: prevPeriodRef.current,
        to: effectivePeriod,
        progress: 0,
      };
      prevPeriodRef.current = effectivePeriod;
    }
  }, [effectivePeriod]);

  // Click handler — cycle time
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const next = nextPeriod(effectivePeriod);
      setTimeOverride(next);

      // Clear existing revert timer
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
      // Set new revert timer
      revertTimerRef.current = setTimeout(() => {
        setTimeOverride(null);
        revertTimerRef.current = null;
      }, 8000);

      onCycleTime?.();
    },
    [effectivePeriod, setTimeOverride, onCycleTime],
  );

  // Cleanup revert timer
  useEffect(() => {
    return () => {
      if (revertTimerRef.current) clearTimeout(revertTimerRef.current);
    };
  }, []);

  // Hover speed control
  useEffect(() => {
    targetSpeedRef.current = hovered ? 3 : 1;
  }, [hovered]);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    function drawSprite(
      sprite: string[][],
      animLookup: Map<string, AnimPixel>,
      time: number,
      globalAlpha: number,
    ) {
      if (!ctx) return;
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const color = sprite[r]?.[c];
          if (!color) continue;

          const animKey = `${r},${c}`;
          const anim = animLookup.get(animKey);

          let alpha = 1;
          if (anim) {
            const wave = Math.sin(time * anim.speed * speedMultRef.current + anim.phase);
            const norm = (wave + 1) / 2; // 0–1
            alpha = anim.minAlpha + norm * (anim.maxAlpha - anim.minAlpha);
          }

          ctx.globalAlpha = alpha * globalAlpha;
          ctx.fillStyle = color;
          ctx.fillRect(c * SCALE, r * SCALE, SCALE, SCALE);
        }
      }
    }

    let lastDrawFrame = -1;

    function tick() {
      frameRef.current += 1;

      // Ease speed multiplier toward target
      const diff = targetSpeedRef.current - speedMultRef.current;
      if (Math.abs(diff) > 0.01) {
        speedMultRef.current += diff * 0.08;
      }

      // Advance cross-fade
      const cf = crossFadeRef.current;
      if (cf && cf.progress < 1) {
        cf.progress = Math.min(cf.progress + 0.04, 1); // ~25 frames = ~1.7s at 15fps
        if (cf.progress >= 1) crossFadeRef.current = null;
      }

      // Draw at ~15fps
      if (frameRef.current - lastDrawFrame >= 4) {
        lastDrawFrame = frameRef.current;

        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, PX, PX);

        const time = frameRef.current * 0.25; // slow time base

        if (cf && cf.progress < 1) {
          // Cross-fade: draw outgoing then incoming
          const fromSprite = SPRITES[cf.from];
          const fromAnim = buildAnimLookup(ANIM_PIXELS[cf.from]);
          const toSprite = SPRITES[cf.to];
          const toAnim = buildAnimLookup(ANIM_PIXELS[cf.to]);

          drawSprite(fromSprite, fromAnim, time, 1 - cf.progress);
          drawSprite(toSprite, toAnim, time, cf.progress);
        } else {
          const sprite = SPRITES[effectivePeriod];
          const animLookup = buildAnimLookup(ANIM_PIXELS[effectivePeriod]);
          drawSprite(sprite, animLookup, time, 1);
        }

        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    // Initial draw
    frameRef.current = 0;
    lastDrawFrame = -1;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [effectivePeriod]);

  return (
    <div
      style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}
    >
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Cycle time theme"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          lineHeight: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          width={PX}
          height={PX}
          style={{
            width: PX,
            height: PX,
            imageRendering: "pixelated",
            display: "block",
            transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
            transform: hovered ? "scale(1.08)" : "scale(1)",
          }}
        />
      </button>
      {/* Tooltip */}
      <span
        className="font-mono uppercase"
        style={{
          fontSize: "7px",
          letterSpacing: "0.1em",
          color: "var(--color-text-ghost)",
          marginTop: "3px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        {effectivePeriod}
      </span>
    </div>
  );
}
