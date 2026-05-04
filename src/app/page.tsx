import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import HomeViewInit from "@/components/HomeViewInit";
import ReservedZone from "@/components/ReservedZone";
import ViewToggle from "@/components/ViewToggle";
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
      <HomeViewInit />
      <main id="main" className="home">
        <Folio token="§01" />
        <ViewToggle />

        <section className="home__gallery" aria-label="Studio catalog (gallery)">
          {pieces.map((piece) => (
            <WorkPlate key={piece.slug} piece={piece} />
          ))}
          <ReservedZone />
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
            padding: clamp(140px, 26vh, 240px) clamp(20px, 5vw, 80px) clamp(56px, 9vh, 88px);
            display: grid;
            gap: clamp(40px, 6vh, 72px);
          }

          /* 2-column catalog grid. Lars Müller / aino register —
             uniform plates compose a register, not a stack. Row gap
             tightened to match aino's 24-32px vertical between tiles
             — denser presence without losing warm-paper air. */
          .home__gallery {
            max-width: 1240px;
            margin-inline: auto;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: clamp(20px, 3vw, 48px);
            row-gap: clamp(32px, 4.5vh, 64px);
          }

          @media (max-width: 720px) {
            .home__gallery {
              grid-template-columns: 1fr;
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
