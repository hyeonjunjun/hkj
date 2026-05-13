// src/components/chrome/Nav.tsx
"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";

const ROUTES = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  return (
    <nav
      className="nav"
      role="navigation"
      aria-label="Primary"
    >
      {ROUTES.map((route, i) => (
        <span key={route.href} className="nav__cell">
          {i > 0 && <span className="t-sep nav__sep" aria-hidden>·</span>}
          <TransitionLink
            href={route.href}
            className="t-footnote nav__link"
            showActiveIndicator
          >
            {route.label}
          </TransitionLink>
        </span>
      ))}
      <span className="nav__theme">
        <ThemeToggle />
      </span>

      <style>{`
        .nav {
          position: fixed;
          top: var(--margin-page);
          right: calc(var(--margin-page) + 56px); /* clear of CTA pill overhang */
          z-index: 50;
          display: inline-flex;
          align-items: baseline;
          gap: 0;
          height: 32px;
        }
        .nav__cell { display: inline-flex; align-items: baseline; }
        .nav__sep { color: var(--ink-4); }
        .nav__link {
          color: var(--ink-3);
          text-transform: uppercase;
          transition: color 180ms var(--ease);
          padding: 0 8px;
        }
        .nav__link:hover { color: var(--ink); }
        .nav__theme { margin-left: 16px; }
        @media (max-width: 640px) {
          .nav { right: var(--margin-page); }
          .nav__link { padding: 0 6px; }
        }
      `}</style>
    </nav>
  );
}
