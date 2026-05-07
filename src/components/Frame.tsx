"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Frame — sticky horizontal top nav.
 *
 *   ┌─ stray ─────────────────────────── Work  Studio  Contact ─┐
 *   ├────────────────────────────────────────────────────────────┤
 *
 * Plain text labels in Aino's masthead register — no numbered prefix,
 * no separators. Hides on scroll-down past 80px, reveals on scroll-up.
 * Mark and links share Geist Mono uppercase at 0.06em tracking.
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
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    // Reveal on scroll-up, hide on scroll-down past a threshold. The
    // 8px tolerance keeps small jitters (trackpad inertia, anchor
    // scroll-into-view) from toggling the bar; the 80px y-threshold
    // keeps the masthead present at the top of the page.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;
        if (Math.abs(dy) > 8) {
          if (y > 80 && dy > 0) setHidden(true);
          else if (dy < 0) setHidden(false);
          lastY.current = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="frame"
      data-hidden={hidden ? "" : undefined}
      aria-label="Site masthead"
    >
      <Link href="/" className="frame__mark" aria-label="stray — home">
        stray
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
          transform: translateY(0);
          transition: transform 250ms var(--ease);
          will-change: transform;
        }
        .frame[data-hidden] {
          transform: translateY(-100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .frame { transition: none; }
          .frame[data-hidden] { transform: translateY(0); }
        }

        .frame__mark {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.06em;
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
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .frame__link:hover { color: var(--ink); }
        .frame__link[data-active] { color: var(--ink); }

        @media (prefers-reduced-motion: reduce) {
          .frame__mark, .frame__link { transition: none; }
        }

        @media (max-width: 640px) {
          .frame { padding: 0 20px; }
          .frame__nav { gap: 14px; }
        }
      `}</style>
    </header>
  );
}
