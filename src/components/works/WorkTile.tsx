import Image from "next/image";
import Link from "next/link";
import type { MediaAsset } from "@/lib/types";
import type { Work } from "@/data/works";
import { delay, duration } from "@/lib/motion";
import MotionReveal from "../MotionReveal";

/**
 * Desktop media width per `desktopSize`, and its 70%-scaled tablet
 * counterpart. `max-w-full` lets the tile shrink below its nominal width
 * when WorkGrid's defensive per-column `maxWidth` (see its top-of-file
 * comment) is narrower than this at a given viewport.
 */
const WIDTH_CLASSES: Record<Work["layout"]["desktopSize"], string> = {
  sm: "w-[126px] max-w-full lg:w-[180px]",
  md: "w-[182px] max-w-full lg:w-[260px]",
  lg: "w-[224px] max-w-full lg:w-[320px]",
};

const ASPECT_RATIO_CSS: Record<MediaAsset["aspectRatio"], string> = {
  portrait: "3 / 4",
  square: "1 / 1",
  landscape: "4 / 3",
  wide: "16 / 9",
};

const mediaClassesBase =
  "block object-cover transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.04]";

/**
 * Exported so mobile/preview surfaces can reuse it with a forced aspect ratio.
 *
 * `fit` controls which dimension is authoritative: "width" (default, used by
 * every existing caller) sizes to 100% of the parent's width and derives
 * height from `aspect-ratio`. "height" (used by the homepage timeline) sizes
 * to 100% of the parent's height and derives width from `aspect-ratio`
 * instead — this only produces a varying width if the parent itself is a
 * single-item flex container with a fixed height (shrink-to-fit sizing),
 * not a plain block box.
 */
export function MediaRenderer({
  media,
  aspectOverride,
  fit = "width",
}: {
  media: MediaAsset;
  aspectOverride?: string;
  fit?: "width" | "height";
}) {
  const style = { aspectRatio: aspectOverride ?? ASPECT_RATIO_CSS[media.aspectRatio] };
  const sizeClasses = fit === "height" ? "h-full w-auto" : "h-auto w-full";

  if (media.type === "video") {
    return (
      <video
        className={`${mediaClassesBase} ${sizeClasses}`}
        style={style}
        muted
        playsInline
        loop
        preload="metadata"
        autoPlay
        poster={media.fallbackSrc}
        aria-label={media.alt}
      >
        {media.src && <source src={media.src} />}
      </video>
    );
  }

  if (media.type === "image" && media.src) {
    return (
      <div className={`relative overflow-hidden ${sizeClasses}`} style={style}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 1024px) 45vw, 320px"
          loading="lazy"
          className={mediaClassesBase}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-paper-shade transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.04] ${sizeClasses}`}
      style={style}
      role="img"
      aria-label={media.alt}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
        Placeholder
      </span>
    </div>
  );
}

interface WorkTileProps {
  work: Work;
}

export default function WorkTile({ work }: WorkTileProps) {
  const { slug, romanNumeral, caption, category, media, layout, index } = work;
  const captionId = `${work.id}-caption`;

  const label = (
    <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
      • {romanNumeral} / {category}
    </p>
  );

  const captionEl = (
    <p
      id={captionId}
      className="mt-1 max-w-[200px] font-serif text-[17px] italic leading-snug text-ink transition-transform duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px]"
    >
      {caption}
    </p>
  );

  const captionBlock = (
    <div>
      {label}
      {captionEl}
    </div>
  );

  const mediaEl = (
    <div className={WIDTH_CLASSES[layout.desktopSize]}>
      <MediaRenderer media={media} />
    </div>
  );

  let inner: React.ReactNode;
  if (layout.captionPosition === "right") {
    inner = (
      <div className="flex flex-row items-start gap-4">
        {mediaEl}
        {captionBlock}
      </div>
    );
  } else if (layout.captionPosition === "below") {
    inner = (
      <div className="flex flex-col items-start gap-3">
        {mediaEl}
        {captionBlock}
      </div>
    );
  } else {
    const align =
      layout.captionPosition === "above-center"
        ? "items-center text-center"
        : layout.captionPosition === "above-right"
          ? "items-end text-right"
          : "items-start text-left";
    inner = (
      <div className={`flex flex-col gap-3 ${align}`}>
        {captionBlock}
        {mediaEl}
      </div>
    );
  }

  return (
    <MotionReveal
      delay={delay.primary + (index - 1) * delay.stagger}
      duration={duration.reveal}
    >
      <article aria-labelledby={captionId}>
        {/* Deliberately `block`, not `inline-block`: an inline-block wrapper
            shrink-to-fits its children, which breaks percentage-based
            max-width (like WIDTH_CLASSES' `max-w-full`) from ever resolving
            against WorkGrid's definite per-column cap — percentages need a
            definite ancestor width, and shrink-to-fit boxes never provide
            one. The tile's own footprint is still governed by
            mediaEl/captionBlock's own widths, so this doesn't change how
            big the tile looks when unconstrained. */}
        <Link href={`/works/${slug}`} className="group block rounded-sm">
          {inner}
        </Link>
      </article>
    </MotionReveal>
  );
}
