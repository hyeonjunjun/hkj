import type { Metadata } from "next";
import { Masthead } from "@/components/corner/Masthead";
import { IdentityStrip } from "@/components/corner/IdentityStrip";
import { AudioFixture } from "@/components/corner/AudioFixture";
import { NotesFeed } from "@/components/corner/NotesFeed";
import { CornerColophon } from "@/components/corner/CornerColophon";

/**
 * /v/corner — the corner portfolio.
 *
 * A separate exploration route off the main /. The current iteration
 * on / stays untouched; this is where the corner direction is
 * developed and shipped for the May 23 networking event.
 *
 * Composition (top → bottom):
 *   masthead → audio fixture → identity strip → notes feed → colophon
 *
 * Reuses the existing typography system (t-* classes), color register,
 * PaperGrain (rendered globally in root layout). Adds only the corner-
 * specific components in /src/components/corner/.
 */

export const metadata: Metadata = {
  title: "Corner",
  description:
    "A quiet corner — notes from Ryan Jun's multidisciplinary practice.",
};

export default function CornerPage() {
  return (
    <article className="corner">
      <section className="corner__masthead-section" aria-label="Masthead">
        <Masthead />
      </section>

      <section className="corner__audio-section" aria-label="Now playing">
        <span className="t-section corner__section-label">Now Playing</span>
        <AudioFixture />
      </section>

      <section className="corner__identity-section" aria-label="About">
        <span className="t-section corner__section-label">About</span>
        <IdentityStrip />
      </section>

      <section className="corner__feed-section" aria-label="Notes">
        <NotesFeed />
      </section>

      <CornerColophon />

      <style>{`
        .corner {
          /* Pull off the global Sitebar (fixed at top: 12px, ~36px tall)
             and provide generous breathing room above the masthead. */
          padding:
            clamp(120px, 16vh, 200px)
            var(--margin-page)
            clamp(80px, 10vh, 128px);
          max-width: 760px;
          margin-inline: auto;
          display: grid;
          /* Sections breathe — each is its own block, not a stacked
             tight column. Spec asks for "expanded spacing to feel
             like a full section." */
          row-gap: clamp(96px, 14vh, 168px);
          position: relative;
          z-index: 2; /* above PaperGrain (z=1) */
        }

        .corner__section-label {
          display: block;
          color: var(--ink-3);
          margin-bottom: clamp(20px, 2.5vh, 32px);
        }

        .corner__masthead-section,
        .corner__audio-section,
        .corner__identity-section,
        .corner__feed-section {
          display: grid;
        }

        /* Each non-masthead section gets a hairline rule above it as a
           quiet "new section" marker. The masthead doesn't need one;
           it's the page anchor. */
        .corner__audio-section,
        .corner__identity-section,
        .corner__feed-section {
          padding-top: clamp(20px, 2.5vh, 32px);
          border-top: 1px solid var(--ink-ghost);
        }

        @media (max-width: 720px) {
          .corner {
            padding-top: clamp(96px, 12vh, 140px);
            row-gap: clamp(64px, 10vh, 100px);
          }
        }
      `}</style>
    </article>
  );
}
