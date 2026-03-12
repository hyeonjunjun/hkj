"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { useRouter } from "next/navigation";
import LiveClock from "@/components/ui/LiveClock";

/* ─────────────────────────────────────────────
   MobileMenu — Nothing OS / Teenage Engineering
   Full-screen overlay with grid bg, numbered
   navigation, technical metadata footer.
   ───────────────────────────────────────────── */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuLink {
  label: string;
  target?: string;
  href?: string;
}

const MENU_LINKS: MenuLink[] = [
  { label: "Work", target: "[data-section='work']" },
  { label: "Lab", href: "/lab" },
  { label: "Studio", target: "[data-section='about']" },
  { label: "Contact", target: "[data-section='contact']" },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15 },
  },
};

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.45, duration: 0.4 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const lenis = useLenis();
  const router = useRouter();

  const handleNavigate = useCallback(
    (link: MenuLink) => {
      if (link.href) {
        router.push(link.href);
        onClose();
        return;
      }
      if (link.target) {
        const el = document.querySelector(link.target) as HTMLElement | null;
        if (el && lenis) {
          lenis.scrollTo(el, { offset: 0, duration: 1.5 });
        }
      }
      onClose();
    },
    [lenis, onClose, router],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Top bar — nav label + close */}
          <div
            className="relative z-10 flex items-center justify-between border-b border-[var(--color-border)]"
            style={{ padding: "1rem var(--page-px)" }}
          >
            <span
              className="font-mono uppercase tracking-[0.2em]"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-ghost)",
              }}
            >
              [ NAV : MENU ]
            </span>

            <button
              onClick={onClose}
              className="font-mono uppercase tracking-[0.15em] border border-[var(--color-border)] px-3 py-1.5 transition-colors duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-dim)",
              }}
              aria-label="Close navigation menu"
            >
              Close
            </button>
          </div>

          {/* Navigation links — numbered */}
          <nav
            className="relative z-10 flex-1 flex flex-col justify-center"
            style={{ padding: "0 var(--page-px)", gap: 0 }}
          >
            {MENU_LINKS.map((link, i) => (
              <motion.button
                key={link.label}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => handleNavigate(link)}
                className="flex items-baseline gap-4 text-left py-4 border-b border-[var(--color-border)] transition-colors duration-300 group"
              >
                <span
                  className="font-mono tabular-nums transition-colors duration-300 group-hover:text-[var(--color-accent)]"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-dim)",
                    minWidth: 32,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-serif italic font-bold tracking-tighter transition-colors duration-300 group-hover:text-[var(--color-accent)]"
                  style={{
                    fontSize: "clamp(2.5rem, 10vw, 5rem)",
                    color: "var(--color-text)",
                    lineHeight: 1,
                  }}
                >
                  {link.label}
                </span>
              </motion.button>
            ))}
          </nav>

          {/* Footer — system info */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 border-t border-[var(--color-border)]"
            style={{ padding: "1.5rem var(--page-px)" }}
          >
            <div className="flex flex-col gap-4">
              <span
                className="font-mono uppercase tracking-[0.2em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                SYS.INFO
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span
                    className="font-mono uppercase tracking-[0.15em]"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    Email
                  </span>
                  <a
                    href="mailto:hello@hkjstudio.com"
                    className="font-mono transition-colors duration-300 hover:text-[var(--color-accent)]"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    hello@hkjstudio.com
                  </a>
                </div>

                <div className="flex flex-col gap-1">
                  <span
                    className="font-mono uppercase tracking-[0.15em]"
                    style={{
                      fontSize: "var(--text-micro)",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    Local Time
                  </span>
                  <LiveClock
                    showTimezone
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
                <span
                  className="font-mono uppercase tracking-[0.15em]"
                  style={{
                    fontSize: "var(--text-micro)",
                    color: "var(--color-text-dim)",
                  }}
                >
                  Available — NYC / Seoul
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
