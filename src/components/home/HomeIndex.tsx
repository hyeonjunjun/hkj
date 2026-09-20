"use client";

import { useRef, useState, type WheelEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import { durationSeconds, windEasing } from "@/lib/motion";

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface HomeIndexProps {
  works: Work[];
}

/**
 * Home as a one-work-at-a-time panel spread — dylan.camera's mechanic.
 * Wheel/scroll advances (debounced to one step per gesture).
 *
 * Plate geometry is dylan.camera's, measured at two viewports rather
 * than inferred from one. His plates sit at column 3 span 4 and column 7
 * span 4, and their height is 50% of the viewport — NOT a fixed aspect:
 *
 *   1440 viewport   4 cols = 464 wide,  50vh = 450 tall   AR 1.03
 *   1920 viewport   4 cols = 624 wide,  50vh = 500 tall   AR 1.25
 *
 * Width comes from the grid, height from the viewport, so the aspect
 * drifts with the window by design. An earlier pass here read only the
 * 1440 case, saw AR 1.03 and locked the plates square — which holds at
 * 1440 but runs 62vh at 1920, visibly too tall. Hence: no aspect-ratio,
 * height 50vh, cover-crop.
 *
 * Note what this deliberately is NOT: filling the viewport. An earlier
 * pass flexed these to full height (758px, 84%) and had to be reverted —
 * generous margin is the point, and the plate is a plate, not a backdrop.
 *
 * Columns 1-2 and 11-12 stay empty, which is what centres the spread
 * without anything being centred by a layout rule.
 *
 * Deliberately not a work index or list — that pattern has been rejected
 * before and should not be reintroduced here.
 */
export default function HomeIndex({ works }: HomeIndexProps) {
  const [index, setIndex] = useState(0);
  const work = works[index];
  const secondaryMedia = work.sections?.[0]?.media;
  const wheelLocked = useRef(false);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (wheelLocked.current || Math.abs(e.deltaY) < 10 || works.length === 0) return;
    wheelLocked.current = true;
    setIndex((i) => (e.deltaY > 0 ? (i + 1) % works.length : (i - 1 + works.length) % works.length));
    setTimeout(() => {
      wheelLocked.current = false;
    }, 450);
  };

  // Two plates take columns 3-6 and 7-10; a lone plate centres at 5-8.
  const plateA = secondaryMedia
    ? "col-span-12 col-start-1 md:col-span-4 md:col-start-3"
    : "col-span-12 col-start-1 md:col-span-4 md:col-start-5";

  return (
    <div onWheel={handleWheel} className="flex h-full w-full flex-col justify-center">
      <Link href={`/works/${work.slug}`} aria-label={`Open ${work.title}`} className="grid12">
        {/* Both plates share one height and cover-crop into it, so a 16:9
            video beside a square placeholder still shares a baseline. */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`${work.id}-a`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationSeconds.base, ease: windEasing }}
            className={`${plateA} h-[50vh] overflow-hidden bg-ws-fill`}
          >
            <MediaRenderer media={work.media} fit="cover" />
          </motion.div>
        </AnimatePresence>
        {secondaryMedia && (
          <AnimatePresence mode="sync">
            <motion.div
              key={`${work.id}-b`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: durationSeconds.base, ease: windEasing }}
              className="col-span-12 col-start-1 h-[50vh] overflow-hidden bg-ws-fill md:col-span-4 md:col-start-7"
            >
              <MediaRenderer media={secondaryMedia} fit="cover" />
            </motion.div>
          </AnimatePresence>
        )}
      </Link>

      {/* Caption aligns to the plates, not to the page edge — a label to
          the left of the thing it names reads as a stray. */}
      <div className="grid12 mt-[var(--space-2)] text-value text-ws-ink-mute">
        <span className="col-span-8 col-start-1 md:col-span-5 md:col-start-3">
          {work.title.toLowerCase()} <span aria-hidden="true">&middot;</span>{" "}
          {work.category.toLowerCase()}
        </span>
        <span className="col-span-4 col-start-9 text-right tabular-nums md:col-span-3 md:col-start-8">
          {pad2(index + 1)} / {pad2(works.length)}
        </span>
      </div>
    </div>
  );
}
