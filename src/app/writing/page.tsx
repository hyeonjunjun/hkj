"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { JOURNAL_ENTRIES, type JournalTag } from "@/constants/journal";

const ALL_TAGS: (JournalTag | "all")[] = ["all", "design", "code", "life"];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.23, 0.88, 0.26, 0.92] as const },
};

export default function WritingPage() {
  const [activeTag, setActiveTag] = useState<JournalTag | "all">("all");

  const filtered =
    activeTag === "all"
      ? JOURNAL_ENTRIES
      : JOURNAL_ENTRIES.filter((e) => e.tags.includes(activeTag));

  return (
    <div data-page-scrollable>
      <div
        style={{
          padding: "clamp(80px, 12vh, 140px) 24px clamp(48px, 8vh, 80px)",
          maxWidth: 680,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "clamp(2rem, 4vh, 3rem)" }}
        >
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              color: "var(--ink-full)",
              lineHeight: 1.1,
              fontStyle: "italic",
              margin: "0 0 12px",
            }}
          >
            Writing
          </h1>
          <p style={{ fontSize: "var(--text-body)", color: "var(--ink-secondary)", maxWidth: "40ch", margin: 0 }}>
            Notes, observations, and things I&rsquo;ve learned along the way.
          </p>
        </motion.div>

        {/* Tag filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ display: "flex", gap: 20, marginBottom: "clamp(2rem, 4vh, 3rem)" }}
        >
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="font-mono"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: activeTag === tag ? "var(--ink-full)" : "var(--ink-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "color 150ms ease",
              }}
            >
              {tag === "all" ? "All" : tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Entry list */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTag} {...fadeUp}>
            {filtered.map((entry, i) => {
              const isLong = !!entry.body;
              return (
                <div
                  key={entry.id}
                  style={{
                    paddingTop: i === 0 ? 0 : "clamp(1.5rem, 3vh, 2rem)",
                    paddingBottom: "clamp(1.5rem, 3vh, 2rem)",
                    borderBottom: "1px solid rgba(var(--ink-rgb), 0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span className="font-mono" style={{ fontSize: 10, color: "var(--ink-muted)" }}>{entry.date}</span>
                    {entry.tags.map((tag) => (
                      <span key={tag} className="font-mono" style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-muted)" }}>{tag}</span>
                    ))}
                  </div>

                  {isLong ? (
                    <Link
                      href={`/writing/${entry.id}`}
                      className="font-display"
                      style={{ fontSize: "var(--text-body)", color: "var(--ink-full)", lineHeight: 1.3, fontStyle: "italic", display: "block", marginBottom: 8, textDecoration: "none" }}
                    >
                      {entry.title}
                    </Link>
                  ) : (
                    <span className="font-display" style={{ fontSize: "var(--text-body)", color: "var(--ink-full)", lineHeight: 1.3, fontStyle: "italic", display: "block", marginBottom: 8 }}>
                      {entry.title}
                    </span>
                  )}

                  <p style={{ fontSize: 14, color: "var(--ink-secondary)", lineHeight: 1.7, margin: 0 }}>{entry.excerpt}</p>

                  {isLong && (
                    <Link
                      href={`/writing/${entry.id}`}
                      className="font-mono"
                      style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--ink-muted)", marginTop: 12, display: "inline-block", textDecoration: "none" }}
                    >
                      Read
                    </Link>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
