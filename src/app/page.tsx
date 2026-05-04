import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import HomeViewInit from "@/components/HomeViewInit";
import Preloader from "@/components/Preloader";
import PreloaderInit from "@/components/PreloaderInit";
import ReservedZone from "@/components/ReservedZone";
import WorkPlate from "@/components/WorkPlate";
import WorkList from "@/components/WorkList";
import { PIECES } from "@/constants/pieces";

/**
 * Home — monograph register. Single warm-paper ground. The catalog
 * is one composition with two views: a vertical sequence of
 * full-width plates (gallery, default) or a typeset row index
 * (list). The toggle is the home `!` moment per the monograph spec
 * §11 — discoverable, unannounced. View persistence is governed by
 * data-home-view on <html>, set before paint by HomeViewInit.
 */
export default function Home() {
  // PIECES is authored in display order; render directly.
  const pieces = PIECES;

  return (
    <>
      {/* Order matters — inline scripts run in document order */}
      <HomeViewInit />
      <PreloaderInit />
      <Preloader />
      <main id="main" className="home">
        <Folio token="§01" />

        {/* ReservedZone is a sibling of both gallery and list — visible in both views.
            Aligned to column 3 of the same 3-col grid template via .home__reserved-wrapper. */}
        <div className="home__reserved-wrapper">
          <ReservedZone />
        </div>

        <section className="home__gallery" aria-label="Studio catalog (gallery)">
          {pieces.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
        </section>

        <section className="home__list" aria-label="Studio catalog (list)">
          <WorkList pieces={pieces} />
        </section>

        <footer className="home__foot">
          <CopyEmailLink className="home__mail" />
          <span className="home__loc tabular">2026 · new york</span>
        </footer>

        <style>{`
          .home {
            min-height: 100svh;
            background: var(--paper);
            color: var(--ink);
            padding: clamp(140px, 26vh, 240px) clamp(20px, 4vw, 64px) clamp(56px, 9vh, 88px);
            display: grid;
            gap: clamp(40px, 6vh, 72px);
          }

          /* 3-col catalog grid. aino-derived; max-width 1480px. Pieces fill
             cells in document order. Last row may have trailing empty cells —
             those are breathing room. Mobile collapses to 1 col. */
          .home__gallery {
            max-width: 1480px;
            margin-inline: auto;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: clamp(20px, 2vw, 36px);
            row-gap: clamp(32px, 4vh, 56px);
          }

          /* ReservedZone sibling wrapper — same 3-col template aligns the
             reserved zone to column 3 visually. Sibling (not child) of gallery
             so it stays visible when list view hides .home__gallery. */
          .home__reserved-wrapper {
            max-width: 1480px;
            margin-inline: auto;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            column-gap: clamp(20px, 2vw, 36px);
          }
          .home__reserved-wrapper > .reserved {
            grid-column: 3;
          }

          @media (max-width: 720px) {
            .home__gallery {
              grid-template-columns: 1fr;
            }
            .home__reserved-wrapper {
              grid-template-columns: 1fr;
            }
            .home__reserved-wrapper > .reserved {
              grid-column: auto;
            }
          }

          .home__list {
            display: grid;
            width: 100%;
          }

          /* Visibility governed by data-home-view on <html>, set by
             HomeViewInit before paint. */
          html[data-home-view="gallery"] .home__list { display: none; }
          html[data-home-view="list"] .home__gallery { display: none; }
          /* Fallback when the attribute hasn't been set yet (script
             blocked, JS off): show gallery only. */
          html:not([data-home-view]) .home__list { display: none; }

          .home__foot {
            max-width: 1240px;
            margin-inline: auto;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            padding-top: clamp(16px, 2.5vh, 24px);
            border-top: 1px solid var(--ink-hair);
            font-family: var(--font-stack-sans);
            font-size: 11px;
            letter-spacing: var(--microtype-tracking);
            text-transform: uppercase;
          }
          .home__mail { color: var(--ink); }
          .home__mail[data-copied] { color: var(--ink-3); }
          .home__loc { color: var(--ink-3); }
        `}</style>
      </main>
    </>
  );
}
