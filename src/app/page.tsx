import type { Metadata } from "next";
import { Suspense } from "react";
import { CornerNav } from "@/components/corner/CornerNav";
import { IndexShell } from "@/components/corner/IndexShell";
import { CornerAudio } from "@/components/corner/CornerAudio";

/**
 * / — single page for both Index (grid) and Projects (ledger).
 *
 * Not separate routes: IndexShell reads `?view=projects` via
 * useSearchParams and folds each tile's media height to 0 in place
 * (titles stay put, no slide). useSearchParams requires Suspense;
 * wrapping IndexShell here keeps any pre-render bail-out localized.
 */

export const metadata: Metadata = {
  title: "Index — Ryan Jun",
  description:
    "Index of selected work — multidisciplinary practice from New York.",
};

export default function CornerIndexPage() {
  return (
    <div className="corner-page" data-page="corner">
      <CornerNav />
      <main className="corner-page__main">
        <Suspense fallback={null}>
          <IndexShell />
        </Suspense>
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
          row-gap: clamp(28px, 4vh, 56px);
        }
      `}</style>
    </div>
  );
}
