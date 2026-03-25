"use client";

import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigation";
import { useStudioStore } from "@/lib/store";
import { MobileMenu } from "@/components/MobileMenu";
import NYCClock from "@/components/NYCClock";
import TransitionLink from "@/components/TransitionLink";
export default function GlobalNav() {
  const pathname = usePathname();
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);

  // Active detection: exact match, starts-with path, or homepage anchor
  function isActive(href: string): boolean {
    if (href === "/#work") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--page-px)",
          backgroundColor: "var(--paper)",
        }}
      >
        {/* Studio mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-small)" }}>
          <TransitionLink
            href="/"
            data-link
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-full)",
              textDecoration: "none",
            }}
          >
            Ryan Jun
          </TransitionLink>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            Design Engineer
          </span>
          <NYCClock />
        </div>

        {/* Desktop nav */}
        <nav data-desktop-nav style={{ display: "flex", alignItems: "center", gap: "var(--space-comfortable)" }}>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <TransitionLink
                key={link.label}
                href={link.href}
                data-link
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-meta)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: active ? "var(--ink-full)" : "var(--ink-muted)",
                  textDecoration: "none",
                  transition: "color var(--duration-hover) var(--ease-hover)",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!active) e.currentTarget.style.color = "var(--ink-secondary)";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!active) e.currentTarget.style.color = "var(--ink-muted)";
                }}
              >
                {link.label}
              </TransitionLink>
            );
          })}
        </nav>

        {/* Mobile menu trigger — hidden above 768px via CSS */}
        <button
          className="mobile-menu-trigger"
          onClick={() => setMobileMenuOpen(true)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "none", // shown by CSS at <768px
          }}
          aria-label="Open menu"
        >
          Menu
        </button>
      </header>

      <MobileMenu />
    </>
  );
}
