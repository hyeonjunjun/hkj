"use client";

import { useRef, useState, type PointerEvent, type WheelEvent } from "react";
import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

interface ArcCarouselProps {
  works: Work[];
  onPreview: (work: Work) => void;
}

const RADIUS = 460;
const ANGLE_STEP = 24;
const VISIBLE_MIN = 95;
const VISIBLE_MAX = 265;
const TILE_SIZE = 110;
const WHEEL_SENSITIVITY = 0.15;
const DRAG_SENSITIVITY = 0.3;

/**
 * The repeating cycle of slots around the arc: each real work followed by
 * two filler slots. With only 3 works today, filling the whole wheel with
 * real content would either look sparse or force a tiny arc -- filler
 * slots (rendered solid black, like an undeveloped photo frame) let the
 * arc read as a fuller collection without fabricating projects.
 */
function buildSlotCycle(works: Work[]): (Work | null)[] {
  const cycle: (Work | null)[] = [];
  works.forEach((work) => {
    cycle.push(work, null, null);
  });
  return cycle;
}

function normalizeAngle(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * A collection of work tiles arranged along a circular arc centered
 * off-screen to the right -- reacts to both wheel scroll and pointer drag,
 * rotating the whole assembly like a wheel rather than sliding a flat
 * strip. Only each tile's *position* follows the curve; tile content
 * stays axis-aligned and upright, the same "geometry moves, content stays
 * legible" rule used for the hero's diagonal cut this replaces.
 */
export default function ArcCarousel({ works, onPreview }: ArcCarouselProps) {
  const cycle = buildSlotCycle(works);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{ startY: number; startRotation: number } | null>(null);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    setRotation((r) => r + e.deltaY * WHEEL_SENSITIVITY);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragState.current = { startY: e.clientY, startRotation: rotation };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const delta = e.clientY - dragState.current.startY;
    setRotation(dragState.current.startRotation - delta * DRAG_SENSITIVITY);
  };

  const handlePointerUp = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  const tiles: { key: string; work: Work | null; theta: number }[] = [];
  const iRange = Math.ceil((VISIBLE_MAX - VISIBLE_MIN) / ANGLE_STEP) + 4;
  for (let i = -iRange; i <= iRange; i++) {
    const theta = normalizeAngle(i * ANGLE_STEP - rotation);
    if (theta < VISIBLE_MIN || theta > VISIBLE_MAX) continue;
    const dataIndex = ((i % cycle.length) + cycle.length) % cycle.length;
    tiles.push({ key: `slot-${i}`, work: cycle[dataIndex], theta });
  }

  return (
    <div
      className={`relative h-full w-full touch-none select-none overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {tiles.map(({ key, work, theta }) => {
        const rad = (theta * Math.PI) / 180;
        // Rounded to whole pixels so the server-rendered and
        // client-hydrated style strings are byte-identical -- raw
        // floating-point cos/sin output can otherwise differ in the
        // last few decimal digits between environments and trip a
        // hydration mismatch warning even though the visual result
        // is indistinguishable.
        const x = Math.round(Math.cos(rad) * RADIUS);
        const y = Math.round(Math.sin(rad) * RADIUS);
        const style = {
          left: `calc(100% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          width: `${TILE_SIZE}px`,
          height: `${TILE_SIZE}px`,
          transform: "translate(-50%, -50%)",
        };

        if (!work) {
          return <div key={key} aria-hidden="true" className="absolute bg-black" style={style} />;
        }

        return (
          <Link
            key={key}
            href={`/works/${work.slug}`}
            onMouseEnter={() => onPreview(work)}
            onFocus={() => onPreview(work)}
            className="absolute overflow-hidden bg-ws-ink/5 transition-opacity duration-300 hover:opacity-90"
            style={style}
          >
            <MediaRenderer media={work.media} fit="cover" />
          </Link>
        );
      })}
    </div>
  );
}
