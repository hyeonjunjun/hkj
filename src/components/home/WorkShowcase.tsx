import type { Work } from "@/data/works";
import { sortWorksForTimeline } from "@/lib/timelineMotion";
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
 * HomeTimeline/TimelineStop/TimelineAxis/ArcCarousel are left in place,
 * unused, in case a future direction wants them back (same precedent as
 * WorkGrid after the /works retirement).
 */
export default function WorkShowcase({ works }: WorkShowcaseProps) {
  const sorted = sortWorksForTimeline(works);

  return (
    <div className="h-full w-full">
      <FeaturedGrid works={sorted} />
    </div>
  );
}
