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
 * Home as a diptych/triptych panel spread — dylan.camera's mechanic,
 * not the list/directory this replaced and not the media-player/poster
 * treatments tried before that. One work at a time, shown as its hero
 * image plus its first section image side by side (a single panel if
 * there's no section media yet), capped to a moderate width within a
 * centered column — flat rectangles, no rounded corners, no shadow, no
 * oversized numerals. That's a deliberate scale correction: the
 * previous pass's depth/shadow "object" treatment and 260px background
 * numeral were reading as poster-scale, not editorial — dylan.camera's
 * actual images sit well inside generous margins at a restrained size,
 * which is the calibration this project has been reaching for all
 * along. Caption stays in the same small tracked microtype used
 * everywhere else on the site, not a display size.
 *
 * Wheel/scroll advances to the next work (debounced to one step per
 * gesture) — this survives from the media-player era since it's
 * independent of layout, and dylan.camera uses the same mechanic.
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

  return (
    <div
      onWheel={handleWheel}
      className="flex h-full w-full flex-col items-center justify-center gap-6 px-[var(--edge-margin)]"
    >
      <Link
        href={`/works/${work.slug}`}
        className="flex w-full max-w-[1000px] items-start justify-center gap-4 md:gap-6"
      >
        {/*
         * Both panels share one 4:3 frame and cover-crop into it. Letting
         * each image keep its own aspect made the pair different heights
         * (a 16:9 video beside a square placeholder), so the spread had a
         * ragged bottom edge and read accidental rather than composed —
         * a diptych only works if the plates share a baseline.
         */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`${work.id}-a`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationSeconds.base, ease: windEasing }}
            className={`aspect-[4/3] overflow-hidden bg-ws-fill ${secondaryMedia ? "w-1/2" : "w-full max-w-[560px]"}`}
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
              className="aspect-[4/3] w-1/2 overflow-hidden bg-ws-fill"
            >
              <MediaRenderer media={secondaryMedia} fit="cover" />
            </motion.div>
          </AnimatePresence>
        )}
      </Link>

      <div className="flex w-full max-w-[1000px] items-baseline justify-between text-value text-ws-ink-mute">
        <span>
          {work.title.toLowerCase()} <span className="text-ws-ink-mute">&middot;</span> {work.category.toLowerCase()}
        </span>
        <span className="tabular-nums">
          {pad2(index + 1)} / {pad2(works.length)}
        </span>
      </div>
    </div>
  );
}
