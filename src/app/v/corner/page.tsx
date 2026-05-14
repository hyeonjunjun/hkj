import type { Metadata } from "next";
import { CornerNav } from "@/components/corner/CornerNav";
import { ProjectSlider } from "@/components/corner/ProjectSlider";
import { CornerAudio } from "@/components/corner/CornerAudio";

/**
 * /v/corner — index home.
 *
 * Single-section editorial homepage:
 *   nav (full-bleed editorial) → project slider → corner audio (fixed)
 *
 * No middle column, no notes feed, no identity strip — those live at
 * /v/corner/notes and /v/corner/about. The home IS the work index.
 *
 * Intentionally no max-width container on the outer wrapper — the
 * nav and slider both stretch edge-to-edge for the "no container"
 * editorial register.
 */

export const metadata: Metadata = {
  title: "Index — Ryan Jun",
  description:
    "Index of selected work. Multidisciplinary practice from New York.",
};

export default function CornerIndexPage() {
  return (
    <div className="corner-index">
      <CornerNav />
      <main className="corner-index__main">
        <ProjectSlider />
      </main>
      <CornerAudio />

      <style>{`
        .corner-index {
          /* Full-bleed: the index home has no centering container.
             Sections own their own horizontal padding. */
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr;
          row-gap: clamp(48px, 8vh, 96px);
          padding-bottom: clamp(120px, 16vh, 200px);
          position: relative;
          z-index: 2;
        }
        .corner-index__main {
          display: grid;
          /* The slider section owns its own padding via .corner-slider__head
             and .corner-slider__track padding-inline. */
          align-content: start;
          row-gap: clamp(32px, 4vh, 56px);
        }
      `}</style>
    </div>
  );
}
