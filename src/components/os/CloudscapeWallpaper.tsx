"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

/**
 * CloudscapeWallpaper — fixed-position photographic ground beneath
 * all OS content. Real cumulus + distant mountain photography sets
 * the mood; chrome and windows layer typographic notation over it.
 *
 * Suppressed on /classic routes (the editorial fallback uses paper
 * tone only). Layered at z-index 0 with a warm-paper overlay that
 * unifies the photograph with the ink palette in both themes.
 *
 * Plan C will swap the JPEG for long-exposure .webm footage and
 * add a <video> branch here.
 *
 * Client component — pathname check requires runtime context.
 */
export default function CloudscapeWallpaper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/classic")) return null;

  return (
    <div className="cloudscape" aria-hidden>
      <Image
        src="/assets/cloudscape-hero.jpg"
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
        .cloudscape__overlay {
          position: absolute;
          inset: 0;
          background: var(--paper);
          opacity: 0.32;
          transition: background-color 200ms var(--ease),
                      opacity 200ms var(--ease);
        }
        html[data-theme="dark"] .cloudscape__overlay {
          opacity: 0.62;
        }
        @media (prefers-reduced-motion: reduce) {
          .cloudscape__overlay { transition: none; }
        }
      `}</style>
    </div>
  );
}
