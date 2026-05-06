import CopyEmailLink from "@/components/CopyEmailLink";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";

/**
 * /contact — direct, functional contact page.
 *
 * Combined-reference shape:
 *  - Aino's /contact: section per contact reason, email per section,
 *    office addresses, social links. No marketing copy.
 *  - HS68's restraint: no contact form, no newsletter — just the
 *    direct lines.
 *
 * Single sans family. No serif. No theme toggle. The studio is
 * one person, so contact reasons collapse to: new work, partnership.
 */
export default function ContactPage() {
  return (
    <main id="main" className="contact">
      <header className="contact__head">
        <p className="contact__eyebrow">
          <span>Contact</span>
          <span className="contact__sep" aria-hidden>·</span>
          <span className="tabular">03</span>
        </p>
        <h1 className="contact__title">Get in touch.</h1>
      </header>

      <section className="contact__lines" aria-label="Direct lines">
        <Line
          label="New work"
          body="For projects, engagements, or a brief reach-out about something specific."
          email={CONTACT_EMAIL}
        />
        <Line
          label="Partnership"
          body="For studios looking to collaborate, refer, or share a piece of work."
          email={CONTACT_EMAIL}
        />
      </section>

      <section className="contact__office" aria-label="Office">
        <Office
          city="New York"
          lines={["Brooklyn, NY", "United States"]}
        />
      </section>

      <section className="contact__socials" aria-label="Networks">
        <p className="contact__socials-label">Elsewhere</p>
        <ul className="contact__socials-list">
          {NETWORKS.map((n) => (
            <li key={n.label}>
              <a
                className="contact__social"
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact__social-name">{n.label}</span>
                <span className="contact__social-handle tabular">{n.handle}</span>
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
          gap: 18px;
          max-width: 720px;
        }
        .contact__eyebrow {
          display: inline-flex;
          gap: 8px;
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
          margin: 0;
        }
        .contact__sep { color: var(--ink-4); }
        .contact__title {
          font-family: var(--font-stack-sans);
          font-weight: 380;
          font-size: var(--type-display);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 0;
        }

        .contact__lines {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(28px, 3.4vw, 56px);
          padding-top: var(--space-section);
          border-top: 1px solid var(--ink-hair);
        }
        @media (max-width: 720px) {
          .contact__lines { grid-template-columns: 1fr; gap: 32px; }
        }

        .contact__office,
        .contact__socials {
          padding-top: var(--space-section);
          border-top: 1px solid var(--ink-hair);
        }

        .contact__socials-label {
          font-family: var(--font-stack-sans);
          font-size: var(--type-nav);
          line-height: 1;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-3);
          margin: 0 0 18px;
        }
        .contact__socials-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0;
        }
        .contact__socials-list > li + li .contact__social {
          border-top: 1px solid var(--ink-hair);
        }
        .contact__social {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 18px;
          padding: 16px 4px;
          align-items: baseline;
          font-family: var(--font-stack-sans);
          color: var(--ink);
          transition: padding-left 220ms var(--ease);
        }
        .contact__social:hover { padding-left: 6px; }
        .contact__social-name {
          font-size: var(--type-title);
          font-weight: 400;
          color: var(--ink);
        }
        .contact__social-handle {
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--ink-3);
          font-variant-numeric: tabular-nums;
        }
        @media (max-width: 640px) {
          .contact__social { grid-template-columns: 1fr; gap: 4px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact__social, .contact__social:hover { transition: none; padding-left: 4px; }
        }
      `}</style>

      {/* Inject the Line/Office helpers' inline shared styles via a one-shot block */}
      <SharedSubcomponentStyles />
    </main>
  );
}

function Line({
  label,
  body,
  email,
}: {
  label: string;
  body: string;
  email: string;
}) {
  return (
    <div className="line">
      <p className="line__label">{label}</p>
      <p className="line__body">{body}</p>
      <CopyEmailLink className="line__email" email={email} />
    </div>
  );
}

function Office({ city, lines }: { city: string; lines: string[] }) {
  return (
    <div className="office">
      <p className="office__label">Office</p>
      <p className="office__city">{city}</p>
      <ul className="office__addr">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function SharedSubcomponentStyles() {
  return (
    <style>{`
      .line { display: grid; gap: 14px; max-width: 38ch; }
      .line__label {
        font-family: var(--font-stack-sans);
        font-size: var(--type-nav);
        line-height: 1;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-3);
        margin: 0;
      }
      .line__body {
        font-family: var(--font-stack-sans);
        font-size: var(--type-body);
        line-height: 1.55;
        color: var(--ink-2);
        margin: 0;
        text-wrap: pretty;
      }
      .line__email {
        font-family: var(--font-stack-sans);
        font-size: var(--type-title);
        font-weight: 400;
        color: var(--ink);
        text-decoration: underline;
        text-decoration-color: var(--ink-hair);
        text-underline-offset: 4px;
        transition: text-decoration-color 180ms var(--ease);
      }
      .line__email:hover { text-decoration-color: var(--ink); }
      .line__email[data-copied] { color: var(--ink-3); text-decoration-color: var(--ink-3); }

      .office { display: grid; gap: 6px; }
      .office__label {
        font-family: var(--font-stack-sans);
        font-size: var(--type-nav);
        line-height: 1;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--ink-3);
        margin: 0 0 8px;
      }
      .office__city {
        font-family: var(--font-stack-sans);
        font-size: var(--type-title);
        font-weight: 400;
        color: var(--ink);
        margin: 0;
      }
      .office__addr {
        list-style: none;
        margin: 0;
        padding: 0;
        font-family: var(--font-stack-sans);
        font-size: var(--type-body);
        line-height: 1.55;
        color: var(--ink-2);
      }
    `}</style>
  );
}
