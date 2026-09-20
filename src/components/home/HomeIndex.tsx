"use client";

import { useEffect, useRef, useState, type WheelEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import SwatchRail from "./SwatchRail";
import { durationSeconds, windEasing } from "@/lib/motion";

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface HomeIndexProps {
  works: Work[];
}

/**
 * Home, on GSP's composition (gsproductions.co.za) with dylan.camera's
 * swatch navigation in the left margin.
 *
 * GSP measured off the live site at 1920x1000:
 *
 *   List          x329   ┐ view toggle, on the plate's own left edge
 *   Grid          x363   ┘
 *   Stills        x1124  ┐
 *   Motion        x1284  │ categories, 159.4px pitch
 *   Culture       x1443  │
 *   Information   x1602  ┘
 *   Journal       x1861    right-aligned to the last column
 *   plate         x329, 626x962 — AR 0.65, 32.6% of width, 96.2% of height
 *
 * That pitch resolves to a 12-column grid with a ~7px gutter and ~152px
 * column, which puts the plate at column 3 span 4 and the nav items on
 * columns 3, 8, 9, 10 and 11. The metadata in the right margin sits on
 * those same nav columns — one set of tracks for chrome and content
 * alike, which is the whole trick.
 *
 * Composition rule: a tall centre plate with its metadata floating in
 * the margins at the plate's vertical centre, never beneath it.
 *
 * GSP bounds its white space by ALIGNMENT; dylan.camera bounds his with
 * filled cells. Those are two different answers to the same problem, and
 * mixing them was the error in the previous pass here — filled metadata
 * cells belong to his system, not this one. Everything in the margins is
 * bare text.
 *
 * GSP reaches 96% of the viewport by scrolling a column of plates. This
 * page is locked to one viewport, so the plate takes the available
 * height between the nav and the counter instead.
 *
 * Its type is Suisse Medium 13.33px/500, no tracking — close enough to
 * this project's 12px/500 label role that no special case is needed.
 *
 * Deliberately absent: waveform, scrubber, transport bar. The horizontal
 * waveform line has been rejected on this project repeatedly for cutting
 * across the composition.
 */
export default function HomeIndex({ works }: HomeIndexProps) {
  const [index, setIndex] = useState(0);
  const work = works[index];

  /**
   * Wheel handling, tuned against gsproductions.co.za.
   *
   * It previously advanced on the first wheel event past a 10px deltaY
   * and then hard-locked for 450ms, so a flick and a shove did the same
   * thing and anything during the lock was simply dropped. That reads as
   * a slideshow with a cooldown, not as scrolling.
   *
   * Now the deltas accumulate and a step fires when the total crosses
   * THRESHOLD, so the gesture's size decides when it advances. Between
   * steps the accumulator decays toward zero at the same 0.1 lerp Lenis
   * uses elsewhere (see SmoothScroll), which is what keeps it feeling
   * continuous rather than quantised — a half-gesture that stops bleeds
   * off instead of sitting there waiting to be topped up.
   *
   * A short COOLDOWN remains, but only long enough for the crossfade to
   * read; it is not what paces the interaction.
   */
  const accum = useRef(0);
  const lastStep = useRef(0);
  const decayRaf = useRef<number | null>(null);

  const THRESHOLD = 120;
  const COOLDOWN = 260;

  const startDecay = () => {
    if (decayRaf.current !== null) return;
    const tick = () => {
      accum.current *= 1 - 0.1;
      if (Math.abs(accum.current) < 1) {
        accum.current = 0;
        decayRaf.current = null;
        return;
      }
      decayRaf.current = requestAnimationFrame(tick);
    };
    decayRaf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    if (decayRaf.current !== null) cancelAnimationFrame(decayRaf.current);
  }, []);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (works.length === 0) return;
    accum.current += e.deltaY;
    startDecay();

    const now = performance.now();
    if (Math.abs(accum.current) < THRESHOLD || now - lastStep.current < COOLDOWN) return;

    const dir = accum.current > 0 ? 1 : -1;
    accum.current = 0;
    lastStep.current = now;
    setIndex((i) => (i + dir + works.length) % works.length);
  };

  // One label/value pair per column, on GSP's nav tracks.
  const meta = [
    { label: "Client", value: work.title.toLowerCase(), col: "md:col-start-8" },
    { label: "Role", value: work.role.toLowerCase(), col: "md:col-start-10" },
    { label: "Year", value: work.year, col: "md:col-start-12" },
  ];

  return (
    <div onWheel={handleWheel} className="flex h-full w-full flex-col">
      <div className="grid12 min-h-0 flex-1 items-center">
        {/* Left margin — swatch rail where GSP puts its "9 Images" count. */}
        <div className="col-span-12 col-start-1 pb-[var(--space-2)] md:col-span-1 md:pb-0">
          <SwatchRail works={works} activeIndex={index} onSelect={setIndex} />
        </div>

        {/* Centre plate — column 3, span 4, available height. */}
        <Link
          href={`/works/${work.slug}`}
          aria-label={`Open ${work.title}`}
          className="col-span-12 col-start-1 h-full min-h-0 md:col-span-4 md:col-start-3"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={work.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durationSeconds.base, ease: windEasing }}
              className="h-full w-full overflow-hidden bg-ws-fill"
            >
              <MediaRenderer media={work.media} fit="cover" />
            </motion.div>
          </AnimatePresence>
        </Link>

        {/* Right margin — bare text on the nav columns. */}
        {meta.map((m) => (
          <p
            key={m.label}
            className={`col-span-12 col-start-1 mt-[var(--space-1)] md:col-span-2 md:mt-0 ${m.col}`}
          >
            <span className="text-value text-ws-ink-mute">{m.label}</span>{" "}
            <span className="text-label text-ws-ink">{m.value}</span>
          </p>
        ))}
      </div>

      {/* Position, bottom right — GSP's 0% readout. */}
      <div className="grid12 pb-[var(--space-2)]">
        <p className="col-span-12 col-start-1 text-right text-value tabular-nums text-ws-ink-mute">
          {pad2(index + 1)} / {pad2(works.length)}
        </p>
      </div>
    </div>
  );
}
