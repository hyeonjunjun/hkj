import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

interface TimelineStopProps {
  work: Work;
  isActive: boolean;
}

const MEDIA_HEIGHT = "h-[10vh]";

/**
 * One stop in the homepage timeline. Unlike WorkTile (which forces a
 * uniform width per desktopSize for the poster composition), each stop
 * here renders at its own natural aspect ratio and a shared height —
 * width varies per item, matching the reference's filmstrip rhythm.
 *
 * The media wrapper below is a single-item row flex container with a
 * fixed height (not a plain block box) — that's what makes `fit="height"`
 * on MediaRenderer actually derive a varying width from `aspect-ratio`;
 * see the Task 3 context note in the plan for why a plain block wrapper
 * doesn't work here. Captions sit below at their natural height, not
 * inside the fixed-height box, so caption line-wrapping never affects
 * the media row's height.
 *
 * `status` (e.g. "LIVE") appears here for the first time in the UI —
 * WorkTile doesn't render it.
 */
export default function TimelineStop({ work, isActive }: TimelineStopProps) {
  const { slug, romanNumeral, category, status, caption, media } = work;
  const captionId = `${work.id}-timeline-caption`;

  return (
    <article aria-labelledby={captionId} className="shrink-0">
      <Link
        href={`/works/${slug}`}
        className={`group block transition-[opacity,filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isActive ? "opacity-100 brightness-100" : "opacity-70 brightness-95"
        }`}
      >
        <div className={`flex ${MEDIA_HEIGHT}`}>
          <MediaRenderer media={media} fit="height" />
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
          • {romanNumeral} / {category} · {status}
        </p>
        <p
          id={captionId}
          className="mt-1 max-w-[200px] font-serif text-[15px] italic leading-snug text-ink"
        >
          {caption}
        </p>
      </Link>
    </article>
  );
}
