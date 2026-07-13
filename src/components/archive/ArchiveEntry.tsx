import Image from "next/image";
import type { ArchiveEntry as ArchiveEntryData } from "@/data/archive";

const ASPECT_RATIO_CSS: Record<string, string> = {
  portrait: "3 / 4",
  square: "1 / 1",
  landscape: "4 / 3",
  wide: "16 / 9",
};

/** Formats an ISO date ("2026-07-09") as "09.07.26" (day.month.year). */
function formatEntryDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year.slice(2)}`;
}

interface ArchiveEntryProps {
  entry: ArchiveEntryData;
}

export default function ArchiveEntry({ entry }: ArchiveEntryProps) {
  const { date, type, title, body, media, tags, slug } = entry;

  const content = (
    <div className="flex gap-6">
      <p className="w-[96px] shrink-0 font-mono text-[12px] uppercase tracking-[0.08em] text-mist">
        {formatEntryDate(date)}
      </p>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
          · {type}
        </p>
        {title && <p className="font-courier text-[18px] font-bold text-ink">{title}</p>}
        {body && (
          <p className="max-w-[560px] font-courier text-[15px] leading-[1.6] text-ink-soft">
            {body}
          </p>
        )}
        {media && (
          <div
            className="relative w-full max-w-[560px] overflow-hidden bg-paper-shade"
            style={{ aspectRatio: ASPECT_RATIO_CSS[media.aspectRatio] }}
          >
            {media.type === "image" && media.src ? (
              <Image
                src={media.src}
                alt={media.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                loading="lazy"
                className="object-cover"
              />
            ) : media.type === "video" ? (
              <video
                className="h-full w-full object-cover"
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
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                role="img"
                aria-label={media.alt}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
                  Placeholder
                </span>
              </div>
            )}
          </div>
        )}
        {tags && tags.length > 0 && (
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-mist">
            {tags.map((tag) => `#${tag}`).join(", ")}
          </p>
        )}
      </div>
    </div>
  );

  if (slug) {
    return (
      <article>
        <a href={`/archive/${slug}`} className="block">
          {content}
        </a>
      </article>
    );
  }

  return <article>{content}</article>;
}
