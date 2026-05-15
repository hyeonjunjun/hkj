import Image from "next/image";
import type { WorkMedia as WorkMediaType } from "@/constants/work-content";
import { SleepingCat } from "../SleepingCat";

/**
 * WorkMediaFrame — single-media renderer used by the project detail
 * sections. Handles image / video / placeholder uniformly and exposes
 * a `full` flag for full-bleed mode.
 *
 * Captions render below the frame in t-warmth caption register.
 */

interface SingleProps {
  media: WorkMediaType;
  full?: boolean;
  caption?: string;
  priority?: boolean;
}

export function WorkMediaSingle({ media, full, caption, priority }: SingleProps) {
  return (
    <figure className={`work-media${full ? " work-media--full" : ""}`}>
      <div className="work-media__frame" style={{ aspectRatio: media.aspect ?? "16 / 9" }}>
        <MediaInner media={media} priority={priority} />
      </div>
      {caption && <figcaption className="t-warmth work-media__caption">{caption}</figcaption>}
      <Styles />
    </figure>
  );
}

interface PairProps {
  left: WorkMediaType;
  right: WorkMediaType;
  caption?: string;
}

export function WorkMediaPair({ left, right, caption }: PairProps) {
  return (
    <figure className="work-media-pair">
      <div className="work-media-pair__cells">
        <div className="work-media__frame" style={{ aspectRatio: left.aspect ?? "3 / 4" }}>
          <MediaInner media={left} />
        </div>
        <div className="work-media__frame" style={{ aspectRatio: right.aspect ?? "3 / 4" }}>
          <MediaInner media={right} />
        </div>
      </div>
      {caption && <figcaption className="t-warmth work-media__caption">{caption}</figcaption>}
      <Styles />
    </figure>
  );
}

function MediaInner({ media, priority }: { media: WorkMediaType; priority?: boolean }) {
  if (media.kind === "video") {
    return (
      <video
        className="work-media__video"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={media.alt}
      />
    );
  }
  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        sizes="(max-width: 720px) 100vw, 960px"
        className="work-media__image"
        style={{ objectFit: "cover" }}
      />
    );
  }
  return (
    <div className="work-media__placeholder" aria-label={media.alt}>
      <SleepingCat size={72} className="work-media__placeholder-cat" />
      <span className="t-warmth work-media__placeholder-text">project incoming</span>
      <span className="t-warmth work-media__placeholder-alt">{media.alt}</span>
    </div>
  );
}

function Styles() {
  return (
    <style>{`
      .work-media {
        margin: 0;
        display: grid;
        row-gap: 10px;
      }
      .work-media--full {
        /* Pull outside the main content column for hero-scale media.
           The parent .work-detail__main has horizontal padding via
           var(--margin-page); negative margins cancel it. */
        margin-inline: calc(var(--margin-page) * -1);
      }
      .work-media__frame {
        position: relative;
        width: 100%;
        overflow: hidden;
        background: var(--paper-2);
        border: 1px solid var(--ink-ghost);
      }
      .work-media__video,
      .work-media__image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .work-media__placeholder {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        justify-items: center;
        gap: 14px;
        text-align: center;
        padding: 24px;
        background: var(--paper-2);
      }
      .work-media__placeholder-cat {
        color: var(--ink-3);
      }
      .work-media__placeholder-text {
        color: var(--ink-2);
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .work-media__placeholder-alt {
        color: var(--ink-4);
        font-size: 11px;
        font-weight: 400;
        letter-spacing: 0.04em;
        max-width: 36ch;
        margin: 0 auto;
      }
      .work-media__caption {
        color: var(--ink-3);
        font-size: 11.5px;
        font-weight: 400;
        letter-spacing: -0.005em;
        line-height: 1.4;
        max-width: 60ch;
        padding-top: 4px;
      }

      .work-media-pair {
        margin: 0;
        display: grid;
        row-gap: 10px;
      }
      .work-media-pair__cells {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(12px, 1.6vw, 24px);
      }
      @media (max-width: 720px) {
        .work-media-pair__cells {
          grid-template-columns: 1fr;
          gap: 14px;
        }
      }
    `}</style>
  );
}
