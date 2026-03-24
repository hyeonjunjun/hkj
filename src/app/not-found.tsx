import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="text-column" style={{ textAlign: "center" }}>
        <h1 className="font-display ink-full" style={{ fontSize: "var(--text-name)", marginBottom: "var(--space-standard)" }}>404</h1>
        <p className="ink-secondary" style={{ fontSize: "var(--text-body)", marginBottom: "var(--space-comfortable)" }}>This page doesn&apos;t exist.</p>
        <Link href="/" className="font-mono hover-step" style={{ fontSize: "var(--text-meta)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>Back to home</Link>
      </div>
    </div>
  );
}
