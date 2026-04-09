"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NycClock from "./NycClock";
import { PIECES } from "@/constants/pieces";

export default function NavCoordinates() {
  const pathname = usePathname();

  const workActive = pathname === "/" || pathname.startsWith("/work");
  const aboutActive = pathname === "/about";

  // Extract project title when on a /work/[slug] page
  let projectTitle: string | null = null;
  const workMatch = pathname.match(/^\/work\/([^/]+)/);
  if (workMatch) {
    const slug = workMatch[1];
    const piece = PIECES.find((p) => p.slug === slug);
    if (piece) projectTitle = piece.title;
  }

  return (
    <nav
      aria-label="Site navigation"
      data-nav-reveal
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 50,
        padding: "20px clamp(24px, 5vw, 64px)",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}
    >
      {projectTitle && (
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--ink-ghost)",
          }}
        >
          {projectTitle}
        </span>
      )}

      <Link
        href="/"
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          color: workActive ? "var(--ink-primary)" : "var(--ink-muted)",
          transition: "color 0.3s var(--ease-swift)",
          textDecoration: "none",
        }}
      >
        Work
      </Link>

      <Link
        href="/about"
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: "0.06em",
          color: aboutActive ? "var(--ink-primary)" : "var(--ink-muted)",
          transition: "color 0.3s var(--ease-swift)",
          textDecoration: "none",
        }}
      >
        About
      </Link>

      {/* gap-16 between last link and clock */}
      <span style={{ marginLeft: -8 }}>
        <NycClock className="mobile:hidden" />
      </span>
    </nav>
  );
}
