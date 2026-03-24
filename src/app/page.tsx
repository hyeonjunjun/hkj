import { PROJECTS } from "@/constants/projects";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";
import { Cover } from "@/components/Cover";

export default function Home() {
  return (
    <div className="page-container">

      {/* ── Identity ── */}
      <section
        className="section text-column"
        style={{ marginTop: "var(--space-breath)" }}
      >
        <h1
          className="font-display ink-full"
          style={{
            fontSize: "var(--text-name)",
            lineHeight: "var(--leading-display)",
            fontWeight: 400,
            marginBottom: "var(--space-compact)",
          }}
        >
          Hyeon Jun
        </h1>
        <p
          className="font-body ink-secondary"
          style={{
            fontSize: "var(--text-nav)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            marginBottom: "var(--space-comfortable)",
          }}
        >
          Design Engineer
        </p>
        <p
          className="ink-primary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            maxWidth: "var(--max-text)",
          }}
        >
          I design and build digital products where craft and systems thinking
          meet — translating ideas from first sketch through shipped code. My
          work lives at the intersection of interaction design, typography, and
          engineering detail.
        </p>
      </section>

      {/* ── Work ── */}
      <section
        id="work"
        className="section"
        style={{ maxWidth: "var(--max-cover)" }}
      >
        <p
          className="section-label font-mono ink-muted"
          style={{ marginBottom: "var(--space-comfortable)" }}
        >
          Work
        </p>
        <div className="cover-grid">
          {PROJECTS.map((project, i) => (
            <Cover key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ── Now ── */}
      <section className="section text-column">
        <p
          className="section-label font-mono ink-muted"
          style={{ marginBottom: "var(--space-comfortable)" }}
        >
          Now
        </p>
        <p
          className="ink-primary"
          style={{
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
          }}
        >
          Currently finishing up Conductor — a design system built to scale
          across surfaces — while exploring new directions in material
          typography. Based in New York, available for select projects starting
          mid-2026.
        </p>
      </section>

      {/* ── Contact ── */}
      <section
        className="section text-column"
        style={{ marginBottom: "var(--space-breath)" }}
      >
        <p
          className="section-label font-mono ink-muted"
          style={{ marginBottom: "var(--space-comfortable)" }}
        >
          Contact
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-display ink-full hover-step"
          style={{
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-display)",
            display: "block",
            marginBottom: "var(--space-comfortable)",
          }}
        >
          {CONTACT_EMAIL}
        </a>
        <div
          style={{
            display: "flex",
            gap: "var(--space-comfortable)",
            flexWrap: "wrap",
          }}
        >
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover-step"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
              }}
            >
              {social.label}
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}
