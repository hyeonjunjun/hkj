"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/index", label: "Index" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14"
      style={{
        paddingInline: "clamp(32px, 8vw, 96px)",
        background: "rgba(10, 10, 11, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--fg-4)",
      }}
    >
      <Link
        href="/"
        className="font-mono text-[12px] tracking-[0.02em] hover:opacity-60 transition-opacity duration-300"
        style={{ color: "var(--fg)" }}
      >
        HKJ
      </Link>

      <div className="flex items-center gap-6">
        {NAV_LINKS.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-mono text-[10px] uppercase tracking-[0.08em] transition-colors duration-300"
              style={{ color: isActive ? "var(--fg)" : "var(--fg-3)" }}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-[7px] left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent-warm-1), var(--accent-warm-3))",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
        <ThemeToggle />
      </div>
    </nav>
  );
}
