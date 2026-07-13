import Image from "next/image";
import type { Reference } from "@/data/references";

const ASPECT_RATIO_CSS: Record<string, string> = {
  portrait: "3 / 4",
  square: "1 / 1",
  landscape: "4 / 3",
  wide: "16 / 9",
};

function ReferenceMedia({ reference }: { reference: Reference }) {
  const { media, type } = reference;
  if (!media) return null;

  return (
    <div
      className="relative mb-3 w-full overflow-hidden bg-paper-shade"
      style={{ aspectRatio: ASPECT_RATIO_CSS[media.aspectRatio] }}
    >
      {media.type === "image" && media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="240px"
          loading="lazy"
          className="object-cover"
        />
      ) : media.type === "video" ? (
        <>
          <video
            className="h-full w-full object-cover"
            muted
            playsInline
            loop
            preload="metadata"
            autoPlay
            poster={media.fallbackSrc}
            aria-label={media.alt}
          />
          {type === "video" && (
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center text-[24px] text-paper"
            >
              ▶
            </span>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center" role="img" aria-label={media.alt}>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
            Placeholder
          </span>
        </div>
      )}
    </div>
  );
}

interface ReferenceCardProps {
  reference: Reference;
}

export default function ReferenceCard({ reference }: ReferenceCardProps) {
  const { type, source, sourceUrl, title, body, note } = reference;

  const cardBody = (() => {
    switch (type) {
      case "quote":
        return (
          <>
            <p className="font-serif text-[17px] italic text-ink">{body}</p>
            {source && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
                {source}
              </p>
            )}
          </>
        );
      case "link":
        return (
          <>
            {title && <p className="font-sans text-[16px] font-medium text-ink">{title}</p>}
            {note && <p className="mt-1 font-courier text-[13px] text-ink-soft">{note}</p>}
            {sourceUrl && (
              <p className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
                {sourceUrl}
              </p>
            )}
          </>
        );
      case "video":
      case "image":
      default:
        return (
          <>
            {note && <p className="font-courier text-[13px] text-ink-soft">{note}</p>}
            {source && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
                {source}
              </p>
            )}
          </>
        );
    }
  })();

  return (
    <div className="border border-paper-edge bg-paper p-4 transition-colors duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-paper-hover">
      {(type === "image" || type === "video") && <ReferenceMedia reference={reference} />}
      {cardBody}
    </div>
  );
}
