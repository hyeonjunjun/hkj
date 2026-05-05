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

        {/* Hero block — aino-coded eyebrow locator distributed across the top,
            HS68-coded display statement, microtype operator line. */}
        <section className="home__intro" aria-label="Studio statement">
          <div className="home__eyebrow">
            <span className="home__eyebrow-anchor">HKJ Studio</span>
            <span className="home__eyebrow-sep" aria-hidden>·</span>
            <span className="home__eyebrow-loc">New York</span>
            <span className="home__eyebrow-sep" aria-hidden>·</span>
            <span className="home__eyebrow-year tabular">2026 —</span>
            <span className="home__eyebrow-sep home__eyebrow-sep--push" aria-hidden>·</span>
            <span className="home__eyebrow-section tabular">Index №01</span>
          </div>
          <p className="home__statement">
            A studio practice in design and engineering.
          </p>
          <p className="home__sub">
            Plates and writing. Considered code, slow rhythm.
          </p>
        </section>

        {/* Section header — aino-coded data-spec rhythm above the catalog. */}
        <header className="home__catalog-head">
          <span className="home__catalog-eyebrow">Index / 2026</span>
          <span className="home__catalog-count tabular">{`${pieces.length.toString().padStart(2, "0")} plates · gallery`}</span>
        </header>

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
          <span className="home__loc tabular">40°43′N · 73°59′W · NYC</span>
          <span className="home__build tabular">
            Build {process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7) ?? "local"}
          </span>
        </footer>

        <style>{`
          .home {
            min-height: 100svh;
            background: var(--paper);
            color: var(--ink);
            padding: clamp(80px, 14vh, 140px) clamp(20px, 4vw, 64px) clamp(56px, 9vh, 88px);
            display: grid;
            gap: clamp(28px, 4vh, 48px);
          }

          /* Hero block — aligned to gallery max-width.
             Eyebrow row distributed at top (aino locator pattern);
             display statement at scale (HS68 shape);
             microtype operator line below. */
          .home__intro {
            max-width: 1480px;
            margin-inline: auto;
            width: 100%;
            display: grid;
            gap: clamp(20px, 2.5vh, 32px);
          }
          .home__eyebrow {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 10px;
            font-family: var(--font-stack-sans);
            font-size: 11px;
            letter-spacing: var(--microtype-tracking);
            text-transform: uppercase;
            color: var(--ink-3);
            padding-block-end: clamp(8px, 1.2vh, 14px);
            border-bottom: 1px solid var(--ink-hair);
          }
          .home__eyebrow-anchor { color: var(--ink); }
          .home__eyebrow-sep { color: var(--ink-4); }
          .home__eyebrow-sep--push { margin-inline-start: auto; }
          .home__eyebrow-loc,
          .home__eyebrow-year,
          .home__eyebrow-section { color: var(--ink-3); }
          @media (max-width: 720px) {
            .home__eyebrow-sep--push { margin-inline-start: 0; }
          }
          .home__statement {
            font-family: var(--font-stack-sans);
            font-size: clamp(28px, 4vw, 48px);
            font-weight: 400;
            letter-spacing: -0.018em;
            line-height: 1.15;
            color: var(--ink);
            max-width: 24ch;
            margin: 0;
          }
          .home__sub {
            font-family: var(--font-stack-sans);
            font-size: 14px;
            line-height: 1.5;
            color: var(--ink-2);
            max-width: 44ch;
            margin: 0;
          }

          /* Catalog header — eyebrow + count, aino-coded.
             Two columns: section identifier left, count right. */
          .home__catalog-head {
            max-width: 1480px;
            margin-inline: auto;
            width: 100%;
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            padding-block-start: clamp(16px, 2.5vh, 28px);
            border-top: 1px solid var(--ink-hair);
          }
          .home__catalog-eyebrow,
          .home__catalog-count {
            font-family: var(--font-stack-sans);
            font-size: 11px;
            letter-spacing: var(--microtype-tracking);
            text-transform: uppercase;
            color: var(--ink-3);
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
            max-width: 1480px;
            margin-inline: auto;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: baseline;
            padding-top: clamp(16px, 2.5vh, 24px);
            border-top: 1px solid var(--ink-hair);
            font-family: var(--font-stack-sans);
            font-size: 11px;
            letter-spacing: var(--microtype-tracking);
            text-transform: uppercase;
          }
          .home__mail { color: var(--ink); justify-self: start; }
          .home__mail[data-copied] { color: var(--ink-3); }
          .home__loc { color: var(--ink-3); justify-self: center; }
          .home__build { color: var(--ink-3); justify-self: end; }

          @media (max-width: 720px) {
            .home__foot {
              grid-template-columns: 1fr;
              gap: 8px;
            }
            .home__mail,
            .home__loc,
            .home__build {
              justify-self: start;
            }
          }
        `}</style>
      </main>
    </>
  );
}
