"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useStudioStore } from "@/lib/store";
import { useTransitionNavigate } from "@/hooks/useTransitionNavigate";
import { NAV_LINKS } from "@/constants/navigation";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";
import PixelArt from "@/components/PixelArt";

/**
 * GlobalNav — Minimal cinematic nav with time-aware pixel art.
 * Visible on all pages. Scroll-direction show/hide on inner pages.
 */
export default function GlobalNav() {
  const mobileMenuOpen = useStudioStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const navRef = useRef<HTMLElement>(null);
  const symbolRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();
  const navigate = useTransitionNavigate();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleNavClick = useCallback(
    (href: string) => {
      if (href.startsWith("#")) {
        const target = document.querySelector(href) as HTMLElement | null;
        if (target && lenis) {
          lenis.scrollTo(target, { duration: 1.2 });
        }
      } else {
        navigate(href);
      }
    },
    [lenis, navigate]
  );

  // Scroll-direction show/hide (non-homepage only)
  useEffect(() => {
    if (!navRef.current || isHome) return;

    const nav = navRef.current;
    gsap.set(nav, { y: 0, opacity: 1 });

    const directionTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (self.direction === 1) {
          gsap.to(nav, { y: -100, opacity: 0, duration: 0.3, ease: "power2.in", overwrite: true });
        } else {
          gsap.to(nav, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out", overwrite: true });
        }
      },
    });

    return () => {
      directionTrigger.kill();
    };
  }, [isHome]);

  // Entrance on mount
  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current.querySelectorAll("[data-nav-el]"),
      { opacity: 0 },
      { opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  // On homepage, render a minimal transparent nav (no bg, no backdrop)
  // On inner pages, render the standard sticky nav with blur bg
  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          padding: "clamp(0.75rem, 2vh, 1.25rem) var(--page-px)",
          backgroundColor: isHome ? "transparent" : "rgba(var(--color-bg-rgb), 0.92)",
          backdropFilter: isHome ? "none" : "blur(8px)",
          WebkitBackdropFilter: isHome ? "none" : "blur(8px)",
        }}
      >
        {/* Pixel art (click cycles time) + studio mark (navigates home) */}
        <div className="flex items-center gap-2" data-nav-el>
          <PixelArt />
          <TransitionLink href="/">
            <span
              className="font-display"
              style={{
                fontSize: "clamp(11px, 1vw, 13px)",
                color: "var(--color-text-dim)",
                letterSpacing: "0.05em",
              }}
            >
              HKJ
            </span>
          </TransitionLink>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6" data-nav-el>
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="font-mono relative group/link"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-text-dim)",
              }}
            >
              <span className="transition-colors duration-300 group-hover/link:text-[var(--color-text)]">
                {link.label}
              </span>
              <span
                className="absolute -bottom-0.5 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500"
                style={{
                  backgroundColor: "var(--color-accent)",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </button>
          ))}
        </div>

        {/* ※ Menu trigger */}
        <button
          ref={symbolRef}
          onClick={() => setMobileMenuOpen(true)}
          data-nav-el
          className="group relative"
          style={{
            fontSize: "clamp(16px, 1.4vw, 20px)",
            color: "var(--color-text-dim)",
            lineHeight: 1,
            transition: "color 0.3s ease",
          }}
          aria-label="Open menu"
          onMouseEnter={() => {
            if (symbolRef.current) {
              gsap.to(symbolRef.current, { rotation: 90, duration: 0.4, ease: "power3.out" });
            }
          }}
          onMouseLeave={() => {
            if (symbolRef.current) {
              gsap.to(symbolRef.current, { rotation: 0, duration: 0.4, ease: "power3.out" });
            }
          }}
        >
          <span className="group-hover:text-[var(--color-text)] transition-colors duration-300">
            ※
          </span>
        </button>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
