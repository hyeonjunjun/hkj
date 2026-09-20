"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import SwatchRail from "./SwatchRail";

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
 * GSP measured live at 1920x1000:
 *
 *   plate     x329, 626x962 — AR 0.65, 32.6% of width, 96.2% of height
 *   List/Grid x329 / x363   on the plate's own left edge
 *   Stills    x1124 ┐
 *   Motion    x1284 │  159.4px pitch
 *   Culture   x1443 │
 *   Information x1602 ┘
 *
 * That pitch resolves to a 12-column grid with a ~7px gutter, putting
 * the plate at column 3 span 4 and the nav on columns 3, 8, 9, 10, 11 —
 * and the right-margin metadata on those same nav columns.
 *
 * SCROLL MODEL — this is GSP's, not a carousel.
 *
 * The plates are a plain vertical column in normal document flow; the
 * page scrolls. Smoothing is Lenis at lerp 0.1 (see SmoothScroll), which
 * is GSP's own measured value. Nothing here hijacks the wheel.
 *
 * The previous version locked the page to one viewport and stepped
 * between works on a wheel accumulator. That is a carousel wearing a
 * scrollbar: it quantises a continuous gesture, so momentum, trackpad
 * inertia, keyboard paging, and find-in-page all stop meaning anything.
 * Letting the document scroll gets all of that back for free.
 *
 * The rail and the metadata do not scroll with it. Each sits in a
 * sticky full-height cell with its contents centred, so they hold the
 * viewport's middle while plates pass — which is exactly where GSP
 * pins "9 Images" and "Client / Photographer".
 *
 * Which work is "current" is whichever plate is crossing the viewport's
 * centre line, found with an IntersectionObserver whose root margin
 * collapses the viewport to that single line.
 *
 * Deliberately absent: waveform, scrubber, transport bar. The
 * horizontal waveform line has been rejected on this project repeatedly
 * for cutting across the composition.
 */
export default function HomeIndex({ works }: HomeIndexProps) {
  const [active, setActive] = useState(0);
  const plateRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // -50%/-50% collapses the root to a zero-height line at the viewport
    // centre, so a plate "intersects" only while it covers that line.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = plateRefs.current.indexOf(entry.target as HTMLAnchorElement);
          if (i !== -1) setActive(i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    plateRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [works.length]);

  const work = works[active];

  // Swatch click scrolls the plate to centre. Lenis is driving the
  // document, so native smooth behaviour is handed off to it.
  const goTo = useCallback((i: number) => {
    plateRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const meta = [
    { label: "Client", value: work.title.toLowerCase(), col: "md:col-start-8" },
    { label: "Role", value: work.role.toLowerCase(), col: "md:col-start-10" },
    { label: "Year", value: work.year, col: "md:col-start-12" },
  ];

  return (
    <div className="grid12 items-start">
      {/* Left margin — rail, held at the viewport's middle. */}
      <div className="sticky top-0 z-10 col-span-12 col-start-1 flex h-screen items-center md:col-span-1">
        <SwatchRail works={works} activeIndex={active} onSelect={goTo} />
      </div>

      {/* Centre column — one plate per work, in normal flow. */}
      <div className="col-span-12 col-start-1 flex flex-col gap-[var(--space-8)] py-[var(--space-8)] md:col-span-4 md:col-start-3">
        {works.map((w, i) => (
          <Link
            key={w.id}
            href={`/works/${w.slug}`}
            aria-label={`Open ${w.title}`}
            ref={(el) => {
              plateRefs.current[i] = el;
            }}
            className="block h-[86vh] overflow-hidden bg-ws-fill"
          >
            <MediaRenderer media={w.media} fit="cover" />
          </Link>
        ))}
      </div>

      {/* Right margin — metadata for whichever plate holds the centre. */}
      <div className="pointer-events-none sticky top-0 col-span-12 col-start-1 hidden h-screen md:col-span-5 md:col-start-8 md:block">
        <div className="grid h-full grid-cols-5 items-center gap-x-[var(--gutter)]">
          {meta.map((m, i) => (
            <p key={m.label} className={["col-start-1", "col-start-3", "col-start-5"][i]}>
              <span className="text-value text-ws-ink-mute">{m.label}</span>{" "}
              <span className="text-label text-ws-ink">{m.value}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Position readout, bottom right — GSP's 0%. */}
      <p className="pointer-events-none fixed bottom-[var(--space-2)] right-[var(--gutter)] z-10 text-value tabular-nums text-ws-ink-mute">
        {pad2(active + 1)} / {pad2(works.length)}
      </p>
    </div>
  );
}
