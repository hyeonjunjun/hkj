"use client";

import { useState } from "react";
import Link from "next/link";
import GutterStrip from "@/components/GutterStrip";
import CornerStamp from "@/components/CornerStamp";
import { PIECES } from "@/constants/pieces";

const EMAIL = "rykjun@gmail.com";

/**
 * Home — 4 project index with a central media strip. Cathydolle-derived
 * mirror-gutter composition; left column 01–02 reads to the left edge,
 * right column 03–04 reads to the right edge. The strip in the middle
 * carries the vertical axis.
 *
 * Foundation-committed: only real work ships to this catalog. No
 * placeholders, no decorative layers, no custom cursor. Wheel-snap +
 * parallax is the single signature interaction.
 */
export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0);

  const left = PIECES.slice(0, 2);
  const right = PIECES.slice(2, 4);

  const displayTitle = (t: string) =>
    t.replace(/:\s*[\u4E00-\u9FFF\uAC00-\uD7AF]+/, "").toLowerCase();

  return (
    <main id="main" className="home">
      <div className="home__stamp">
        <CornerStamp />
      </div>

      <section className="cd" aria-label="Selected work, 2025–2026">
        <div className="cd__stage">
          <ol className="cd__col cd__col--l" aria-label="Entries 1 to 2">
            {left.map((p, i) => {
              const active = i === activeIdx;
              return (
                <li key={p.slug} className="cd__row">
                  <Link
                    href={`/work/${p.slug}`}
                    className={`cd__link${active ? " is-active" : ""}`}
                  >
                    <span className="cd__num tabular">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="cd__slash" aria-hidden>/</span>
                    <span className="cd__name">{displayTitle(p.title)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="cd__gutter">
            <GutterStrip pieces={PIECES} onActiveChange={setActiveIdx} />
          </div>

          <ol className="cd__col cd__col--r" aria-label="Entries 3 to 4">
            {right.map((p, i) => {
              const globalIdx = i + 2;
              const active = globalIdx === activeIdx;
              return (
                <li key={p.slug} className="cd__row">
                  <Link
                    href={`/work/${p.slug}`}
                    className={`cd__link cd__link--r${active ? " is-active" : ""}`}
                  >
                    <span className="cd__num tabular">
                      {String(globalIdx + 1).padStart(2, "0")}
                    </span>
                    <span className="cd__slash" aria-hidden>/</span>
                    <span className="cd__name">{displayTitle(p.title)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <footer className="cd__foot">
          <a href={`mailto:${EMAIL}`} className="cd__mail">
            {EMAIL}
          </a>
          <span className="cd__foot-spacer" aria-hidden />
          <span className="cd__loc tabular">2026, new york</span>
        </footer>
      </section>

      <style>{`
        .home {
          height: 100svh;
          background: var(--paper);
          color: var(--ink);
          position: relative;
          overflow: hidden;
        }
        .home__stamp {
          position: absolute;
          top: clamp(64px, 9vh, 88px);
          right: clamp(20px, 3vw, 48px);
          z-index: 2;
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .home__stamp { display: none; }
        }

        .cd {
          position: relative;
          z-index: 2;
          height: 100svh;
          padding: clamp(72px, 10vh, 104px) clamp(16px, 2.5vw, 40px) clamp(24px, 4vh, 44px);
          display: grid;
          grid-template-rows: 1fr auto;
          gap: clamp(20px, 3vh, 32px);
        }

        .cd__stage {
          display: grid;
          grid-template-columns: minmax(180px, 1fr) minmax(280px, 34vw) minmax(180px, 1fr);
          gap: clamp(16px, 2.5vw, 40px);
          align-items: stretch;
          min-height: 0;
        }

        .cd__col {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }
        .cd__col--l { align-items: flex-start; padding-left: clamp(12px, 2vw, 32px); }
        .cd__col--r { align-items: flex-end;   padding-right: clamp(12px, 2vw, 32px); }

        .cd__row { margin: 0; }

        .cd__link {
          display: inline-flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-stack-mono);
          font-size: clamp(10px, 0.85vw, 12px);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.3;
          transition: opacity 360ms cubic-bezier(0.4, 0, 0.2, 1);
          padding: 8px 0;
        }
        .cd__link--r { flex-direction: row-reverse; }
        .cd__link.is-active { opacity: 1; }
        .cd__link:hover { opacity: 1; }
        .cd__stage:has(.cd__link:hover) .cd__link:not(:hover) { opacity: 0.3; }

        .cd__num { color: var(--ink-3); }
        .cd__slash { color: var(--ink-4); }
        .cd__name { color: var(--ink); }

        .cd__gutter {
          position: relative;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .cd__foot {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding: clamp(16px, 2.5vh, 24px) clamp(12px, 2vw, 32px) 0;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .cd__foot-spacer { flex: 1; }
        .cd__mail {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          transition: border-color 180ms var(--ease);
        }
        .cd__mail:hover { border-bottom-color: var(--ink); }
        .cd__loc { color: var(--ink-3); }

        @media (max-width: 960px) {
          .cd__stage {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr auto;
            gap: 24px;
          }
          .cd__col--l, .cd__col--r {
            align-items: flex-start;
            padding: 0;
          }
          .cd__col--r .cd__link--r { flex-direction: row; }
          .cd__gutter { order: 3; max-height: 60svh; }
          .cd__col--l { order: 1; }
          .cd__col--r { order: 2; }
        }
      `}</style>
    </main>
  );
}
