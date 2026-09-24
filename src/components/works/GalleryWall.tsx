import Link from "next/link";
import type { Work } from "@/data/works";
import type { MediaAsset } from "@/lib/types";
import { MediaRenderer } from "./WorkTile";
import MotionReveal from "../MotionReveal";
import { duration } from "@/lib/motion";

interface GalleryWallProps {
  works: Work[];
}

interface GalleryTile {
  key: string;
  media: MediaAsset;
  workSlug: string;
}

/** Pools every media asset across every work — the hero plus every section's media — into one flat list, in work order. */
function collectTiles(works: Work[]): GalleryTile[] {
  const tiles: GalleryTile[] = [];
  for (const work of works) {
    tiles.push({ key: `${work.id}-hero`, media: work.media, workSlug: work.slug });
    for (const [i, section] of (work.sections ?? []).entries()) {
      if (section.media) {
        tiles.push({ key: `${work.id}-section-${i}`, media: section.media, workSlug: work.slug });
      }
    }
  }
  return tiles;
}

/**
 * A real, long-scrolling image wall pooling every still across every
 * work — dylan.camera's Gallery, minus his color-wheel visualization
 * (his own professional signature as a colorist, not something to copy
 * verbatim onto a different practice). Unlike Home (locked to one
 * viewport, paged) and unlike Index (a text list), this is the one page
 * meant to scroll long and show sheer volume. No captions on the tiles
 * themselves — each links back to its work's case study for the ones
 * that want detail.
 */
export default function GalleryWall({ works }: GalleryWallProps) {
  const tiles = collectTiles(works);

  return (
    // pb-56 (not a smaller pad) leaves room for CornerMark, which is
    // `absolute bottom-[edge-margin]` against <main> and lands wherever
    // this grid's own bottom edge happens to be.
    <div className="grid grid-cols-2 gap-1 px-[var(--edge-margin)] pb-56 md:grid-cols-3 md:gap-2">
      {tiles.map((tile, i) => (
        // Capped stagger: with a long wall, an uncapped per-tile delay would
        // leave the last rows blank for seconds after everything above settled.
        <MotionReveal key={tile.key} delay={Math.min(i, 11) * 55} duration={duration.reveal}>
        <Link
          href={`/works/${tile.workSlug}`}
          className="group relative block aspect-square overflow-hidden bg-ws-fill transition-opacity duration-micro hover:opacity-85"
        >
          <MediaRenderer media={tile.media} fit="cover" />
        </Link>
        </MotionReveal>
      ))}
    </div>
  );
}
