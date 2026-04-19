"use client";

import { useEffect, useState } from "react";
import AsciiGradient from "@/components/AsciiGradient";

type ShelfItem = {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
  year: string;
  body: string;
  tags: string[];
};

const SHELF: ShelfItem[] = [
  {
    id: "01",
    kind: "MIXTAPE",
    title: "WALKS BETWEEN MEETINGS",
    subtitle: "VOL. 01 · FIELD RECORDINGS",
    year: "2026",
    body: "Six ambient tracks cut between Brooklyn and the East River. For the moment before a hard problem.",
    tags: ["AMBIENT", "NYC", "FOCUS"],
  },
  {
    id: "02",
    kind: "BOOK",
    title: "THE NATURE OF ORDER",
    subtitle: "CHRISTOPHER ALEXANDER",
    year: "2003",
    body: "Still the clearest argument I know for why some interfaces feel alive and others don't.",
    tags: ["CRAFT", "SYSTEMS", "SLOW"],
  },
  {
    id: "03",
    kind: "ZINE",
    title: "NOTES ON A QUIET TOOL",
    subtitle: "FIELD NOTE · SPRING 2026",
    year: "2026",
    body: "A short zine about designing Pane — what ambient software should feel like when it's actually quiet.",
    tags: ["PRACTICE", "DRAFT"],
  },
  {
    id: "04",
    kind: "RECORD",
    title: "TWILIGHT INDEX",
    subtitle: "A COLLECTION OF SKY COLORS",
    year: "ONGOING",
    body: "I photograph the sky every day at the Hanada hour. The index is slowly becoming a book.",
    tags: ["SKY", "PHOTOGRAPHY"],
  },
];

function pad(n: number, len = 2) {
  return String(Math.max(0, Math.floor(n))).padStart(len, "0");
}

function formatStamp(d: Date) {
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const min = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return `${y}.${m}.${day} · ${h}:${min}:${s}`;
}

export default function ShelfPage() {
  const [stamp, setStamp] = useState<string>("————.——.—— · ——:——:——");

  useEffect(() => {
    const tick = () => setStamp(formatStamp(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main id="main" className="shelf-main">
      <div className="shelf-wrap">
        <AsciiGradient ramp=" ·-:=+*▒▓" stops={120} charSize={10} height={16} />

        <header className="shelf-head">
          <span className="shelf-head__left">THE SHELF</span>
          <span className="shelf-head__rule" aria-hidden="true" />
          <span className="shelf-head__right">HYEONJOON · 2026</span>
        </header>

        <p className="shelf-intro">
          Objects I keep near while I work — books, tapes, zines, field notes. Each one changes the work in a small way.
        </p>

        <AsciiGradient ramp=" ·-:=+*▒▓" stops={120} charSize={10} height={16} />

        <section className="shelf-grid" aria-label="Shelf items">
          {SHELF.map((item) => (
            <article
              key={item.id}
              className="shelf-item"
              data-reticle-lock
              data-reticle-label={`${item.kind} / ${item.title}`}
            >
              <div className="shelf-item__card">
                <div className="shelf-item__label">
                  <span className="shelf-item__kind">[ {item.kind} ]</span>
                  <span className="shelf-item__number">№ {item.id}</span>
                </div>
                <div className="shelf-item__body">
                  <h3 className="shelf-item__title">{item.title}</h3>
                  <div className="shelf-item__subtitle">{item.subtitle}</div>
                  <p className="shelf-item__copy">{item.body}</p>
                </div>
                <div className="shelf-item__footer">
                  <div className="shelf-item__tags">
                    {item.tags.map((t) => (
                      <span key={t} className="shelf-item__tag">☐ {t}</span>
                    ))}
                  </div>
                  <div className="shelf-item__year">{item.year}</div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="shelf-foot">
          <span className="shelf-foot__line">VOL. 01 · MORE TO COME · {stamp}</span>
        </footer>
      </div>

      <style>{`
        .shelf-main {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }
        .shelf-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(96px, 14vh, 160px) clamp(96px, 14vh, 160px);
          display: flex;
          flex-direction: column;
          gap: clamp(28px, 4vw, 44px);
        }

        .shelf-head {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .shelf-head__left { color: var(--ink); }
        .shelf-head__right { color: var(--ink-muted); text-align: right; }
        .shelf-head__rule {
          display: block;
          height: 1px;
          width: 100%;
          background: var(--ink-ghost);
        }

        .shelf-intro {
          font-family: var(--font-stack-serif);
          font-style: italic;
          font-size: clamp(22px, 2.6vw, 32px);
          line-height: 1.35;
          max-width: 48ch;
          color: var(--ink);
          letter-spacing: -0.01em;
        }

        .shelf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: clamp(32px, 5vw, 64px);
          margin-top: clamp(16px, 3vw, 32px);
        }

        .shelf-item {
          display: block;
        }
        .shelf-item__card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 340px;
          padding: 32px;
          background-color: #EFEDE4;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(28,28,26,0.02) 1px, transparent 1px),
            radial-gradient(circle at 70% 65%, rgba(28,28,26,0.018) 1px, transparent 1px);
          background-size: 4px 4px, 6px 6px;
          border: 1px solid rgba(28,28,26,0.12);
          box-shadow:
            0 1px 0 rgba(28,28,26,0.04),
            0 8px 16px -12px rgba(28,28,26,0.08);
          transition:
            transform 240ms var(--ease),
            box-shadow 240ms var(--ease);
          height: 100%;
        }
        .shelf-item:hover .shelf-item__card {
          transform: translateY(-2px);
          box-shadow:
            0 2px 0 rgba(28,28,26,0.04),
            0 12px 24px -12px rgba(28,28,26,0.12);
        }

        .shelf-item__label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-bottom: 20px;
        }
        .shelf-item__kind { color: var(--ink-muted); }
        .shelf-item__number {
          color: var(--ink-faint);
          letter-spacing: 0.1em;
          text-align: right;
        }

        .shelf-item__body {
          display: flex;
          flex-direction: column;
        }
        .shelf-item__title {
          font-family: var(--font-stack-serif);
          font-style: italic;
          font-weight: 400;
          font-size: 24px;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0 0 4px 0;
        }
        .shelf-item__subtitle {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 20px;
        }
        .shelf-item__copy {
          font-family: var(--font-stack-sans);
          font-size: 14px;
          line-height: 1.55;
          color: var(--ink-muted);
          max-width: 32ch;
          margin: 0;
        }

        .shelf-item__footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 24px;
          gap: 16px;
        }
        .shelf-item__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }
        .shelf-item__tag {
          white-space: nowrap;
        }
        .shelf-item__year {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-faint);
          text-align: right;
          white-space: nowrap;
        }

        .shelf-foot {
          display: flex;
          justify-content: flex-end;
          margin-top: clamp(16px, 3vw, 32px);
        }
        .shelf-foot__line {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-muted);
        }

        @media (max-width: 720px) {
          .shelf-wrap {
            padding: clamp(72px, 12vh, 120px) clamp(24px, 6vw, 48px);
          }
          .shelf-head {
            grid-template-columns: auto 1fr;
          }
          .shelf-head__right {
            grid-column: 1 / span 2;
            text-align: left;
          }
          .shelf-head__rule {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
