import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";
import { CONTACT_EMAIL, SOCIALS } from "@/constants/contact";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(var(--ink-rgb), 0.08)",
        maxWidth: "var(--max-cover)",
        margin: "0 auto",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "var(--space-breath)",
        paddingBottom: "var(--space-breath)",
      }}
    >
      {/* Row 1: Email */}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="font-display hover-step"
        style={{
          fontSize: "var(--text-title)",
          fontStyle: "italic",
          lineHeight: "var(--leading-display)",
          display: "block",
          marginBottom: "var(--space-comfortable)",
        }}
      >
        {CONTACT_EMAIL}
      </a>

      {/* Row 2: Nav + Socials */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-standard)",
          marginBottom: "var(--space-comfortable)",
        }}
      >
        <div style={{ display: "flex", gap: "var(--space-comfortable)", flexWrap: "wrap" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-mono hover-step-muted"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", gap: "var(--space-comfortable)", flexWrap: "wrap" }}>
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover-step-muted"
              style={{
                fontSize: "var(--text-meta)",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>

      {/* Row 3: Copyright */}
      <span
        className="font-mono"
        style={{
          fontSize: "var(--text-meta)",
          letterSpacing: "var(--tracking-label)",
          color: "var(--ink-muted)",
        }}
      >
        &copy; {new Date().getFullYear()} HKJ
      </span>
    </footer>
  );
}
