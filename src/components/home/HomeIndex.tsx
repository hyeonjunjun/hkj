"use client";

import { useRef, useState, type WheelEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import TrackRow from "./TrackRow";
import { durationSeconds, windEasing } from "@/lib/motion";

interface HomeIndexProps {
  works: Work[];
}

/**
 * Home as a player: a track list on the left, now-playing plates on the
 * right. Wheel/scroll skips (debounced to one step per gesture); a row
 * click selects directly.
 *
 * Structure follows dylan.camera, adapted. His rail is column 1 holding
 * bare 20px colour swatches, with plates at columns 3-6 and 7-10 and the
 * outer columns left empty. Ours carries real metadata per row — title,
 * category, year, position — so it needs the width: rail at columns 1-4,
 * plates at 5-8 and 9-12.
 *
 * That also answers why this page read as empty. It was not the quantity
 * of white space; it was that nothing bounded it. His fields are filled
 * cells, so a wide cell holding a short word reads as a form field with
 * capacity rather than a gap. Every field in the rail is now a filled
 * cell for the same reason.
 *
 * Plate geometry is measured at two viewports, not one. Width is four
 * grid columns, height is 50% of the viewport — the aspect is an output:
 *
 *   1440   4 cols = 464 wide,  50vh = 450 tall   AR 1.03
 *   1920   4 cols = 624 wide,  50vh = 500 tall   AR 1.25
 *
 * Deliberately NOT here: a waveform, a transport scrubber, or anything
 * else a music UI reaches for by reflex — the horizontal waveform line
 * has been rejected on this project repeatedly for cutting across the
 * composition. The list IS the player.
 *
 * Also not a work index masquerading as a homepage: the rail selects
 * what the plates show, it does not navigate away.
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
    <div onWheel={handleWheel} className="grid12 h-full w-full items-start">
      {/* Track list — columns 1-4, top-aligned. His rail sits at y=12,
          level with the nav, not floating in the middle of the column. */}
      <div className="col-span-12 col-start-1 flex flex-col gap-[var(--space-1)] pt-[var(--space-1)] md:col-span-4 md:col-start-1">
        {works.map((w, i) => (
          <TrackRow
            key={w.id}
            work={w}
            position={i + 1}
            isActive={i === index}
            onSelect={() => setIndex(i)}
          />
        ))}
      </div>

      {/* Now playing — columns 5-8 and 9-12. Both plates share one height
          and cover-crop into it, so a 16:9 video beside a square
          placeholder still shares a baseline. */}
      <Link
        href={`/works/${work.slug}`}
        aria-label={`Open ${work.title}`}
        className="col-span-12 col-start-1 mt-[var(--space-4)] grid grid-cols-1 gap-[var(--gutter)] md:col-span-8 md:col-start-5 md:mt-0 md:grid-cols-2 md:self-center"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={`${work.id}-a`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationSeconds.base, ease: windEasing }}
            className={`h-[50vh] overflow-hidden bg-ws-fill ${secondaryMedia ? "" : "md:col-span-2"}`}
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
              className="h-[50vh] overflow-hidden bg-ws-fill"
            >
              <MediaRenderer media={secondaryMedia} fit="cover" />
            </motion.div>
          </AnimatePresence>
        )}
      </Link>
    </div>
  );
}
