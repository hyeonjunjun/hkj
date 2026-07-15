"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NavItem } from "@/data/studio";
import { delay, duration, durationSeconds, windEasing } from "@/lib/motion";
import { isNavItemActive } from "@/lib/navActive";
import MotionReveal from "./MotionReveal";

interface NavProps {
  items: NavItem[];
  /**
   * "room" (default) is today's plain-text nav, shared by RoomHeader on
   * every room page -- unchanged. Deliberately the default: neither
   * RoomHeader.tsx nor the landing page passes a variant today, so
   * defaulting to "room" keeps RoomHeader's call site provably
   * unaffected. "landing" is the earlier Windswept bracketed-door
   * treatment (no longer used by the homepage, but left in place). "bar"
   * is the current homepage top-bar treatment: plain small text, no
   * brackets, tight gaps, matching a thin utility-bar nav rather than a
   * display element.
   */
  variant?: "room" | "landing" | "bar";
}

/**
 * Primary navigation, shared across the landing masthead and every room.
 * The active room (matched against the current pathname) gets weight 500
 * and a persistent 2px ember underline, 4px below the baseline — distinct
 * from the ink hover-underline every link gets (see .nav-link in
 * globals.css), which only appears on hover/focus.
 */
export default function Nav({ items, variant = "room" }: NavProps) {
  const pathname = usePathname();

  if (variant === "bar") {
    return (
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-6">
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="font-display text-[13px] capitalize text-ws-ink transition-opacity hover:opacity-60"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  if (variant === "landing") {
    return (
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-6 lg:gap-10">
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            return (
              <li key={item.href}>
                <motion.div whileHover={{ x: 6 }} transition={{ duration: durationSeconds.base, ease: windEasing }}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="relative inline-block font-display text-[11px] uppercase tracking-[0.15em] text-ws-ink"
                  >
                    [ {item.label} ]
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 h-[2px] w-full bg-ws-accent"
                      />
                    )}
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <MotionReveal delay={delay.nav} duration={duration.reveal}>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-6 lg:gap-14">
          {items.map((item) => {
            const isActive = isNavItemActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-link relative inline-block font-sans text-[15px] text-ink lg:text-[18px] ${
                    isActive ? "font-medium" : "font-normal"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-ember"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionReveal>
  );
}
