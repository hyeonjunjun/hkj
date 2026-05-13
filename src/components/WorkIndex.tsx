"use client";

import { useEffect, useState } from "react";
import type { Piece } from "@/constants/pieces";
import CatalogPlate from "@/components/CatalogPlate";
import ViewToggle from "@/components/ViewToggle";
import ListView from "@/components/ListView";
import Footer from "@/components/Footer";

/**
 * WorkIndex — full catalog at /work. Aino's /work pattern: small
 * eyebrow + display title at the top, then a uniform 2-column grid
 * of project covers, Grid/List toggle at the top-right. No statement,
 * no asymmetric rows — this page is a dedicated catalog index.
 *
 * View choice persists in localStorage under rj.work.view.
 */
type Props = { pieces: Piece[] };

const STORAGE_KEY = "rj.work.view";
type View = "grid" | "list";

export default function WorkIndex({ pieces }: Props) {
  const [view, setView] = useState<View>("grid");

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
    setView(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch {}
  }

  return (
    <main id="main" className="workidx">
      <header className="workidx__head">
        <p className="t-eyebrow workidx__eyebrow">Work</p>
        <h1 className="t-display workidx__title">Selected work and projects.</h1>
      </header>

      <div className="workidx__toolbar">
        <ViewToggle value={view} onChange={changeView} />
      </div>

      {view === "grid" ? (
        <section className="workidx__grid" aria-label="Catalog">
          {pieces.map((p) => (
            <div key={p.slug} className="workidx__cell">
              <CatalogPlate piece={p} aspect={p.coverAspect ?? "3 / 4"} />
            </div>
          ))}
        </section>
      ) : (
        <ListView pieces={pieces} />
      )}

      <Footer />

      <style>{`
        .workidx {
          padding: clamp(96px, 16vh, 168px) var(--margin-page) 0;
          max-width: 1440px;
          margin-inline: auto;
          display: grid;
        }
        .workidx__head {
          display: grid;
          gap: 14px;
          max-width: 720px;
          margin-bottom: clamp(28px, 3.5vw, 48px);
        }
        /* Typography from .t-eyebrow and .t-display utility classes;
           only layout/whitespace lives in these selectors so the
           page reads as a sibling of /about, /contact, /notes. */
        .workidx__eyebrow { margin: 0; }
        .workidx__title {
          text-transform: none;
          margin: 0;
        }

        .workidx__toolbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: clamp(20px, 2.4vw, 32px);
        }

        .workidx__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--gap-plates) calc(var(--gap-plates) * 1.4);
          row-gap: var(--space-row);
          margin-bottom: var(--space-row);
        }
        .workidx__cell { display: block; }

        @media (max-width: 760px) {
          .workidx__grid {
            grid-template-columns: 1fr;
            row-gap: clamp(40px, 8vh, 64px);
          }
        }
      `}</style>
    </main>
  );
}
