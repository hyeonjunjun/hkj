"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const AsciiField = dynamic(() => import("@/components/AsciiField"), {
  ssr: false,
  loading: () => <div className="cover__plate-placeholder" aria-hidden />,
});

export default function Home() {
  return (
    <main id="main" className="home">
      <div className="home__grain" aria-hidden />

      <article className="cover" aria-label="Hyeonjoon Jun — design engineer, New York">
        {/* ── Top register ────────────────────────────── */}
        <header className="cover__top">
          <span className="cover__top-item">
            <span className="cover__top-key">Observation Log</span>
            <span className="cover__top-val tabular">№001</span>
          </span>
          <span className="cover__stamp" aria-hidden>
            <span className="cover__stamp-dot" />
            <span className="cover__stamp-mono">HKJ — PLATE №001</span>
          </span>
          <span className="cover__top-item cover__top-item--right">
            <span className="cover__top-key">40°43′N 73°59′W</span>
            <span className="cover__top-val tabular">2026·04·20</span>
          </span>
        </header>

        {/* ── Masthead ────────────────────────────────── */}
        <div className="cover__mast">
          <h1 className="cover__name">Hyeonjoon Jun</h1>
          <div className="cover__mast-rule" aria-hidden>
            <span className="cover__rule" />
            <span className="cover__mast-dot">●</span>
            <span className="cover__rule" />
          </div>
          <p className="cover__role">
            <span>Design engineer</span>
            <span className="cover__role-sep">—</span>
            <span>New York</span>
            <span className="cover__role-sep">—</span>
            <span className="tabular">MMXXVI</span>
          </p>
        </div>

        {/* ── Plate (hero landscape) ──────────────────── */}
        <div className="cover__plate">
          <AsciiField />
          <div className="cover__marks" aria-hidden>
            <span className="cover__mark cover__mark--tl">TIDE / FIELD</span>
            <span className="cover__mark cover__mark--tr tabular">F / 4.2 — 1200s</span>
            <span className="cover__mark cover__mark--bl">SUBJECT · TIDAL ATMOSPHERE</span>
            <span className="cover__mark cover__mark--br tabular">LAT 40.71° · LON −74.00°</span>
          </div>
          {/* registration ticks */}
          <span className="cover__tick cover__tick--t" aria-hidden />
          <span className="cover__tick cover__tick--b" aria-hidden />
          <span className="cover__tick cover__tick--l" aria-hidden />
          <span className="cover__tick cover__tick--r" aria-hidden />
        </div>

        {/* ── Editorial block (3 columns) ─────────────── */}
        <section className="editorial">
          <div className="editorial__col">
            <span className="editorial__label">Subject</span>
            <p className="editorial__body">
              A practice concerned with the invisible craft that makes
              software feel intentional — typography, motion, material, and
              the warmth of physical objects in digital form.
            </p>
          </div>

          <div className="editorial__col">
            <span className="editorial__label">Recent Entries</span>
            <p className="editorial__body">
              <Link href="/work/gyeol" className="editorial__ref">Gyeol</Link>, a
              fragrance brand rooted in Korean craft;{" "}
              <Link href="/work/sift" className="editorial__ref">Sift</Link>, an
              AI-assisted tool for finding what matters in a camera roll;{" "}
              <Link href="/work/pane" className="editorial__ref">Pane</Link>, an
              ambient dashboard for quiet systems; and{" "}
              <Link href="/work/clouds-at-sea" className="editorial__ref">Clouds at Sea</Link>,
              a generative horizon where water and sky dissolve.
            </p>
          </div>

          <div className="editorial__col">
            <span className="editorial__label">Correspondence</span>
            <p className="editorial__body">
              Available for select engagements through 2026.
            </p>
            <a href="mailto:rykjun@gmail.com" className="editorial__mail">
              rykjun@gmail.com
            </a>
          </div>
        </section>

        {/* ── Bottom register ─────────────────────────── */}
        <footer className="cover__bottom">
          <span className="cover__bottom-item">
            <span className="cover__bottom-key">Voice</span>
            <span className="cover__bottom-val">Observation Log</span>
          </span>
          <span className="cover__bottom-item">
            <span className="cover__bottom-key">Edition</span>
            <span className="cover__bottom-val tabular">Vol. 01 — Entry 001</span>
          </span>
          <span className="cover__bottom-item cover__bottom-item--right">
            <span className="cover__bottom-key">Folio</span>
            <span className="cover__bottom-val tabular">001 / 001</span>
          </span>
        </footer>
      </article>

      <style>{`
        /* ── Layout frame ─────────────────────────────── */
        .home {
          min-height: 100svh;
          background: var(--paper);
          color: var(--ink);
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 56px) clamp(40px, 6vh, 72px);
          position: relative;
          overflow-x: hidden;
        }

        /* Fine paper grain — tasteful, not decorative */
        .home__grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.055;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .cover {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          gap: clamp(28px, 4.5vh, 52px);
          position: relative;
          z-index: 2;
        }

        /* ── Top register ─────────────────────────────── */
        .cover__top {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: clamp(20px, 3vw, 40px);
          padding-bottom: 18px;
          border-bottom: 1px solid var(--ink-hair);
        }
        .cover__top-item {
          display: flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .cover__top-item--right {
          justify-content: flex-end;
        }
        .cover__top-key { color: var(--ink-3); }
        .cover__top-val { color: var(--ink); }

        .cover__stamp {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-2);
          padding: 6px 14px;
          border: 1px solid var(--ink-hair);
          border-radius: 2px;
        }
        .cover__stamp-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--ink);
          display: inline-block;
        }

        /* ── Masthead ─────────────────────────────────── */
        .cover__mast {
          display: grid;
          gap: 18px;
          justify-items: center;
          text-align: center;
          padding: clamp(12px, 2vh, 22px) 0;
        }
        .cover__name {
          font-family: var(--font-stack-serif);
          font-weight: 360;
          font-size: clamp(56px, 9.5vw, 128px);
          line-height: 0.92;
          letter-spacing: -0.022em;
          color: var(--ink);
          margin: 0;
        }
        .cover__mast-rule {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          width: min(420px, 70%);
        }
        .cover__rule {
          height: 1px;
          background: var(--ink-hair);
        }
        .cover__mast-dot {
          font-size: 7px;
          color: var(--ink-3);
        }
        .cover__role {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .cover__role-sep { color: var(--ink-4); }

        /* ── Plate (hero landscape) ───────────────────── */
        .cover__plate {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 16, 0.08);
        }
        .cover__plate-placeholder {
          position: absolute;
          inset: 0;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
        }
        .cover__marks { position: absolute; inset: 0; pointer-events: none; }
        .cover__mark {
          position: absolute;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(17, 17, 16, 0.42);
          mix-blend-mode: multiply;
        }
        .cover__mark--tl { top: 14px; left: 18px; }
        .cover__mark--tr { top: 14px; right: 18px; }
        .cover__mark--bl { bottom: 14px; left: 18px; }
        .cover__mark--br { bottom: 14px; right: 18px; }

        /* Printer registration ticks at plate midpoints */
        .cover__tick {
          position: absolute;
          pointer-events: none;
          background: rgba(17, 17, 16, 0.2);
        }
        .cover__tick--t, .cover__tick--b {
          left: 50%; width: 1px; height: 8px; transform: translateX(-50%);
        }
        .cover__tick--t { top: -10px; }
        .cover__tick--b { bottom: -10px; }
        .cover__tick--l, .cover__tick--r {
          top: 50%; height: 1px; width: 8px; transform: translateY(-50%);
        }
        .cover__tick--l { left: -10px; }
        .cover__tick--r { right: -10px; }

        /* ── Editorial block ──────────────────────────── */
        .editorial {
          display: grid;
          grid-template-columns: 1fr 1.25fr 1fr;
          gap: clamp(32px, 4vw, 72px);
          padding-top: clamp(8px, 1.5vh, 18px);
        }
        .editorial__col {
          display: grid;
          align-content: start;
          gap: 14px;
          border-top: 1px solid var(--ink-hair);
          padding-top: 18px;
        }
        .editorial__label {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .editorial__body {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-2);
          margin: 0;
          max-width: 44ch;
        }
        .editorial__ref {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          transition: border-color 180ms var(--ease);
        }
        .editorial__ref:hover { border-bottom-color: var(--ink); }
        .editorial__mail {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          align-self: start;
          transition: border-color 180ms var(--ease);
        }
        .editorial__mail:hover { border-bottom-color: var(--ink); }

        /* ── Bottom register ──────────────────────────── */
        .cover__bottom {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          align-items: center;
          gap: clamp(16px, 2vw, 32px);
          padding-top: 18px;
          border-top: 1px solid var(--ink-hair);
        }
        .cover__bottom-item {
          display: flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .cover__bottom-item--right { justify-content: flex-end; }
        .cover__bottom-item:nth-child(2) { justify-content: center; }
        .cover__bottom-key { color: var(--ink-4); }
        .cover__bottom-val { color: var(--ink-2); }

        /* ── Responsive ───────────────────────────────── */
        @media (max-width: 900px) {
          .cover__top {
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }
          .cover__stamp { display: none; }
          .editorial {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .cover__bottom {
            grid-template-columns: 1fr 1fr;
            row-gap: 14px;
          }
          .cover__bottom-item:nth-child(2) {
            grid-column: 1 / -1;
            justify-content: flex-start;
          }
          .cover__plate { aspect-ratio: 4 / 3; }
        }

        @media (max-width: 640px) {
          .cover__top-item--right {
            justify-content: flex-start;
          }
          .cover__mark { font-size: 8px; letter-spacing: 0.14em; }
          .cover__mark--tl, .cover__mark--tr { top: 10px; }
          .cover__mark--bl, .cover__mark--br { bottom: 10px; }
          .cover__plate { aspect-ratio: 3 / 4; }
        }
      `}</style>
    </main>
  );
}
