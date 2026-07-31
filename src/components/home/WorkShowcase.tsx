import type { Work } from "@/data/works";
import FeaturedGrid from "./FeaturedGrid";

interface WorkShowcaseProps {
  works: Work[];
}

/**
 * Homepage centerpiece: solely FeaturedGrid, full-bleed under the top
 * bar -- no separate editorial text column. Every work detail (index,
 * title, category, year) lives in each tile's own hover caption instead
 * of a persistent sidebar, per the "media/grid heavy, details on hover"
 * direction. No client-side state needed here anymore since nothing
 * outside the grid reacts to hover -- each tile's caption is pure CSS
 * (group-hover), so this can be a server component again.
 *
 * Passes `works` straight from works.ts, deliberately not through
 * sortWorksForTimeline: FeaturedGrid's positions are hand-curated by
 * array slot (the first work lands in the biggest spot), and with every
 * work's `year` currently a "YEAR" placeholder, a most-recent-first sort
 * would just fall back to index order anyway while adding an
 * indirection that obscures which slot gets which work. Once works have
 * real years, revisit whether the curated slots should track something
 * other than raw array order.
 *
 * HomeTimeline/TimelineStop/TimelineAxis/ArcCarousel are left in place,
 * unused, in case a future direction wants them back (same precedent as
 * WorkGrid after the /works retirement).
 */
export default function WorkShowcase({ works }: WorkShowcaseProps) {
  return (
    <div className="h-full w-full">
      <FeaturedGrid works={works} />
    </div>
  );
}
