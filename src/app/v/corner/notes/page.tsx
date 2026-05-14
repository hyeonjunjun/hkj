import type { Metadata } from "next";
import { CornerNav } from "@/components/corner/CornerNav";
import { CornerAudio } from "@/components/corner/CornerAudio";
import { NotesFeed } from "@/components/corner/NotesFeed";

/**
 * /v/corner/notes — notes feed.
 *
 * Moved from the home (which is now the project index). Same CornerNav
 * at top, same fixed CornerAudio, the notes feed in the middle.
 */

export const metadata: Metadata = {
  title: "Notes — Ryan Jun",
  description: "Short entries from the practice — what's being made, what's being thought.",
};

export default function CornerNotesPage() {
  return (
    <div className="corner-notes-page">
      <CornerNav />
      <main className="corner-notes-page__main">
        <NotesFeed />
      </main>
      <CornerAudio />

      <style>{`
        .corner-notes-page {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr;
          row-gap: clamp(56px, 8vh, 96px);
          padding-bottom: clamp(120px, 16vh, 200px);
          position: relative;
          z-index: 2;
        }
        .corner-notes-page__main {
          padding: 0 var(--margin-page);
          max-width: 760px;
          margin-inline: auto;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
