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
 * Laid out on the site grid and sized to the locked viewport. The
 * previous pass centred a max-w-[1000px] column with items-center
 * justify-center, which left roughly 220px of dead margin either side,
 * a third of the viewport empty above the plates and another third
 * below, and put the plates' left edge at x=220 — column 3 starts at
 * 246.7, so nothing on the page lined up with anything else.
 *
 * Now: plates run from column 3 (the same left edge as every other
 * page) and flex to fill the height between the nav and the caption,
 * and the caption is a ruled row that bookends the ruled nav above it.
 * A diptych splits columns 3-7 / 8-12; a single plate takes 3-11.
 *
 * Deliberately NOT a work index or list — that pattern has been
 * rejected before and should not be reintroduced here.
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

  const plate = secondaryMedia
    ? "col-span-6 col-start-1 md:col-span-5 md:col-start-3"
    : "col-span-12 col-start-1 md:col-span-9 md:col-start-3";

  return (
    <div onWheel={handleWheel} className="flex h-full w-full flex-col">
      <Link
        href={`/works/${work.slug}`}
        aria-label={`Open ${work.title}`}
        className="grid12 min-h-0 flex-1 py-[var(--space-2)]"
      >
        {/* Both plates cover-crop into the grid cell and share the row's
            height, so the spread keeps a common baseline instead of going
            ragged when a 16:9 video sits beside a square placeholder. */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`${work.id}-a`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationSeconds.base, ease: windEasing }}
            className={`${plate} min-h-0 overflow-hidden bg-ws-fill`}
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
              className="col-span-6 col-start-7 min-h-0 overflow-hidden bg-ws-fill md:col-span-5 md:col-start-8"
            >
              <MediaRenderer media={secondaryMedia} fit="cover" />
            </motion.div>
          </AnimatePresence>
        )}
      </Link>

      {/* Ruled cells, matching the nav row at the top of the page — the
          two together frame the image the way a plate is framed.

          These start at column 3, under the plates, not at column 1: a
          caption sitting to the left of the thing it names reads as a
          stray label. Columns 1-2 stay the page's reserved margin. */}
      <div className="grid12 pb-[var(--space-2)]">
        <p className="col-span-8 col-start-1 border-t border-ws-rule pt-[var(--space-1)] text-label text-ws-ink md:col-span-4 md:col-start-3">
          {work.title.toLowerCase()}
        </p>
        <p className="col-span-4 col-start-9 border-t border-ws-rule pt-[var(--space-1)] text-value text-ws-ink-mute md:col-span-4 md:col-start-7">
          {work.category.toLowerCase()}
        </p>
        <p className="col-span-12 col-start-1 border-ws-rule pt-[var(--space-1)] text-value tabular-nums text-ws-ink-mute md:col-span-2 md:col-start-11 md:border-t md:text-right">
          {pad2(index + 1)} / {pad2(works.length)}
        </p>
      </div>
    </div>
  );
}
