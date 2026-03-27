"use client";

import Link from "next/link";
import { useState } from "react";
import { useStudioStore } from "@/lib/store";
import { MobileMenu } from "@/components/MobileMenu";

export default function GlobalNav() {
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const [aboutHovered, setAboutHovered] = useState(false);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: 14,
            color: "var(--ink-full)",
            textDecoration: "none",
          }}
        >
          HKJ
        </Link>

        {/* Desktop: About link */}
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link
            href="/about"
            onMouseEnter={() => setAboutHovered(true)}
            onMouseLeave={() => setAboutHovered(false)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: aboutHovered ? "var(--ink-full)" : "var(--ink-secondary)",
              textDecoration: "none",
              transition: "color 150ms ease",
              display: "none",
            }}
            className="desktop-about"
          >
            ABOUT
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ink-secondary)",
              display: "block",
            }}
            className="mobile-menu-btn"
          >
            Menu
          </button>
        </nav>
      </header>

      <style>{`
        @media (min-width: 768px) {
          .desktop-about { display: block !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <MobileMenu />
    </>
  );
}
