import type { Work } from "@/data/works";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "../MotionReveal";
import WorkTile, { MediaRenderer } from "./WorkTile";

/**
 * WorkGrid handles the poster composition on desktop (>=1024px)
 * and stacked vertical layout on mobile (<768px).
 *
 * GROWTH STRATEGY:
 * - Works 1-3 render in the poster composition zones (left/center/right).
 * - Works 4+ overflow to a horizontal scroll strip below the poster.
 *   The strip uses compact 200px tiles with mono labels "MORE / IV-N".
 * - When the count exceeds ~8, migrate the overflow to a dedicated
 *   /works archive view instead of an ever-growing horizontal strip.
 *
 * Column X-anchors on desktop (percentage from viewport left):
 * - left: 15%, center: 48%, right: 69%
 *
 * Each tile also gets a defensive `max-width` (capped to the gap between
 * its own anchor and the *next* column's, or the viewport edge for the
 * rightmost column) and a defensive `max-height` (top and bottom
 * reserves, below) — a fixed pixel tile size plus a percentage anchor
 * can otherwise overflow the viewport or collide with RoomHeader above
 * it, ThesisStatement (bottom-right), or CornerMark (bottom-left) below
 * it, at some viewport size. `overflow: hidden` means a data change that
 * busts this budget clips the tile's edge instead of visually
 * overlapping the surrounding chrome.
 *
 * Requires WIDTH_CLASSES in WorkTile.tsx to include `max-w-full` so the
 * fixed media width can actually yield to the max-width cap, and requires
 * the interactive Link in WorkTile to be `block` rather than
 * `inline-block` — percentages need a definite ancestor width to resolve
 * against, and a shrink-to-fit ancestor never provides one.
 *
 * Y-anchor from Work.layout.desktopVerticalAnchor (0-100 percent).
 */

const COLUMN_ORDER: Array<Work["layout"]["desktopColumn"]> = ["left", "center", "right"];

const X_ANCHOR: Record<Work["layout"]["desktopColumn"], number> = {
  left: 15,
  center: 48,
  right: 69,
};

/** Clears RoomHeader (wordmark/nav row + label/clock row + rule; measured ~179px), which spans full width above every column. */
const TOP_RESERVE_PX = 220;
/** Clears ThesisStatement (bottom-right) and CornerMark (bottom-left), whichever a column's tile might reach. */
const BOTTOM_RESERVE_PX = 300;

function getTileWrapperStyle(work: Work): React.CSSProperties {
  const { desktopColumn, desktopVerticalAnchor } = work.layout;
  const anchor = X_ANCHOR[desktopColumn];
  const nextIndex = COLUMN_ORDER.indexOf(desktopColumn) + 1;
  const nextAnchor = nextIndex < COLUMN_ORDER.length ? X_ANCHOR[COLUMN_ORDER[nextIndex]] : 100;
  const topExpr = `max(${desktopVerticalAnchor}%, ${TOP_RESERVE_PX}px)`;

  return {
    left: `${anchor}%`,
    top: topExpr,
    maxWidth: `calc(${nextAnchor - anchor}% - 24px)`,
    maxHeight: `calc(100% - ${topExpr} - ${BOTTOM_RESERVE_PX}px)`,
    overflow: "hidden",
  };
}

interface WorkGridProps {
  works: Work[];
}

export default function WorkGrid({ works }: WorkGridProps) {
  const posterWorks = works.slice(0, 3);
  const overflowWorks = works.slice(3);

  return (
    <section aria-label="Selected work">
      {/* Poster composition — tablet (scaled) and desktop, hidden below 768px.
          `absolute top-0 inset-x-0 h-screen` (not `inset-0`, and not a
          normal-flow `h-screen` div) matters for two reasons: starting at
          `top-0` rather than in normal flow means every tile's percentage
          anchor resolves against the full viewport instead of being shifted
          down by RoomHeader's height (TOP_RESERVE_PX above is what actually
          keeps tiles clear of RoomHeader, which sits above this in z-index).
          And a hard `h-screen`, not `inset-0`'s implicit "100% of <main>",
          matters once the overflow strip below pushes <main> taller than one
          viewport (see its own comment) — `inset-0` would then stretch this
          box to <main>'s full (inflated) height, so every percentage anchor
          here would resolve against that instead of one viewport and drift
          downward as more overflow works get added. */}
      <div className="absolute inset-x-0 top-0 hidden md:block md:h-screen">
        {posterWorks.map((work) => (
          <div key={work.id} className="absolute" style={getTileWrapperStyle(work)}>
            <WorkTile work={work} />
          </div>
        ))}
      </div>

      {/* Mobile stack — every Work, regardless of count, vertical, uniform 16:10 media */}
      <div className="flex flex-col gap-12 px-[var(--edge-margin)] pt-8 md:hidden">
        {works.map((work, i) => (
          <MotionReveal
            key={work.id}
            delay={delay.primary + i * delay.stagger}
            duration={duration.reveal}
          >
            <article aria-labelledby={`${work.id}-mobile-caption`}>
              <a href={`/works/${work.slug}`} className="block">
                <MediaRenderer media={work.media} aspectOverride="16 / 10" />
                <p
                  id={`${work.id}-mobile-caption`}
                  className="mt-3 font-instrument-sans text-[16px] italic leading-snug text-ws-ink"
                >
                  {work.caption}
                </p>
                <p className="mt-2 font-instrument-sans text-[11px] font-medium uppercase tracking-[0.15em] text-ws-ink/40">
                  • {work.romanNumeral} / {work.category}
                </p>
              </a>
            </article>
          </MotionReveal>
        ))}
      </div>

      {/* Overflow strip — Works 4+, horizontal scroll below the poster. Hidden
          entirely while empty. `md:pt-[100vh]` (rather than a plain top
          margin) is load-bearing: the poster above is `absolute inset-0`
          against <main>, so it takes up zero space in normal flow. Without
          a full-viewport offset here, this strip — the next thing in flow
          after RoomHeader — renders at the very top of the page, visually
          buried under the poster's tiles instead of appearing below them. */}
      {overflowWorks.length > 0 && (
        // md:pb-40 (rather than a smaller pad) leaves room for CornerMark,
        // which is `absolute bottom-[edge-margin] left-[edge-margin]`
        // against <main> — it anchors to wherever <main>'s content actually
        // ends, so without enough clearance here it lands on top of this
        // strip's own bottom-left tile instead of below it.
        <div className="hidden md:flex md:flex-wrap md:gap-6 md:pt-[100vh] md:pb-40 md:pl-[var(--edge-margin)] md:pr-[var(--edge-margin)]">
          {overflowWorks.map((work) => (
            <a key={work.id} href={`/works/${work.slug}`} className="w-[200px] shrink-0">
              <MediaRenderer media={work.media} />
              <p className="mt-2 font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/40">
                MORE / {work.romanNumeral}-{work.index}
              </p>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
