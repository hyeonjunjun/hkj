"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import MobileMenu from "@/components/MobileMenu";

/* ─────────────────────────────────────────────
   GlobalNav — Brutalist / Minimalist hybrid
   Top bar: Massive logo left, minimal links right.
   Side pinned: Vertical "Get in touch" (Valiente).
   ───────────────────────────────────────────── */

export default function GlobalNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  // For the Telha Clarke style shrinking logo
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.6]);
  const logoOriginY = useTransform(scrollY, [0, 100], ["0%", "0%"]);

  /* ── Scroll-to helper ── */
  const scrollTo = useCallback(
    (target: string) => {
      const el = document.querySelector(target) as HTMLElement | null;
      if (el && lenis) {
        lenis.scrollTo(el, { offset: 0, duration: 1.5 });
      }
    },
    [lenis],
  );

  const scrollToTop = useCallback(() => {
    lenis?.scrollTo(0, { duration: 1.5 });
  }, [lenis]);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    if (mobileMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [mobileMenuOpen, lenis]);

  return (
    <>
      {/* ── Top Bar ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start pointer-events-none"
        style={{
          padding: "var(--page-px)",
          mixBlendMode: "difference",
          color: "#fff",
        }}
      >
        {/* Brand / Logo (Scales down on scroll) */}
        <motion.button
          onClick={scrollToTop}
          className="font-display font-bold uppercase tracking-tighter leading-none pointer-events-auto origin-top-left"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            scale: logoScale,
            y: logoOriginY,
          }}
        >
          HKJ
        </motion.button>

        {/* Right side links & Hamburger */}
        <div className="flex items-center gap-8 pointer-events-auto mt-2 md:mt-4">
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo("[data-section='work']")}
              className="font-mono uppercase tracking-[0.15em] hover:text-[#EB3300] transition-colors duration-300"
              style={{ fontSize: "var(--text-micro)" }}
            >
              Work
            </button>
            <button
              onClick={() => scrollTo("[data-section='about']")}
              className="font-mono uppercase tracking-[0.15em] hover:text-[#EB3300] transition-colors duration-300"
              style={{ fontSize: "var(--text-micro)" }}
            >
              Studio
            </button>
          </div>

          <button
            className="flex flex-col items-end justify-center group"
            style={{ gap: 6, width: 32, height: 24 }}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <div
              className="bg-current transition-all duration-300 group-hover:w-full"
              style={{ width: "100%", height: 2 }}
            />
            <div
              className="bg-current transition-all duration-300 group-hover:w-full"
              style={{ width: "60%", height: 2 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* ── Fixed Side Navigation (Valiente Brands) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-1/2 right-0 z-40 hidden lg:flex flex-col items-center pointer-events-none mix-blend-difference"
        style={{
          transform: "translateY(-50%)",
          paddingRight: "var(--page-px)",
          color: "#fff",
        }}
      >
        <button
          onClick={() => scrollTo("[data-section='contact']")}
          className="group relative flex items-center justify-center h-40 pointer-events-auto"
        >
          <span
            className="font-mono uppercase tracking-[0.2em] whitespace-nowrap origin-center -rotate-90 transition-colors duration-300 group-hover:text-[#EB3300]"
            style={{ fontSize: "var(--text-micro)" }}
          >
            Get In Touch
          </span>
          <div className="absolute top-full mt-4 w-[2px] h-12 bg-white/30 group-hover:bg-[#EB3300] transition-colors duration-300 pointer-events-none" />
        </button>
      </motion.div>

      {/* ── Mobile Menu Overlay ── */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
