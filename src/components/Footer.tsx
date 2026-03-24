import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(var(--ink-rgb), 0.08)",
        maxWidth: "var(--max-text)",
        margin: "0 auto",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "var(--space-breath)",
        paddingBottom: "var(--space-breath)",
      }}
    >
      {/* Row 1: Nav links */}
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-mono hover-step"
            style={{
              fontSize: "var(--text-meta)",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Row 2: Copyright + Version */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
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
        <span
          className="font-mono"
          style={{
            fontSize: "var(--text-meta)",
            letterSpacing: "var(--tracking-label)",
            color: "var(--ink-muted)",
          }}
        >
          v0.1.0
        </span>
      </div>
    </footer>
  );
}
