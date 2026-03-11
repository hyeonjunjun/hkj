"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";

/**
 * Console Nav — flat, monospaced, utilitarian.
 * Name left · Section links center · Live clock right.
 */

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time || "00:00:00"}</span>;
}

export default function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => setScrolled(lenis.scroll > 60);
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const scrollTo = (target: string) => {
    const el = document.querySelector(target) as HTMLElement | null;
    if (el && lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 1.5 });
    }
  };

  const links = [
    { label: "Work", target: "[data-section='work']" },
    { label: "About", target: "[data-section='about']" },
    { label: "Contact", target: "[data-section='contact']" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--color-border)"
          : "1px solid transparent",
        transition: "background-color 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          padding: "0.75rem var(--page-px)",
        }}
      >
        {/* Name */}
        <button
          onClick={() => lenis?.scrollTo(0, { duration: 1.5 })}
          className="font-mono uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors duration-300"
          style={{ fontSize: "var(--text-xs)" }}
        >
          HKJ Studio
        </button>

        {/* Center links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.target)}
              className="font-mono uppercase tracking-[0.15em] transition-colors duration-300"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-dim)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-dim)")
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Clock */}
        <span
          className="font-mono uppercase tracking-[0.08em]"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-dim)",
          }}
        >
          <LiveClock />
        </span>
      </div>
    </motion.nav>
  );
}
