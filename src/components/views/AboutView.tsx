"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const anim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

const stats: [string, string][] = [
  ["LOCATION", "New York"],
  ["FOCUS", "Design Engineering"],
  ["EXPERIENCE", "3+ years"],
  ["STATUS", "Available"],
];

const experience = [
  { period: "2024 —", role: "Freelance Design Engineer" },
  { period: "2023 — 24", role: "Design Technologist" },
  { period: "2021 — 23", role: "Frontend Developer" },
];

export default function AboutView() {
  return (
    <motion.div {...anim}>
      {/* 1. Label */}
      <span
        className="block font-mono uppercase"
        style={{
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.08em",
          lineHeight: 1,
          color: "var(--fg-3)",
          marginBottom: 16,
        }}
      >
        PROFILE
      </span>

      {/* 2. Lead */}
      <h1
        className="font-display"
        style={{
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          color: "var(--fg)",
          maxWidth: 320,
          margin: 0,
        }}
      >
        Design engineer building at the intersection of craft and systems
        thinking.
      </h1>

      {/* 3. Body */}
      <p
        className="font-body"
        style={{
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: "-0.005em",
          lineHeight: 1.7,
          color: "var(--fg-2)",
          maxWidth: 280,
          margin: 0,
          marginTop: 16,
        }}
      >
        I care about type, motion, and the invisible details that make digital
        products feel considered.
      </p>

      {/* 4. Divider */}
      <div
        style={{
          height: 1,
          background: "var(--fg-4)",
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      {/* 5. Stats grid */}
      <div
        className="font-mono uppercase"
        style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr",
          gap: "8px 16px",
          fontSize: 9,
          fontWeight: 400,
          letterSpacing: "0.06em",
          lineHeight: 1.8,
        }}
      >
        {stats.map(([key, value]) => (
          <Fragment key={key}>
            <span style={{ color: "var(--fg-3)" }}>{key}</span>
            <span style={{ color: "var(--fg-2)" }}>{value}</span>
          </Fragment>
        ))}
      </div>

      {/* 6. Divider */}
      <div
        style={{
          height: 1,
          background: "var(--fg-4)",
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      {/* 7. Experience */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {experience.map((e) => (
          <div key={e.period} style={{ display: "flex" }}>
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                fontWeight: 400,
                letterSpacing: "0.06em",
                lineHeight: 1.8,
                fontVariantNumeric: "tabular-nums",
                width: 80,
                flexShrink: 0,
                color: "var(--fg-3)",
              }}
            >
              {e.period}
            </span>
            <span
              className="font-body"
              style={{
                fontSize: 11,
                fontWeight: 400,
                lineHeight: 1.6,
                color: "var(--fg)",
              }}
            >
              {e.role}
            </span>
          </div>
        ))}
      </div>

      {/* 8. Divider */}
      <div
        style={{
          height: 1,
          background: "var(--fg-4)",
          marginTop: 24,
          marginBottom: 24,
        }}
      />

      {/* 9. Email */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-body block"
        style={{
          fontSize: 11,
          fontWeight: 400,
          lineHeight: 1.6,
          color: "var(--fg-2)",
          textDecoration: "none",
        }}
      >
        {CONTACT_EMAIL}
      </a>

      {/* 10. Socials */}
      <div
        className="flex"
        style={{ gap: 12, marginTop: 12 }}
      >
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono uppercase"
            style={{
              fontSize: 8,
              fontWeight: 400,
              letterSpacing: "0.06em",
              lineHeight: 1,
              color: "var(--fg-3)",
              textDecoration: "none",
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
