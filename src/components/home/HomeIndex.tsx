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
 * Plate geometry is dylan.camera's, measured rather than guessed. His
 * hero plates sit on his own 12-column grid at column 3 span 4 and
 * column 7 span 4 — predicted x 250.0 / 726.0 and width 464.0 against
 * measured 250 / 726 / 464 — and they are SQUARE, occupying 50% of the
 * viewport height with equal margins above and below.
 *
 * Ours matched him on width already (33.9% vs 32.2%) and on centring,
 * but ran 4:3, which left the plates at 40.7% of viewport height. Square
 * on our grid gives 469px at 1440, i.e. 52%.
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
        {/* Both plates are square and cover-crop, so a 16:9 video beside a
            square placeholder still shares a baseline. */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`${work.id}-a`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationSeconds.base, ease: windEasing }}
            className={`${plateA} aspect-square overflow-hidden bg-ws-fill`}
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
              className="col-span-12 col-start-1 aspect-square overflow-hidden bg-ws-fill md:col-span-4 md:col-start-7"
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
