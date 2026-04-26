"use client";

import Folio from "@/components/Folio";

const BUILD_SHA = process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev";

export default function ColophonPage() {
  return (
    <main id="main" className="colophon">
      <Folio token="§06" />

      <article className="colophon__inner">
        <header className="colophon__head">
          <p className="eyebrow">
            <span>Colophon</span>
            <span className="eyebrow__sep">·</span>
            <span>Typographic notes</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
          </p>
          <h1 className="colophon__title">How this site is set.</h1>
        </header>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Typefaces</span>
            <span className="colophon__section-count tabular">02 Faces</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Fragment Mono</dt>
              <dd className="colophon__row-body">
                Weiredesign (Weir &amp; Tobias Frere-Jones after WFMU), 2019.
                Every visible surface except case-study body prose. The
                mono register is the whole site — nav, labels, ledgers,
                titles, captions.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Gambetta</dt>
              <dd className="colophon__row-body">
                Hubert Jocham, Indestructible Type Co., 2021. Variable
                serif. Reserved strictly for long-form prose on
                <code> /work/[slug]</code> case studies. Long-form reading
                faces need to breathe; mono alone would fatigue.
              </dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Grid</span>
            <span className="colophon__section-count tabular">Perfect Fourth</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Scale</dt>
              <dd className="colophon__row-body">
                9 px → 10 → 12 → 15 → 20 → 27 → 36 → 48 → 64 → 88.
                Modular ratio 1.333 (Perfect Fourth).
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Measure</dt>
              <dd className="colophon__row-body">
                <code>--measure-narrow: 48ch</code> ·
                <code> --measure-body: 62ch</code>. Long-form case-study
                prose holds to these.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Palette</dt>
              <dd className="colophon__row-body">
                Paper <code>#FBFAF6</code> through Ink <code>#111110</code>,
                with four tonal tiers between. No accent. No second hue.
              </dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Motion</span>
            <span className="colophon__section-count tabular">03 Curves</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name"><code>--ease</code></dt>
              <dd className="colophon__row-body">
                <code>cubic-bezier(.4,0,.2,1)</code> — standard ease for
                opacity fades, color transitions, default state changes.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Ease-out-quart</dt>
              <dd className="colophon__row-body">
                <code>cubic-bezier(.22,1,.36,1)</code> — ease-out for
                reveals, the strip wheel-snap (920 ms), view-transition
                shared-element morph.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Hover-slide</dt>
              <dd className="colophon__row-body">
                <code>cubic-bezier(.33,.12,.15,1)</code> — Vercel-lineage
                curve for the 6 px arrow slide on any <code>.arrow-glyph</code>.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Windows</dt>
              <dd className="colophon__row-body">
                Every user-triggered motion sits in a 120–400 ms window.
                View transitions 300 ms. Wheel-snap 920 ms. No ambient
                motion anywhere on the site.
              </dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Stack</span>
            <span className="colophon__section-count tabular">2026</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Framework</dt>
              <dd className="colophon__row-body">
                Next.js 16 App Router, React 19, TypeScript. Native
                View Transitions API for cross-route morphs — no animation
                library.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Scroll</dt>
              <dd className="colophon__row-body">
                Native. No smooth-scroll library. Friction carried by
                deliberate 160–400 ms transitions and the wheel-snap carousel.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Host</dt>
              <dd className="colophon__row-body">Vercel.</dd>
            </div>
          </dl>
        </section>

        <section className="colophon__section">
          <header className="colophon__section-head">
            <span className="colophon__section-label">Lineage</span>
            <span className="colophon__section-count tabular">05 Refs</span>
          </header>
          <dl className="colophon__list">
            <div className="colophon__row">
              <dt className="colophon__row-name">Kenya Hara</dt>
              <dd className="colophon__row-body">
                <em>Designing Design</em>. Emptiness as active material.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Jasper Morrison &amp; Naoto Fukasawa</dt>
              <dd className="colophon__row-body">
                <em>Super Normal</em>. Documentary equality across the catalog.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Dieter Rams</dt>
              <dd className="colophon__row-body">Less, but better.</dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Rauno Freiberg</dt>
              <dd className="colophon__row-body">
                Craft in 40×40 px details.
              </dd>
            </div>
            <div className="colophon__row">
              <dt className="colophon__row-name">Cathy Dolle</dt>
              <dd className="colophon__row-body">
                The mirrored index mechanic this homepage inherits.
              </dd>
            </div>
          </dl>
        </section>

        <footer className="colophon__foot">
          <span>Hyeonjoon Jun</span>
          <span className="colophon__foot-dot" aria-hidden>·</span>
          <span>New York</span>
          <span className="colophon__foot-dot" aria-hidden>·</span>
          <span className="tabular">Build {BUILD_SHA}</span>
        </footer>
      </article>

      <style>{`
        .colophon {
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(56px, 9vh, 96px);
          display: flex;
          justify-content: center;
          color: var(--ink);
        }
        .colophon__inner {
          width: 100%;
          max-width: 820px;
          display: grid;
          gap: clamp(48px, 7vh, 72px);
        }

        .colophon__head { display: grid; gap: 18px; }
        .colophon__title {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: clamp(22px, 2.4vw, 30px);
          line-height: 1.35;
          letter-spacing: -0.005em;
          color: var(--ink);
          margin: 6px 0 0;
          max-width: 32ch;
        }

        .colophon__section { display: grid; gap: 12px; }
        .colophon__section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--ink);
        }
        .colophon__section-label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .colophon__section-count {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .colophon__list { margin: 0; display: grid; gap: 0; }
        .colophon__row {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 20px;
          padding: 14px 0;
          border-bottom: 1px solid var(--ink-hair);
        }
        .colophon__row-name {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-3);
          align-self: baseline;
        }
        .colophon__row-body {
          font-family: var(--font-stack-serif);
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-2);
          margin: 0;
          font-feature-settings: "onum" on;
        }
        .colophon__row-body code {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          color: var(--ink-3);
          padding: 1px 4px;
          background: var(--ink-ghost);
          border-radius: 2px;
        }
        .colophon__row-body em {
          font-style: italic;
        }

        .colophon__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .colophon__foot-dot { color: var(--ink-4); }

        @media (max-width: 640px) {
          .colophon__row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>
    </main>
  );
}
