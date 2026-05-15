"use client";

import { usePathname } from "next/navigation";
import { PIECES } from "@/constants/pieces";
import { NOTES } from "@/constants/notes";

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
 *   /about             ABOUT / NEW YORK
 *   /notes             NOTES / {N}
 *   /contact           CONTACT
 *
 * Slash-as-separator (borrowed from cathydolle.com's "01/ARD" pattern)
 * reads as a quieter, more editorial join than the dot used elsewhere.
 * No JS work past the pathname read. Hidden when there is no resolvable
 * label rather than rendering an empty stamp.
 */
function resolveLabel(pathname: string | null): string | null {
  if (!pathname) return null;
  // Folio is only shown on legacy routes (the corner has its own
  // page-stamp affordances via CornerNav + the t-footnote colophon).
  // Suppressed on /legacy itself — the home carries its identity
  // through the masthead.
  if (!pathname.startsWith("/legacy")) return null;
  if (pathname === "/legacy") return null;
  if (pathname === "/legacy/about") return "ABOUT / NEW YORK";
  if (pathname === "/legacy/notes") {
    const n = NOTES.length;
    return `NOTES / ${String(n).padStart(2, "0")}`;
  }
  if (pathname === "/legacy/contact") return "CONTACT";
  if (pathname === "/legacy/work") {
    const n = PIECES.length;
    return `WORK / INDEX / ${String(n).padStart(2, "0")}`;
  }
  if (pathname.startsWith("/legacy/work/")) {
    const slug = pathname.slice("/legacy/work/".length);
    const piece = PIECES.find((p) => p.slug === slug && !p.placeholder);
    if (!piece) return null;
    return `[${piece.number}] / ${piece.title.toUpperCase()}`;
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
