import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "./WorkTile";
import MotionReveal from "../MotionReveal";
import { duration } from "@/lib/motion";

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface IndexListProps {
  works: Work[];
}

/**
 * The full catalog as a plain text index — one row per work (thumbnail,
 * title, category · year, an enter mark), separated by hairline rules
 * rather than boxed containers, per the editorial-analog rebuild's
 * "no pill backgrounds, no bordered containers" rule. Titles use the
 * same plain grotesk as the nav bar, not the serif — editorial here
 * comes from the row rhythm and hairlines, not a display typeface.
 */
export default function IndexList({ works }: IndexListProps) {
  return (
    /*
     * Capped measure, not full-bleed: at 1600px the title sat around x=135
     * while its own category/year sat near x=1470, and the eye can't bridge
     * a ~1300px gap to connect a row to its own metadata.
     */
    <div className="flex w-full max-w-[1100px] flex-col px-[var(--edge-margin)] pt-16 pb-32">
      {works.map((work, i) => (
        // Short per-row stagger, no long lead-in: the preloader covers the
        // first ~1.2s of a hard load, so a slow entrance would play unseen.
        // Kept brief so it still reads on client-side navigation.
        <MotionReveal key={work.id} delay={i * 60} duration={duration.reveal}>
        <Link
          href={`/works/${work.slug}`}
          className="group flex items-center gap-4 border-b border-ws-ink/10 py-4 first:border-t"
        >
          <span className="w-8 shrink-0 font-instrument-sans text-micro tabular-nums text-ws-ink/40">
            {pad2(i + 1)}
          </span>
          <span className="h-10 w-10 shrink-0 overflow-hidden bg-ws-ink/5">
            <MediaRenderer media={work.media} fit="cover" />
          </span>
          <span className="flex-1 truncate font-instrument-sans text-title font-medium text-ws-ink transition-opacity group-hover:opacity-60">
            {work.title.toLowerCase()}
          </span>
          <span className="hidden shrink-0 font-instrument-sans text-meta text-ws-ink/50 sm:inline">
            {work.category.toLowerCase()} · {work.year}
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 text-ws-ink/40 transition-transform group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </Link>
        </MotionReveal>
      ))}
    </div>
  );
}
