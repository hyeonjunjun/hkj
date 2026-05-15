import type { Metadata } from "next";
import { CornerNav } from "@/components/corner/CornerNav";
import { IndexLedger } from "@/components/corner/IndexLedger";
import { CornerAudio } from "@/components/corner/CornerAudio";

/**
 * /v/corner/list — Index (text-only ledger view).
 *
 * Companion to /v/corner (Selects). Same projects, no media — a high-
 * density typographic ledger that lets the body of work read at a
 * glance. Reference: ethan&tom Index view.
 */

export const metadata: Metadata = {
  title: "Projects — Ryan Jun",
  description:
    "Full projects list — text ledger of selected work.",
};

export default function CornerIndexPage() {
  return (
    <div className="corner-page" data-page="corner">
      <CornerNav />
      <main className="corner-page__main">
        <IndexLedger />
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
