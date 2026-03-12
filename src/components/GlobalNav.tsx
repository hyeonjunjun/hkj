"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import MobileMenu from "@/components/MobileMenu";
import { useStudioStore } from "@/lib/store";

/**
 * GlobalNav — Refined Studio Navigation
 * 
 * Simplified to match Jonite-style precision:
 * - Logo left
 * - Integrated settings / menu trigger right
 * - Removed ExperienceToggle for visual hierarchy clarity
 */

export default function GlobalNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isLoaded = useStudioStore((s) => s.isLoaded);

  // Logo shrink on scroll
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.75]);

  useLenis((lenis) => {
    const current = lenis.scroll;
    const direction = current > lastScrollY.current ? "down" : "up";

    if (current > 120) {
      setNavVisible(direction === "up");
    } else {
      setNavVisible(true);
    }

    lastScrollY.current = current;
  });

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pointer-events-none"
        style={{
          padding: "1.5rem var(--page-px)",
          opacity: isLoaded ? 1 : 0,
        }}
        initial={{ y: -100 }}
        animate={{ 
          y: navVisible ? 0 : -100,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
        }}
      >
        {/* Logo */}
        <motion.a
          href="/"
          className="pointer-events-auto flex items-center gap-2 group"
          style={{ originX: 0, scale: logoScale }}
        >
          <span
            className="font-grotesk tracking-[-0.03em]"
            style={{ 
              fontSize: "1.125rem", 
              fontWeight: 500,
              color: "var(--color-text)" 
            }}
          >
            HKJ STUDIO
          </span>
          <span 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        </motion.a>

        {/* Menu Toggle */}
        <div className="pointer-events-auto flex items-center gap-8">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="group flex flex-col gap-1 items-end focus:outline-none"
          >
            <span 
              className="font-mono uppercase tracking-[0.2em] mb-1"
              style={{ fontSize: "var(--text-micro)", color: "var(--color-text)" }}
            >
              Menu
            </span>
            <div className="w-6 h-[1px] bg-current transition-transform group-hover:scale-x-75 origin-right" />
            <div className="w-4 h-[1px] bg-current transition-transform group-hover:scale-x-125 origin-right" />
          </button>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
