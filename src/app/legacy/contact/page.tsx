"use client";

import CopyEmailLink from "@/components/CopyEmailLink";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";

/**
 * /contact — direct lines, in the home's mono register.
 *
 * Single editorial column. One sentence of context, one email
 * (primary), one row of social handles. No CV, no contact-reason
 * taxonomy — the inbox sorts that out itself. Mono-only typography;
 * email at display scale acts as the page's anchor.
 */
export default function ContactPage() {
  return (
    <main id="main" className="contact">
      <header className="contact__head">
        <p className="t-eyebrow">Contact</p>
        <h1 className="t-display contact__title">Get in touch.</h1>
        <p className="t-prose contact__body">
          for new work, partnerships, or a brief reach-out about
          something specific — a direct email is the fastest path.
        </p>
      </header>

      <hr className="t-rule" />

      <section className="contact__primary" aria-label="Direct line">
        <span className="t-section contact__label">Email</span>
        <CopyEmailLink className="contact__email" email={CONTACT_EMAIL} />
      </section>

      <hr className="t-rule" />

      <section className="contact__elsewhere" aria-label="Networks">
        <span className="t-section contact__label">Elsewhere</span>
        <ul className="contact__socials" role="list">
          {NETWORKS.map((n, i) => (
            <li key={n.label} className="contact__social-item">
              <span className="t-code dimmer contact__social-num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                className="contact__social"
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {n.handle} <span className="contact__social-arrow" aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .contact {
          padding: clamp(80px, 12vh, 140px) var(--margin-page) clamp(56px, 8vh, 96px);
          max-width: 920px;
          margin-inline: auto;
          display: grid;
          row-gap: clamp(40px, 5vh, 64px);
        }

        .contact__head {
          display: grid;
          row-gap: clamp(14px, 1.6vh, 22px);
          max-width: 56ch;
        }
        .contact__title {
          text-transform: none;
          letter-spacing: -0.03em;
        }
        .contact__body {
          color: var(--ink-2);
          text-transform: lowercase;
          max-width: 48ch;
        }

        /* Primary email — display-scale, the page's center of
           gravity. Mono, weight 500, with the underline-fade
           hover from the home's email pattern. */
        .contact__primary,
        .contact__elsewhere {
          display: grid;
          grid-template-columns: clamp(80px, 12vw, 120px) 1fr;
          column-gap: clamp(20px, 3vw, 40px);
          align-items: baseline;
        }
        .contact__label {
          color: var(--ink-3);
        }
        /* Display email — a one-off scale between t-statement (15-18px)
           and t-display (48-96px). Kept inline because there's no
           shared role at this size; values reference the t-* scale
           tokens so the system stays tunable from globals.css. */
        .contact__email {
          font-family: var(--font-stack-mono);
          font-size: clamp(20px, 2.4vw, 32px);
          font-weight: 500;
          letter-spacing: var(--track-tight);
          line-height: var(--lh-tight);
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 220ms var(--ease), color 180ms var(--ease);
          text-transform: lowercase;
          width: max-content;
          max-width: 100%;
        }
        .contact__email:hover { background-size: 100% 1px; }
        .contact__email[data-copied] { color: var(--ink-3); }

        /* Networks — numbered rows, microtype-density. */
        .contact__socials {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          row-gap: 8px;
        }
        .contact__social-item {
          display: inline-grid;
          grid-template-columns: 28px auto;
          column-gap: 12px;
          align-items: baseline;
        }
        .contact__social-num {
          padding-top: 1px;
        }
        /* Social link — chrome at t-prose's size but single-line, so
           line-height collapses to 1. Inherits family/size/weight via
           t-prose tokens for system consistency. */
        .contact__social {
          font-family: var(--font-stack-mono);
          font-size: var(--type-prose);
          font-weight: 400;
          letter-spacing: var(--track-normal);
          line-height: 1;
          color: var(--ink);
          text-transform: lowercase;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 180ms var(--ease);
        }
        .contact__social:hover { background-size: 100% 1px; }
        .contact__social-arrow {
          color: var(--ink-3);
          margin-left: 4px;
        }

        @media (max-width: 720px) {
          .contact { row-gap: clamp(28px, 4vh, 48px); }
          .contact__primary,
          .contact__elsewhere {
            grid-template-columns: 1fr;
            row-gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}
