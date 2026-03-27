"use client";

import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.23, 0.88, 0.26, 0.92] as const },
};

export default function AboutPage() {
  return (
    <div data-page-scrollable>
      <section
        style={{
          padding: "clamp(80px, 12vh, 140px) 24px clamp(48px, 8vh, 80px)",
          maxWidth: 680,
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
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
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            color: "var(--ink-primary)",
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
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            color: "var(--ink-secondary)",
            maxWidth: "58ch",
            letterSpacing: "-0.01em",
          }}
        >
          Previously, I worked on products across mobile, AI, and design systems. I believe the best digital work borrows from the rigor of print and the warmth of physical objects.
        </motion.p>

        <motion.p
          {...fadeUp}
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            lineHeight: "var(--leading-body)",
            color: "var(--ink-muted)",
            letterSpacing: "var(--tracking-label)",
            maxWidth: "48ch",
            marginTop: 32,
          }}
        >
          When I&rsquo;m not pushing pixels, I&rsquo;m probably hunting for good light to photograph, reading about material science, or making pour-overs that take too long.
        </motion.p>

        <motion.div
          {...fadeUp}
          style={{ height: 1, backgroundColor: "rgba(var(--ink-rgb), 0.06)", marginTop: 40, marginBottom: 32 }}
        />

        <motion.div {...fadeUp}>
          <span
            className="font-mono"
            style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)", display: "block", marginBottom: 16 }}
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
                <span className="font-mono" style={{ fontSize: "var(--text-meta)", color: "var(--ink-muted)" }}>{exp.period}</span>
                <span style={{ fontSize: "var(--text-body)", color: "var(--ink-secondary)", lineHeight: "1.5", letterSpacing: "-0.01em" }}>
                  <span style={{ color: "var(--ink-secondary)" }}>{exp.role}</span> &mdash; {exp.desc}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ height: 1, backgroundColor: "rgba(var(--ink-rgb), 0.06)", marginTop: 40, marginBottom: 32 }} />

        <motion.div {...fadeUp}>
          <span className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)", display: "block", marginBottom: 16 }}>
            Get in touch
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{ fontSize: "var(--text-body)", letterSpacing: "-0.01em", color: "var(--ink-primary)", textDecoration: "none" }}
          >
            {CONTACT_EMAIL}
          </a>
          <p className="font-mono" style={{ fontSize: "var(--text-meta)", color: "var(--ink-muted)", letterSpacing: "var(--tracking-label)", marginTop: 8 }}>
            New York &middot; Available for select projects
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={{ marginTop: 24 }}>
          <span className="font-mono" style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)", marginRight: 16 }}>
            See also:
          </span>
          {SOCIALS.map((link, i) => (
            <span key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono"
                style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)", textDecoration: "none" }}
              >
                {link.label}
              </a>
              {i < SOCIALS.length - 1 && (
                <span className="font-mono" style={{ fontSize: "var(--text-meta)", color: "var(--ink-muted)", margin: "0 8px" }}>·</span>
              )}
            </span>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
