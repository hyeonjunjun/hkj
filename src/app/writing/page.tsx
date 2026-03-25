"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { REVEAL_CONTENT } from "@/lib/animations";
import { JOURNAL_ENTRIES, type JournalTag } from "@/constants/journal";

const ALL_TAGS: (JournalTag | "all")[] = ["all", "design", "code", "life"];

export default function WritingPage() {
  const [activeTag, setActiveTag] = useState<JournalTag | "all">("all");
  const listRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeTag === "all"
      ? JOURNAL_ENTRIES
      : JOURNAL_ENTRIES.filter((e) => e.tags.includes(activeTag));

  useEffect(() => {
    if (!listRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = listRef.current.querySelectorAll("[data-journal-item]");
    gsap.fromTo(
      items,
      REVEAL_CONTENT.from,
      { ...REVEAL_CONTENT.to }
    );
  }, [activeTag]);

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "var(--space-breath)",
        paddingBottom: "var(--space-breath)",
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          marginBottom: "clamp(2rem, 4vh, 3rem)",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
            color: "var(--ink-full)",
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          Writing
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--ink-secondary)",
            marginTop: "0.75rem",
            maxWidth: "40ch",
          }}
        >
          Notes, observations, and things I&rsquo;ve learned along the way.
        </p>
      </div>

      {/* Tag filter */}
      <div
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          display: "flex",
          gap: "1.25rem",
          marginBottom: "clamp(2rem, 4vh, 3rem)",
        }}
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
              color:
                activeTag === tag ? "var(--ink-full)" : "var(--ink-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "color var(--duration-micro) var(--ease-micro)",
            }}
          >
            {tag === "all" ? "All" : tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Entry list */}
      <div
        ref={listRef}
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          maxWidth: "var(--max-text)",
        }}
      >
        {filtered.map((entry, i) => {
          const isLong = !!entry.body;

          return (
            <div
              key={entry.id}
              data-journal-item
              style={{
                paddingTop: i === 0 ? 0 : "clamp(1.5rem, 3vh, 2rem)",
                paddingBottom: "clamp(1.5rem, 3vh, 2rem)",
                borderBottom: `1px solid rgba(var(--ink-rgb), 0.08)`,
              }}
            >
              {/* Date + tags row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    color: "var(--ink-muted)",
                  }}
                >
                  {entry.date}
                </span>
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--ink-muted)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              {isLong ? (
                <Link
                  href={`/writing/${entry.id}`}
                  className="font-display"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--ink-full)",
                    lineHeight: 1.3,
                    fontStyle: "italic",
                    display: "block",
                    marginBottom: "0.5rem",
                    transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {entry.title}
                </Link>
              ) : (
                <span
                  className="font-display"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--ink-full)",
                    lineHeight: 1.3,
                    fontStyle: "italic",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  {entry.title}
                </span>
              )}

              {/* Excerpt */}
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--ink-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {entry.excerpt}
              </p>

              {/* Read link for long entries */}
              {isLong && (
                <Link
                  href={`/writing/${entry.id}`}
                  className="font-mono hover-step-muted"
                  style={{
                    fontSize: "var(--text-meta)",
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    marginTop: "0.75rem",
                    display: "inline-block",
                  }}
                >
                  Read
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
