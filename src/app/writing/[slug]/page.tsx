"use client";

import { use, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { JOURNAL_ENTRIES } from "@/constants/journal";

/** Only entries with a body can have detail pages */
const LONG_ENTRIES = JOURNAL_ENTRIES.filter((e) => !!e.body);

export default function WritingEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const contentRef = useRef<HTMLDivElement>(null);

  const entry = JOURNAL_ENTRIES.find((e) => e.id === slug);
  const currentIndex = LONG_ENTRIES.findIndex((e) => e.id === slug);
  const nextEntry =
    currentIndex < LONG_ENTRIES.length - 1
      ? LONG_ENTRIES[currentIndex + 1]
      : LONG_ENTRIES[0];

  useEffect(() => {
    if (!contentRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = contentRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "expo.out" }
    );
  }, [slug]);

  if (!entry || !entry.body) {
    return (
      <main
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--ink-secondary)" }}>Entry not found.</p>
      </main>
    );
  }

  const paragraphs = entry.body.split("\n\n");

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "var(--space-breath)",
        paddingBottom: "var(--space-breath)",
      }}
    >
      <div
        ref={contentRef}
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          maxWidth: "var(--max-text)",
        }}
      >
        {/* Back link */}
        <Link
          href="/writing"
          data-reveal
          className="font-mono"
          style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            display: "inline-block",
            marginBottom: "clamp(2rem, 4vh, 3rem)",
            transition: "color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Writing
        </Link>

        {/* Title */}
        <h1
          data-reveal
          className="font-display"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
            color: "var(--ink-full)",
            lineHeight: 1.1,
            fontStyle: "italic",
          }}
        >
          {entry.title}
        </h1>

        {/* Date + tags */}
        <div
          data-reveal
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "clamp(1rem, 2vh, 1.5rem)",
            marginBottom: "clamp(2rem, 4vh, 3rem)",
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

        {/* Body */}
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            data-reveal
            style={{
              fontSize: "var(--text-body)",
              color: "var(--ink-full)",
              lineHeight: 1.7,
              marginBottom: i < paragraphs.length - 1 ? "1.5rem" : 0,
            }}
          >
            {paragraph}
          </p>
        ))}

        {/* Next entry */}
        {nextEntry && nextEntry.id !== entry.id && (
          <Link
            href={`/writing/${nextEntry.id}`}
            data-reveal
            style={{
              display: "block",
              marginTop: "clamp(4rem, 8vh, 6rem)",
              paddingTop: "clamp(2rem, 4vh, 3rem)",
              borderTop: `1px solid rgba(var(--ink-rgb), 0.08)`,
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
              }}
            >
              Next
            </span>
            <span
              className="font-display"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--ink-full)",
                fontStyle: "italic",
                display: "block",
                marginTop: "0.5rem",
              }}
            >
              {nextEntry.title}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "var(--ink-muted)",
                display: "block",
                marginTop: "0.25rem",
              }}
            >
              {nextEntry.date}
            </span>
          </Link>
        )}
      </div>
    </main>
  );
}
