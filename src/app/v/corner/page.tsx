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
      <section className="corner__header" aria-label="Masthead">
        <Masthead />
        <IdentityStrip />
      </section>

      <section className="corner__audio" aria-label="Now playing">
        <AudioFixture />
      </section>

      <section className="corner__feed" aria-label="Notes">
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
          /* Flora-level discipline: three sections, no section labels,
             trust the typography to provide hierarchy. */
          row-gap: clamp(72px, 11vh, 128px);
          position: relative;
          z-index: 2; /* above PaperGrain (z=1) */
        }

        .corner__header {
          display: grid;
          row-gap: clamp(20px, 2.6vh, 32px);
        }
        .corner__audio,
        .corner__feed {
          display: grid;
        }

        @media (max-width: 720px) {
          .corner {
            padding-top: clamp(96px, 12vh, 140px);
            row-gap: clamp(56px, 8vh, 88px);
          }
        }
      `}</style>
    </article>
  );
}
