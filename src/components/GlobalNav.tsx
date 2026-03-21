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
  const pathname = usePathname();
  const lenis = useLenis();
  const navigate = useTransitionNavigate();
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

  // Scroll-direction show/hide
  useEffect(() => {
    if (!navRef.current) return;

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
  }, []);

  // Entrance on mount
  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current.querySelectorAll("[data-nav-el]"),
      { opacity: 0 },
      { opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  // TODO: Replace the "hkj" text mark with a proper logotype/monogram component

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between"
        style={{
          height: 48, /* matches Hero paddingTop — 4×12 baseline */
          padding: "0 var(--page-px)",
          backgroundColor: "rgba(var(--color-bg-rgb), 0.92)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Studio mark */}
        <div className="flex items-center gap-2" data-nav-el>
          <TransitionLink href="/" className="link-dim">
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "var(--text-micro)",
                letterSpacing: "var(--tracking-wider)",
              }}
            >
              hkj
            </span>
          </TransitionLink>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6" data-nav-el>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="font-mono uppercase relative group/link"
                style={{
                  fontSize: "var(--text-micro)",
                  letterSpacing: "var(--tracking-wider)",
                  color: isActive ? "var(--color-text)" : "var(--color-text-dim)",
                  transition: "color var(--duration-micro) var(--ease-micro)",
                }}
              >
                <span className="transition-colors duration-300 group-hover/link:text-[var(--color-text)]">
                  {link.label}
                </span>
                <span
                  className={`absolute -bottom-0.5 left-0 right-0 h-[1px] origin-left transition-transform duration-500 ${isActive ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100"}`}
                  style={{
                    backgroundColor: isActive ? "var(--color-text)" : "var(--color-text-dim)",
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          data-nav-el
          className="font-mono uppercase"
          style={{
            fontSize: "var(--text-micro)",
            letterSpacing: "var(--tracking-wider)",
            color: "var(--color-text-dim)",
            lineHeight: 1,
            transition: "color var(--duration-micro) var(--ease-micro)",
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
