"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "lenis/react";
import { useStudioStore } from "@/lib/store";
import { NAV_LINKS } from "@/constants/navigation";
import MobileMenu from "@/components/MobileMenu";

/**
 * GlobalNav — GSAP-only, scroll show/hide
 *
 * Not visible in hero. Appears after scrolling past hero section.
 * Fixed bar: studio mark (left), text links (right)
 * Hides on scroll-down, shows on scroll-up
 * Background: --color-bg at 0.92 opacity + backdrop-filter blur
 */
export default function GlobalNav() {
  const mobileMenuOpen = useStudioStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const isLoaded = useStudioStore((s) => s.isLoaded);
  const navRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  const handleClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (href.startsWith("#")) {
        const target = document.querySelector(href) as HTMLElement | null;
        if (target && lenis) {
          lenis.scrollTo(target, { duration: 1.2 });
        }
      } else {
        window.location.href = href;
      }
    },
    [lenis]
  );

  // Show/hide based on scroll direction + hero threshold
  useEffect(() => {
    if (!navRef.current) return;

    const nav = navRef.current;
    let lastScrollY = 0;

    // Initially hidden
    gsap.set(nav, { y: -100, opacity: 0 });

    const hero = document.getElementById("hero");
    if (!hero) return;

    // Show nav after scrolling past hero
    ScrollTrigger.create({
      trigger: hero,
      start: "bottom top",
      onEnter: () => {
        gsap.to(nav, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
      },
      onLeaveBack: () => {
        gsap.to(nav, { y: -100, opacity: 0, duration: 0.3, ease: "power2.in" });
      },
    });

    // Hide on scroll-down, show on scroll-up
    const onScroll = () => {
      const currentY = window.scrollY;
      const heroBottom = hero.offsetTop + hero.offsetHeight;

      if (currentY <= heroBottom) return;

      if (currentY > lastScrollY + 5) {
        // Scrolling down — hide
        gsap.to(nav, { y: -100, duration: 0.3, ease: "power2.in" });
      } else if (currentY < lastScrollY - 5) {
        // Scrolling up — show
        gsap.to(nav, { y: 0, duration: 0.3, ease: "power3.out" });
      }
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stagger entrance after preloader
  useEffect(() => {
    if (!isLoaded || !navRef.current) return;

    const links = navRef.current.querySelectorAll("[data-nav-link]");
    gsap.fromTo(
      links,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" }
    );
  }, [isLoaded]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          padding: "clamp(0.75rem, 2vh, 1.25rem) var(--page-px)",
          backgroundColor: "rgba(17, 17, 16, 0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Studio mark */}
        <a href="/" data-nav-link>
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
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              data-nav-link
              className="relative font-mono group"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "0.12em",
                color: "var(--color-text-dim)",
                textTransform: "uppercase",
              }}
            >
              <span className="group-hover:text-[var(--color-text)] transition-colors duration-300">
                {link.label}
              </span>
              <span
                className="absolute -bottom-[2px] left-0 right-0 h-[1px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                style={{
                  backgroundColor: "var(--color-text-dim)",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </a>
          ))}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden font-mono"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "0.12em",
            color: "var(--color-text-dim)",
            textTransform: "uppercase",
          }}
          aria-label="Open menu"
        >
          Menu
        </button>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
