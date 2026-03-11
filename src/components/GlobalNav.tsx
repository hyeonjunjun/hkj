"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";

/**
 * Navigation — minimal, fixed, mix-blend-difference.
 * Hides on scroll down, shows on scroll up.
 * No slider coupling. No CTA buttons.
 */

export default function GlobalNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => {
      const currentY = lenis.scroll;
      if (currentY < 100) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current + 5) {
        setIsVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const scrollTo = (target: string) => {
    setMenuOpen(false);
    // Simple approach: scroll to section by class/id
    const el = document.querySelector(target) as HTMLElement | null;
    if (el && lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.5 });
    }
  };

  return (
    <>
      {/* Nav Bar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white px-6 md:px-12 py-6"
        initial={{ y: 0 }}
        animate={{ y: isVisible || menuOpen ? 0 : -80 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => lenis?.scrollTo(0, { duration: 1.5 })}
            className="font-serif italic tracking-wide"
            style={{ fontSize: "var(--text-base)" }}
          >
            HKJ
          </button>

          {/* Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="font-mono uppercase tracking-widest"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </motion.nav>

      {/* Full-Screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor: "var(--color-bg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col items-center gap-8">
              {[
                { label: "Work", target: "[data-section='work']" },
                { label: "About", target: "[data-section='about']" },
                { label: "Contact", target: "[data-section='contact']" },
              ].map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollTo(item.target)}
                  className="font-serif italic transition-colors duration-300"
                  style={{
                    fontSize: "var(--text-2xl)",
                    color: "var(--color-text)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-text)")
                  }
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
