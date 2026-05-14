import type { Metadata } from "next";
import { CornerNav } from "@/components/corner/CornerNav";
import { IndexShell } from "@/components/corner/IndexShell";
import { CornerAudio } from "@/components/corner/CornerAudio";

/**
 * /v/corner — Selects (default view).
 *
 * ethan&tom-style numbered project grid + Spotify-style right-rail
 * "Now Playing" panel that peeks project details on first click and
 * shifts the grid layout without covering content.
 */

export const metadata: Metadata = {
  title: "Selects — Ryan Jun",
  description:
    "Selected work — multidisciplinary practice from New York.",
};

export default function CornerSelectsPage() {
  return (
    <div className="corner-page" data-page="corner">
      <CornerNav />
      <main className="corner-page__main">
        <IndexShell />
      </main>
      <CornerAudio />

      <style>{`
        .corner-page {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr;
          row-gap: clamp(40px, 6vh, 80px);
          padding-bottom: clamp(120px, 16vh, 200px);
          position: relative;
          z-index: 2;
        }
        .corner-page__main {
          display: grid;
          align-content: start;
        }
      `}</style>
    </div>
  );
}
