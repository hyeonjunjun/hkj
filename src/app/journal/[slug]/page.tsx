"use client";

import { use, useRef, useEffect } from "react";
import TransitionLink from "@/components/TransitionLink";
import { gsap } from "@/lib/gsap";
import { REVEAL_CONTENT } from "@/lib/animations";
import { JOURNAL_ENTRIES } from "@/constants/journal";

/** Only entries with a body can have detail pages */
const LONG_ENTRIES = JOURNAL_ENTRIES.filter((e) => !!e.body);

export default function JournalEntryPage({
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
    gsap.fromTo(items, REVEAL_CONTENT.from, { ...REVEAL_CONTENT.to });
  }, [slug]);

  if (!entry || !entry.body) {
    return (
      <main
        className="flex items-center justify-center"
        style={{ height: "100vh", backgroundColor: "var(--color-bg)" }}
      >
        <p style={{ color: "var(--color-text-dim)" }}>Entry not found.</p>
      </main>
    );
  }

  const paragraphs = entry.body.split("\n\n");

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        paddingTop: "var(--page-pt)",
        paddingBottom: "var(--section-py)",
      }}
    >
      <div
        ref={contentRef}
        className="section-padding"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* Back link */}
        <TransitionLink
          href="/journal"
          data-reveal
          className="font-mono uppercase"
          style={{
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "var(--color-text-ghost)",
            display: "inline-block",
            marginBottom: "clamp(2rem, 4vh, 3rem)",
            transition: "color 200ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          Journal
        </TransitionLink>

        {/* Title */}
        <h1
          data-reveal
          className="font-display italic"
          style={{
            fontSize: "var(--text-display)",
            color: "var(--color-text)",
            lineHeight: 1.1,
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

        {/* Body */}
        {paragraphs.map((paragraph, i) => (
          <p
            key={i}
            data-reveal
            style={{
              fontSize: "var(--text-body)",
              color: "var(--color-text)",
              lineHeight: 1.7,
              marginBottom: i < paragraphs.length - 1 ? "1.5rem" : 0,
            }}
          >
            {paragraph}
          </p>
        ))}

        {/* Next entry */}
        {nextEntry && nextEntry.id !== entry.id && (
          <TransitionLink
            href={`/journal/${nextEntry.id}`}
            data-reveal
            style={{
              display: "block",
              marginTop: "clamp(4rem, 8vh, 6rem)",
              paddingTop: "clamp(2rem, 4vh, 3rem)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                color: "var(--color-text-ghost)",
              }}
            >
              Next
            </span>
            <span
              className="font-display italic"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-text)",
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
                color: "var(--color-text-ghost)",
                display: "block",
                marginTop: "0.25rem",
              }}
            >
              {nextEntry.date}
            </span>
          </TransitionLink>
        )}
      </div>
    </main>
  );
}
