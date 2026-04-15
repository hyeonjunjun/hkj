"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        mixBlendMode: "difference",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#fff",
          textDecoration: "none",
          pointerEvents: "auto",
        }}
      >
        Hyeon Jun
      </Link>
      <div style={{ display: "flex", gap: 24, pointerEvents: "auto" }}>
        <Link
          href="/about"
          style={{
            color: pathname === "/about" ? "#fff" : "#888",
            transition: "color 0.15s var(--ease)",
          }}
        >
          About
        </Link>
        <Link
          href="/archive"
          style={{
            color: pathname === "/archive" ? "#fff" : "#888",
            transition: "color 0.15s var(--ease)",
          }}
        >
          Archive
        </Link>
        <a
          href="mailto:hyeonjunjun07@gmail.com"
          style={{ color: "#888", transition: "color 0.15s var(--ease)" }}
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
