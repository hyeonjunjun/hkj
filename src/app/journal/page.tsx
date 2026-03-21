"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { REVEAL_CONTENT } from "@/lib/animations";
import TransitionLink from "@/components/TransitionLink";
import {
  JOURNAL_ENTRIES,
  type JournalTag,
} from "@/constants/journal";

const ALL_TAGS: (JournalTag | "all")[] = ["all", "design", "code", "life"];

export default function JournalPage() {
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
    gsap.fromTo(items, REVEAL_CONTENT.from, { ...REVEAL_CONTENT.to, delay: 0 });
  }, [activeTag]);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        paddingTop: "var(--page-pt)",
        paddingBottom: "var(--section-py)",
      }}
    >
      {/* Header */}
      <div
        className="section-padding"
        style={{ marginBottom: "clamp(2rem, 4vh, 3rem)" }}
      >
        <h1
          className="font-display italic"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.1,
          }}
        >
          Journal
        </h1>
        <p
          style={{
            fontSize: "var(--text-body)",
            color: "var(--color-text-dim)",
            marginTop: "0.75rem",
            maxWidth: "40ch",
          }}
        >
          Notes, observations, and things I&rsquo;ve learned along the way.
        </p>
      </div>

      {/* Tag filter */}
      <div
        className="section-padding"
        style={{
          display: "flex",
          gap: "1.25rem",
          marginBottom: "clamp(2rem, 4vh, 3rem)",
        }}
      >
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "var(--tracking-wider)",
              color:
                activeTag === tag
                  ? "var(--color-text)"
                  : "var(--color-text-ghost)",
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
      <div ref={listRef} className="section-padding" style={{ maxWidth: "var(--content-max)" }}>
        {filtered.map((entry, i) => {
          const isLong = !!entry.body;

          return (
            <div
              key={entry.id}
              data-journal-item
              style={{
                visibility: "hidden",
                paddingTop: i === 0 ? 0 : "clamp(1.5rem, 3vh, 2rem)",
                paddingBottom: "clamp(1.5rem, 3vh, 2rem)",
                borderBottom: "1px solid var(--color-border)",
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
                    color: "var(--color-text-ghost)",
                  }}
                >
                  {entry.date}
                </span>
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono uppercase"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.1em",
                      color: "var(--color-text-ghost)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              {isLong ? (
                <TransitionLink
                  href={`/journal/${entry.id}`}
                  className="font-display italic"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--color-text)",
                    lineHeight: 1.3,
                    display: "block",
                    marginBottom: "0.5rem",
                    transition:
                      "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {entry.title}
                </TransitionLink>
              ) : (
                <span
                  className="font-display italic"
                  style={{
                    fontSize: "var(--text-body)",
                    color: "var(--color-text)",
                    lineHeight: 1.3,
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
                  fontSize: "var(--text-small)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {entry.excerpt}
              </p>

              {/* Read link for long entries */}
              {isLong && (
                <TransitionLink
                  href={`/journal/${entry.id}`}
                  className="font-mono uppercase link-dim"
                  style={{
                    fontSize: "var(--text-micro)",
                    letterSpacing: "var(--tracking-wider)",
                    marginTop: "0.75rem",
                    display: "inline-block",
                  }}
                >
                  Read
                </TransitionLink>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
