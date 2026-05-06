"use client";

import { usePathname } from "next/navigation";

/**
 * Dock — left-vertical fixed-position app launcher. Four app
 * glyphs (◇ Finder · ✎ Notes · ◑ Shelf · ⊕ About) stacked
 * vertically. Click handlers are no-op in Plan A — the dock
 * renders as visual furniture, signaling "an OS is here," but
 * window machinery doesn't ship until Plan B.
 *
 * Hidden on /classic and on small viewports (mobile gets the
 * editorial fallback, no dock).
 *
 * Glyph + label microtype rendered vertically. Each item is a
 * <button> (semantic — opening an app is a state change, not
 * navigation). aria-disabled until Plan B wires real handlers.
 */

type DockApp = {
  id: string;
  glyph: string;
  label: string;
};

const APPS: DockApp[] = [
  { id: "finder", glyph: "◇", label: "Finder" },
  { id: "notes",  glyph: "✎", label: "Notes" },
  { id: "shelf",  glyph: "◑", label: "Shelf" },
  { id: "about",  glyph: "⊕", label: "About" },
];

export default function Dock() {
  const pathname = usePathname();
  if (pathname?.startsWith("/classic")) return null;

  return (
    <nav aria-label="Apps" className="dock">
      {APPS.map((app) => (
        <button
          key={app.id}
          type="button"
          className="dock__item"
          aria-disabled="true"
          aria-label={`Open ${app.label} (not yet available)`}
          title={`${app.label} — coming soon`}
        >
          <span className="dock__glyph" aria-hidden>{app.glyph}</span>
          <span className="dock__label">{app.label}</span>
        </button>
      ))}

      <style>{`
        .dock {
          position: fixed;
          left: clamp(20px, 4vw, 56px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          display: grid;
          gap: clamp(20px, 2.4vh, 32px);
        }
        .dock__item {
          background: transparent;
          border: 0;
          padding: 4px 0;
          margin: 0;
          cursor: pointer;
          color: inherit;
          display: grid;
          gap: 7px;
          justify-items: center;
          line-height: 1;
        }
        .dock__item[aria-disabled="true"] {
          cursor: default;
          opacity: 0.7;
        }
        .dock__glyph {
          font-family: var(--font-stack-sans);
          font-size: 18px;
          font-weight: 400;
          color: var(--ink);
          text-shadow: 0 0 8px rgba(248, 245, 236, 0.55);
          transition: color 200ms var(--ease), transform 200ms var(--ease);
        }
        html[data-theme="dark"] .dock__glyph {
          text-shadow: 0 0 8px rgba(14, 13, 9, 0.55);
        }
        .dock__label {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-2);
          text-shadow: 0 0 6px rgba(248, 245, 236, 0.55);
          transition: color 200ms var(--ease);
        }
        html[data-theme="dark"] .dock__label {
          text-shadow: 0 0 6px rgba(14, 13, 9, 0.55);
        }
        .dock__item:not([aria-disabled="true"]):hover .dock__glyph {
          color: var(--ink-2);
          transform: scale(1.1);
        }
        .dock__item:not([aria-disabled="true"]):hover .dock__label {
          color: var(--ink-2);
        }
        .dock__item:focus-visible {
          outline: 1px solid var(--ink);
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .dock__glyph, .dock__label { transition: none; }
          .dock__item:hover .dock__glyph { transform: none; }
        }

        @media (max-width: 720px) {
          .dock { display: none; }
        }
      `}</style>
    </nav>
  );
}
