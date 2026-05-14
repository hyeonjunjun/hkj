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
      <div className="corner__top">
        <Masthead />
        <AudioFixture />
      </div>

      <div className="corner__identity">
        <IdentityStrip />
      </div>

      <div className="corner__feed">
        <NotesFeed />
      </div>

      <CornerColophon />

      <style>{`
        .corner {
          /* Pull off the global Sitebar (fixed at top: 12px, ~36px tall)
             and provide breathing room. */
          padding:
            clamp(96px, 12vh, 160px)
            var(--margin-page)
            clamp(56px, 8vh, 96px);
          max-width: 760px;
          margin-inline: auto;
          display: grid;
          row-gap: clamp(40px, 5vh, 64px);
          position: relative;
          z-index: 2; /* above PaperGrain (z=1) */
        }
        .corner__top {
          display: grid;
          row-gap: clamp(16px, 2vh, 28px);
        }
        .corner__identity {
          display: grid;
        }
        .corner__feed {
          display: grid;
        }

        @media (max-width: 720px) {
          .corner {
            padding-top: clamp(72px, 10vh, 120px);
            row-gap: clamp(28px, 4vh, 48px);
          }
        }
      `}</style>
    </article>
  );
}
