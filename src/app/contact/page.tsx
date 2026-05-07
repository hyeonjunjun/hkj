import CopyEmailLink from "@/components/CopyEmailLink";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";

/**
 * /contact — direct lines.
 *
 * Single editorial column. One sentence. One email. One row of social
 * handles. No section numbering, no duplicated office address (the
 * footer carries it), no contact-reason taxonomy — Aino's contact page
 * doesn't break things into "new work" vs "partnership" because the
 * inbox sorts that out itself.
 */
export default function ContactPage() {
  return (
    <main id="main" className="contact">
      <header className="contact__head">
        <p className="contact__eyebrow">Contact</p>
        <h1 className="contact__title">Get in touch.</h1>
        <p className="contact__body">
          For new work, partnerships, or a brief reach-out about something
          specific — a direct email is the fastest path.
        </p>
      </header>

      <section className="contact__primary" aria-label="Direct line">
        <p className="contact__label">Email</p>
        <CopyEmailLink className="contact__email" email={CONTACT_EMAIL} />
      </section>

      <section className="contact__elsewhere" aria-label="Networks">
        <p className="contact__label">Elsewhere</p>
        <ul className="contact__socials">
          {NETWORKS.map((n, i) => (
            <li key={n.label} className="contact__social-item">
              {i > 0 && <span className="contact__social-sep" aria-hidden>/</span>}
              <a
                className="contact__social"
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Footer />

      <style>{`
        .contact {
          padding: clamp(96px, 16vh, 168px) var(--margin-page) 0;
          max-width: 1080px;
          margin-inline: auto;
          display: grid;
          gap: var(--space-section);
        }

        .contact__head {
          display: grid;
          gap: 14px;
          max-width: 720px;
        }
        .contact__eyebrow {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .contact__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0;
        }
        .contact__body {
          font-family: var(--font-stack-sans);
          font-weight: 400;
          font-size: var(--type-body);
          line-height: 1.65;
          color: var(--ink-2);
          max-width: 56ch;
          margin: 8px 0 0;
          text-wrap: pretty;
        }

        .contact__primary,
        .contact__elsewhere {
          padding-top: var(--space-section);
          border-top: 1px solid var(--ink-hair);
          display: grid;
          gap: 14px;
        }
        .contact__label {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0;
        }
        .contact__email {
          font-family: var(--font-stack-sans);
          font-size: var(--type-statement);
          font-weight: 380;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--ink);
          text-decoration: none;
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 220ms var(--ease), color 180ms var(--ease);
          width: max-content;
          max-width: 100%;
        }
        .contact__email:hover {
          background-size: 100% 1px;
        }
        .contact__email[data-copied] {
          color: var(--ink-3);
        }

        .contact__socials {
          list-style: none;
          margin: 0;
          padding: 0;
          display: inline-flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8px;
        }
        .contact__social-item {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
        }
        .contact__social-sep { color: var(--ink-4); }
        .contact__social {
          font-family: var(--font-stack-mono);
          font-size: var(--type-nav);
          line-height: 1.4;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-position: 0 100%;
          background-repeat: no-repeat;
          transition: background-size 180ms var(--ease), color 180ms var(--ease);
        }
        .contact__social:hover {
          background-size: 100% 1px;
        }
      `}</style>
    </main>
  );
}
