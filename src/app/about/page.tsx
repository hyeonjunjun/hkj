"use client";

import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";
import TransitionLink from "@/components/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.23, 0.88, 0.26, 0.92] as const },
};

export default function AboutPage() {
  return (
    <div data-page-scrollable>
      {/* ── Nav ── */}
      <nav className="detail-nav" data-nav-stagger="0">
        <TransitionLink href="/" className="nav-mark">
          HKJ
        </TransitionLink>
        <div className="nav-links">
          <ThemeToggle />
          <TransitionLink href="/about" className="active">About</TransitionLink>
        </div>
      </nav>

      <section
        style={{
          padding: "clamp(80px, 12vh, 140px) var(--pad) clamp(48px, 8vh, 80px)",
          maxWidth: 680,
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            display: "block",
            marginBottom: 32,
          }}
        >
          About
        </motion.span>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 3vw, 32px)",
            lineHeight: 1.3,
            color: "var(--fg)",
            marginBottom: 20,
            maxWidth: "58ch",
            letterSpacing: "-0.01em",
          }}
        >
          HKJ is a one-person design engineering practice based in New York. I care about type, motion, and the invisible details that make software feel intentional.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--fg-2)",
            maxWidth: "54ch",
            letterSpacing: "-0.01em",
          }}
        >
          Previously, I worked on products across mobile, AI, and design systems. I believe the best digital work borrows from the rigor of print and the warmth of physical objects.
        </motion.p>

        <motion.p
          {...fadeUp}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            lineHeight: 1.7,
            color: "var(--fg-3)",
            letterSpacing: "0.04em",
            maxWidth: "48ch",
            marginTop: 32,
          }}
        >
          When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for good light to photograph, reading about material science, or making pour-overs that take too long.
        </motion.p>

        <motion.div
          {...fadeUp}
          style={{ height: 1, backgroundColor: "var(--fg-4)", marginTop: 40, marginBottom: 32 }}
        />

        <motion.div {...fadeUp}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              display: "block",
              marginBottom: 16,
            }}
          >
            Experience
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { period: "2024–", role: "HKJ Studio", desc: "Independent design engineering" },
              { period: "2023–24", role: "Product", desc: "Mobile & AI products" },
              { period: "2022–23", role: "Design Systems", desc: "Component architecture & tokens" },
            ].map((exp) => (
              <div key={exp.period} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.04em" }}>
                  {exp.period}
                </span>
                <span style={{ fontSize: 15, color: "var(--fg-2)", lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                  <span style={{ color: "var(--fg)" }}>{exp.role}</span> &mdash; {exp.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ height: 1, backgroundColor: "var(--fg-4)", marginTop: 40, marginBottom: 32 }} />

        <motion.div {...fadeUp}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            display: "block",
            marginBottom: 16,
          }}>
            Get in touch
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{ fontSize: 15, letterSpacing: "-0.01em", color: "var(--fg)", textDecoration: "none" }}
          >
            {CONTACT_EMAIL}
          </a>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--fg-3)",
            letterSpacing: "0.04em",
            marginTop: 8,
          }}>
            New York &middot; Available for select projects
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={{ marginTop: 24 }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            marginRight: 16,
          }}>
            See also:
          </span>
          {SOCIALS.map((link, i) => (
            <span key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  textDecoration: "none",
                  transition: "color 0.3s",
                }}
              >
                {link.label}
              </a>
              {i < SOCIALS.length - 1 && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-3)", margin: "0 8px" }}>·</span>
              )}
            </span>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
