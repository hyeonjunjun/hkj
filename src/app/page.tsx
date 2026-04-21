"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const AsciiField = dynamic(() => import("@/components/AsciiField"), {
  ssr: false,
  loading: () => <div className="cover__plate-placeholder" aria-hidden />,
});

const EMAIL = "rykjun@gmail.com";
const BUILD_HASH =
  process.env.NEXT_PUBLIC_BUILD_HASH ?? "9106cae";

type Entry = {
  slug: string;
  stamp: string;      // YYYY·MM
  title: string;
  sector: string;
  status: "shipped" | "wip";
};

// Reverse-chronological dated ledger — the page's primary axis
const ENTRIES: Entry[] = [
  { slug: "clouds-at-sea", stamp: "2026·07", title: "Clouds at Sea", sector: "WebGL / Generative",  status: "shipped" },
  { slug: "gyeol",         stamp: "2026·04", title: "Gyeol",         sector: "Material Science",    status: "shipped" },
  { slug: "pane",          stamp: "2026·03", title: "Pane",          sector: "Ambient Computing",   status: "wip"     },
  { slug: "sift",          stamp: "2025·11", title: "Sift",          sector: "Mobile / AI",         status: "shipped" },
];

export default function Home() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

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
            <span className="cover__top-val tabular">2026·04·21</span>
          </span>
        </header>

        {/* ── Manifesto frame (no serif masthead) ─────── */}
        <p className="cover__manifesto">
          A practice concerned with the invisible craft that makes software
          feel intentional — typography, motion, material, and the warmth
          of physical objects in digital form.
        </p>

        {/* ── Main split: plate left · ledger right ───── */}
        <div className="main">
          <aside className="main__plate">
            <div className="cover__plate">
              <AsciiField />
              <div className="cover__marks" aria-hidden>
                <span className="cover__mark cover__mark--tl">TIDE / FIELD</span>
                <span className="cover__mark cover__mark--tr tabular">F / 4.2 — 1200s</span>
                <span className="cover__mark cover__mark--bl">SUBJECT · TIDAL</span>
                <span className="cover__mark cover__mark--br tabular">40.71° / −74.00°</span>
              </div>
              <span className="cover__tick cover__tick--t" aria-hidden />
              <span className="cover__tick cover__tick--b" aria-hidden />
              <span className="cover__tick cover__tick--l" aria-hidden />
              <span className="cover__tick cover__tick--r" aria-hidden />
            </div>
            <p className="main__plate-caption">
              <span>Plate №001 —</span>
              <span className="tabular">Tidal atmosphere, 2026·04·20</span>
            </p>
          </aside>

          <section className="ledger" aria-label="Selected work">
            <header className="ledger__head">
              <span className="ledger__label">Index</span>
              <span className="ledger__count tabular">
                {String(ENTRIES.length).padStart(2, "0")} Entries — 2025 — 2026
              </span>
            </header>

            <ol className="ledger__list">
              {ENTRIES.map((e) => (
                <li key={e.slug} className="ledger__row">
                  <Link href={`/work/${e.slug}`} className="ledger__link">
                    <span className="ledger__stamp tabular">{e.stamp}</span>
                    <span className="ledger__title">{e.title}</span>
                    <span className="ledger__sector">{e.sector}</span>
                    <span
                      className={`ledger__status${e.status === "wip" ? " is-wip" : ""}`}
                    >
                      {e.status === "wip" ? "WIP" : "→"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <footer className="ledger__notes">
              <div className="ledger__note">
                <span className="ledger__label">Correspondence</span>
                <p className="ledger__note-body">
                  Available for select engagements through 2026.
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={handleCopy}
                  className="ledger__mail"
                  data-copied={copied || undefined}
                >
                  <span className="ledger__mail-text">{EMAIL}</span>
                  <span className="ledger__mail-toast" aria-live="polite">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </a>
              </div>
            </footer>
          </section>
        </div>

        {/* ── Bottom register ─────────────────────────── */}
        <footer className="cover__bottom">
          <span className="cover__bottom-item">
            <span className="cover__bottom-key">Voice</span>
            <span className="cover__bottom-val">Observation Log</span>
          </span>
          <span className="cover__bottom-item">
            <span className="cover__bottom-key">Edition</span>
            <span className="cover__bottom-val tabular">Vol. 01</span>
          </span>
          <span className="cover__bottom-item cover__bottom-item--right">
            <span className="cover__bottom-key">Build</span>
            <span className="cover__bottom-val tabular">{BUILD_HASH}</span>
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
          gap: clamp(32px, 5vh, 56px);
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
        .cover__top-item--right { justify-content: flex-end; }
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
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--ink); display: inline-block;
        }

        /* ── Manifesto frame ──────────────────────────── */
        .cover__manifesto {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: clamp(18px, 1.9vw, 22px);
          line-height: 1.45;
          letter-spacing: -0.005em;
          color: var(--ink);
          max-width: 46ch;
          margin: 0;
        }

        /* ── Main split ───────────────────────────────── */
        .main {
          display: grid;
          grid-template-columns: minmax(300px, 400px) 1fr;
          gap: clamp(40px, 6vw, 88px);
          align-items: start;
        }

        /* ── Plate (demoted, portrait) ────────────────── */
        .main__plate {
          display: grid;
          gap: 14px;
          position: sticky;
          top: 96px;
        }
        .cover__plate {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(17, 17, 16, 0.08);
        }
        .cover__plate-placeholder {
          position: absolute; inset: 0;
          background: color-mix(in oklab, var(--paper) 98%, var(--ink) 2%);
        }
        .cover__marks { position: absolute; inset: 0; pointer-events: none; }
        .cover__mark {
          position: absolute;
          font-family: var(--font-stack-mono);
          font-size: 8.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(17, 17, 16, 0.42);
          mix-blend-mode: multiply;
        }
        .cover__mark--tl { top: 12px; left: 14px; }
        .cover__mark--tr { top: 12px; right: 14px; }
        .cover__mark--bl { bottom: 12px; left: 14px; }
        .cover__mark--br { bottom: 12px; right: 14px; }

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

        .main__plate-caption {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-stack-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }

        /* ── Ledger (primary axis) ────────────────────── */
        .ledger {
          display: grid;
          gap: clamp(24px, 3vh, 32px);
        }
        .ledger__head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--ink);
        }
        .ledger__label {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .ledger__count {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-3);
        }

        .ledger__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .ledger__row {
          border-bottom: 1px solid var(--ink-hair);
        }
        .ledger__link {
          display: grid;
          grid-template-columns: 88px 1fr 1fr 36px;
          align-items: baseline;
          gap: 18px;
          padding: 20px 0;
          color: var(--ink);
          transition: background 200ms var(--ease);
        }
        .ledger__link:hover { background: var(--ink-ghost); }
        .ledger__stamp {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .ledger__title {
          font-family: var(--font-stack-sans);
          font-weight: 450;
          font-size: 19px;
          letter-spacing: -0.006em;
          color: var(--ink);
        }
        .ledger__sector {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-2);
        }
        .ledger__status {
          font-family: var(--font-stack-mono);
          font-size: 12px;
          color: var(--ink-3);
          text-align: right;
          transition: transform 200ms var(--ease), color 200ms var(--ease);
        }
        .ledger__status.is-wip {
          font-size: 9px;
          letter-spacing: 0.18em;
          color: var(--ink-4);
        }
        .ledger__link:hover .ledger__status:not(.is-wip) {
          color: var(--ink);
          transform: translateX(4px);
        }

        /* ── Notes under ledger (marginalia) ──────────── */
        .ledger__notes {
          display: grid;
          gap: 20px;
          padding-top: 8px;
        }
        .ledger__note {
          display: grid;
          gap: 10px;
          max-width: 52ch;
        }
        .ledger__note-body {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: 14px;
          line-height: 1.65;
          color: var(--ink-2);
          margin: 0;
        }

        .ledger__mail {
          display: inline-flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-stack-mono);
          font-size: 12px;
          letter-spacing: 0.06em;
          color: var(--ink);
          align-self: start;
          padding: 4px 0;
          border-bottom: 1px solid var(--ink-hair);
          transition: border-color 180ms var(--ease);
          cursor: pointer;
        }
        .ledger__mail:hover { border-bottom-color: var(--ink); }
        .ledger__mail[data-copied] { border-bottom-color: var(--ink); }
        .ledger__mail-toast {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          padding: 2px 6px;
          border: 1px solid var(--ink-hair);
          border-radius: 2px;
          transition: color 180ms var(--ease), border-color 180ms var(--ease);
        }
        .ledger__mail[data-copied] .ledger__mail-toast {
          color: var(--ink);
          border-color: var(--ink);
        }

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

          .main {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .main__plate {
            position: static;
            max-width: 420px;
          }

          .cover__bottom {
            grid-template-columns: 1fr 1fr;
            row-gap: 14px;
          }
          .cover__bottom-item:nth-child(2) {
            grid-column: 1 / -1;
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .cover__top-item--right { justify-content: flex-start; }
          .ledger__link {
            grid-template-columns: 68px 1fr 22px;
            gap: 14px;
            padding: 16px 0;
          }
          .ledger__sector { display: none; }
          .cover__mark { font-size: 8px; letter-spacing: 0.12em; }
          .cover__mark--tl, .cover__mark--tr { top: 10px; }
          .cover__mark--bl, .cover__mark--br { bottom: 10px; }
        }
      `}</style>
    </main>
  );
}
