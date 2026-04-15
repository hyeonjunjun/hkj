import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: 900,
        marginLeft: "8vw",
        paddingTop: 96,
        paddingRight: "clamp(24px, 5vw, 64px)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(48px, 8vw, 80px)",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "var(--ink-faint)",
        }}
      >
        404
      </p>

      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          lineHeight: 1.6,
          color: "var(--ink-muted)",
          marginTop: 20,
          maxWidth: "40ch",
        }}
      >
        This page doesn&apos;t exist — or it wandered off.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--ink-muted)",
          marginTop: 32,
          transition: "color 0.3s var(--ease)",
        }}
      >
        Return home
      </Link>
    </div>
  );
}
