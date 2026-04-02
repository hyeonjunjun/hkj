import TransitionLink from "@/components/TransitionLink";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 400,
            color: "var(--fg)",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--fg-2)",
            marginBottom: 24,
          }}
        >
          This page doesn&apos;t exist.
        </p>
        <TransitionLink
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--fg-3)",
            textDecoration: "none",
            transition: "color 0.3s",
          }}
        >
          Back to home
        </TransitionLink>
      </div>
    </div>
  );
}
