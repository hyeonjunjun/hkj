/**
 * NoteMedia — image / video components for embedding inside note
 * bodies. Two named exports:
 *
 *   <NoteImage src="..." alt="..." caption="..." aspect="16/9" />
 *   <NoteVideo src="..." alt="..." caption="..." poster="..." />
 *
 * Both render as a <figure> with a t-caption figcaption when caption
 * is provided. If src is omitted, the component renders a clearly-
 * marked placeholder block at the requested aspect ratio — useful
 * during authoring so the layout reads correctly before assets exist.
 *
 * Treatment: ink-hair hairline frame, generous breathing room, max-
 * width tied to the prose measure so media doesn't blow out the
 * editorial column.
 *
 * Why differentiate from Flora's site: she has no media. Ryan's work
 * is visual — the corner needs to surface that without losing the
 * Flora-level restraint of the surrounding text.
 */

import Image, { type StaticImageData } from "next/image";

interface BaseProps {
  alt: string;
  caption?: string;
  /** CSS aspect-ratio (e.g. "16/9", "3/4"). Defaults to 16/9. */
  aspect?: string;
  /** Optional pull-out: full-bleed of the column, plus a slim breath. */
  fullBleed?: boolean;
}

interface NoteImageProps extends BaseProps {
  src?: string | StaticImageData;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function NoteImage({
  src,
  alt,
  caption,
  aspect = "16/9",
  fullBleed,
  width,
  height,
  priority,
}: NoteImageProps) {
  return (
    <figure className={`note-media ${fullBleed ? "note-media--full" : ""}`}>
      <div className="note-media__frame" style={{ aspectRatio: aspect }}>
        {src ? (
          // Use Next/Image for remote-style optimization when a static
          // import is provided. For string paths, Next handles the
          // optimization pass at build time.
          typeof src === "string" ? (
            <Image
              src={src}
              alt={alt}
              fill={!(width && height)}
              width={width}
              height={height}
              priority={priority}
              sizes="(max-width: 720px) 100vw, 760px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              placeholder="blur"
              sizes="(max-width: 720px) 100vw, 760px"
              style={{ objectFit: "cover" }}
            />
          )
        ) : (
          <div className="note-media__placeholder" aria-label={alt}>
            <span className="t-meta">[ {alt} ]</span>
            <span className="t-footnote dimmer">placeholder · {aspect}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="t-caption note-media__caption">{caption}</figcaption>
      )}
      <NoteMediaStyles />
    </figure>
  );
}

interface NoteVideoProps extends BaseProps {
  src?: string;
  poster?: string;
}

export function NoteVideo({
  src,
  poster,
  alt,
  caption,
  aspect = "16/9",
  fullBleed,
}: NoteVideoProps) {
  return (
    <figure className={`note-media ${fullBleed ? "note-media--full" : ""}`}>
      <div className="note-media__frame" style={{ aspectRatio: aspect }}>
        {src ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            aria-label={alt}
            className="note-media__video"
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="note-media__placeholder" aria-label={alt}>
            <span className="t-meta">[ ▶ {alt} ]</span>
            <span className="t-footnote dimmer">placeholder · {aspect}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="t-caption note-media__caption">{caption}</figcaption>
      )}
      <NoteMediaStyles />
    </figure>
  );
}

/**
 * Styles shared by NoteImage + NoteVideo. Inlined as a component so
 * Next.js can dedupe across multiple renders on a page.
 */
function NoteMediaStyles() {
  return (
    <style>{`
      .note-media {
        margin: clamp(24px, 3.5vh, 44px) 0;
        display: grid;
        row-gap: 10px;
      }
      .note-media--full {
        /* Pull slightly outside the prose measure for a deliberate
           breath. Sub-pixel negative margins keep it visually anchored
           to the column. */
        margin-inline: clamp(-16px, -2vw, -32px);
      }
      .note-media__frame {
        position: relative;
        width: 100%;
        background: var(--paper-2);
        border: 1px solid var(--ink-hair);
        overflow: hidden;
      }
      .note-media__frame > img,
      .note-media__frame > video,
      .note-media__video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .note-media__placeholder {
        position: absolute;
        inset: 0;
        display: grid;
        place-content: center;
        gap: 6px;
        text-align: center;
        /* Diagonal hatch uses ink-ghost so it inverts cleanly when the
           page register changes (light: dark hatch on white; dark:
           light hatch on black). */
        background:
          repeating-linear-gradient(
            -45deg,
            transparent 0,
            transparent 10px,
            var(--ink-ghost) 10px,
            var(--ink-ghost) 11px
          ),
          var(--paper-2);
        color: var(--ink-3);
      }
      .note-media__caption {
        color: var(--ink-3);
        font-family: var(--font-stack-chrome);
        max-width: 60ch;
      }
    `}</style>
  );
}
