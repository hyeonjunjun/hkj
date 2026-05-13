"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { PIECES, type Piece } from "@/constants/pieces";
import CaseHero from "@/components/case/CaseHero";
import { EDITORIAL } from "@/components/case/editorial";

/**
 * /work/[slug] — Case study, in the home's mono register.
 *
 *   HERO         full-width cover
 *   TITLE        eyebrow · code · year, then sentence-case title
 *                followed by description (lowercase prose)
 *   LEDGER       label/value rows (role, sector, year, status)
 *   BODY         editorial paragraphs, mono prose
 *   NEXT         hairline-separated link to next piece
 *
 * Mono-only typography throughout via the .t-* utility classes.
 * No sans, no italics, no inline-style typography.
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
  const code = String(piece.order).padStart(2, "0");
  const status =
    piece.status === "wip"
      ? "in progress"
      : piece.status === "concept"
        ? "concept"
        : "shipped";

  return (
    <main id="main">
      <article className="case">
        <header className="case__head">
          <p className="t-eyebrow case__eyebrow">
            <span>Work</span>
            <span className="t-sep">/</span>
            <span className="tabular">{code}</span>
            <span className="t-sep">/</span>
            <span className="tabular">{piece.year}</span>
          </p>
          <h1 className="t-display case__title">{piece.title}</h1>
          <p className="t-prose case__sub">{piece.description}</p>
        </header>

        <section className="case__hero" aria-label="Cover">
          <CaseHero piece={piece} />
        </section>

        <section className="case__ledger" aria-label="Project ledger">
          <Row label="Role" value={editorial?.role ?? "design + development"} />
          <Row label="Sector" value={piece.sector} />
          <Row label="Year" value={String(piece.year)} mono />
          <Row label="Status" value={status} />
        </section>

        <section className="case__body" aria-label="Editorial">
          {editorial?.blocks?.length ? (
            editorial.blocks.map((block, i) => (
              <p key={i} className="t-prose case__prose">
                {block.paragraph}
              </p>
            ))
          ) : (
            <p className="t-prose case__prose">
              a longer write-up is in progress. for now this entry
              stands as a placeholder while editorial copy and
              supporting plates are prepared.
            </p>
          )}
        </section>

        <hr className="t-rule" />

        <section className="case__next-block" aria-label="Next project">
          <Link href={`/work/${nextPiece.slug}`} className="case__next">
            <span className="t-eyebrow case__next-label">Next</span>
            <span className="case__next-title">{nextPiece.title}</span>
            <span className="case__next-arrow" aria-hidden>→</span>
          </Link>
        </section>
      </article>

      <PageStyle />
    </main>
  );
}

function Row({
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
      <span className="t-meta dim case__ledger-key">{label}</span>
      <span className={`case__ledger-val${mono ? " tabular" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function NotFound() {
  return (
    <main id="main" className="work-404">
      <p className="t-eyebrow work-404__eyebrow">
        <span>Work</span>
        <span className="t-sep">/</span>
        <span>Not found</span>
      </p>
      <p className="t-prose work-404__body">
        no plate at that address.{" "}
        <Link href="/work" className="work-404__link">
          return to the index
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
          color: var(--ink-2);
          text-transform: lowercase;
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
          clamp(80px, 12vh, 140px)
          var(--margin-page)
          clamp(56px, 8vh, 96px);
        display: grid;
        row-gap: clamp(36px, 5vh, 64px);
      }

      /* Header — eyebrow, title (sentence case), description. */
      .case__head {
        display: grid;
        row-gap: clamp(14px, 1.6vh, 22px);
        max-width: 64ch;
      }
      .case__eyebrow {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .case__title {
        text-transform: none;
        letter-spacing: -0.03em;
      }
      .case__sub {
        color: var(--ink-2);
        text-transform: lowercase;
        max-width: 56ch;
      }

      /* Hero — sits inside the case container's max-width.
         CaseHero handles its own aspect via piece.coverAspect. */
      .case__hero {
        margin: clamp(8px, 1vh, 14px) 0 clamp(24px, 3vh, 40px);
      }

      /* Ledger — 4-column metadata strip with hairline above and
         below. Each cell has a label (mono caps small) and a
         value (mono case-sensitive). */
      .case__ledger {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: clamp(16px, 2.4vw, 32px);
        margin: 0;
        padding: clamp(16px, 2vw, 24px) 0;
        border-top: 1px solid var(--ink-hair);
        border-bottom: 1px solid var(--ink-hair);
      }
      .case__ledger-cell {
        display: grid;
        gap: 6px;
        align-content: start;
      }
      .case__ledger-val {
        font-family: var(--font-stack-mono);
        font-size: clamp(11px, 0.85vw, 13px);
        line-height: 1.4;
        letter-spacing: 0;
        color: var(--ink);
        margin: 0;
        text-transform: lowercase;
      }

      /* Editorial body — mono prose paragraphs at 13-14.5px,
         line-height 1.65. Lowercase per the home register. */
      .case__body {
        display: grid;
        row-gap: clamp(16px, 1.8vh, 24px);
        max-width: 56ch;
      }
      .case__prose {
        color: var(--ink-2);
        text-transform: lowercase;
        margin: 0;
      }

      /* Next-link — eyebrow + title + arrow, hairline above. */
      .case__next-block {
        padding-top: clamp(16px, 2vh, 24px);
      }
      .case__next {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: baseline;
        gap: 18px;
        color: var(--ink);
      }
      .case__next-label {
        color: var(--ink-3);
      }
      .case__next-title {
        font-family: var(--font-stack-mono);
        font-size: clamp(15px, 1.2vw, 18px);
        font-weight: 500;
        letter-spacing: -0.01em;
        line-height: 1.2;
        color: var(--ink);
        text-transform: lowercase;
      }
      .case__next-arrow {
        font-family: var(--font-stack-mono);
        font-size: 16px;
        color: var(--ink-3);
        transition: transform 200ms var(--ease), color 180ms var(--ease);
      }
      .case__next:hover .case__next-arrow {
        color: var(--ink);
        transform: translateX(6px);
      }

      @media (max-width: 768px) {
        .case { row-gap: clamp(24px, 4vh, 40px); }
        .case__ledger {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          padding: 16px 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .case__next-arrow { transition: none; }
        .case__next:hover .case__next-arrow { transform: none; }
      }
    `}</style>
  );
}
