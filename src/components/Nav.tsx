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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(24px,6vw,48px)] h-12 bg-bg/80 backdrop-blur-sm border-b border-fg-4">
      <Link
        href="/"
        className="font-mono text-[13px] tracking-[0.01em] text-fg no-underline hover:opacity-70 transition-opacity duration-300"
      >
        HKJ
      </Link>

      <div className="flex items-center gap-5">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-mono text-[10px] uppercase tracking-[0.06em] no-underline transition-colors duration-300"
              style={{ color: isActive ? "var(--fg)" : "var(--fg-3)" }}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, var(--accent-warm-1), var(--accent-warm-2))" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
