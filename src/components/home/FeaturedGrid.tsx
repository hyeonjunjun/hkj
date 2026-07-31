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
  areaClassName: string;
}

/**
 * One work tile: media fills its area, a caption row (index / title /
 * category / year) sits just below it, outside the tile's own border --
 * in the surrounding gap, not overlaid on the media -- invisible at rest
 * and fading in on hover or focus. The outer Link deliberately has no
 * overflow-hidden (only the media wrapper does, for the image/video
 * crop), so this absolutely-positioned caption isn't clipped when it
 * extends past the tile's bottom edge into the gap.
 */
function Tile({ work, index, areaClassName }: TileProps) {
  return (
    <Link href={`/works/${work.slug}`} className={`group relative flex min-w-0 flex-col ${areaClassName}`}>
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
 * Homepage centerpiece, blit.studio-inspired: work tiles, decorative
 * "visual filler" swatches, and small standalone microtype labels
 * scattered across an open 12-column canvas at hand-curated, non-uniform
 * positions -- not a repeating grid of equal cells. Generous gaps do
 * double duty: they're the whitespace the composition needs to read as
 * open rather than packed, and they're where each tile's hover caption
 * has room to appear without colliding with a neighboring tile.
 *
 * Positions are curated for the current five works specifically (by
 * array position, since sortWorksForTimeline's output order is what the
 * caller passes in) rather than computed generically -- matching how an
 * art-directed composition like this is actually built, not algorithmic.
 * Adding a sixth work means adding a sixth curated slot here, not just
 * appending to works.ts.
 */
export default function FeaturedGrid({ works }: FeaturedGridProps) {
  const [a, b, c, d, e] = works;

  return (
    <div className="relative grid h-full w-full grid-cols-1 grid-rows-[repeat(5,minmax(220px,auto))] gap-10 p-10 md:grid-cols-12 md:grid-rows-[repeat(7,1fr)] md:gap-8 md:p-12">
      {a && <Tile work={a} index={1} areaClassName="row-[1/2] md:col-[1/8] md:row-[1/4]" />}

      {/* Visual filler -- a plain accent-colored swatch, no work behind
          it, purely rhythm/punctuation between the two top tiles. */}
      <div aria-hidden="true" className="hidden bg-ws-accent md:col-[8/9] md:row-[1/2] md:block" />

      {/* Microtype -- a small standalone label, not tied to any tile's
          hover state, sitting alone in the open canvas. */}
      <span
        aria-hidden="true"
        className="hidden self-end font-instrument-sans text-[10px] font-bold uppercase tracking-widest text-ws-ink/30 md:col-[8/11] md:row-[2/3] md:block"
      >
        N&deg; 2026
      </span>

      {b && <Tile work={b} index={2} areaClassName="row-[2/3] md:col-[9/13] md:row-[1/4]" />}

      {c && <Tile work={c} index={3} areaClassName="row-[3/4] md:col-[9/13] md:row-[4/6]" />}

      {d && <Tile work={d} index={4} areaClassName="row-[4/5] md:col-[1/5] md:row-[4/8]" />}

      <span
        aria-hidden="true"
        className="hidden self-start font-instrument-sans text-[10px] font-bold uppercase tracking-widest text-ws-ink/30 md:col-[5/7] md:row-[4/5] md:block"
      >
        ( selected works )
      </span>

      {e && <Tile work={e} index={5} areaClassName="row-[5/6] md:col-[5/9] md:row-[5/8]" />}

      {/* Visual filler -- a thin outline swatch, echoing the "content
          coming soon" placeholder treatment but with no label, pure
          negative-space punctuation in the bottom-right corner. */}
      <div aria-hidden="true" className="hidden border border-ws-ink/15 md:col-[9/11] md:row-[6/8] md:block" />
    </div>
  );
}
