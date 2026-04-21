"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; key: string };

const ITEMS: NavItem[] = [
  { href: "/",       label: "Work",     key: "01" },
  { href: "/about",  label: "About",    key: "02" },
  { href: "/shelf",  label: "Shelf",    key: "03" },
];

export default function NavCoordinates() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav
      aria-label="Primary"
      className={isHome ? "nav nav--home" : "nav"}
    >
      <Link href="/" className="nav__mark" aria-label="Hyeonjoon Jun — home">
        <span className="nav__mark-primary">HYEONJOON JUN</span>
        <span className="nav__mark-secondary">OBSERVER</span>
      </Link>

      <ol className="nav__list">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);
          return (
            <li key={item.href} className="nav__item">
              <Link
                href={item.href}
                className={`nav__link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="nav__key">{item.key}</span>
                <span className="nav__label">{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="nav__item">
          <a className="nav__link" href="mailto:hyeonjunjun07@gmail.com">
            <span className="nav__key">04</span>
            <span className="nav__label">Contact</span>
          </a>
        </li>
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
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-2);
        }

        .nav__mark {
          pointer-events: auto;
          display: inline-flex;
          gap: 10px;
          align-items: baseline;
          color: var(--ink);
          transition: opacity 180ms var(--ease);
        }
        .nav__mark:hover { opacity: 0.55; }
        .nav__mark-primary { letter-spacing: 0.18em; }
        .nav__mark-secondary {
          color: var(--ink-3);
          letter-spacing: 0.22em;
        }

        .nav__list {
          pointer-events: auto;
          list-style: none;
          display: flex;
          gap: 22px;
          align-items: baseline;
        }
        .nav__link {
          display: inline-flex;
          gap: 6px;
          align-items: baseline;
          color: var(--ink-2);
          transition: color 180ms var(--ease);
        }
        .nav__link:hover { color: var(--ink); }
        .nav__link.is-active { color: var(--ink); }
        .nav__key { color: var(--ink-4); font-variant-numeric: tabular-nums; }

        /* Home override — nav floats over the dark cosmos hero */
        .nav--home { color: rgba(241, 236, 224, 0.6); }
        .nav--home .nav__mark { color: rgba(241, 236, 224, 0.95); }
        .nav--home .nav__mark-secondary { color: rgba(241, 236, 224, 0.55); }
        .nav--home .nav__link { color: rgba(241, 236, 224, 0.55); }
        .nav--home .nav__link:hover,
        .nav--home .nav__link.is-active { color: rgba(255, 255, 255, 0.95); }
        .nav--home .nav__key { color: rgba(241, 236, 224, 0.32); }

        @media (max-width: 640px) {
          .nav { top: 14px; left: 16px; right: 16px; font-size: 9px; }
          .nav__mark-secondary { display: none; }
          .nav__list { gap: 14px; }
          .nav__key { display: none; }
        }
      `}</style>
    </nav>
  );
}
