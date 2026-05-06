"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PIECES } from "@/constants/pieces";
import { NOTES } from "@/constants/notes";
import { SHELF } from "@/constants/shelf";

/**
 * Frame — fixed top navigation per spec §08.
 *
 *   ┌─ hyeonjoon jun ─────── work (n) · studio · bookmarks (n) · notes (n) ─┐
 *
 * Height 48px · padding-x var(--margin-page) · transparent → paper@0.92 +
 * backdrop-blur(8px) on scroll. Hide on scroll-down (translateY -100%),
 * reveal on scroll-up. All chrome text is Geist Sans uppercase 11px /
 * tracking 0.12em / color --ink-3, with --ink for active page.
 *
 * Mobile (<768px): collapses to "HKJ" left + "menu" right; menu opens a
 * full-screen overlay with numbered nav (deferred — Phase 4).
 */

type NavItem = {
  href: string;
  label: string;
  count?: number;
};

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Frame() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Live counts — derived from constants so the nav is always honest
  const workCount = PIECES.filter((p) => !p.placeholder).length;
  const notesCount = NOTES.length;
  const bookmarksCount = SHELF.length;

  const NAV: NavItem[] = [
    { href: "/work", label: "Work", count: workCount },
    { href: "/studio", label: "Studio" },
    { href: "/bookmarks", label: "Bookmarks", count: bookmarksCount },
    { href: "/notes", label: "Notes", count: notesCount },
  ];

  useEffect(() => {
    let lastY = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 8);
        // Hide on scroll-down past 80px; reveal on scroll-up
        if (y > lastY && y > 80) setHidden(true);
        else if (y < lastY) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="frame"
      data-scrolled={scrolled ? "" : undefined}
      data-hidden={hidden ? "" : undefined}
      aria-label="Site masthead"
    >
      <Link href="/" className="frame__mark" aria-label="hyeonjoon jun — home">
        hyeonjoon jun
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
              <span className="frame__link-label">{item.label}</span>
              {typeof item.count === "number" && (
                <span className="frame__link-count" aria-hidden>
                  ({item.count})
                </span>
              )}
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
          background: transparent;
          transition:
            background-color 220ms var(--ease),
            backdrop-filter 220ms var(--ease),
            transform 280ms var(--ease);
          pointer-events: auto;
        }
        .frame[data-scrolled] {
          background: rgba(251, 250, 246, 0.92);
          backdrop-filter: saturate(150%) blur(8px);
          -webkit-backdrop-filter: saturate(150%) blur(8px);
          border-bottom: 1px solid var(--ink-hair);
        }
        html[data-theme="dark"] .frame[data-scrolled] {
          background: rgba(14, 13, 9, 0.85);
        }
        .frame[data-hidden] {
          transform: translateY(-100%);
        }

        /* ─── Wordmark ─────────────────────────────────────────────── */
        .frame__mark {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          justify-self: start;
          transition: color 180ms var(--ease);
        }
        .frame__mark:hover { color: var(--ink); }

        /* ─── Numbered nav (right side) ────────────────────────────── */
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
        .frame__link-count {
          color: var(--ink-4);
          letter-spacing: 0.04em;
          font-feature-settings: "tnum" on;
        }
        .frame__link[data-active] .frame__link-count { color: var(--ink-3); }

        @media (prefers-reduced-motion: reduce) {
          .frame, .frame__mark, .frame__link { transition: none; }
        }

        /* ─── Mobile (<768px) ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .frame {
            padding: 0 20px;
          }
          .frame__nav {
            gap: 14px;
          }
          .frame__link {
            font-size: 10px;
            gap: 3px;
          }
        }
      `}</style>
    </header>
  );
}
