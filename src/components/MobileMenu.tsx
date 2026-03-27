"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore, type ViewMode } from "@/lib/store";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

const VIEW_LINKS: { label: string; value: ViewMode }[] = [
  { label: "Index", value: "index" },
  { label: "Drift", value: "drift" },
  { label: "Archive", value: "archive" },
];

export function MobileMenu() {
  const isOpen = useStudioStore((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useStudioStore((s) => s.setMobileMenuOpen);
  const setActiveView = useStudioStore((s) => s.setActiveView);
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setMobileMenuOpen(false), [setMobileMenuOpen]);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus first link on open
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => {
        const first = overlayRef.current?.querySelector<HTMLElement>(
          "a[href], button:not([disabled])"
        );
        first?.focus();
      });
      return () => cancelAnimationFrame(raf);
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

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
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
    },
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onKeyDown={handleKeyDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9500,
            backgroundColor: "var(--paper)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Close button */}
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 24px",
            }}
          >
            <button
              onClick={close}
              aria-label="Close menu"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--ink-secondary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Close
            </button>
          </div>

          {/* View links */}
          <nav
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 24px",
              gap: 24,
            }}
          >
            {VIEW_LINKS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => {
                  setActiveView(value);
                  close();
                }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 5vw, 28px)",
                  color: "var(--ink-primary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textAlign: "left",
                  lineHeight: 1.2,
                }}
              >
                {label}
              </button>
            ))}

            <Link
              href="/about"
              onClick={close}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(22px, 5vw, 28px)",
                color: "var(--ink-primary)",
                textDecoration: "none",
                lineHeight: 1.2,
              }}
            >
              About
            </Link>
          </nav>

          {/* Bottom contact */}
          <div
            style={{
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              gap: 24,
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
              }}
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
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
