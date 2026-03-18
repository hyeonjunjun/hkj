"use client";

import { useRef, useEffect, useCallback } from "react";
import { useLenis } from "lenis/react";
import { useTransitionNavigate } from "@/hooks/useTransitionNavigate";
import { gsap } from "@/lib/gsap";
import { MENU_LINKS } from "@/constants/navigation";
import { CONTACT_EMAIL } from "@/constants/contact";

/**
 * MobileMenu — Editorial overlay with GSAP clipPath entrance
 *
 * Display serif link names with mono numbering. Accent line detail.
 * Refined spacing and typography to match the dark editorial aesthetic.
 */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const navigate = useTransitionNavigate();
  const lenis = useLenis();

  const handleNavigate = useCallback(
    (href: string) => {
      onClose();
      setTimeout(() => {
        if (href.startsWith("#")) {
          const target = document.querySelector(href) as HTMLElement | null;
          if (target && lenis) {
            lenis.scrollTo(target, { duration: 1.2 });
          }
        } else {
          navigate(href);
        }
      }, 400);
    },
    [onClose, navigate, lenis]
  );

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (isOpen) {
      el.style.display = "flex";

      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power4.inOut" }
      );

      const items = el.querySelectorAll("[data-menu-item]");
      tl.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        },
        "-=0.2"
      );

      const footer = el.querySelector("[data-menu-footer]");
      if (footer) {
        tl.fromTo(
          footer,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power3.out" },
          "-=0.2"
        );
      }
    } else {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.35,
        ease: "power4.inOut",
        onComplete: () => {
          el.style.display = "none";
        },
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex-col"
      style={{
        backgroundColor: "var(--color-bg)",
        display: "none",
        clipPath: "inset(0 0 100% 0)",
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "clamp(1rem, 2.5vh, 1.75rem) var(--page-px)" }}
        data-menu-item
      >
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
        <button
          onClick={onClose}
          className="group"
          style={{
            fontSize: "clamp(16px, 1.4vw, 20px)",
            color: "var(--color-text-dim)",
            lineHeight: 1,
          }}
          aria-label="Close menu"
        >
          <span className="group-hover:text-[var(--color-text)] transition-colors duration-300">
            ✕
          </span>
        </button>
      </div>

      {/* Links */}
      <nav
        className="flex-1 flex flex-col justify-center"
        style={{ padding: "0 var(--page-px)" }}
      >
        {MENU_LINKS.map((link, i) => (
          <button
            key={link.label}
            onClick={() => handleNavigate(link.href)}
            data-menu-item
            aria-label={`Navigate to ${link.label}`}
            className="text-left group"
            style={{
              paddingTop: "clamp(1.25rem, 3vh, 2rem)",
              paddingBottom: "clamp(1.25rem, 3vh, 2rem)",
              borderBottom:
                i < MENU_LINKS.length - 1
                  ? "1px solid var(--color-border)"
                  : "none",
            }}
          >
            <div className="flex items-baseline gap-5">
              <span
                className="font-mono"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                  letterSpacing: "0.1em",
                  minWidth: "2ch",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="font-display group-hover:text-[var(--color-accent)] transition-colors duration-300"
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
                  color: "var(--color-text)",
                  lineHeight: 1.15,
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                }}
              >
                {link.label}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* Accent line */}
      <div
        style={{
          margin: "0 var(--page-px)",
          height: "1px",
          backgroundColor: "var(--color-accent)",
          opacity: 0.2,
        }}
      />

      {/* Footer */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "clamp(1.25rem, 2.5vh, 1.75rem) var(--page-px)" }}
        data-menu-footer
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono hover:text-[var(--color-accent)] transition-colors duration-300"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          {CONTACT_EMAIL}
        </a>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              backgroundColor: "var(--color-accent)",
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.1em",
              color: "var(--color-text-ghost)",
            }}
          >
            available
          </span>
        </div>
      </div>
    </div>
  );
}
