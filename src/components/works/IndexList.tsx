import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "./WorkTile";

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
    <div className="flex flex-col px-[var(--edge-margin)] pt-16 pb-32">
      {works.map((work, i) => (
        <Link
          key={work.id}
          href={`/works/${work.slug}`}
          className="group flex items-center gap-4 border-b border-ws-ink/10 py-4 first:border-t"
        >
          <span className="w-8 shrink-0 font-instrument-sans text-[11px] tabular-nums text-ws-ink/40">
            {pad2(i + 1)}
          </span>
          <span className="h-10 w-10 shrink-0 overflow-hidden bg-ws-ink/5">
            <MediaRenderer media={work.media} fit="cover" />
          </span>
          <span className="flex-1 truncate font-instrument-sans text-[16px] font-medium text-ws-ink transition-opacity group-hover:opacity-60">
            {work.title.toLowerCase()}
          </span>
          <span className="hidden shrink-0 font-instrument-sans text-[12px] text-ws-ink/50 sm:inline">
            {work.category.toLowerCase()} · {work.year}
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 text-ws-ink/40 transition-transform group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
