"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { PIECES, type Piece } from "@/constants/pieces";
import CaseHero from "@/components/case/CaseHero";
import { EDITORIAL } from "@/components/case/editorial";
import Footer from "@/components/Footer";

/**
 * /work/[slug] — Case Study page (Aino × HS68 line).
 *
 *   HERO         full-width cover
 *   TITLE BLOCK  eyebrow · display title · description
 *   LEDGER       4-column metadata strip
 *   BODY         editorial prose, sans-only, single column
 *   NEXT         hairline-separated link to next real piece
 *
 * Subtractions vs. earlier version: no margin annotations, no scroll
 * reveals, no serif body, no view-transition title morph. Restraint
 * is the position — match the reference register.
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

function CaseStudyPage({ piece }: { piece: Piece }) {
  const nextPiece = useMemo<Piece>(() => {
    const sorted = [...PIECES]
      .filter((p) => !p.placeholder)
      .sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((p) => p.slug === piece.slug);
    return sorted[(idx + 1) % sorted.length] ?? piece;
  }, [piece]);

  const editorial = EDITORIAL[piece.slug];
  const eyebrowSection = String(piece.order).padStart(2, "0");
  const status = piece.status === "wip" ? "In progress" : "Shipped";

  return (
    <main id="main">
      <article className="case">
        <section className="case__hero" aria-label="Cover">
          <CaseHero piece={piece} />
        </section>

        <section className="case__title-block" aria-label="Project">
          <p className="case__eyebrow">
            <span>Work</span>
            <span className="case__sep" aria-hidden>·</span>
            <span className="tabular">{eyebrowSection}</span>
            <span className="case__sep" aria-hidden>·</span>
            <span className="tabular">{piece.year}</span>
          </p>
          <h1 className="case__title">{piece.title}</h1>
          <p className="case__sub">{piece.description}</p>
        </section>

        <section className="case__ledger-block" aria-label="Project ledger">
          <dl className="case__ledger">
            <LedgerCell label="Role"   value={editorial?.role ?? "Design + Development"} />
            <LedgerCell label="Sector" value={piece.sector} />
            <LedgerCell label="Year"   value={String(piece.year)} mono />
            <LedgerCell label="Status" value={status} />
          </dl>
        </section>

        <section className="case__body" aria-label="Editorial">
          {editorial?.blocks?.length ? (
            editorial.blocks.map((block, i) => (
              <p key={i} className="case__prose">{block.paragraph}</p>
            ))
          ) : (
            <p className="case__prose">
              A longer write-up is in progress. For now this entry stands
              as a placeholder while the editorial copy and supporting
              plates are prepared.
            </p>
          )}
        </section>

        <section className="case__next-block" aria-label="Next project">
          <Link href={`/work/${nextPiece.slug}`} className="case__next">
            <span className="case__next-label">Next</span>
            <span className="case__next-title">{nextPiece.title}</span>
            <span className="case__next-arrow" aria-hidden>→</span>
          </Link>
        </section>
      </article>

      <div className="case__footer-wrap">
        <Footer />
      </div>

      <PageStyle />
    </main>
  );
}

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
      <p className="work-404__eyebrow">
        <span>Work</span>
        <span className="work-404__sep" aria-hidden>·</span>
        <span>Not found</span>
      </p>
      <p className="work-404__body">
        No plate at that address.{" "}
        <Link href="/work" className="work-404__link">Return to the index</Link>.
      </p>
      <style>{`
        .work-404 {
          min-height: 100svh;
          padding: clamp(96px, 14vh, 160px) var(--margin-page);
          display: grid;
          gap: 20px;
          place-content: center;
        }
        .work-404__eyebrow {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          display: inline-flex;
          gap: 8px;
        }
        .work-404__sep { color: var(--ink-4); }
        .work-404__body {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-body);
          line-height: 1.6;
          color: var(--ink-2);
          max-width: 40ch;
        }
        .work-404__link {
          color: var(--ink);
          text-decoration: underline;
          text-decoration-color: var(--ink-hair);
          text-underline-offset: 3px;
          transition: text-decoration-color 180ms var(--ease);
        }
        .work-404__link:hover { text-decoration-color: var(--ink); }
      `}</style>
    </main>
  );
}

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

      .case__hero {
        max-width: 960px;
        margin-inline: auto;
        width: 100%;
      }

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
      .case__sep { color: var(--ink-4); }

      .case__title {
        font-family: var(--font-stack-sans);
        font-size: var(--type-display);
        font-weight: 380;
        line-height: 1.05;
        letter-spacing: -0.02em;
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

      .case__body {
        display: grid;
        gap: clamp(18px, 1.8vw, 26px);
        max-width: 56ch;
      }
      .case__prose {
        font-family: var(--font-stack-sans);
        font-weight: 400;
        font-size: var(--type-body);
        line-height: 1.65;
        color: var(--ink-2);
        margin: 0;
        text-wrap: pretty;
      }

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
        color: var(--ink);
      }
      .case__next-arrow {
        font-family: var(--font-stack-sans);
        font-size: 18px;
        color: var(--ink-3);
        transition: transform 200ms var(--ease), color 180ms var(--ease);
      }
      .case__next:hover .case__next-arrow {
        color: var(--ink);
        transform: translateX(6px);
      }

      .case__footer-wrap {
        max-width: 1080px;
        margin-inline: auto;
        padding: 0 var(--margin-page);
      }

      @media (max-width: 768px) {
        .case { gap: clamp(40px, 8vw, 64px); }
        .case__ledger {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          padding: 20px 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .case__next-arrow { transition: none; }
        .case__next:hover .case__next-arrow { transform: none; }
      }
    `}</style>
  );
}
