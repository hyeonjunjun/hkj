"use client";

import { motion } from "framer-motion";
import GameLink from "@/components/GameLink";

const MENU_ITEMS = [
  { href: "/index", label: "Index", desc: "Projects", num: "01" },
  { href: "/archive", label: "Archive", desc: "Experiments", num: "02" },
  { href: "/about", label: "About", desc: "Profile", num: "03" },
];

export default function Home() {
  return (
    <main id="main" className="game-screen">
      {/* Background atmosphere layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            bottom: "5%",
            left: "0",
            width: "60vw",
            height: "50vh",
            background:
              "radial-gradient(ellipse at center, rgba(200,164,85,0.025), transparent 60%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "5%",
            right: "0",
            width: "45vw",
            height: "40vh",
            background:
              "radial-gradient(ellipse at center, rgba(74,138,140,0.02), transparent 60%)",
          }}
        />
      </div>

      {/* Decorative vertical line — right side */}
      <motion.div
        className="absolute z-10"
        style={{
          right: "clamp(32px, 8vw, 96px)",
          top: "15%",
          width: "1px",
          height: "70%",
          background: "linear-gradient(to bottom, transparent, var(--fg-4), transparent)",
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Decorative horizontal line — bottom */}
      <motion.div
        className="absolute z-10"
        style={{
          bottom: "60px",
          left: "clamp(32px, 8vw, 96px)",
          right: "clamp(32px, 8vw, 96px)",
          height: "1px",
          background: "linear-gradient(to right, var(--fg-4), transparent 50%)",
        }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Top-left: Mark */}
      <motion.div
        className="absolute top-8 left-[clamp(32px,8vw,96px)] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span
          className="font-display text-[14px] tracking-[0.02em]"
          style={{ color: "var(--fg)" }}
        >
          HKJ
        </span>
      </motion.div>

      {/* Top-right: coordinates-style info */}
      <motion.div
        className="absolute top-8 right-[clamp(32px,8vw,96px)] z-10 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span
          className="block font-mono text-[9px] tracking-[0.12em] uppercase"
          style={{ color: "var(--fg-3)" }}
        >
          New York — 2026
        </span>
      </motion.div>

      {/* Center-left: Main title + menu */}
      <div
        className="absolute z-10"
        style={{
          left: "clamp(32px, 8vw, 96px)",
          top: "50%",
          transform: "translateY(-55%)",
        }}
      >
        <motion.span
          className="block font-mono text-[9px] uppercase tracking-[0.18em] mb-6"
          style={{ color: "var(--fg-3)" }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Design Engineering
        </motion.span>

        <motion.h1
          className="font-display font-normal leading-[0.9] tracking-[-0.04em]"
          style={{
            fontSize: "clamp(72px, 10vw, 130px)",
            color: "var(--fg)",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          HKJ
        </motion.h1>

        {/* Separator line */}
        <motion.div
          className="mt-8 mb-6 h-px"
          style={{
            width: 48,
            background: "linear-gradient(90deg, var(--accent-warm-1), transparent)",
          }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />

        {/* Menu items */}
        <nav className="flex flex-col">
          {MENU_ITEMS.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <GameLink
                href={item.href}
                data-cursor="link"
                className="group flex items-center gap-5 py-3.5 transition-all duration-300"
              >
                {/* Number */}
                <span
                  className="font-mono text-[9px] tracking-[0.1em] tabular-nums w-5"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.num}
                </span>

                {/* Selection line */}
                <div
                  className="w-0 group-hover:w-10 h-px transition-all duration-500 ease-out"
                  style={{
                    background: "linear-gradient(90deg, var(--accent-warm-1), transparent)",
                  }}
                />

                {/* Label */}
                <span
                  className="font-body text-[15px] tracking-[0.01em] group-hover:text-[var(--fg)] transition-colors duration-300"
                  style={{ color: "var(--fg-2)" }}
                >
                  {item.label}
                </span>

                {/* Desc — appears on hover */}
                <span
                  className="font-mono text-[9px] tracking-[0.08em] uppercase opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-400"
                  style={{ color: "var(--fg-3)" }}
                >
                  {item.desc}
                </span>
              </GameLink>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom-left: Tagline */}
      <motion.div
        className="absolute bottom-7 left-[clamp(32px,8vw,96px)] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <p
          className="font-mono text-[9px] tracking-[0.04em] leading-[2]"
          style={{ color: "var(--fg-3)" }}
        >
          Craft and systems thinking
        </p>
      </motion.div>

      {/* Bottom-right: Corner mark — larger */}
      <motion.div
        className="absolute bottom-7 right-[clamp(32px,8vw,96px)] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M32 0L32 10M32 0L22 0" stroke="var(--accent-warm-1)" strokeWidth="0.75" opacity="0.35" />
          <path d="M0 32L0 22M0 32L10 32" stroke="var(--accent-warm-1)" strokeWidth="0.75" opacity="0.15" />
        </svg>
      </motion.div>
    </main>
  );
}
