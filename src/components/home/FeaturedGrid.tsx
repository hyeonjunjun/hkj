import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

interface FeaturedGridProps {
  works: Work[];
}

/** Zero-pads a positive integer to 2 digits, e.g. 1 -> "01". */
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface TileProps {
  work: Work;
  index: number;
  spanClassName?: string;
}

/**
 * One grid tile: media fills the cell; a caption row (index / title /
 * category / year) sits just below it, outside the tile's own border --
 * in the grid gap, not overlaid on the media -- invisible at rest and
 * fading in on hover or focus. The outer Link deliberately has no
 * overflow-hidden (only the media wrapper does, for the image/video
 * crop), so this absolutely-positioned caption isn't clipped when it
 * extends past the tile's bottom edge into the surrounding whitespace.
 */
function Tile({ work, index, spanClassName = "" }: TileProps) {
  return (
    <Link href={`/works/${work.slug}`} className={`group relative flex flex-col ${spanClassName}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-ws-ink/5 transition-opacity duration-300 group-hover:opacity-90">
        <MediaRenderer media={work.media} fit="cover" />
      </div>
      <div className="absolute inset-x-0 top-full flex items-baseline justify-between gap-3 pt-2 font-instrument-sans text-[10px] font-bold uppercase tracking-widest text-ws-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <span className="text-ws-ink/40">{pad2(index)}</span>
        <span className="truncate">{work.title}</span>
        <span className="shrink-0 text-ws-ink/40">{work.category}</span>
        <span className="shrink-0 text-ws-ink/40">{work.year}</span>
      </div>
    </Link>
  );
}

/**
 * Homepage centerpiece, full-bleed: solely a media grid, no separate
 * text column. One work gets a large 2x2 featured cell -- the first
 * work with real media, so a still-placeholder piece never lands the
 * biggest spot -- the other two sit at 1x1, exactly filling a 3x2 grid
 * with no filler cells needed (2x2 + 1x1 + 1x1 = 6 cells). Every detail
 * (index, title, category, year) lives in the tile's own hover caption,
 * which appears below the tile rather than overlaid on it -- replaces
 * the earlier editorial-text-column + grid split. The generous gap and
 * outer padding aren't just whitespace for its own sake -- the bottom
 * row's tiles need that room for their hover captions to have somewhere
 * to appear without being clipped by the viewport edge.
 */
export default function FeaturedGrid({ works }: FeaturedGridProps) {
  const featuredIndex = works.findIndex((w) => w.media.type !== "placeholder");
  const featured = works[featuredIndex] ?? works[0];
  const rest = works.filter((w) => w.id !== featured.id);

  return (
    <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-8 p-8">
      <Tile work={featured} index={1} spanClassName="col-span-2 row-span-2" />
      {rest.map((work, i) => (
        <Tile key={work.id} work={work} index={i + 2} />
      ))}
    </div>
  );
}
