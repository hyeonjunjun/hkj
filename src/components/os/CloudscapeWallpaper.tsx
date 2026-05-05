"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * CloudscapeWallpaper — fixed-position image element behind all
 * OS content. Renders the placeholder JPEG until Plan C's real
 * .webm asset lands (then this component gains a <video> branch
 * with the same overlay treatment).
 *
 * Suppressed on /classic routes (mobile fallback shows editorial
 * chrome only — no cloudscape). The pathname guard is in place
 * from the start; its effect is exercised once /classic exists
 * in Chunk 3.
 *
 * Layered behind <Frame> chrome and <Dock> via z-index. Theme-
 * responsive overlay — warm-paper overlay in light, warm-dark
 * overlay in dark. The cloud reads as ambient atmosphere, not
 * foreground.
 *
 * prefers-reduced-data: rendered identically (single static JPEG
 * is already minimal data — no .webm to skip yet).
 *
 * Client component because pathname checking requires runtime
 * access. The Image element itself is statically renderable.
 */
export default function CloudscapeWallpaper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/classic")) return null;

  return (
    <div className="cloudscape" aria-hidden>
      <Image
        src="/assets/cloudscape-placeholder.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="cloudscape__media"
        style={{ objectFit: "cover" }}
      />
      <div className="cloudscape__overlay" />

      <style>{`
        .cloudscape {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .cloudscape__media {
          filter: saturate(0.85) contrast(0.95);
        }
        .cloudscape__overlay {
          position: absolute;
          inset: 0;
          background: var(--paper);
          opacity: 0.35;
          transition: background-color 200ms var(--ease),
                      opacity 200ms var(--ease);
        }
        html[data-theme="dark"] .cloudscape__overlay {
          opacity: 0.55;
        }
        @media (prefers-reduced-motion: reduce) {
          .cloudscape__overlay { transition: none; }
        }
      `}</style>
    </div>
  );
}
