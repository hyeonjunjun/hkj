import type { Metadata } from "next";
import Link from "next/link";
import { CornerNav } from "@/components/corner/CornerNav";
import { CornerAudio } from "@/components/corner/CornerAudio";

/**
 * /photography — the Photo tab.
 *
 * Reserved for real photographs Ryan has taken (personal documentary,
 * studio stills, ambient shots). Distinct from the Selects grid
 * (which is design / engineering / direction project work).
 *
 * v0 is a holding page — the framework + nav slot exist so the tab
 * isn't broken, but no photographs are surfaced yet. Drop assets into
 * /public/photography and define a PHOTOS constant when ready; the
 * gallery layout can land next iteration.
 */

export const metadata: Metadata = {
  title: "Photography — Ryan Jun",
  description:
    "Photography — selected stills from Ryan Jun's documentary and studio work.",
};

export default function CornerPhotographyPage() {
  return (
    <div className="corner-photo" data-page="corner">
      <CornerNav />
      <main className="corner-photo__main">
        <header className="corner-photo__head">
          <span className="t-warmth corner-photo__eyebrow">Photography</span>
          <h1 className="t-warmth corner-photo__title">A gallery is being curated.</h1>
          <p className="t-warmth corner-photo__lede">
            Real photographs — documentary, studio, ambient — coming
            shortly. In the meantime, <Link href="/" className="corner-photo__inline-link">selected
            work</Link> and <Link href="/notes" className="corner-photo__inline-link">notes</Link> live
            elsewhere on the corner.
          </p>
        </header>
      </main>
      <CornerAudio />

      <style>{`
        .corner-photo {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr;
          row-gap: clamp(40px, 6vh, 80px);
          padding-bottom: clamp(120px, 16vh, 200px);
          position: relative;
          z-index: 2;
        }
        .corner-photo__main {
          padding: 0 var(--margin-page);
          max-width: 880px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          place-content: center;
          min-height: 60vh;
        }
        .corner-photo__head {
          display: grid;
          row-gap: 16px;
          max-width: 56ch;
        }
        .corner-photo__eyebrow {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .corner-photo__title {
          color: var(--ink);
          font-size: clamp(28px, 4.6vw, 48px);
          font-weight: 500;
          letter-spacing: -0.018em;
          line-height: 1.1;
          margin: 0;
          text-transform: none;
          max-width: 22ch;
        }
        .corner-photo__lede {
          color: var(--ink-3);
          font-size: 14px;
          line-height: 1.55;
          letter-spacing: -0.005em;
          margin: 0;
          max-width: 56ch;
        }
        .corner-photo__inline-link {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          padding-bottom: 1px;
          transition: border-color 200ms var(--ease);
        }
        .corner-photo__inline-link:hover {
          border-bottom-color: var(--ink);
        }
      `}</style>
    </div>
  );
}
