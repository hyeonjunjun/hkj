"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NycClock from "./NycClock";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Work" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
      style={{
        height: 48,
        paddingInline: "clamp(24px, 5vw, 64px)",
      }}
    >
      <Link
        href="/"
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: "0.08em",
          color: "var(--ink-primary)",
        }}
      >
        HKJ
      </Link>

      <div className="flex items-center" style={{ gap: 24 }}>
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/" || pathname.startsWith("/work")
              : pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: isActive ? "var(--ink-primary)" : "var(--ink-muted)",
                transition: "color 0.3s var(--ease-swift)",
              }}
            >
              {link.label}
            </Link>
          );
        })}
        <NycClock />
      </div>
    </nav>
  );
}
