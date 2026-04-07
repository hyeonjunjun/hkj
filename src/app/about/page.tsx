"use client";

import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";
import GameLink from "@/components/GameLink";

const stagger = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const STATS = [
  { label: "Location", value: "New York" },
  { label: "Focus", value: "Design Engineering" },
  { label: "Experience", value: "3+ years" },
  { label: "Status", value: "Available" },
];

const EXPERIENCE = [
  { period: "2024 —", role: "HKJ Studio", desc: "Independent practice" },
  { period: "2023 — 24", role: "Product", desc: "Mobile & AI" },
  { period: "2022 — 23", role: "Design Systems", desc: "Components & tokens" },
];

const SKILLS = [
  "React", "Next.js", "TypeScript", "Framer Motion", "Three.js",
  "Figma", "Design Systems", "WebGL",
];

export default function AboutPage() {
  return (
    <main id="main" className="game-screen">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            top: "20%", left: "60%",
            width: "40vw", height: "40vh",
            background: "radial-gradient(ellipse at center, rgba(200,164,85,0.025), transparent 60%)",
          }}
        />
      </div>

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between h-14"
        style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}
      >
        <GameLink
          href="/"
          className="font-mono text-[11px] tracking-[0.04em] hover:opacity-60 transition-opacity"
          style={{ color: "var(--fg-2)" }}
          data-cursor="link"
        >
          ← Back
        </GameLink>
        <span
          className="font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: "var(--fg-3)" }}
        >
          About — Profile
        </span>
      </div>

      {/* Profile layout — two columns */}
      <div
        className="absolute inset-0 z-10 flex items-center"
        style={{ paddingInline: "clamp(32px, 8vw, 96px)" }}
      >
        <div className="flex gap-[clamp(40px,6vw,100px)] w-full max-w-[1100px] max-md:flex-col relative">
          {/* Vertical divider between columns */}
          <motion.div
            className="absolute max-md:hidden"
            style={{
              left: "45%",
              top: "0",
              bottom: "0",
              width: "1px",
              background: "linear-gradient(to bottom, transparent, var(--fg-4), transparent)",
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />

          {/* Left column — identity */}
          <div className="w-[45%] max-md:w-full">
            <motion.span
              className="block font-mono text-[10px] tracking-[0.14em] uppercase mb-4"
              style={{ color: "var(--accent-warm-1)" }}
              {...stagger(0.3)}
            >
              Profile
            </motion.span>

            <motion.h1
              className="font-display font-normal tracking-[-0.02em] leading-[1.1] mb-5"
              style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--fg)" }}
              {...stagger(0.4)}
            >
              Hyeon Jun
            </motion.h1>

            <motion.p
              className="text-[14px] leading-[1.75] mb-6 max-w-[380px]"
              style={{ color: "var(--fg-2)" }}
              {...stagger(0.5)}
            >
              Design engineer building at the intersection of
              craft and systems thinking. I care about type, motion,
              and the invisible details that make software feel intentional.
            </motion.p>

            <motion.p
              className="font-mono text-[10px] leading-[1.8] max-w-[340px]"
              style={{ color: "var(--fg-3)" }}
              {...stagger(0.6)}
            >
              When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting
              for good light to photograph, reading about material science,
              or making pour-overs that take too long.
            </motion.p>

            {/* Contact */}
            <motion.div className="mt-8" {...stagger(0.7)}>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-mono text-[11px] tracking-[0.02em] transition-colors duration-300"
                style={{ color: "var(--fg-2)" }}
                data-cursor="link"
              >
                {CONTACT_EMAIL}
              </a>

              <div className="flex gap-4 mt-3">
                {SOCIALS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] uppercase tracking-[0.1em] transition-colors duration-300 hover:text-[var(--fg)]"
                    style={{ color: "var(--fg-3)" }}
                    data-cursor="link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column — stats & experience */}
          <div className="w-[55%] max-md:w-full">
            {/* Stats grid */}
            <motion.div {...stagger(0.5)}>
              <span
                className="block font-mono text-[10px] tracking-[0.14em] uppercase mb-4"
                style={{ color: "var(--fg-3)" }}
              >
                Stats
              </span>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="pb-3"
                    style={{ borderBottom: "1px solid var(--fg-4)" }}
                  >
                    <span
                      className="block font-mono text-[9px] uppercase tracking-[0.1em] mb-1"
                      style={{ color: "var(--fg-3)" }}
                    >
                      {stat.label}
                    </span>
                    <span className="text-[13px]" style={{ color: "var(--fg)" }}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div {...stagger(0.6)}>
              <span
                className="block font-mono text-[10px] tracking-[0.14em] uppercase mb-4"
                style={{ color: "var(--fg-3)" }}
              >
                Experience
              </span>
              <div className="flex flex-col gap-3 mb-8">
                {EXPERIENCE.map((exp) => (
                  <div
                    key={exp.period}
                    className="flex items-baseline gap-4"
                    style={{ borderBottom: "1px solid var(--fg-4)", paddingBottom: 12 }}
                  >
                    <span
                      className="font-mono text-[10px] tracking-[0.04em] tabular-nums shrink-0"
                      style={{ color: "var(--fg-3)", width: 80 }}
                    >
                      {exp.period}
                    </span>
                    <span className="text-[13px]" style={{ color: "var(--fg)" }}>
                      {exp.role}
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--fg-2)" }}>
                      {exp.desc}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Skills / tools */}
            <motion.div {...stagger(0.7)}>
              <span
                className="block font-mono text-[10px] tracking-[0.14em] uppercase mb-3"
                style={{ color: "var(--fg-3)" }}
              >
                Proficiencies
              </span>
              <div className="flex gap-2 flex-wrap">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[9px] uppercase tracking-[0.08em] px-2.5 py-1 border rounded-sm"
                    style={{ color: "var(--fg-3)", borderColor: "var(--fg-4)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom decorative */}
      <div
        className="absolute bottom-6 left-[clamp(32px,8vw,96px)] right-[clamp(32px,8vw,96px)] z-20 flex justify-between"
      >
        <span className="font-mono text-[10px] tracking-[0.06em]" style={{ color: "var(--fg-3)" }}>
          New York
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M24 0L24 8M24 0L16 0" stroke="var(--accent-warm-1)" strokeWidth="0.75" opacity="0.3" />
          <path d="M0 24L0 16M0 24L8 24" stroke="var(--accent-warm-1)" strokeWidth="0.75" opacity="0.15" />
        </svg>
      </div>
    </main>
  );
}
