import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "./WorkTile";

/**
 * Swatch edge, px. The same 20px cell the home rail uses — see SWATCH in
 * components/home/SwatchRail. Kept as its own constant rather than
 * imported because that module is a client boundary and this one renders
 * on the server; if one moves, move both.
 */
const SWATCH = 20;

/**
 * Where the swatch sits against the type's baseline, px.
 *
 * Baseline-aligned, a box sits with its bottom edge ON the baseline,
 * which hangs it above the line and leaves the descender space under it
 * empty. A small positive value drops it back onto the line so the
 * swatch and the four fields read as one row, while the box still rises
 * clear of the cap height.
 */
const SWATCH_RISE = 3;

interface IndexListProps {
  works: Work[];
}

/**
 * The full catalog, in the home hero's own vocabulary.
 *
 * Each row is the hero spread flattened onto one line: the media swatch
 * from the rail at column 1, then the same four fields the hero shows —
 * title, role, type, year — each holding its own grid columns so they
 * line up down the page as columns, not as a ragged run of text.
 *
 * The columns are the hero's columns, and the row lands on the hero's
 * own measurements: the swatch sits at column 1 where the rail sits, the
 * title sits one --space-2 to its right — x=44 at 1440, the same x the
 * hero's title holds beside its active swatch — and the last field ends
 * on column 10, where the hero's media block ends. Moving between / and
 * /works moves no furniture.
 *
 * The swatch and title are one flex unit rather than two grid cells.
 * Given a column of its own the swatch was stranded ~90px from the
 * title it belongs to, and the title's own column was wide enough to
 * open a void before the metadata. Pinned to the swatch it is the hero's
 * pairing exactly, and every title still starts on the same x because
 * the swatch and the gap are both fixed.
 *
 * Spacing does all the separating: no rules, no row numbers, no boxes,
 * no enter mark. What was here before — a number, a thumbnail, a title,
 * a `category · year` pair and an arrow, divided by hairlines — has been
 * replaced outright.
 *
 * The old capped 1100px measure is gone with it. That cap existed
 * because a two-field row left the title at x=135 and its metadata at
 * x=1470 with nothing between them to bridge the gap; four fields on
 * fixed columns are their own stepping stones, so the row can use the
 * full page grid the way every other surface does.
 */
export default function IndexList({ works }: IndexListProps) {
  return (
    <div className="flex w-full flex-col pt-16 pb-32">
      {works.map((work, i) => (
        // One row at a time. Every field in a row shares one --enter,
        // so the row arrives as a unit — four separate fades per row
        // across five rows is twenty events, which reads as noise
        // rather than as a list arriving.
        //
        // data-enter is on the FIELDS, never on the row. The swatch
        // travels here as its own view-transition layer, and the
        // browser captures that layer's DESTINATION with whatever
        // opacity it inherits. Staged from the row, every swatch was
        // captured inside an ancestor still at zero, so each one faded
        // out across its own flip instead of landing.
        <Link
          key={work.id}
          href={`/works/${work.slug}`}
          data-work-slug={work.slug}
          className="grid12 group items-baseline py-[var(--space-2)]"
        >
          {/* Swatch and title as one unit, on the hero's own gap. */}
          <span className="col-span-4 col-start-1 flex min-w-0 items-baseline gap-[var(--space-2)]">
            {/* Two names, one element.

                Into a case study it is this work's hero, and carries
                `work-<slug>` exactly as the home plate does. On a home
                <-> /works move it is instead this work's swatch in the
                rail — same column, same 20px, a different pitch either
                side — and carries `swatch-<slug>`, so it travels
                rather than fades.

                An element can hold only one name at a time, so which
                one applies is decided by the pair rule in globals.css,
                which swaps the custom property the name is read
                through. view-transition-name resolves a var() like any
                other property, which is what makes this possible at
                all. */}
            <span
              className="block shrink-0 overflow-hidden bg-ws-fill"
              data-vt-dual=""
              style={
                {
                  width: SWATCH,
                  height: SWATCH,
                  transform: `translateY(${SWATCH_RISE}px)`,
                  "--vt-case": `work-${work.slug}`,
                  "--vt-swatch": `swatch-${work.slug}`,
                  viewTransitionName: "var(--vt-case)",
                } as React.CSSProperties
              }
            >
              {/* Guarded: the placeholder path draws its own "content
                  coming soon" copy, illegible at 20px. */}
              {work.media.src ? <MediaRenderer media={work.media} fit="cover" /> : null}
            </span>
            {/* Does NOT travel. Only the swatches do — a title that
                flipped as well put two labels in motion at once for the
                same project, and the pair read as the layout sliding
                rather than as the catalogue rearranging. It stages in
                with the rest of its row. */}
            <span
              data-enter=""
              style={{ ["--enter" as string]: i } as React.CSSProperties}
              className="truncate text-label text-ws-ink transition-opacity group-hover:opacity-60"
            >
              {work.title.toLowerCase()}
            </span>
          </span>

          <span
            data-enter=""
            style={{ ["--enter" as string]: i } as React.CSSProperties}
            className="col-span-2 col-start-5 truncate text-value text-ws-ink-mute"
          >
            {work.role.toLowerCase()}
          </span>
          <span
            data-enter=""
            style={{ ["--enter" as string]: i } as React.CSSProperties}
            className="col-span-2 col-start-7 truncate text-value text-ws-ink-mute"
          >
            {work.category.toLowerCase()}
          </span>
          <span
            data-enter=""
            style={{ ["--enter" as string]: i } as React.CSSProperties}
            className="col-span-2 col-start-9 truncate text-value text-ws-ink-mute"
          >
            {work.year.toLowerCase()}
          </span>
        </Link>
      ))}
    </div>
  );
}
