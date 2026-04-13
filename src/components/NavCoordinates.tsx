"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavCoordinates() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const aboutActive = pathname === "/about";
  const archiveActive = pathname === "/archive";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: active ? "var(--text-primary)" : "var(--text-muted)",
    transition: "color 0.3s var(--ease-swift)",
    textDecoration: "none",
  });

  return (
    <nav
      aria-label="Site navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px clamp(24px, 5vw, 64px)",
        background: scrolled ? "rgba(12,12,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.4s var(--ease-swift), backdrop-filter 0.4s var(--ease-swift)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-primary)",
          textDecoration: "none",
        }}
      >
        HKJ
      </Link>

      <div style={{ display: "flex", gap: 32 }}>
        <Link href="/about" style={linkStyle(aboutActive)}>
          About
        </Link>
        <Link href="/archive" style={linkStyle(archiveActive)}>
          Archive
        </Link>
      </div>
    </nav>
  );
}
