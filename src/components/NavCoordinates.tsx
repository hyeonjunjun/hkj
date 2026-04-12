"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NycClock from "./NycClock";
import { PIECES } from "@/constants/pieces";

export default function NavCoordinates() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isCaseStudy = pathname.startsWith("/work/");

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

  // T1.9 — Scroll progress for case study routes
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!isCaseStudy) return;

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const progress = Math.min(
          100,
          Math.round(
            (window.scrollY /
              (document.documentElement.scrollHeight - window.innerHeight)) *
              100
          )
        );
        setScrollProgress(progress);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isCaseStudy]);

  // T1.3 — Homepage-demoted link styles
  const linkFontSize = isHomepage ? 10 : 11;
  const linkColor = (active: boolean) => {
    if (isHomepage) return "rgba(255,255,255,0.25)";
    return active ? "var(--ink-primary)" : "var(--ink-muted)";
  };

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

      {/* T1.8 — Bracketed nav labels */}
      <Link
        href="/"
        className="font-mono uppercase"
        style={{
          fontSize: linkFontSize,
          letterSpacing: "0.06em",
          color: linkColor(workActive),
          transition: "color 0.3s var(--ease-swift)",
          textDecoration: "none",
        }}
      >
        [WORK]
      </Link>

      <Link
        href="/about"
        className="font-mono uppercase"
        style={{
          fontSize: linkFontSize,
          letterSpacing: "0.06em",
          color: linkColor(aboutActive),
          transition: "color 0.3s var(--ease-swift)",
          textDecoration: "none",
        }}
      >
        [ABOUT]
      </Link>

      {/* T1.9 — Scroll progress readout on case study routes */}
      {isCaseStudy && (
        <span
          className="font-mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            color: "var(--ink-ghost)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          [SCROLL {String(scrollProgress).padStart(2, "0")}%]
        </span>
      )}

      {/* gap-16 between last link and clock */}
      <span style={{ marginLeft: -8 }}>
        <NycClock className="hidden md:inline" />
      </span>
    </nav>
  );
}
