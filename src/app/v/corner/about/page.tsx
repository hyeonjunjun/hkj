import type { Metadata } from "next";
import Link from "next/link";
import { CornerNav } from "@/components/corner/CornerNav";
import { CornerAudio } from "@/components/corner/CornerAudio";

/**
 * /v/corner/about — the Info tab.
 *
 * Long-form practice description in the dark corner register. Reuses
 * CornerNav + CornerAudio; the body is a single editorial column with
 * generous breathing room.
 *
 * Sections:
 *   - One-line "currently" lede
 *   - Bio (2–3 paragraphs)
 *   - Practice — what gets made
 *   - Working with — clients / collaborators / partners
 *   - Contact (email, social, availability)
 *   - Colophon (tools / typography / hosting)
 *
 * Edit the prose here directly. This is the place to lock the
 * one-breath identity sentence and the practice description before
 * the May 23 networking event.
 */

export const metadata: Metadata = {
  title: "Info — Ryan Jun",
  description:
    "About Ryan Jun — a multidisciplinary creative practice based in New York. Design, engineering, direction.",
};

export default function CornerAboutPage() {
  return (
    <div className="corner-about" data-page="corner">
      <CornerNav />
      <main className="corner-about__main">
        {/* Hero ledger row */}
        <header className="corner-about__head">
          <span className="t-warmth corner-about__eyebrow">Currently</span>
          <h1 className="t-warmth corner-about__title">
            designing, building, and directing a multidisciplinary practice
            from <span className="corner-about__accent">new york</span>.
          </h1>
          <p className="t-warmth corner-about__subline">
            Available for collaboration, commission, and full-time roles.
            Selected work at{" "}
            <Link href="/v/corner" className="corner-about__inline-link">
              /selects
            </Link>
            ; ongoing entries at{" "}
            <Link href="/v/corner/notes" className="corner-about__inline-link">
              /notes
            </Link>
            .
          </p>
        </header>

        <hr className="t-rule" />

        {/* Bio */}
        <section className="corner-about__section" aria-label="Bio">
          <h2 className="t-warmth corner-about__section-h">Bio</h2>
          <div className="corner-about__prose t-warmth">
            <p>
              I&apos;m Ryan Jun (Hyeon Jun), a multidisciplinary creative
              working at the intersection of design, engineering, and direction.
              The practice is small — one person — and that&apos;s deliberate:
              I make the kind of work that lives across surfaces (brand, code,
              motion, sound, narrative), and the way I make it is one set of
              hands holding the whole composition rather than handing it off
              between disciplines.
            </p>
            <p>
              I&apos;m currently based in New York and studying at Parsons.
              Before this I was based in Korea, where the texture and grain
              of physical materials taught me more about digital craft than
              any tool has. My references are atmospheric music, world-building,
              editorial print, and the small games that punch above their
              budget — Wuthering Waves, BTS releases, Fred Again, Studio
              Daikoku, Aino, ethan&amp;tom.
            </p>
            <p>
              Right now I&apos;m building a portfolio of concepts — projects
              I&apos;d want to ship if I were the studio you hired to ship
              them. The corner you&apos;re on is part of that — the form is
              the argument.
            </p>
          </div>
        </section>

        <hr className="t-rule" />

        {/* Practice */}
        <section className="corner-about__section" aria-label="Practice">
          <h2 className="t-warmth corner-about__section-h">Practice</h2>
          <div className="corner-about__columns">
            <PracticeCol heading="Design" lines={[
              "Brand systems",
              "Visual identity",
              "Editorial layouts",
              "Product UI",
              "Type direction",
            ]} />
            <PracticeCol heading="Engineering" lines={[
              "Next.js / React / TypeScript",
              "WebGL / R3F / shaders",
              "Motion (GSAP, View Transitions)",
              "Web audio (zero-audio playable)",
              "AI-augmented tooling",
            ]} />
            <PracticeCol heading="Direction" lines={[
              "Concept",
              "Art direction",
              "Narrative arc",
              "Casting + reference",
              "End-to-end shipping",
            ]} />
          </div>
        </section>

        <hr className="t-rule" />

        {/* Working with */}
        <section className="corner-about__section" aria-label="Working with">
          <h2 className="t-warmth corner-about__section-h">Working with</h2>
          <ul className="corner-about__list t-warmth">
            <li>Brands that want to feel like a place, not a logo.</li>
            <li>Founders shipping something that doesn&apos;t fit a template.</li>
            <li>Music projects and labels with a visual practice to develop.</li>
            <li>Studios looking for someone who can own design AND ship code.</li>
          </ul>
        </section>

        <hr className="t-rule" />

        {/* Contact */}
        <section className="corner-about__section" aria-label="Contact">
          <h2 className="t-warmth corner-about__section-h">Contact</h2>
          <dl className="corner-about__contact">
            <dt className="t-warmth">Email</dt>
            <dd className="t-warmth">
              <a href="mailto:rykjun@gmail.com" className="corner-about__link">
                rykjun@gmail.com
              </a>
            </dd>
            <dt className="t-warmth">Instagram</dt>
            <dd className="t-warmth">
              <a
                href="https://instagram.com/hyeonjunjun"
                target="_blank"
                rel="noreferrer noopener"
                className="corner-about__link"
              >
                @hyeonjunjun ↗
              </a>
            </dd>
            <dt className="t-warmth">Read</dt>
            <dd className="t-warmth">
              <Link href="/v/corner/notes" className="corner-about__link">
                /v/corner/notes
              </Link>
            </dd>
            <dt className="t-warmth">Availability</dt>
            <dd className="t-warmth">
              Open for projects starting 2026.
              <span className="corner-about__live-dot" aria-hidden /> live now
            </dd>
          </dl>
        </section>

        <hr className="t-rule" />

        {/* Colophon */}
        <section className="corner-about__section" aria-label="Colophon">
          <h2 className="t-warmth corner-about__section-h">Colophon</h2>
          <div className="corner-about__prose t-warmth">
            <p>
              This corner is built in Next.js 16 with React Three Fiber
              reserved for project surfaces, GSAP and the View Transitions
              API for the motion layer, and a self-hosted typography
              system: Departure Mono for chrome, Geist Mono for body,
              Switzer (Spotify-Sans-adjacent humanist) for the editorial
              register you&apos;re reading now. The Now Playing fixture
              rotates a curated playlist as metadata only — no audio plays;
              the silence is the joke.
            </p>
          </div>
        </section>

        <p className="corner-about__back-row">
          <Link href="/v/corner" className="t-warmth corner-about__back-link">
            ← Back to selects
          </Link>
        </p>
      </main>
      <CornerAudio />

      <style>{`
        .corner-about {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr;
          row-gap: clamp(40px, 6vh, 80px);
          padding-bottom: clamp(120px, 16vh, 200px);
          position: relative;
          z-index: 2;
        }
        .corner-about__main {
          padding: 0 var(--margin-page);
          max-width: 880px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          row-gap: clamp(40px, 5vh, 64px);
        }
        .corner-about__head {
          display: grid;
          row-gap: 18px;
        }
        .corner-about__eyebrow {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          line-height: 1;
        }
        .corner-about__title {
          color: var(--ink);
          font-size: clamp(28px, 4.6vw, 48px);
          font-weight: 500;
          letter-spacing: -0.018em;
          line-height: 1.1;
          margin: 0;
          text-transform: none;
          max-width: 24ch;
        }
        .corner-about__accent {
          color: var(--accent);
        }
        .corner-about__subline {
          color: var(--ink-3);
          font-size: 13px;
          font-weight: 400;
          letter-spacing: -0.005em;
          line-height: 1.5;
          margin: 0;
          max-width: 64ch;
        }
        .corner-about__inline-link {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          padding-bottom: 1px;
          transition: border-color 200ms var(--ease);
        }
        .corner-about__inline-link:hover {
          border-bottom-color: var(--ink);
        }

        .corner-about__section {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: clamp(20px, 3vw, 48px);
          align-items: start;
        }
        .corner-about__section-h {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0;
          padding-top: 4px;
          line-height: 1.3;
        }

        .corner-about__prose {
          color: var(--ink-2);
          font-size: 14px;
          line-height: 1.65;
          letter-spacing: -0.005em;
          max-width: 60ch;
          display: grid;
          row-gap: 1.1em;
        }
        .corner-about__prose p { margin: 0; }

        .corner-about__columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2vw, 32px);
        }

        .corner-about__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: 10px;
          color: var(--ink-2);
          font-size: 14px;
          line-height: 1.5;
          letter-spacing: -0.005em;
          max-width: 56ch;
        }
        .corner-about__list li {
          padding-left: 18px;
          position: relative;
        }
        .corner-about__list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--ink-4);
        }

        .corner-about__contact {
          display: grid;
          grid-template-columns: 100px 1fr;
          column-gap: 24px;
          row-gap: 12px;
          margin: 0;
          max-width: 60ch;
        }
        .corner-about__contact dt {
          color: var(--ink-3);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding-top: 2px;
        }
        .corner-about__contact dd {
          color: var(--ink);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: -0.005em;
          margin: 0;
        }
        .corner-about__link {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
          padding-bottom: 1px;
          transition: border-color 200ms var(--ease);
        }
        .corner-about__link:hover {
          border-bottom-color: var(--ink);
        }
        .corner-about__live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          margin: 0 4px 0 10px;
          vertical-align: 1px;
          animation: corner-about-pulse 2.4s ease-in-out infinite;
        }
        @keyframes corner-about-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .corner-about__live-dot { animation: none; }
        }

        .corner-about__back-row {
          margin: 0;
          padding-top: clamp(16px, 2vh, 24px);
        }
        .corner-about__back-link {
          color: var(--ink-3);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.005em;
          transition: color 200ms var(--ease), transform 200ms var(--ease);
          display: inline-block;
        }
        .corner-about__back-link:hover {
          color: var(--ink);
          transform: translateX(-2px);
        }

        @media (max-width: 720px) {
          .corner-about__section {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .corner-about__columns {
            grid-template-columns: 1fr;
          }
          .corner-about__contact {
            grid-template-columns: 1fr;
            row-gap: 4px;
          }
          .corner-about__contact dd {
            padding-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
}

interface PracticeColProps {
  heading: string;
  lines: string[];
}

function PracticeCol({ heading, lines }: PracticeColProps) {
  return (
    <div className="practice-col">
      <h3 className="t-warmth practice-col__h">{heading}</h3>
      <ul className="practice-col__list">
        {lines.map((line) => (
          <li key={line} className="t-warmth practice-col__item">
            {line}
          </li>
        ))}
      </ul>
      <style>{`
        .practice-col {
          display: grid;
          row-gap: 10px;
        }
        .practice-col__h {
          color: var(--ink);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
          margin: 0;
        }
        .practice-col__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: 4px;
        }
        .practice-col__item {
          color: var(--ink-3);
          font-size: 12.5px;
          font-weight: 400;
          letter-spacing: -0.005em;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
