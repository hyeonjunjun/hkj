"use client";

import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";
import CopyEmailLink from "@/components/CopyEmailLink";

/**
 * Footer — Aino-style flat row.
 *
 * Aino renders the colophon as a single horizontal line:
 *
 *   GBG / OSL          New Business: julie@aino.agency          LinkedIn / Instagram
 *
 * Three slots: location · contact line · social handles. No copyright,
 * no bio block, no stacked address. The work above the footer is the
 * studio's voice; the footer is just the edge of the page.
 */
export default function Footer() {
  return (
    <footer className="footer" aria-label="Colophon">
      <div className="footer__row">
        <span className="footer__location">New York</span>

        <span className="footer__contact">
          <span className="footer__contact-label">New business</span>
          <span className="footer__contact-sep" aria-hidden>·</span>
          <CopyEmailLink className="footer__email" email={CONTACT_EMAIL} />
        </span>

        <ul className="footer__socials">
          {NETWORKS.map((n, i) => (
            <li key={n.label} className="footer__social-item">
              {i > 0 && <span className="footer__social-sep" aria-hidden>/</span>}
              <a
                className="footer__social"
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .footer {
          margin-top: var(--space-section);
          padding: var(--space-section) 0 var(--space-row);
          border-top: 1px solid var(--ink-hair);
        }
        .footer__row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: baseline;
          gap: clamp(20px, 3vw, 48px);
        }

        /* All chrome — Geist Mono uppercase, one size, the only
           register the footer speaks in. Tight tracking; mono letters
           are wide enough that 0.06em reads as deliberate. */
        .footer__location,
        .footer__contact,
        .footer__contact-label,
        .footer__social {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          line-height: 1.4;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .footer__location { color: var(--ink-3); }

        .footer__contact {
          justify-self: center;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          color: var(--ink-3);
          flex-wrap: wrap;
        }
        .footer__contact-label { color: var(--ink-3); }
        .footer__contact-sep { color: var(--ink-4); }

        .footer__email {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          line-height: 1.4;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          transition: color 180ms var(--ease);
        }
        .footer__email:hover { color: var(--ink-2); }
        .footer__email[data-copied] { color: var(--ink-3); }

        .footer__socials {
          list-style: none;
          margin: 0;
          padding: 0;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          justify-self: end;
        }
        .footer__social-item {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
        }
        .footer__social-sep { color: var(--ink-4); }
        .footer__social {
          color: var(--ink-3);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 180ms var(--ease), color 180ms var(--ease);
        }
        .footer__social:hover {
          color: var(--ink);
          background-size: 100% 1px;
        }

        @media (max-width: 720px) {
          .footer__row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .footer__contact { justify-self: start; }
          .footer__socials { justify-self: start; flex-wrap: wrap; }
        }
      `}</style>
    </footer>
  );
}
