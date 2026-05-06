"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { PIECES, type Piece } from "@/constants/pieces";
import CaseHero from "@/components/case/CaseHero";
import { EDITORIAL } from "@/components/case/editorial";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * /work/[slug] — Case Study page per spec §07.
 *
 * Anatomy, top to bottom:
 *
 *   HERO         full-width cover (image or click-to-play video)
 *   TITLE BLOCK  eyebrow · display title · description subtitle
 *   LEDGER       4-column metadata grid (Role · Sector · Year · Status)
 *   BODY         editorial prose with optional margin annotations
 *   NEXT         hairline-separated link to the next real piece
 *
 * Scroll reveals: every <section class="case-reveal"> fades in 0.88 → 1
 * and translateY(5px) → 0 over 300ms cubic-bezier(0.33, 0, 0, 1) when
 * it crosses the viewport, staggered 60ms (capped at 4). Forward-only:
 * once revealed, sections stay revealed even when scrolled out of view.
 * `prefers-reduced-motion` disables transforms and reveals everything
 * immediately.
 *
 * Editorial copy is keyed by slug in EDITORIAL. Slugs without an entry
 * render a stub body — the template still renders cleanly for any
 * piece in PIECES.
 */

export default function WorkDetailPage() {
  const params = useParams<{ slug: string }>();
  const piece = useMemo(
    () => PIECES.find((p) => p.slug === params?.slug && !p.placeholder),
    [params?.slug],
  );

  if (!piece) return <NotFound />;
  return <CaseStudyPage piece={piece} />;
}

/* ─── Page ───────────────────────────────────────────────────────────── */

function CaseStudyPage({ piece }: { piece: Piece }) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Resolve the next real piece in PIECES order, skipping placeholders
  // and wrapping to the start when at the end of the list.
  const nextPiece = useMemo<Piece>(() => {
    const sorted = [...PIECES]
      .filter((p) => !p.placeholder)
      .sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((p) => p.slug === piece.slug);
    return sorted[(idx + 1) % sorted.length] ?? piece;
  }, [piece]);

  const editorial = EDITORIAL[piece.slug];
  const eyebrowSection = `§${String(piece.order).padStart(2, "0")}`;
  const status = piece.status === "wip" ? "In progress" : "Shipped";

  // Scroll reveals — IntersectionObserver scoped to the page container.
  // Stagger the first 4 sections by 60ms; remaining sections reveal
  // without a delay so a long scroll doesn't accumulate latency.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(".case-reveal"),
    );

    if (reduced) {
      targets.forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    targets.forEach((el, i) => {
      const stagger = Math.min(i, 3) * 60;
      el.style.setProperty("--reveal-delay", `${stagger}ms`);
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            !entry.target.hasAttribute("data-revealed")
          ) {
            entry.target.setAttribute("data-revealed", "");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduced, piece.slug]);

  return (
    <main id="main">
      <article ref={containerRef} className="case">
        {/* HERO ─────────────────────────────────────────────────────── */}
        <section className="case__hero case-reveal" aria-label="Cover">
          <CaseHero piece={piece} />
        </section>

        {/* TITLE BLOCK ──────────────────────────────────────────────── */}
        <section className="case__title-block case-reveal" aria-label="Project">
          <p className="case__eyebrow">
            <span>Work</span>
            <span className="case__eyebrow-sep" aria-hidden>·</span>
            <span>{eyebrowSection}</span>
            <span className="case__eyebrow-sep" aria-hidden>·</span>
            <span className="tabular">{piece.year}</span>
          </p>
          <h1
            className="case__title"
            style={
              { viewTransitionName: `work-title-${piece.slug}` } as React.CSSProperties
            }
          >
            {piece.title}
          </h1>
          <p className="case__sub">{piece.description}</p>
        </section>

        {/* LEDGER ───────────────────────────────────────────────────── */}
        <section
          className="case__ledger-block case-reveal"
          aria-label="Project ledger"
        >
          <dl className="case__ledger">
            <LedgerCell
              label="Role"
              value={editorial?.role ?? "Design + Development"}
            />
            <LedgerCell label="Sector" value={piece.sector} />
            <LedgerCell label="Year" value={String(piece.year)} mono />
            <LedgerCell label="Status" value={status} />
          </dl>
        </section>

        {/* BODY — editorial prose ──────────────────────────────────── */}
        <section className="case__body case-reveal" aria-label="Editorial">
          {editorial?.blocks?.length ? (
            editorial.blocks.map((block, i) => (
              <div key={i} className="case__paragraph">
                {block.annotation && (
                  <span className="case__annotation" aria-hidden>
                    {block.annotation}
                  </span>
                )}
                <p className="case__prose">{block.paragraph}</p>
              </div>
            ))
          ) : (
            <div className="case__paragraph">
              <p className="case__prose">
                A longer write-up is in progress. For now this entry stands as
                a placeholder while the editorial copy and supporting plates
                are prepared.
              </p>
            </div>
          )}
        </section>

        {/* NEXT ─────────────────────────────────────────────────────── */}
        <section className="case__next-block case-reveal" aria-label="Next project">
          <Link
            href={`/work/${nextPiece.slug}`}
            className="case__next"
            aria-label={`Next project — ${nextPiece.title}`}
          >
            <span className="case__next-label">Next</span>
            <span className="case__next-title">{nextPiece.title}</span>
            <span className="case__next-arrow arrow-glyph" aria-hidden>→</span>
          </Link>
        </section>
      </article>

      <PageStyle />
    </main>
  );
}

/* ─── Subcomponents ──────────────────────────────────────────────────── */

function LedgerCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="case__ledger-cell">
      <dt className="case__ledger-key">{label}</dt>
      <dd className={`case__ledger-val${mono ? " tabular" : ""}`}>{value}</dd>
    </div>
  );
}

function NotFound() {
  return (
    <main id="main" className="work-404">
      <p className="eyebrow">
        <span>Work</span>
        <span className="eyebrow__sep">·</span>
        <span>Not found</span>
      </p>
      <p className="work-404__body">
        No plate at that address.{" "}
        <Link href="/" className="work-404__link">
          Return to the index
        </Link>
        .
      </p>
      <style>{`
        .work-404 {
          min-height: 100svh;
          padding: clamp(96px, 14vh, 160px) var(--margin-page);
          display: grid;
          gap: 20px;
          place-content: center;
        }
        .work-404__body {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: 17px;
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 40ch;
        }
        .work-404__link {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
        }
        .work-404__link:hover { border-bottom-color: var(--ink); }
      `}</style>
    </main>
  );
}

/* ─── Style ──────────────────────────────────────────────────────────── */

function PageStyle() {
  return (
    <style>{`
      .case {
        max-width: 1080px;
        margin-inline: auto;
        padding:
          clamp(96px, 14vh, 160px)
          var(--margin-page)
          clamp(64px, 10vh, 120px);
        display: grid;
        gap: var(--space-section);
      }

      /* ─── HERO ─────────────────────────────────────────────────── */
      .case__hero {
        max-width: 960px;
        margin-inline: auto;
        width: 100%;
      }

      /* ─── TITLE BLOCK ──────────────────────────────────────────── */
      .case__title-block {
        display: grid;
        gap: 18px;
        max-width: 720px;
      }
      .case__eyebrow {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 10px;
        font-family: var(--font-stack-sans);
        font-size: var(--type-nav);
        line-height: 1;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-3);
        font-variant-numeric: tabular-nums;
        margin: 0;
      }
      .case__eyebrow-sep { color: var(--ink-4); }

      .case__title {
        font-family: var(--font-stack-sans);
        font-size: var(--type-display);
        font-weight: 380;
        line-height: 1.05;
        letter-spacing: var(--track-display);
        color: var(--ink);
        margin: 0;
        text-wrap: balance;
      }
      .case__sub {
        font-family: var(--font-stack-sans);
        font-size: var(--type-body);
        line-height: 1.55;
        color: var(--ink-2);
        max-width: 56ch;
        margin: 0;
        text-wrap: pretty;
      }

      /* ─── LEDGER ───────────────────────────────────────────────── */
      .case__ledger-block {
        display: block;
      }
      .case__ledger {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: clamp(20px, 3vw, 40px);
        margin: 0;
        padding: clamp(20px, 2.4vw, 28px) 0;
        border-top: 1px solid var(--ink-hair);
        border-bottom: 1px solid var(--ink-hair);
      }
      .case__ledger-cell {
        display: grid;
        gap: 8px;
        align-content: start;
      }
      .case__ledger-key {
        font-family: var(--font-stack-sans);
        font-size: var(--type-nav);
        line-height: 1;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-3);
        margin: 0;
      }
      .case__ledger-val {
        font-family: var(--font-stack-mono);
        font-size: var(--type-number);
        line-height: 1.4;
        letter-spacing: 0.02em;
        color: var(--ink-2);
        margin: 0;
        font-variant-numeric: tabular-nums lining-nums;
      }

      /* ─── BODY ─────────────────────────────────────────────────── */
      .case__body {
        display: grid;
        gap: clamp(28px, 3.4vw, 44px);
        max-width: 720px;
      }
      /* On desktop, an annotation column floats out to the left of the
         reading column. On narrower widths, it stacks above the prose. */
      .case__paragraph {
        position: relative;
        display: grid;
        gap: 10px;
      }
      .case__annotation {
        font-family: var(--font-stack-sans);
        font-size: var(--type-nav);
        line-height: 1.4;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-4);
      }
      .case__prose {
        font-family: var(--font-stack-serif);
        font-weight: 400;
        font-size: var(--type-prose);
        line-height: 1.7;
        color: var(--ink-2);
        margin: 0;
        max-width: 62ch;
        font-feature-settings: "onum" on;
        hanging-punctuation: first last;
        text-wrap: pretty;
      }

      @media (min-width: 960px) {
        .case__paragraph {
          grid-template-columns: 140px minmax(0, 1fr);
          gap: 24px;
          align-items: baseline;
        }
        .case__annotation {
          /* Margin annotation — tucks slightly above the first line so
             it reads as a running label, not a heading. */
          padding-top: 4px;
          margin-left: -164px;
          width: 140px;
        }
        /* When an annotation is present, the prose still anchors to the
           reading column. The grid handles the alignment. */
        .case__paragraph:has(> .case__annotation) {
          margin-left: 0;
        }
      }

      /* ─── NEXT ─────────────────────────────────────────────────── */
      .case__next-block {
        margin-top: var(--space-section);
        padding-top: var(--space-section);
        border-top: 1px solid var(--ink-hair);
      }
      .case__next {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: baseline;
        gap: 18px;
        padding: 4px 0;
        color: var(--ink);
      }
      .case__next-label {
        font-family: var(--font-stack-sans);
        font-size: var(--type-nav);
        line-height: 1;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-3);
      }
      .case__next-title {
        font-family: var(--font-stack-sans);
        font-size: var(--type-title);
        font-weight: 400;
        line-height: 1.2;
        letter-spacing: var(--track-heading);
        color: var(--ink);
      }
      .case__next-arrow {
        font-family: var(--font-stack-sans);
        font-size: 18px;
        color: var(--ink-3);
      }
      .case__next:hover .case__next-arrow { color: var(--ink); }

      /* ─── Reveals ──────────────────────────────────────────────── */
      .case-reveal {
        opacity: 0.88;
        transform: translateY(5px);
        transition:
          opacity 300ms cubic-bezier(0.33, 0, 0, 1),
          transform 300ms cubic-bezier(0.33, 0, 0, 1);
        transition-delay: var(--reveal-delay, 0ms);
        will-change: opacity, transform;
      }
      .case-reveal[data-revealed] {
        opacity: 1;
        transform: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .case-reveal,
        .case-reveal[data-revealed] {
          opacity: 1;
          transform: none;
          transition: none;
        }
      }

      /* ─── Mobile ───────────────────────────────────────────────── */
      @media (max-width: 768px) {
        .case { gap: clamp(40px, 8vw, 64px); }
        .case__ledger {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          padding: 20px 0;
        }
        .case__next {
          grid-template-columns: auto 1fr auto;
          gap: 12px;
        }
      }
    `}</style>
  );
}
