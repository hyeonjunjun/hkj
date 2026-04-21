"use client";

import dynamic from "next/dynamic";

const AsciiCosmos = dynamic(() => import("@/components/AsciiCosmos"), {
  ssr: false,
  loading: () => <div className="home-hero__placeholder" aria-hidden />,
});

const ENTRY = {
  id: "HH-001",
  object: "Protostellar Jet / Herbig-Haro",
  ra: "05h 39m 44s",
  dec: "−02° 33′ 16″",
  date: "2026-04-24",
  filter: "F814W",
  exposure: "1200s",
};

export default function Home() {
  return (
    <main id="main" className="home" data-theme-lock="dark">
      <section className="home-hero" aria-label="Hyeonjoon Jun — design engineer, New York">
        <AsciiCosmos />

        <header className="home-hero__ledger" aria-hidden>
          <div className="home-hero__ledger-row">
            <span className="meta-key">ENTRY</span>
            <span className="meta-val tabular">{ENTRY.id}</span>
          </div>
          <div className="home-hero__ledger-row">
            <span className="meta-key">OBJECT</span>
            <span className="meta-val">{ENTRY.object}</span>
          </div>
          <div className="home-hero__ledger-row">
            <span className="meta-key">RA / DEC</span>
            <span className="meta-val tabular">{ENTRY.ra} &nbsp; {ENTRY.dec}</span>
          </div>
          <div className="home-hero__ledger-row">
            <span className="meta-key">FILTER</span>
            <span className="meta-val">{ENTRY.filter}</span>
            <span className="meta-key" style={{ marginLeft: 18 }}>EXP</span>
            <span className="meta-val tabular">{ENTRY.exposure}</span>
          </div>
        </header>

        <footer className="home-hero__byline" aria-hidden>
          <span className="home-hero__name">HYEONJOON JUN</span>
          <span className="home-hero__sep">·</span>
          <span className="home-hero__role">Design Engineer, New York</span>
        </footer>
      </section>

      <style>{`
        .home {
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #030408;
        }
        .home-hero {
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        .home-hero__placeholder {
          position: absolute;
          inset: 0;
          background: #030408;
        }

        .home-hero__ledger {
          position: absolute;
          top: clamp(64px, 8vh, 108px);
          left: clamp(24px, 4vw, 64px);
          z-index: 3;
          display: grid;
          gap: 4px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          pointer-events: none;
          user-select: none;
        }
        .home-hero__ledger-row { display: flex; align-items: baseline; }
        .home-hero__ledger .meta-key {
          color: rgba(241, 236, 224, 0.36);
          width: 68px;
          flex: 0 0 auto;
        }
        .home-hero__ledger .meta-val {
          color: rgba(241, 236, 224, 0.82);
        }

        .home-hero__byline {
          position: absolute;
          left: clamp(24px, 4vw, 64px);
          bottom: clamp(28px, 4vh, 48px);
          z-index: 3;
          display: inline-flex;
          align-items: baseline;
          gap: 10px;
          pointer-events: none;
          user-select: none;
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .home-hero__name { color: rgba(241, 236, 224, 0.95); }
        .home-hero__sep  { color: rgba(241, 236, 224, 0.4); }
        .home-hero__role { color: rgba(241, 236, 224, 0.7); letter-spacing: 0.18em; }

        @media (max-width: 640px) {
          .home-hero__ledger { top: 60px; font-size: 9px; }
          .home-hero__byline { font-size: 10px; flex-wrap: wrap; }
        }
      `}</style>
    </main>
  );
}
