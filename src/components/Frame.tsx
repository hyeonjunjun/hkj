"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CopyEmailLink from "@/components/CopyEmailLink";

/**
 * Frame — the persistent chrome that surrounds every route.
 *
 *   TL: identity ("Ryan Jun" → /)
 *   TR: nav cluster (work · garden · shelf · about)
 *   BL: empty (intentional ma)
 *   BR: route-aware action slot
 *
 * Nothing in the frame moves on idle, scrolls, or rearranges per
 * route. The document changes inside the frame; the frame stays.
 *
 * BR convention: email on hello-stake routes (/, /about). Other
 * routes leave the slot empty by default — wire route-specific
 * actions (e.g. "next →" on case studies) here as they're added.
 */

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/work",   label: "work" },
  { href: "/garden", label: "garden" },
  { href: "/shelf",  label: "shelf" },
  { href: "/about",  label: "about" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

function BRSlot({ pathname }: { pathname: string | null }) {
  if (!pathname) return null;
  if (pathname === "/" || pathname === "/about") {
    return <CopyEmailLink className="frame__action" />;
  }
  return null;
}

export default function Frame() {
  const pathname = usePathname();

  return (
    <>
      <Link href="/" className="frame__mark" aria-label="Ryan Jun — home">
        Ryan Jun
      </Link>

      <nav aria-label="Primary" className="frame__nav">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="frame__link"
              data-active={active ? "" : undefined}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="frame__br">
        <BRSlot pathname={pathname} />
      </div>

      <style>{`
        /* Frame chrome runs on Geist Mono — Aino-discipline.
           The chrome is registry data (identity, nav, action), not
           reading. Mono carries that role naturally; tracking sits at
           the mono natural rhythm with a tiny positive bump. */
        .frame__mark,
        .frame__nav,
        .frame__br {
          position: fixed;
          z-index: 50;
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0;
          font-variant-numeric: tabular-nums;
          pointer-events: auto;
        }

        .frame__mark {
          top: clamp(20px, 3vh, 36px);
          left: clamp(20px, 4vw, 56px);
          color: var(--ink);
          transition: opacity 180ms var(--ease);
        }
        .frame__mark:hover { opacity: 0.6; }

        .frame__nav {
          top: clamp(20px, 3vh, 36px);
          right: clamp(20px, 4vw, 56px);
          display: flex;
          gap: clamp(14px, 2.4vw, 28px);
        }
        .frame__link {
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .frame__link:hover { color: var(--ink); }
        .frame__link[data-active] { color: var(--ink); }

        .frame__br {
          bottom: clamp(20px, 3vh, 36px);
          right: clamp(20px, 4vw, 56px);
        }
        .frame__action {
          color: var(--ink);
          transition: color 180ms var(--ease);
        }
        .frame__action:hover { color: var(--ink-2); }
        .frame__action[data-copied] { color: var(--ink-3); }

        @media (prefers-reduced-motion: reduce) {
          .frame__mark, .frame__link, .frame__action { transition: none; }
        }

        @media (max-width: 640px) {
          .frame__mark, .frame__nav, .frame__br {
            font-size: 11px;
          }
          .frame__nav { gap: 14px; }
        }
      `}</style>
    </>
  );
}
