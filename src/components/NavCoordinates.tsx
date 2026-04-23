"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const ITEMS: NavItem[] = [
  { href: "/about",   label: "about" },
  { href: "/shelf",   label: "shelf" },
  { href: "/contact", label: "contact" },
];

export default function NavCoordinates() {
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let rafPending = false;
    const update = () => {
      rafPending = false;
      const y = window.scrollY;
      const scrollingDown = y > lastY;
      const next = scrollingDown && y > 80;
      setHidden((prev) => (prev === next ? prev : next));
      lastY = y;
    };
    const onScroll = () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Primary"
      className="nav"
      data-hidden={hidden ? "" : undefined}
    >
      <Link href="/" className="nav__mark" aria-label="Hyeonjoon Jun — design engineer — home">
        <span>hyeonjoon jun</span>
        <span className="nav__mark-sep" aria-hidden>·</span>
        <span className="nav__mark-role">design engineer</span>
      </Link>

      <ol className="nav__list">
        {ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href) ?? false;
          const className = `nav__link${active ? " is-active" : ""}`;

          return (
            <li key={item.href} className="nav__item">
              <Link
                href={item.href}
                className={className}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>

      <style>{`
        .nav {
          position: fixed;
          top: 20px;
          left: 24px;
          right: 24px;
          z-index: 50;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          pointer-events: none;
          transform: translateY(0);
          transition: transform 200ms var(--ease);
        }
        .nav[data-hidden] { transform: translateY(-100%); }

        @media (prefers-reduced-motion: reduce) {
          .nav { transition: none; }
          .nav[data-hidden] { transform: none; }
        }

        .nav__mark {
          pointer-events: auto;
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink);
          transition: opacity 180ms var(--ease);
        }
        .nav__mark:hover { opacity: 0.55; }
        .nav__mark-sep { color: var(--ink-4); }
        .nav__mark-role { color: var(--ink-3); }

        @media (max-width: 520px) {
          .nav__mark-sep, .nav__mark-role { display: none; }
        }

        .nav__list {
          pointer-events: auto;
          list-style: none;
          display: flex;
          gap: 22px;
          align-items: baseline;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin: 0;
          padding: 0;
        }
        .nav__link {
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .nav__link:hover { color: var(--ink); }
        .nav__link.is-active { color: var(--ink); }

        @media (max-width: 640px) {
          .nav { top: 14px; left: 16px; right: 16px; }
          .nav__mark { font-size: 9px; letter-spacing: 0.18em; }
          .nav__list { gap: 14px; font-size: 9px; letter-spacing: 0.18em; }
        }
      `}</style>
    </nav>
  );
}
