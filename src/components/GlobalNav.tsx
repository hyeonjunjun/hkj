"use client";

import Link from "next/link";
import { useStudioStore } from "@/lib/store";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { NYCClock } from "@/components/NYCClock";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/MobileMenu";

export function GlobalNav() {
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "transparent",
        }}
      >
        {/* Left: ViewSwitcher (desktop) / Hamburger (mobile) */}
        <div>
          <div className="desktop-switcher">
            <ViewSwitcher />
          </div>
          <button
            className="mobile-menu-btn"
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
            }}
          >
            Menu
          </button>
        </div>

        {/* Center: Brand mark */}
        <Link
          href="/"
          className="brand-mark"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(20px, 3vw, 32px)",
            color: "var(--ink-full)",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          HKJ/2026
        </Link>

        {/* Right: Clock + Theme + About */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <NYCClock />
          <ThemeToggle />
          <Link
            href="/about"
            className="desktop-about"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--ink-secondary)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-full)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--ink-secondary)";
            }}
          >
            ABOUT
          </Link>
        </div>
      </header>

      <style>{`
        .desktop-switcher { display: none; }
        .mobile-menu-btn { display: block; }
        .desktop-about { display: none; }

        @media (min-width: 768px) {
          .desktop-switcher { display: flex; }
          .mobile-menu-btn { display: none !important; }
          .desktop-about { display: block !important; }
        }
      `}</style>

      <MobileMenu />
    </>
  );
}

export default GlobalNav;
