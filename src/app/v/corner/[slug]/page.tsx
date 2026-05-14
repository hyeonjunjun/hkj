import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CORNER_NOTES } from "@/constants/corner-notes";
import { Masthead } from "@/components/corner/Masthead";
import { AudioFixture } from "@/components/corner/AudioFixture";
import { CornerColophon } from "@/components/corner/CornerColophon";

/**
 * /v/corner/[slug] — single-note detail page.
 *
 * Reuses Masthead + AudioFixture for continuity. The note title block
 * carries `view-transition-name: corner-note-<slug>` so the row-to-
 * detail transition morphs the title into place.
 *
 * Body content lives in /src/constants/corner-notes.tsx as JSX. MDX is
 * deferred until the writing volume justifies the dependency.
 */

interface Params {
  slug: string;
}

export function generateStaticParams() {
  return CORNER_NOTES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const note = CORNER_NOTES.find((n) => n.slug === slug);
  if (!note) return { title: "Note not found" };
  return {
    title: note.title,
    description: note.lede,
  };
}

export default async function NoteDetailPage({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = CORNER_NOTES.find((n) => n.slug === slug);
  if (!note) notFound();

  const number = `N${String(note.number).padStart(3, "0")}`;

  return (
    <article className="corner-detail">
      <section className="corner-detail__top" aria-label="Masthead">
        <Masthead />
        <AudioFixture />
      </section>

      <header className="corner-detail__head">
        <div className="corner-detail__meta">
          <span className="t-code tabular">{number}</span>
          <span className="t-sep" aria-hidden>·</span>
          <time className="t-meta tabular" dateTime={note.date}>{note.date}</time>
          <span className="t-sep" aria-hidden>·</span>
          <span className="t-meta">{note.category}</span>
        </div>
        <h1
          className="t-display corner-detail__title"
          style={{ viewTransitionName: `corner-note-${note.slug}` }}
        >
          {note.title}
        </h1>
        {note.lede && (
          <p className="t-statement corner-detail__lede">{note.lede}</p>
        )}
      </header>

      <hr className="t-rule" />

      <div className="corner-detail__body t-prose">{note.body}</div>

      <nav className="corner-detail__back" aria-label="Back to corner">
        <Link href="/v/corner" className="t-meta corner-detail__back-link">
          ← back to corner
        </Link>
      </nav>

      <CornerColophon />

      <style>{`
        .corner-detail {
          padding:
            clamp(120px, 16vh, 200px)
            var(--margin-page)
            clamp(80px, 10vh, 128px);
          max-width: 760px;
          margin-inline: auto;
          display: grid;
          row-gap: clamp(56px, 8vh, 96px);
          position: relative;
          z-index: 2;
        }
        .corner-detail__top {
          display: grid;
          row-gap: clamp(20px, 2.6vh, 32px);
        }
        .corner-detail__head {
          display: grid;
          row-gap: clamp(12px, 1.4vh, 18px);
        }
        .corner-detail__meta {
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          color: var(--ink-3);
          text-transform: lowercase;
        }
        .corner-detail__title {
          text-transform: none;
          letter-spacing: -0.025em;
          color: var(--ink);
          /* Display role; clamp drops to a readable size for note titles
             vs. the full hero-scale of the home wordmark. */
          font-size: clamp(28px, 5vw, 56px);
        }
        .corner-detail__lede {
          color: var(--ink-2);
          font-style: italic;
          font-family: "Newsreader", Georgia, serif;
          max-width: 56ch;
        }
        .corner-detail__body {
          color: var(--ink-2);
          max-width: 64ch;
          display: grid;
          row-gap: 1.15em;
        }
        .corner-detail__body p {
          margin: 0;
        }
        .corner-detail__back {
          padding-top: clamp(24px, 3vh, 40px);
        }
        .corner-detail__back-link {
          color: var(--ink-3);
          transition: color 200ms var(--ease), transform 200ms var(--ease);
          display: inline-block;
        }
        .corner-detail__back-link:hover {
          color: var(--ink);
          transform: translateX(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-detail__back-link { transition: none; }
        }
      `}</style>
    </article>
  );
}
