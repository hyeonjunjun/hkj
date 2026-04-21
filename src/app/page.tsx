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
      <article className="cover" aria-label="Hyeonjoon Jun — design engineer, New York">
        <header className="cover__head">
          <p className="eyebrow">
            <span>Observation Log</span>
            <span className="eyebrow__sep">·</span>
            <span>New York</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">№001</span>
          </p>

          <h1 className="cover__name">Hyeonjoon Jun</h1>
          <p className="cover__role">
            <span>Design engineer</span>
            <span className="cover__role-sep">—</span>
            <span>New York</span>
          </p>
        </header>

        <div className="cover__plate">
          <AsciiField />
          <div className="cover__marks" aria-hidden>
            <span className="cover__mark cover__mark--tl">HKJ / PLATE №001</span>
            <span className="cover__mark cover__mark--tr tabular">2026·04·20</span>
            <span className="cover__mark cover__mark--bl tabular">40°43′N 73°59′W</span>
            <span className="cover__mark cover__mark--br">TIDE / FIELD</span>
          </div>
        </div>

        <section className="cover__body">
          <p>
            A practice concerned with the invisible craft that makes software
            feel intentional — typography, motion, material, and the warmth
            of physical objects in digital form.
          </p>

          <p>
            Recent work includes{" "}
            <Link href="/work/gyeol" className="cover__ref">Gyeol</Link>, a
            conceptual fragrance brand rooted in Korean craft;{" "}
            <Link href="/work/sift" className="cover__ref">Sift</Link>, an
            AI-assisted tool for finding what matters in a camera roll;{" "}
            <Link href="/work/pane" className="cover__ref">Pane</Link>, an
            ambient dashboard for quiet systems; and{" "}
            <Link href="/work/clouds-at-sea" className="cover__ref">Clouds at Sea</Link>,
            a generative horizon where water and sky dissolve.
          </p>

          <p>
            Available for select engagements through 2026.{" "}
            <a href="mailto:rykjun@gmail.com" className="cover__ref">
              rykjun@gmail.com
            </a>
            .
          </p>
        </section>

        <footer className="cover__foot">
          <span className="plate-mark">Hyeonjoon Jun</span>
          <span className="cover__foot-dot" aria-hidden>·</span>
          <span className="plate-mark tabular">New York, 2026</span>
        </footer>
      </article>

      <style>{`
        .home {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 72px) clamp(72px, 12vh, 120px);
          background: var(--paper);
          color: var(--ink);
        }

        .cover {
          width: min(560px, 100%);
          display: grid;
          gap: clamp(36px, 5vh, 56px);
        }

        /* ── Masthead ─────────────────────────────────────── */
        .cover__head { display: grid; gap: 14px; }
        .cover__name {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: clamp(36px, 5vw, 52px);
          line-height: 1.02;
          letter-spacing: -0.012em;
          color: var(--ink);
          margin: 6px 0 0;
        }
        .cover__role {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .cover__role-sep { color: var(--ink-4); }

        /* ── Plate ────────────────────────────────────────── */
        .cover__plate {
          position: relative;
          aspect-ratio: 4 / 5;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 16, 0.06);
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
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(17, 17, 16, 0.38);
          mix-blend-mode: multiply;
        }
        .cover__mark--tl { top: 12px; left: 14px; }
        .cover__mark--tr { top: 12px; right: 14px; }
        .cover__mark--bl { bottom: 12px; left: 14px; }
        .cover__mark--br { bottom: 12px; right: 14px; }

        /* ── Body prose ───────────────────────────────────── */
        .cover__body {
          font-family: var(--font-stack-serif);
          font-weight: 380;
          font-size: 15px;
          line-height: 1.75;
          color: var(--ink-2);
          max-width: 52ch;
        }
        .cover__body p + p { margin-top: 1em; }
        .cover__ref {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          transition: border-color 180ms var(--ease);
        }
        .cover__ref:hover { border-bottom-color: var(--ink); }

        /* ── Foot ─────────────────────────────────────────── */
        .cover__foot {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-top: 20px;
          border-top: 1px solid var(--ink-hair);
        }
        .cover__foot-dot { color: var(--ink-4); font-size: 10px; }

        /* ── Responsive ───────────────────────────────────── */
        @media (max-width: 640px) {
          .cover__mark { font-size: 8px; letter-spacing: 0.12em; }
          .cover__mark--tl, .cover__mark--tr { top: 10px; }
          .cover__mark--bl, .cover__mark--br { bottom: 10px; }
        }
      `}</style>
    </main>
  );
}
