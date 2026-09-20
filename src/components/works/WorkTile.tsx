import Image from "next/image";
import type { MediaAsset } from "@/lib/types";

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
 * height from `aspect-ratio`. "height" sizes to 100% of the parent's height
 * and derives width from `aspect-ratio` instead — this only produces a
 * varying width if the parent itself is a single-item flex container with a
 * fixed height (shrink-to-fit sizing), not a plain block box. "cover" fills
 * 100% of both dimensions and crops via `object-fit: cover` (already part of
 * `mediaClassesBase`) — for a parent that already establishes its own fixed
 * aspect ratio (e.g. an `aspect-[3/4]` box) and just wants the image to fill
 * and crop rather than derive a size from `aspect-ratio` itself.
 */
export function MediaRenderer({
  media,
  aspectOverride,
  fit = "width",
}: {
  media: MediaAsset;
  aspectOverride?: string;
  fit?: "width" | "height" | "cover";
}) {
  const style = fit === "cover" ? undefined : { aspectRatio: aspectOverride ?? ASPECT_RATIO_CSS[media.aspectRatio] };
  const sizeClasses = fit === "cover" ? "h-full w-full" : fit === "height" ? "h-full w-auto" : "h-auto w-full";

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
      className={`flex items-center justify-center border border-ws-ink-mute transition-[filter] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:brightness-[1.04] ${sizeClasses}`}
      style={style}
      role="img"
      aria-label={media.alt}
    >
      <span className="max-w-full truncate px-1 text-value uppercase text-ws-ink-mute">
        Content coming soon
      </span>
    </div>
  );
}
