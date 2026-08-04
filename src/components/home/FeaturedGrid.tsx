import Link from "next/link";
import type { Work } from "@/data/works";
import { studio } from "@/data/studio";
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
 * One art-directed tile. Media fills the cell; caption row appears
 * below the tile in the surrounding gap on hover / focus, matching the
 * original hover-caption pattern (info hides at rest so the composition
 * reads as pure image + air).
 */
function Tile({ work, index, areaClassName }: TileProps) {
  return (
    <Link
      href={`/works/${work.slug}`}
      className={`group relative flex min-w-0 flex-col ${areaClassName}`}
    >
      <div className="relative min-h-0 flex-1 overflow-hidden bg-ws-ink/5 transition-opacity duration-300 group-hover:opacity-90">
        <MediaRenderer media={work.media} fit="cover" />
      </div>
      <div className="absolute inset-x-0 top-full flex items-baseline justify-between gap-3 pt-2 font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <span className="tabular-nums text-ws-ink/40">{pad2(index)}</span>
        <span className="truncate">{work.title.toLowerCase()}</span>
        <span className="shrink-0 text-ws-ink/40">{work.category.toLowerCase()}</span>
        <span className="shrink-0 text-ws-ink/40">{work.year}</span>
      </div>
    </Link>
  );
}

/**
 * Homepage centerpiece: art-directed placement of four works and three
 * microtype anchors on a 12-col × 9-row canvas. Blit-inspired in
 * *approach* — freeform hand-curated positions, generous negative space,
 * microtype as compositional punctuation — but the specific geometry,
 * scale rhythm, and chrome are composed here for ryan jun rather than
 * mirroring blit's panel layout.
 *
 * Home is deliberately a curated "look" — taste and philosophy, not the
 * full catalog. Four tiles is a ceiling, not a slice of a longer list:
 * col 1, col 8, and all of row 5 are left genuinely empty (no tile, no
 * text) rather than gapped-but-full, which is what actually reads as
 * whitespace instead of a tight grid with narrow gutters. The full
 * catalog lives at /works — see the "all works" link below.
 *
 * Deliberately drops the earlier orange filler swatch and bottom-right
 * outline block: those were the blit-fingerprint tells (accent-color
 * filler + outline-swatch punctuation are blit's specific vocabulary).
 * The microtype elements that remain (thesis line, edition mark, all-works
 * link) carry real copy or real navigation — they're stated positions,
 * not decoration.
 *
 * Tile positions are hand-curated for exactly four works; a fifth means
 * adding an explicit fifth slot, not appending to works.ts. Works beyond
 * the curated four are still reachable — they just live at /works, not here.
 */
export default function FeaturedGrid({ works }: FeaturedGridProps) {
  const [a, b, c, d] = works;

  return (
    <div className="relative grid h-full w-full grid-cols-1 grid-rows-[repeat(4,minmax(180px,auto))] gap-10 p-8 md:grid-cols-12 md:grid-rows-9 md:gap-x-16 md:gap-y-10 md:p-16 lg:p-20">
      {a && (
        <Tile
          work={a}
          index={1}
          areaClassName="row-[1/2] md:col-[2/8] md:row-[1/7]"
        />
      )}

      {b && (
        <Tile
          work={b}
          index={2}
          areaClassName="row-[2/3] md:col-[9/13] md:row-[1/4]"
        />
      )}

      {/* Thesis line — sits alone under the upper-right tile (b), in the
          gap before row 5's empty band. Real copy, not decorative
          microtype: the practice-and-place statement. */}
      <p className="hidden font-instrument-sans text-[11px] font-medium leading-relaxed text-ws-ink/50 md:col-[9/13] md:row-[4/5] md:block md:self-start">
        {studio.role} &mdash; {studio.location.toLowerCase()}.
      </p>

      {c && (
        <Tile
          work={c}
          index={3}
          areaClassName="row-[3/4] md:col-[9/13] md:row-[6/9]"
        />
      )}

      {d && (
        <Tile
          work={d}
          index={4}
          areaClassName="row-[4/5] md:col-[3/7] md:row-[7/10]"
        />
      )}

      {/* Edition mark — sits in the empty band to the right of the
          lower-left tile (d), below row 5's void. Names the site as a
          dated publication, not a static portfolio. Roman numeral for
          editorial character. */}
      <span
        aria-hidden="true"
        className="hidden font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/35 md:col-[7/9] md:row-[8/9] md:block md:self-start"
      >
        selected &middot; mmxxvi
      </span>

      {/* All-works link — the way out of the curated four into the full
          catalog at /works. Sits in the left margin under the anchor
          tile (a), the same quiet register as the edition mark. */}
      <Link
        href="/works"
        className="hidden font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/50 transition-opacity hover:opacity-60 md:col-[2/5] md:row-[8/9] md:block md:self-start"
      >
        all works &rarr;
      </Link>
    </div>
  );
}
