import Link from "next/link";
import DifferenceCursor from "@/components/DifferenceCursor";
import { PIECES } from "@/constants/pieces";

const EMAIL = "rykjun@gmail.com";
const QUOTE = "The warmth of physical objects, in digital form.";

/**
 * Home — a Cathy Dolle sequential-wrap index.
 *
 * Eight project rows stacked in a single `display: flex; flex-direction: column;
 * flex-wrap: wrap;` list, capped at the viewport height so the rows wrap into
 * two columns: 01–04 read down the left, 05–08 read down the right. The right
 * column uses `flex-row-reverse` + `text-end` so its text pushes to the right
 * edge. The blank middle is the point — it's where the composition breathes.
 *
 * A `mix-blend-difference` cursor floats over everything with an "OPEN PROJECT"
 * label that reveals when hovering any row.
 */
export default function Home() {
  const displayTitle = (t: string) =>
    t.replace(/:\s*[\u4E00-\u9FFF\uAC00-\uD7AF]+/, "").toLowerCase();

  return (
    <main id="main" className="home">
      <div className="home__grain" aria-hidden />
      <DifferenceCursor />

      <section className="cd" aria-label="Selected work, 2025–2026">
        <blockquote className="cd__quote">
          <p>{QUOTE}</p>
        </blockquote>

        <ol className="cd__index">
          {PIECES.map((p, i) => {
            const onLeft = i < 4;
            return (
              <li
                key={p.slug}
                className={`cd__row${onLeft ? " cd__row--l" : " cd__row--r"}`}
              >
                <Link
                  href={`/work/${p.slug}`}
                  className="cd__link"
                  data-cursor-label="OPEN PROJECT"
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

        <footer className="cd__foot">
          <a href={`mailto:${EMAIL}`} className="cd__mail" data-cursor-label="WRITE">
            {EMAIL}
          </a>
          <span className="cd__foot-spacer" aria-hidden />
          <span className="cd__loc tabular">2026, new york</span>
        </footer>
      </section>

      <style>{`
        /* ── Frame ────────────────────────────────────── */
        .home {
          min-height: 100svh;
          background: var(--paper);
          color: var(--ink);
          position: relative;
          overflow-x: hidden;
        }
        .home__grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.04;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .cd {
          position: relative;
          z-index: 2;
          min-height: 100svh;
          padding: clamp(88px, 12vh, 128px) clamp(24px, 4vw, 72px) clamp(32px, 5vh, 56px);
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        /* ── Quote (top, left-aligned, narrow) ────────── */
        .cd__quote {
          margin: 0 0 clamp(24px, 4vh, 44px);
          max-width: 32ch;
        }
        .cd__quote p {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: clamp(15px, 1.4vw, 18px);
          line-height: 1.4;
          letter-spacing: -0.003em;
          color: var(--ink-2);
          margin: 0;
          text-wrap: balance;
        }
        .cd__quote p::before {
          content: "\\201C";
          color: var(--ink-4);
        }
        .cd__quote p::after {
          content: "\\201D";
          color: var(--ink-4);
        }

        /* ── Index (the cathydolle move) ──────────────── */
        .cd__index {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          align-content: space-between;
          /* Cap the height so 4 rows fit per column, rest wraps. */
          max-height: clamp(440px, 72svh, 720px);
          align-self: center;
          width: 100%;
        }

        .cd__row {
          width: 50%;
          /* Each row claims equal vertical share of the capped height. */
          flex: 1 1 25%;
          display: flex;
          align-items: center;
          padding: 0 clamp(12px, 2vw, 32px);
        }
        .cd__row--l { flex-direction: row; text-align: start; }
        .cd__row--r { flex-direction: row-reverse; text-align: end; }

        .cd__link {
          display: inline-flex;
          align-items: baseline;
          gap: 12px;
          font-family: var(--font-stack-mono);
          font-size: clamp(10px, 0.85vw, 12px);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink);
          transition: opacity 220ms var(--ease);
        }
        .cd__row--r .cd__link { flex-direction: row-reverse; }
        .cd__link:hover { opacity: 1; }

        /* Default everything slightly muted; only the hovered row sits at full ink — */
        /* handled by :has() so adjacent rows don't fight for attention. */
        .cd__index:has(.cd__link:hover) .cd__link { opacity: 0.45; }
        .cd__index:has(.cd__link:hover) .cd__link:hover { opacity: 1; }

        .cd__num { color: var(--ink-3); }
        .cd__slash { color: var(--ink-4); }
        .cd__name { color: var(--ink); }

        /* ── Foot ─────────────────────────────────────── */
        .cd__foot {
          display: flex;
          align-items: baseline;
          gap: 16px;
          padding-top: clamp(20px, 3vh, 32px);
          margin-top: clamp(24px, 4vh, 48px);
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

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 720px) {
          .cd__index {
            flex-wrap: nowrap;
            max-height: none;
            gap: 0;
          }
          .cd__row,
          .cd__row--l,
          .cd__row--r {
            width: 100%;
            flex: 0 0 auto;
            flex-direction: row;
            text-align: start;
            padding: 18px 0;
            border-bottom: 1px solid var(--ink-hair);
          }
          .cd__row--r .cd__link { flex-direction: row; }
          .cd__row:first-child { border-top: 1px solid var(--ink-hair); }
        }
      `}</style>
    </main>
  );
}
