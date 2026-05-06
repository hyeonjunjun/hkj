"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Frame — always-sticky horizontal top nav.
 *
 *   ┌─ hyeonjoon jun ───────── 1 Work  2 Studio  3 Contact ─┐
 *   ├──────────────────────────────────────────────────────────┤
 *
 * Numbered prefix borrowed from hs68.la's [1 COLLECTION] cadence.
 * Three clusters fit Aino's masthead density at our scale (an agency
 * with ten staff and five service lanes can afford five clusters; a
 * single design engineer cannot). Single Geist Sans family throughout.
 */

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/work",    label: "Work" },
  { href: "/studio",  label: "Studio" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Frame() {
  const pathname = usePathname();

  return (
    <header className="frame" aria-label="Site masthead">
      <Link href="/" className="frame__mark" aria-label="hyeonjoon jun — home">
        hyeonjoon jun
      </Link>

      <nav aria-label="Primary" className="frame__nav">
        {NAV.map((item, idx) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="frame__link"
              data-active={active ? "" : undefined}
              aria-current={active ? "page" : undefined}
            >
              <span className="frame__link-num tabular" aria-hidden>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="frame__link-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        .frame {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          height: 48px;
          padding: 0 var(--margin-page);
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: clamp(16px, 3vw, 40px);
          background: rgba(251, 250, 246, 0.92);
          backdrop-filter: saturate(150%) blur(8px);
          -webkit-backdrop-filter: saturate(150%) blur(8px);
          pointer-events: auto;
        }

        .frame__mark {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          justify-self: start;
          transition: opacity 180ms var(--ease);
        }
        .frame__mark:hover { opacity: 0.65; }

        .frame__nav {
          display: flex;
          align-items: baseline;
          gap: clamp(20px, 2.6vw, 36px);
          justify-self: end;
        }
        .frame__link {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          transition: color 180ms var(--ease);
        }
        .frame__link:hover { color: var(--ink); }
        .frame__link[data-active] { color: var(--ink); }
        .frame__link-num {
          color: var(--ink-4);
          letter-spacing: 0.04em;
        }
        .frame__link[data-active] .frame__link-num { color: var(--ink-3); }

        @media (prefers-reduced-motion: reduce) {
          .frame__mark, .frame__link { transition: none; }
        }

        @media (max-width: 640px) {
          .frame { padding: 0 20px; }
          .frame__nav { gap: 14px; }
          .frame__link { gap: 4px; }
          .frame__link-num { display: none; }
        }
      `}</style>
    </header>
  );
}
