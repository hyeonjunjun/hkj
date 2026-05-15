import type { Metadata } from "next";
import { Suspense } from "react";
import { CornerNav } from "@/components/corner/CornerNav";
import { IndexShell } from "@/components/corner/IndexShell";
import { CornerAudio } from "@/components/corner/CornerAudio";
import { VestaboardNote } from "@/components/corner/VestaboardNote";

/**
 * / — single page for both Index (grid) and Projects (ledger).
 *
 * The two views are not separate routes: the IndexShell client
 * component reads the `?view=projects` search param via
 * useSearchParams and renders the IndexLedger when present, the
 * SelectsGrid otherwise. Tab clicks in CornerNav update the URL
 * inside startViewTransition so the fold animation fires without a
 * route navigation / loading flash.
 *
 * useSearchParams requires Suspense; wrapping IndexShell here keeps
 * any pre-render bail-out localized.
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
        <VestaboardNote />
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
