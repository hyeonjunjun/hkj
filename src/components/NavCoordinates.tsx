"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function NavCoordinates() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      style={{
        position: "fixed",
        top: 24,
        left: 24,
        right: 24,
        zIndex: 50,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.04em",
        pointerEvents: "none",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink)",
          textDecoration: "none",
          pointerEvents: "auto",
          transition: "opacity 0.15s var(--ease)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        HYEONJOON
      </Link>
      <div style={{ display: "flex", gap: 24, alignItems: "baseline", pointerEvents: "auto" }}>
        <Link href="/about" className={`nav-link${pathname === "/about" ? " is-active" : ""}`}>
          <span className="nav-link-text">About</span>
        </Link>
        <Link href="/" className={`nav-link${pathname === "/" ? " is-active" : ""}`}>
          <span className="nav-link-text">Work</span>
        </Link>
        <Link href="/shelf" className={`nav-link${pathname === "/shelf" ? " is-active" : ""}`}>
          <span className="nav-link-text">Shelf</span>
        </Link>
        <Link href="/writing" className={`nav-link${pathname === "/writing" ? " is-active" : ""}`}>
          <span className="nav-link-text">Writing</span>
        </Link>
        <a href="mailto:hyeonjunjun07@gmail.com" className="nav-link">
          <span className="nav-link-text">Contact</span>
        </a>
        <span style={{ marginLeft: 6, alignSelf: "center", color: "var(--ink-muted)" }}>
          <ThemeToggle />
        </span>
      </div>
      <style jsx>{`
        .nav-link {
          display: inline-flex;
          align-items: baseline;
          color: var(--ink-muted);
          text-decoration: none;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          transition: color 200ms var(--ease);
        }
        .nav-link.is-active {
          color: var(--accent);
        }
        .nav-link:hover {
          color: var(--ink);
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-thickness: 1px;
        }
      `}</style>
    </nav>
  );
}
