"use client";

import { usePathname } from "next/navigation";
import { PIECES } from "@/constants/pieces";

/**
 * Folio — fixed bottom-right page stamp, 9px Geist Mono, --ink-4.
 *
 * Editorial signature borrowed from Wang Zhi-Hong / Daikoku monograph
 * folios: the page identifies itself in the corner without competing
 * with the work. Top-right is owned by the Frame nav; bottom-right is
 * the natural folio gutter.
 *
 *   /                  (suppressed — home carries its own identity)
 *   /work              WORK / INDEX / {N}
 *   /work/[slug]       §{number} / {title}
 *   /studio            STUDIO / NEW YORK
 *   /contact           CONTACT
 *
 * Slash-as-separator (borrowed from cathydolle.com's "01/ARD" pattern)
 * reads as a quieter, more editorial join than the dot used elsewhere.
 * No JS work past the pathname read. Hidden when there is no resolvable
 * label rather than rendering an empty stamp.
 */
function resolveLabel(pathname: string | null): string | null {
  if (!pathname) return null;
  // Homepage carries its identity through the masthead and the hero
  // caption; a corner stamp would duplicate signal. Folio kicks in on
  // every other route.
  if (pathname === "/") return null;
  if (pathname === "/studio") return "STUDIO / NEW YORK";
  if (pathname === "/contact") return "CONTACT";
  if (pathname === "/work") {
    const n = PIECES.length;
    return `WORK / INDEX / ${String(n).padStart(2, "0")}`;
  }
  if (pathname.startsWith("/work/")) {
    const slug = pathname.slice("/work/".length);
    const piece = PIECES.find((p) => p.slug === slug && !p.placeholder);
    if (!piece) return null;
    return `§${piece.number} / ${piece.title.toUpperCase()}`;
  }
  return null;
}

export default function Folio() {
  const pathname = usePathname();
  const label = resolveLabel(pathname);
  if (!label) return null;

  return (
    <span className="folio tabular" aria-hidden>
      {label}

      <style>{`
        .folio {
          position: fixed;
          right: var(--margin-page);
          bottom: clamp(14px, 2vh, 22px);
          z-index: 40;
          font-family: var(--font-stack-mono);
          font-size: var(--type-folio);
          line-height: 1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-4);
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .folio { display: none; }
        }
      `}</style>
    </span>
  );
}
