"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { JOURNAL_ENTRIES } from "@/constants/journal";

const LONG_ENTRIES = JOURNAL_ENTRIES.filter((e) => !!e.body);

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.23, 0.88, 0.26, 0.92] as const },
};

export default function WritingEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const entry = JOURNAL_ENTRIES.find((e) => e.id === slug);
  const currentIndex = LONG_ENTRIES.findIndex((e) => e.id === slug);
  const nextEntry =
    currentIndex < LONG_ENTRIES.length - 1
      ? LONG_ENTRIES[currentIndex + 1]
      : LONG_ENTRIES[0];

  if (!entry || !entry.body) {
    return (
      <div
        data-page-scrollable
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <p style={{ color: "var(--ink-secondary)" }}>Entry not found.</p>
      </div>
    );
  }

  const paragraphs = entry.body.split("\n\n");

  return (
    <div data-page-scrollable>
      <div
        style={{
          padding: "clamp(80px, 12vh, 140px) 24px clamp(48px, 8vh, 80px)",
          maxWidth: 680,
        }}
      >
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "clamp(2rem, 4vh, 3rem)" }}
        >
          <Link
            href="/writing"
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              textDecoration: "none",
            }}
          >
            ← Writing
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-display"
          style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            color: "var(--ink-full)",
            lineHeight: 1.1,
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {entry.title}
        </motion.h1>

        {/* Date + tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: "clamp(1rem, 2vh, 1.5rem)",
            marginBottom: "clamp(2rem, 4vh, 3rem)",
          }}
        >
          <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)" }}>{entry.date}</span>
          {entry.tags.map((tag) => (
            <span key={tag} className="font-mono" style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)" }}>{tag}</span>
          ))}
        </motion.div>

        {/* Body */}
        {paragraphs.map((paragraph, i) => (
          <motion.p
            key={i}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            style={{
              fontSize: "var(--text-body)",
              color: "var(--ink-full)",
              lineHeight: 1.7,
              marginBottom: i < paragraphs.length - 1 ? 24 : 0,
            }}
          >
            {paragraph}
          </motion.p>
        ))}

        {/* Next entry */}
        {nextEntry && nextEntry.id !== entry.id && (
          <motion.div {...fadeUp} style={{ marginTop: "clamp(4rem, 8vh, 6rem)", paddingTop: "clamp(2rem, 4vh, 3rem)", borderTop: "1px solid rgba(var(--ink-rgb), 0.08)" }}>
            <Link
              href={`/writing/${nextEntry.id}`}
              style={{ display: "block", textDecoration: "none" }}
            >
              <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)" }}>Next</span>
              <span className="font-display" style={{ fontSize: "var(--text-body)", color: "var(--ink-full)", fontStyle: "italic", display: "block", marginTop: 8 }}>
                {nextEntry.title}
              </span>
              <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)", display: "block", marginTop: 4 }}>{nextEntry.date}</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
