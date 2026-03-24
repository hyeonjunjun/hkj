"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigation";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
import { useStudioStore } from "@/lib/store";

export function MobileMenu() {
  const isOpen = useStudioStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setMobileMenuOpen(false), [setMobileMenuOpen]);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock + focus management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus first link after paint
      const raf = requestAnimationFrame(() => {
        const first = overlayRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        first?.focus();
      });
      return () => cancelAnimationFrame(raf);
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Full focus trap (Tab / Shift+Tab)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.closest('[aria-hidden="true"]'));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9500,
        backgroundColor: "var(--paper)",
        display: "flex",
        flexDirection: "column",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 320ms ease-out",
      }}
    >
      {/* Top bar — close button */}
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 var(--page-px)",
        }}
      >
        <button
          ref={closeButtonRef}
          onClick={close}
          aria-label="Close menu"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-nav)",
            color: "var(--ink-secondary)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            height: 48,
            display: "flex",
            alignItems: "center",
            transition: "color var(--duration-hover) var(--ease-hover)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-secondary)")}
        >
          Close
        </button>
      </div>

      {/* Nav links */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 var(--page-px)",
          gap: 24,
        }}
      >
        {NAV_LINKS.map((link) => {
          const active =
            link.href === "/#work"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 5vw, 28px)",
                color: active ? "var(--ink-full)" : "var(--ink-primary)",
                textDecoration: "none",
                lineHeight: "var(--leading-display)",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom contact row */}
      <div
        style={{
          padding: "var(--space-standard) var(--page-px)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-comfortable)",
          flexWrap: "wrap",
        }}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-meta)",
            color: "var(--ink-muted)",
            textDecoration: "none",
            transition: "color var(--duration-hover) var(--ease-hover)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-muted)")}
        >
          {CONTACT_EMAIL}
        </a>
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-meta)",
              color: "var(--ink-muted)",
              textDecoration: "none",
              transition: "color var(--duration-hover) var(--ease-hover)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-muted)")}
          >
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default MobileMenu;
