"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * HomeHero — full-bleed atmospheric video at the top of /.
 *
 * Borrowed shape from hs68.la's homepage gate: a single piece of
 * footage occupies the first viewport, sound off, the masthead and
 * the work below. No overlay headline, no marketing tagline.
 *
 * Behaviour:
 *  - autoplay, muted, loop, playsInline (all required for mobile autoplay)
 *  - IntersectionObserver pauses playback when off-screen
 *  - prefers-reduced-motion: poster-only image, video element never
 *    instantiated; if no poster, the frame's --paper-2 fills the slot
 *  - 72-92svh on desktop, 56-78svh on mobile so the catalog line is
 *    hinted below the fold
 *  - no controls, no unmute affordance — silence is the editorial choice
 *
 * Caption: optional structured meta below the frame, formatted as a
 * museum plaque. Three columns: title (sans, full ink), description
 * (mono microtype, muted), year (mono microtype, muted, flush right).
 * Mirrors CatalogPlate's caption shape so the hero reads as a piece
 * in the catalog rather than an unlabelled mood reel.
 */
type HeroMeta = {
  title: string;
  description?: string;
  year?: number | string;
};

type Props = {
  src: string;
  poster?: string;
  meta?: HeroMeta;
};

export default function HomeHero({ src, poster, meta }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.25) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: [0, 0.25, 1] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className="home-hero" aria-label="Studio reel">
      <div className="home-hero__frame">
        {reduced ? (
          poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              aria-hidden
              className="home-hero__media"
            />
          ) : null
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            className="home-hero__media"
          />
        )}
      </div>

      {meta ? (
        <footer className="home-hero__caption">
          <span className="home-hero__caption-title">{meta.title}</span>
          {meta.description ? (
            <span className="home-hero__caption-desc">{meta.description}</span>
          ) : (
            <span aria-hidden />
          )}
          {meta.year != null ? (
            <span className="home-hero__caption-year tabular">{meta.year}</span>
          ) : null}
        </footer>
      ) : null}

      <style>{`
        .home-hero {
          /* Hero sits on the 12-column grid like everything else.
             HomeView places it at grid-column: 1 / -1 (full width of
             the 12 cols). No viewport math, no 100vw bleed — the
             ratio of hero-to-page-margin is fixed by the column grid
             at every screen size. */
          display: grid;
          gap: 14px;
        }
        .home-hero__frame {
          position: relative;
          width: 100%;
          height: clamp(56svh, 64svh, 72svh);
          background: var(--paper-2);
          overflow: hidden;
        }
        .home-hero__media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Caption — bound to the hero's own edges, NOT the page-margin
           gutter the catalog uses below. The hero is a full-bleed
           module; this caption is its plaque, so it sits inside the
           video's edge by a small flat inset rather than aligning to
           the same margin token as the project plates. That decouples
           "metadata for the video" from "first row of the catalog". */
        .home-hero__caption {
          padding: 0 clamp(16px, 1.6vw, 28px);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: 16px;
          line-height: 1.3;
          margin: 0;
        }
        /* All three caption cells share the same mono register —
           Aino-style "one-sized monospace." Hierarchy is carried by
           color (--ink vs --ink-3) and a one-step size differential
           (10px on the title, 9px on description/year), not by
           swapping font families. */
        .home-hero__caption-title {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .home-hero__caption-desc {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .home-hero__caption-year {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: 0.06em;
          color: var(--ink-3);
          justify-self: end;
          font-variant-numeric: tabular-nums lining-nums;
        }

        @media (max-width: 760px) {
          .home-hero__frame { height: clamp(48svh, 56svh, 64svh); }
          .home-hero__caption {
            grid-template-columns: 1fr auto;
            gap: 6px 12px;
          }
          .home-hero__caption-title { grid-column: 1 / -1; }
          .home-hero__caption-desc { grid-column: 1; }
          .home-hero__caption-year { grid-column: 2; }
        }
      `}</style>
    </section>
  );
}
