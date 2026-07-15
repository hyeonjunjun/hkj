import Link from "next/link";
import type { Work } from "@/data/works";
import { MediaRenderer } from "@/components/works/WorkTile";

interface TimelineStopProps {
  work: Work;
  isActive: boolean;
}

/**
 * One stop in the homepage timeline. Unlike WorkTile (which forces a
 * uniform width per desktopSize for the poster composition), each stop
 * here renders at its own natural aspect ratio and a shared height —
 * width varies per item, matching the reference's filmstrip rhythm.
 *
 * The index number and title/category label are always visible at rest
 * (not hidden behind a hover reveal) -- a flat, unlabeled media block
 * reads as broken/empty rather than intentionally minimal, per both
 * reference sites (tlb.betteroff.studio, letsplayfight.com), which keep
 * their sparse typographic labels fully legible at rest. Hover adds a
 * subtle accent-color shift and a slight upward settle, rather than
 * conjuring the label out of nothing.
 */
export default function TimelineStop({ work, isActive }: TimelineStopProps) {
  const { slug, title, category, media, index } = work;
  const captionId = `${work.id}-timeline-caption`;

  const isPortrait = media.aspectRatio === "portrait";
  const aspectRatio = isPortrait ? "aspect-[3/4]" : media.aspectRatio === "landscape" ? "aspect-[4/3]" : "aspect-square";
  const widthClass = isPortrait ? "w-[30vw] min-w-[300px] max-w-[450px]" : "w-[40vw] min-w-[400px] max-w-[600px]";

  return (
    <article aria-labelledby={captionId} className="shrink-0 relative group">
      <Link
        href={`/works/${slug}`}
        className={`block relative transition-[opacity,filter,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isActive ? "opacity-100 scale-100" : "opacity-60 scale-[0.98] blur-[2px]"
        }`}
      >
        <div className="mb-3 font-display text-xs text-ws-ink/60 uppercase tracking-widest transition-colors duration-300 group-hover:text-ws-accent">
          {index}
        </div>
        <div className={`relative ${widthClass} ${aspectRatio} overflow-hidden border border-ws-ink/10 bg-ws-ink/5`}>
          <MediaRenderer media={media} fit="cover" />
          <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-transparent"></div>
        </div>
        <div
          id={captionId}
          className="mt-3 flex items-baseline justify-between gap-3 font-display text-sm text-ws-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[2px]"
        >
          <span className="font-medium">{title}</span>
          <span className="shrink-0 font-display text-xs uppercase tracking-widest text-ws-ink/50">{category}</span>
        </div>
      </Link>
    </article>
  );
}
