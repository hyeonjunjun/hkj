"use client";

import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

const EXPERIENCE: Array<{ period: string; role: string; org: string }> = [
  { period: "2024 — Present", role: "Independent",       org: "Design Engineering" },
  { period: "2023 — 2024",    role: "Design Technologist", org: "" },
  { period: "2021 — 2023",    role: "Frontend Developer",  org: "" },
];

export default function AboutPage() {
  return (
    <main id="main" className="about">
      <article className="about__inner">
        <header className="about__head">
          <p className="eyebrow">
            <span>About</span>
            <span className="eyebrow__sep">·</span>
            <span>New York</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2026</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">№002</span>
          </p>
          <h1 className="about__title">
            A design engineering practice concerned with the invisible craft
            that makes software feel intentional.
          </h1>
        </header>

        <section className="about__prose">
          <p>
            Hyeonjoon Jun — Ryan — is a design engineer based in New York. He
            works at the intersection of craft and systems thinking, caring
            about typography, motion, and the small details that make digital
            products feel considered. He treats AI as a collaborator — a force
            multiplier, not a shortcut — and builds brands, interfaces, and
            atmospheres for people who take care of the work.
          </p>
          <p>
            He is available for full-time design engineering roles and
            selected consulting through 2026.
          </p>
        </section>

        <section className="about__section">
          <p className="eyebrow">
            <span>Experience</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">03 Entries</span>
            <span className="eyebrow__sep">·</span>
            <span className="tabular">2021—2026</span>
          </p>
          <dl className="about__timeline">
            {EXPERIENCE.map((e) => (
              <div key={e.period} className="about__timeline-row">
                <dt className="about__timeline-period tabular">{e.period}</dt>
                <dd className="about__timeline-role">
                  <span>{e.role}</span>
                  {e.org ? <span className="about__timeline-org">, {e.org}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="about__section">
          <p className="eyebrow">
            <span>Contact</span>
            <span className="eyebrow__sep">·</span>
            <span>Available 2026</span>
          </p>
          <p className="about__contact-lede">
            For work inquiries, freelance, or a quiet hello — reach me at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="about__mail">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <ul className="about__socials">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about__social"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="about__signoff">
          <span className="plate-mark">— Hyeonjoon Jun, New York, 2026</span>
        </footer>
      </article>

      <style>{`
        .about {
          min-height: 100svh;
          padding: clamp(96px, 14vh, 160px) clamp(24px, 6vw, 72px) clamp(64px, 10vh, 120px);
          display: flex;
          justify-content: center;
        }
        .about__inner {
          width: 100%;
          max-width: 640px;
          display: grid;
          gap: clamp(56px, 8vh, 88px);
        }

        .about__head { display: grid; gap: 20px; }
        .about__title {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: clamp(24px, 2.8vw, 32px);
          line-height: 1.35;
          letter-spacing: -0.003em;
          color: var(--ink);
          margin: 0;
          max-width: 28ch;
        }

        .about__prose {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 15px;
          line-height: 1.8;
          color: var(--ink-2);
          max-width: 52ch;
        }
        .about__prose p + p { margin-top: 1em; }

        .about__section { display: grid; gap: 20px; }

        .about__timeline {
          border-top: 1px solid var(--ink-hair);
          margin: 0;
        }
        .about__timeline-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
          padding: 16px 0;
          border-bottom: 1px solid var(--ink-hair);
        }
        .about__timeline-period {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          align-self: baseline;
        }
        .about__timeline-role {
          font-family: var(--font-stack-mono);
          font-weight: 400;
          font-size: 15px;
          color: var(--ink);
          margin: 0;
        }
        .about__timeline-org { color: var(--ink-3); }

        .about__contact-lede {
          font-family: var(--font-stack-mono);
          font-weight: 380;
          font-size: 15px;
          line-height: 1.8;
          color: var(--ink-2);
          max-width: 52ch;
        }
        .about__mail {
          color: var(--ink);
          border-bottom: 1px solid var(--ink-hair);
        }
        .about__mail:hover { border-bottom-color: var(--ink); }

        .about__socials {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 22px;
          flex-wrap: wrap;
        }
        .about__social {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-3);
          transition: color 180ms var(--ease);
        }
        .about__social:hover { color: var(--ink); }

        .about__signoff {
          padding-top: 24px;
          border-top: 1px solid var(--ink-hair);
        }

        @media (max-width: 640px) {
          .about__timeline-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>
    </main>
  );
}
