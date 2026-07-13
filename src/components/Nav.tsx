"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/data/studio";
import { delay, duration } from "@/lib/motion";
import { isNavItemActive } from "@/lib/navActive";
import MotionReveal from "./MotionReveal";

interface NavProps {
  items: NavItem[];
}

/**
 * Primary navigation, shared across the landing masthead and every room.
 * The active room (matched against the current pathname) gets weight 500
 * and a persistent 2px ember underline, 4px below the baseline — distinct
 * from the ink hover-underline every link gets (see .nav-link in
 * globals.css), which only appears on hover/focus.
 */
export default function Nav({ items }: NavProps) {
  const pathname = usePathname();

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
