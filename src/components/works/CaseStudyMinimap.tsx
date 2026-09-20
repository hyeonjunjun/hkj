"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaAsset } from "@/lib/types";

/**
 * Scroll overview rail for case-study pages — the page rendered small
 * down the right edge, doubling as a position indicator.
 *
 * Proportions are taken from cathydolle.com/case-study/*, measured off
 * its rendered DOM at 1495x990 rather than eyeballed:
 *
 *   rail       position: fixed, right: 0, top: 50%, translateY(-50%)
 *              width = ONE grid column, margin = one gutter
 *              flex column, row-gap = one gutter
 *   inner      width/height 100%, transform: scale(0.6), origin centre
 *   thumbs     aspect-video, object-cover
 *   indicator  absolute, width 100%, aspect-ratio 16/19, 1px border
 *
 * The rail is one grid column wide because it belongs to the same grid
 * as the page — it is not an independently-tuned width. The 0.6 scale is
 * applied to content laid out at *full* column width, which is what
 * makes it read as the page shrunk rather than as a thumbnail strip.
 *
 * Desktop only: hidden below md, matching the reference's max-md:hidden.
 */
export default function CaseStudyMinimap({
  items,
}: {
  items: { media: MediaAsset; label: string }[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [trackH, setTrackH] = useState(0);

  useEffect(() => {
    // Progress is the scrolled fraction of the document, which is what
    // the indicator's travel is mapped onto below.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The indicator's travel is the track's height minus its own, so it has
  // to be measured rather than read off the ref during render (which would
  // capture a stale value and never re-run). ResizeObserver keeps it right
  // as lazy-loaded thumbnails settle and change the track's height.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => setTrackH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  if (items.length === 0) return null;

  const jumpTo = (i: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = items.length > 1 ? (i / (items.length - 1)) * max : 0;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Page overview"
      className="fixed right-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center justify-center md:flex"
      style={{
        width: "var(--col)",
        marginInline: "var(--gutter)",
        rowGap: "var(--gutter)",
      }}
    >
      <div
        ref={trackRef}
        className="relative flex h-full w-full flex-col"
        style={{ transform: "scale(0.6)", rowGap: "var(--gutter)" }}
      >
        {/* Viewport indicator. Travels over the track's own height minus
            its own, so it lands flush at both ends instead of overhanging. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 z-10 w-full border border-ws-ink"
          style={{
            aspectRatio: "16 / 19",
            top: 0,
            transform: `translateY(calc((${trackH}px - 100%) * ${progress}))`,
            transition: "transform 120ms linear",
          }}
        />
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => jumpTo(i)}
            aria-label={`Jump to ${item.label}`}
            className="block w-full cursor-pointer transition-opacity hover:opacity-50"
          >
            {item.media.type === "video" ? (
              <video
                className="aspect-video w-full object-cover"
                muted
                playsInline
                loop
                preload="metadata"
                poster={item.media.fallbackSrc}
                aria-hidden="true"
              >
                {item.media.src && <source src={item.media.src} />}
              </video>
            ) : item.media.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.media.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="aspect-video w-full object-cover"
              />
            ) : (
              <span className="block aspect-video w-full bg-ws-fill" />
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
