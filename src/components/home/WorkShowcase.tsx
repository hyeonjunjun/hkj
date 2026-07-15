"use client";

import Link from "next/link";
import { studio } from "@/data/studio";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";
import { sortWorksForTimeline } from "@/lib/timelineMotion";

interface WorkShowcaseProps {
  works: Work[];
}

/** Zero-pads a positive integer to 3 digits, e.g. 1 -> "001". */
function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

/**
 * Single-work homepage centerpiece: one large contained image and a
 * left-margin page counter (total / current) -- replaces the
 * horizontal-filmstrip HomeTimeline on the homepage. HomeTimeline/
 * TimelineStop/TimelineAxis are left in place, unused, in case a future
 * direction wants them back (same precedent as WorkGrid after the
 * /works retirement).
 */
export default function WorkShowcase({ works }: WorkShowcaseProps) {
  const sorted = sortWorksForTimeline(works);
  const active = sorted[0];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-[6vw] py-[3vh]">
        <span
          aria-hidden="true"
          className="absolute left-[2vw] top-1/2 hidden -translate-y-1/2 items-baseline gap-4 font-display text-[13px] tabular-nums md:flex"
        >
          <span className="text-ws-ink/40">{pad3(sorted.length)}</span>
          <span className="font-medium text-ws-ink">{pad3(1)}</span>
        </span>

        {/* Height-driven, not a fixed-aspect box: the image fills the full
            available height between the two bars (matching the reference,
            which reads edge-to-edge vertically with no letterboxing), and
            width is derived from the active work's own aspect ratio via
            MediaRenderer's fit="height" mode -- the flex wrapper is what
            makes that derivation actually work (see TimelineStop.tsx for
            the same pattern/rationale). */}
        <Link
          href={`/works/${active.slug}`}
          className="flex h-full transition-opacity duration-300 hover:opacity-90"
        >
          <div className="relative h-full overflow-hidden bg-ws-ink/5">
            <MediaRenderer media={active.media} fit="height" />
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 px-[var(--edge-margin)] pb-5 pt-10">
        <span className="hidden font-display text-[12px] text-ws-ink/50 md:inline">{studio.role}</span>
        <p className="min-w-0 flex-1 truncate text-center font-display text-[13px] text-ws-ink">
          <span className="font-semibold">{active.title}</span>{" "}
          <span className="text-ws-ink/50">{active.caption}</span>
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <a
            href={`mailto:${studio.contactEmail}`}
            className="font-display text-[13px] text-ws-ink transition-opacity hover:opacity-60"
          >
            Email
          </a>
          <a href="#" className="font-display text-[13px] text-ws-ink transition-opacity hover:opacity-60">
            Subscribe to Newsletter
          </a>
        </div>
      </div>
    </div>
  );
}
