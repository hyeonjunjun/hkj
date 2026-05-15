import Link from "next/link";
import type { Metadata } from "next";
import { CornerNav } from "@/components/corner/CornerNav";
import { CornerAudio } from "@/components/corner/CornerAudio";

/**
 * /* — segment-scoped 404.
 *
 * Catches missing notes (/notes/[slug] where slug doesn't
 * exist) and any other unresolved route under /*. Renders
 * in the corner register with a music-coded "track not found" line
 * rather than the default Next.js 404.
 */

export const metadata: Metadata = {
  title: "Track not found — Ryan Jun",
};

export default function CornerNotFound() {
  return (
    <div className="corner-404" data-page="corner">
      <CornerNav />
      <main className="corner-404__main">
        <div className="corner-404__inner">
          <p className="t-warmth corner-404__code tabular">404</p>
          <h1 className="t-warmth corner-404__title">Track not found.</h1>
          <p className="t-warmth corner-404__lede">
            That cue isn&apos;t in the playlist. Maybe a different track —
            the index has everything in order.
          </p>
          <nav className="corner-404__links">
            <Link href="/" className="t-warmth corner-404__link">
              <span>Index</span>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/list" className="t-warmth corner-404__link">
              <span>Projects</span>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/notes" className="t-warmth corner-404__link">
              <span>Notes</span>
              <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      </main>
      <CornerAudio />

      <style>{`
        .corner-404 {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr;
          row-gap: clamp(40px, 6vh, 80px);
          padding-bottom: clamp(120px, 16vh, 200px);
          position: relative;
          z-index: 2;
        }
        .corner-404__main {
          padding: 0 var(--margin-page);
          max-width: 880px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          place-content: center;
          min-height: 60vh;
        }
        .corner-404__inner {
          display: grid;
          row-gap: 16px;
          max-width: 56ch;
        }
        .corner-404__code {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
        }
        .corner-404__title {
          color: var(--ink);
          font-size: clamp(28px, 4.6vw, 48px);
          font-weight: 500;
          letter-spacing: -0.018em;
          line-height: 1.1;
          margin: 0;
          text-transform: none;
        }
        .corner-404__lede {
          color: var(--ink-3);
          font-size: 14px;
          line-height: 1.55;
          letter-spacing: -0.005em;
          margin: 0;
          max-width: 48ch;
        }
        .corner-404__links {
          display: inline-flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 12px;
        }
        .corner-404__link {
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          color: var(--ink);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          padding: 6px 0;
          border-bottom: 1px solid var(--ink-hair);
          width: max-content;
          transition: transform 220ms var(--ease), border-color 200ms var(--ease);
        }
        .corner-404__link:hover {
          transform: translateX(2px);
          border-bottom-color: var(--ink);
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-404__link { transition: none; }
        }
      `}</style>
    </div>
  );
}
