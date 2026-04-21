"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; kind?: "mailto" };

const EMAIL = "rykjun@gmail.com";

const ITEMS: NavItem[] = [
  { href: "/about", label: "about" },
  { href: "/shelf", label: "shelf" },
  { href: `mailto:${EMAIL}`, label: "contact", kind: "mailto" },
];

export default function NavCoordinates() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="nav">
      <Link href="/" className="nav__mark" aria-label="Hyeonjoon Jun — design engineer — home">
        <span>hyeonjoon jun</span>
        <span className="nav__mark-sep" aria-hidden>·</span>
        <span className="nav__mark-role">design engineer</span>
      </Link>

      <ol className="nav__list">
        {ITEMS.map((item) => {
          const isInternal = item.kind !== "mailto";
          const active =
            isInternal && (pathname?.startsWith(item.href) ?? false);

          const className = `nav__link${active ? " is-active" : ""}`;

          return (
            <li key={item.href} className="nav__item">
              {isInternal ? (
                <Link
                  href={item.href}
                  className={className}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <a href={item.href} className={className}>
                  {item.label}
                </a>
              )}
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
