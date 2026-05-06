"use client";

import { usePathname } from "next/navigation";

/**
 * FolioStamp — fixed top-right corner microtype per spec §08.
 *
 *   HKJ · §00 · 2026
 *
 * Geist Mono 9px / --ink-4. Context-aware per page — the §-number
 * shifts to identify the route family. Hidden below 960px.
 */
export default function FolioStamp() {
  const pathname = usePathname();
  const folio = folioFor(pathname);
  const year = new Date().getFullYear();
  return (
    <div className="folio" aria-hidden>
      <span>HKJ</span>
      <span className="folio__sep">·</span>
      <span>{folio}</span>
      <span className="folio__sep">·</span>
      <span className="tabular">{year}</span>

      <style>{`
        .folio {
          position: fixed;
          top: 14px;
          right: var(--margin-page);
          z-index: 49;
          display: inline-flex;
          gap: 6px;
          font-family: var(--font-stack-mono);
          font-size: var(--type-folio);
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-4);
          font-variant-numeric: tabular-nums;
          pointer-events: none;
          mix-blend-mode: multiply;
        }
        html[data-theme="dark"] .folio { mix-blend-mode: screen; }
        .folio__sep { color: var(--ink-4); opacity: 0.55; }
        @media (max-width: 960px) {
          .folio { display: none; }
        }
      `}</style>
    </div>
  );
}

function folioFor(pathname: string | null): string {
  if (!pathname) return "§00";
  if (pathname === "/") return "§00";
  if (pathname.startsWith("/work")) return "§01";
  if (pathname.startsWith("/studio")) return "§02";
  if (pathname.startsWith("/bookmarks")) return "§03";
  if (pathname.startsWith("/notes")) return "§04";
  if (pathname.startsWith("/classic")) return "§99";
  return "§00";
}
