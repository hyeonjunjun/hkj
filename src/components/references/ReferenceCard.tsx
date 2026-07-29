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
      className="relative mb-3 w-full overflow-hidden bg-ws-ink/5"
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
              className="absolute inset-0 flex items-center justify-center text-[24px] text-ws-paper"
            >
              ▶
            </span>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center" role="img" aria-label={media.alt}>
          <span className="font-instrument-sans text-[10px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
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
            <p className="font-instrument-sans text-[17px] text-ws-ink">{body}</p>
            {source && (
              <p className="mt-2 font-instrument-sans text-[10px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
                {source}
              </p>
            )}
          </>
        );
      case "link":
        return (
          <>
            {title && <p className="font-instrument-sans text-[16px] font-bold text-ws-ink">{title}</p>}
            {note && <p className="mt-1 font-instrument-sans text-[13px] text-ws-ink/60">{note}</p>}
            {sourceUrl && (
              <p className="mt-2 truncate font-instrument-sans text-[10px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
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
            {note && <p className="font-instrument-sans text-[13px] text-ws-ink/60">{note}</p>}
            {source && (
              <p className="mt-2 font-instrument-sans text-[10px] font-bold uppercase tracking-[0.08em] text-ws-ink/40">
                {source}
              </p>
            )}
          </>
        );
    }
  })();

  return (
    <div className="border border-ws-ink/10 bg-ws-paper p-4 transition-colors duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ws-ink/5">
      {(type === "image" || type === "video") && <ReferenceMedia reference={reference} />}
      {cardBody}
    </div>
  );
}
