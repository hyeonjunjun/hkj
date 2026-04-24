"use client";

import { useState } from "react";
import Link from "next/link";
import GutterStrip from "@/components/GutterStrip";
import CopyEmailLink from "@/components/CopyEmailLink";
import Folio from "@/components/Folio";
import { PIECES } from "@/constants/pieces";

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
      <Folio token="§01" />
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
                    <span
                      className="cd__name"
                      style={
                        active
                          ? ({ viewTransitionName: "work-title" } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {displayTitle(p.title)}
                    </span>
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
                    <span
                      className="cd__name"
                      style={
                        active
                          ? ({ viewTransitionName: "work-title" } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {displayTitle(p.title)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <footer className="cd__foot">
          <CopyEmailLink className="cd__mail" />
          <span className="cd__foot-role">design engineer</span>
          <span className="cd__loc tabular">2026, new york</span>
          <kbd className="cd__kbd" aria-label="Press Command K to open command palette">⌘K</kbd>
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
          gap: 10px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.3;
          transition: opacity 360ms var(--ease);
          padding: 6px 0;
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
          display: grid;
          grid-template-columns: 1fr auto 1fr auto;
          align-items: baseline;
          gap: 16px;
          padding: clamp(16px, 2.5vh, 24px) clamp(12px, 2vw, 32px) 0;
          border-top: 1px solid var(--ink-hair);
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .cd__kbd {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.24em;
          color: var(--ink-4);
          padding: 0;
          background: transparent;
          border: none;
          justify-self: end;
          grid-column: 4;
        }
        .cd__mail { justify-self: start; }
        .cd__mail[data-copied] { color: var(--ink-3); }
        .cd__foot-role {
          justify-self: center;
          color: var(--ink-3);
        }
        .cd__loc { justify-self: end; color: var(--ink-3); }

        @media (max-width: 640px) {
          .cd__foot {
            grid-template-columns: 1fr 1fr;
            row-gap: 10px;
          }
          .cd__foot-role { grid-column: 1 / -1; justify-self: start; }
          .cd__kbd { display: none; }
        }

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

        /* ─── Stage register: home ───────────────────────────────────────── */
        html[data-register="stage"] .home { background: var(--stage); color: var(--glow); }

        html[data-register="stage"] .cd__link { color: var(--glow-2); opacity: 0.5; }
        html[data-register="stage"] .cd__link.is-active { opacity: 1; color: var(--glow); }
        html[data-register="stage"] .cd__link:hover { opacity: 1; color: var(--glow); }
        html[data-register="stage"] .cd__stage:has(.cd__link:hover) .cd__link:not(:hover) { opacity: 0.5; }

        html[data-register="stage"] .cd__num { color: var(--glow-hair); }
        html[data-register="stage"] .cd__slash { color: var(--glow-hair); }
        html[data-register="stage"] .cd__name { color: var(--glow); }

        html[data-register="stage"] .cd__foot { border-top-color: var(--glow-hair); }
        html[data-register="stage"] .cd__foot-role { color: var(--glow-2); }
        html[data-register="stage"] .cd__loc { color: var(--glow-2); }
        html[data-register="stage"] .cd__kbd { color: var(--glow-hair); }

        html[data-register="stage"] .cd__mail {
          color: var(--glow);
          text-decoration-color: transparent;
        }
        html[data-register="stage"] .cd__mail:hover { text-decoration-color: var(--glow); }
        html[data-register="stage"] .cd__mail[data-copied] { color: var(--glow-2); }
      `}</style>
    </main>
  );
}
