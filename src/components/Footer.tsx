"use client";

import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";
import CopyEmailLink from "@/components/CopyEmailLink";

/**
 * Footer — minimal, per spec §09.
 *
 * Hairline at top. Two columns:
 *   Left:  hyeonjoon jun / design engineer / new york
 *   Right: email · 2 social links
 * Bottom: © 2026 in mono folio size.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  // Per spec §09 — show 2 social links (GitHub/LinkedIn pattern, but use what we have)
  const socials = NETWORKS.slice(0, 2);

  return (
    <footer className="footer" aria-label="Colophon">
      <div className="footer__row">
        <div className="footer__col footer__col--left">
          <span className="footer__line">hyeonjoon jun</span>
          <span className="footer__line">design engineer</span>
          <span className="footer__line">new york</span>
        </div>
        <div className="footer__col footer__col--right">
          <CopyEmailLink className="footer__mail" email={CONTACT_EMAIL} />
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="footer__bottom tabular">© {year}</div>

      <style>{`
        .footer {
          margin-top: var(--space-section);
          padding: var(--space-section) 0 var(--space-row);
          border-top: 1px solid var(--ink-hair);
          display: grid;
          gap: var(--space-section);
        }
        .footer__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .footer__col {
          display: grid;
          gap: 6px;
          align-content: start;
        }
        .footer__col--right {
          justify-items: end;
        }
        .footer__line {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1.4;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .footer__mail {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1.4;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          transition: color 180ms var(--ease);
        }
        .footer__mail:hover { color: var(--ink-2); }
        .footer__mail[data-copied] { color: var(--ink-3); }
        .footer__social {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1.4;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          text-decoration: underline;
          text-decoration-color: transparent;
          text-underline-offset: 3px;
          transition: text-decoration-color 180ms var(--ease), color 180ms var(--ease);
        }
        .footer__social:hover {
          color: var(--ink);
          text-decoration-color: currentColor;
        }
        .footer__bottom {
          font-family: var(--font-stack-mono);
          font-size: var(--type-folio);
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-4);
        }
        @media (max-width: 640px) {
          .footer__row { grid-template-columns: 1fr; gap: 18px; }
          .footer__col--right { justify-items: start; }
        }
      `}</style>
    </footer>
  );
}
