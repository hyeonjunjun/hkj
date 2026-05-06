"use client";

import { useEffect, useState } from "react";
import type { Piece } from "@/constants/pieces";
import CatalogPlate from "@/components/CatalogPlate";
import ViewToggle from "@/components/ViewToggle";
import ListView from "@/components/ListView";
import Footer from "@/components/Footer";

/**
 * HomeView — Grid / List view orchestrator for the homepage.
 *
 * Persists the user's last view choice in localStorage under
 * `hkj.home.view`. Initial render uses Grid (SSR-stable). The
 * toggle crossfades between views per spec §10:
 *   200ms fade out → 100ms overlap → 300ms fade in.
 *
 * Variable Grid composition is encoded inline below — the spec's
 * Row Types A/C/E/B applied to current PIECES (2 real + 5
 * placeholders): asymmetric pair, statement, three-column,
 * equal pair.
 */
type Props = { pieces: Piece[] };

const STORAGE_KEY = "hkj.home.view";
type View = "grid" | "list";

export default function HomeView({ pieces }: Props) {
  const [view, setView] = useState<View>("grid");
  const [phase, setPhase] = useState<"in" | "out">("in");

  // Hydrate stored preference after mount (avoids SSR mismatch).
  // setState here is intentional — we read localStorage post-hydration
  // and apply the user's prior choice. The "in/out" phase animation
  // doesn't run for this initial sync (phase stays "in").
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "list" || stored === "grid") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setView(stored);
      }
    } catch {}
  }, []);

  function changeView(next: View) {
    if (next === view) return;
    setPhase("out");
    window.setTimeout(() => {
      setView(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      setPhase("in");
    }, 200);
  }

  const gyeol = pieces.find((p) => p.slug === "gyeol");
  const sift = pieces.find((p) => p.slug === "sift");
  const placeholders = pieces.filter((p) => p.placeholder);
  const phRow1 = placeholders.slice(0, 3);
  const phRow2 = placeholders.slice(3, 5);

  return (
    <main id="main" className="home">
      <div className="home__void" aria-hidden />

      <div className="home__toolbar">
        <ViewToggle value={view} onChange={changeView} />
      </div>

      <div className="home__viewport" data-phase={phase}>
        {view === "grid" ? (
          <>
            {gyeol && sift && (
              <section className="home__row home__row--C" aria-label="Featured">
                <div className="home__cell home__cell--58">
                  <CatalogPlate piece={gyeol} aspect="3 / 4" />
                </div>
                <div className="home__cell home__cell--38">
                  <CatalogPlate piece={sift} aspect="9 / 16" />
                </div>
              </section>
            )}

            <section className="home__statement" aria-label="Statement">
              <p>
                a design engineer building interfaces and brands — and the
                small things between them.
              </p>
            </section>

            {phRow1.length === 3 && (
              <section className="home__row home__row--E" aria-label="Index">
                {phRow1.map((p) => (
                  <div key={p.slug} className="home__cell home__cell--33">
                    <CatalogPlate piece={p} aspect="4 / 5" />
                  </div>
                ))}
              </section>
            )}

            {phRow2.length === 2 && (
              <section className="home__row home__row--B" aria-label="Index continued">
                {phRow2.map((p) => (
                  <div key={p.slug} className="home__cell home__cell--50">
                    <CatalogPlate piece={p} aspect="16 / 9" />
                  </div>
                ))}
              </section>
            )}
          </>
        ) : (
          <ListView pieces={pieces} />
        )}
      </div>

      <Footer />

      <style>{`
        .home {
          padding: 0 var(--margin-page);
          max-width: 1440px;
          margin-inline: auto;
          display: grid;
        }
        .home__void {
          height: var(--space-void);
        }
        .home__toolbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: clamp(20px, 2.4vw, 32px);
        }

        .home__viewport {
          opacity: 1;
          transition: opacity 300ms var(--ease);
        }
        .home__viewport[data-phase="out"] {
          opacity: 0;
          transition: opacity 200ms var(--ease);
        }

        .home__row {
          display: grid;
          gap: var(--gap-plates);
          margin-bottom: var(--space-row);
        }
        .home__row--C { grid-template-columns: 58fr 38fr; }
        .home__row--E { grid-template-columns: 1fr 1fr 1fr; }
        .home__row--B { grid-template-columns: 1fr 1fr; }
        .home__cell { display: block; }

        .home__statement {
          max-width: 880px;
          margin-inline: auto;
          padding: 0 8px;
          margin-bottom: var(--space-row);
          text-align: center;
        }
        .home__statement p {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-statement);
          line-height: 1.32;
          letter-spacing: -0.01em;
          color: var(--ink-2);
          margin: 0;
          text-wrap: balance;
        }

        /* Sibling-dim hover at row level */
        .home__row:hover .home__cell { opacity: 0.5; transition: opacity 400ms var(--ease); }
        .home__row:hover .home__cell:hover { opacity: 1; transition: opacity 320ms var(--ease); }

        @media (max-width: 760px) {
          .home__row--C,
          .home__row--E,
          .home__row--B { grid-template-columns: 1fr; }
          .home__row { margin-bottom: clamp(40px, 8vh, 64px); gap: 18px; }
          .home__void { height: clamp(80px, 18vh, 140px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .home__viewport,
          .home__row:hover .home__cell,
          .home__row:hover .home__cell:hover { transition: none; }
        }
      `}</style>
    </main>
  );
}
