"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const anim = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.3 },
};

const stats: [string, string][] = [
  ["Location", "New York"],
  ["Focus", "Design Engineering"],
  ["Experience", "3+ years"],
  ["Status", "Available"],
];

const experience = [
  {
    period: "2024 —",
    role: "Freelance Design Engineer",
    desc: "Digital products and brand experiences for select clients.",
  },
  {
    period: "2023 — 24",
    role: "Design Technologist",
    desc: "Bridging design and engineering on product teams.",
  },
  {
    period: "2021 — 23",
    role: "Frontend Developer",
    desc: "Interfaces and design systems at scale.",
  },
];

function Divider() {
  return (
    <div
      style={{
        height: 1,
        width: 32,
        background: "var(--fg-4)",
        marginTop: 28,
        marginBottom: 24,
      }}
    />
  );
}

export default function AboutView() {
  return (
    <motion.div className="w-full" {...anim}>
      {/* Profile label */}
      <span
        className="font-mono uppercase block"
        style={{
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "var(--fg-3)",
          marginBottom: 16,
        }}
      >
        Profile
      </span>

      {/* Lead paragraph */}
      <p
        className="font-display"
        style={{
          fontSize: "clamp(26px, 3vw, 34px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          color: "var(--fg)",
          maxWidth: 440,
        }}
      >
        Design engineer building at the intersection of craft and systems
        thinking.
      </p>

      {/* Body */}
      <p
        className="font-body"
        style={{
          fontSize: 14,
          lineHeight: 1.75,
          letterSpacing: "-0.005em",
          color: "var(--fg-2)",
          maxWidth: 360,
          marginTop: 16,
        }}
      >
        I care about type, motion, and the invisible details that make digital
        products feel considered. Currently based in New York, open to
        collaboration.
      </p>

      <Divider />

      {/* Stats grid */}
      <div
        className="grid font-mono uppercase"
        style={{
          gridTemplateColumns: "80px 1fr",
          gap: "8px 16px",
          fontSize: 9,
          letterSpacing: "0.06em",
        }}
      >
        {stats.map(([key, value]) => (
          <Fragment key={key}>
            <span style={{ color: "var(--fg-3)" }}>{key}</span>
            <span style={{ color: "var(--fg-2)" }}>{value}</span>
          </Fragment>
        ))}
      </div>

      <Divider />

      {/* Experience */}
      <div className="flex flex-col" style={{ gap: 16 }}>
        {experience.map((entry) => (
          <div key={entry.period} className="flex" style={{ gap: 16 }}>
            <span
              className="font-mono shrink-0"
              style={{
                fontSize: 9,
                letterSpacing: "0.04em",
                fontVariantNumeric: "tabular-nums",
                width: 80,
                color: "var(--fg-3)",
                paddingTop: 3,
              }}
            >
              {entry.period}
            </span>
            <div>
              <div
                className="font-body"
                style={{ fontSize: 14, letterSpacing: "-0.005em", color: "var(--fg)" }}
              >
                {entry.role}
              </div>
              <div
                className="font-body"
                style={{
                  fontSize: 12,
                  letterSpacing: "0",
                  color: "var(--fg-3)",
                  marginTop: 2,
                  lineHeight: 1.5,
                }}
              >
                {entry.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* Contact */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-mono block"
        style={{
          fontSize: 10,
          letterSpacing: "0.02em",
          color: "var(--fg-2)",
        }}
      >
        {CONTACT_EMAIL}
      </a>

      {/* Social links */}
      <div className="flex" style={{ gap: 16, marginTop: 12 }}>
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono uppercase"
            style={{
              fontSize: 8,
              letterSpacing: "0.06em",
              color: "var(--fg-3)",
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
