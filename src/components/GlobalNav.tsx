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

export default function GlobalNav() {
  const mobileMenuOpen = useStudioStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const navigate = useTransitionNavigate();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Homepage has its own chrome (HomepageChrome) — only render MobileMenu here
  if (isHome) {
    return (
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    );
  }

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

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between"
        style={{
          height: 48, /* matches Hero paddingTop — 4×12 baseline */
          padding: "0 var(--page-px)",
          backgroundColor: isHome ? "transparent" : "rgba(var(--color-bg-rgb), 0.92)",
          backdropFilter: isHome ? "none" : "blur(8px)",
          WebkitBackdropFilter: isHome ? "none" : "blur(8px)",
        }}
      >
        {/* Studio mark */}
        <div className="flex items-center gap-2" data-nav-el>
          <TransitionLink href="/">
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--color-text-dim)",
              }}
            >
              hkj
            </span>
          </TransitionLink>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6" data-nav-el>
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="font-mono relative group/link"
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--color-text-dim)",
              }}
            >
              <span className="transition-colors duration-300 group-hover/link:text-[var(--color-text)]">
                {link.label}
              </span>
              <span
                className="absolute -bottom-0.5 left-0 right-0 h-[1px] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500"
                style={{
                  backgroundColor: "var(--color-text-dim)",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </button>
          ))}
        </div>

        {/* Menu trigger — mobile only on homepage, always on inner pages */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          data-nav-el
          className=""
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "var(--color-text-dim)",
            lineHeight: 1,
            transition: "color 0.3s ease",
            fontFamily: "var(--font-mono)",
          }}
          aria-label="Open menu"
        >
          <span className="hover:text-[var(--color-text)] transition-colors duration-300">
            Menu
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
