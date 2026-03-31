import { notFound } from "next/navigation";
import Link from "next/link";
import { PIECES } from "@/constants/pieces";
import ScrollProgress from "@/components/ScrollProgress";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PIECES.filter((p) => p.type === "experiment").map((p) => ({
    slug: p.slug,
  }));
}

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const piece = PIECES.find((p) => p.slug === slug && p.type === "experiment");

  if (!piece) notFound();

  // Find prev/next experiments for inter-project nav
  const experiments = PIECES.filter((p) => p.type === "experiment").sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = experiments.findIndex((p) => p.slug === piece.slug);
  const prevExperiment =
    currentIndex > 0 ? experiments[currentIndex - 1] : null;
  const nextExperiment =
    currentIndex < experiments.length - 1
      ? experiments[currentIndex + 1]
      : null;

  /* ── Shared label style ── */
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--fg-3)",
    marginBottom: 10,
  };

  const monoSmall: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <div
      data-page-scrollable
      style={{
        overflow: "auto",
        height: "100dvh",
        background: "var(--bg)",
      }}
    >
      {/* ── Fixed Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 200,
          background: "var(--bg)",
        }}
      >
        {/* Left: HKJ */}
        <Link
          href="/"
          style={{
            ...monoSmall,
            color: "var(--fg)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          HKJ
        </Link>

        {/* Center: scroll hint */}
        {prevExperiment && (
          <Link
            href={`/lab/${prevExperiment.slug}`}
            style={{
              ...monoSmall,
              fontSize: 10,
              color: "var(--fg-3)",
              textDecoration: "none",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Scroll up to previous project
          </Link>
        )}

        {/* Right: About */}
        <Link
          href="/#about"
          className="nav-link"
          style={{
            ...monoSmall,
            color: "var(--fg-3)",
            textDecoration: "none",
          }}
        >
          About
        </Link>
      </nav>

      {/* ── Project Header ── */}
      <header
        style={{
          paddingTop: 80,
          paddingBottom: 40,
          paddingLeft: 24,
          paddingRight: 24,
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: 48,
          maxWidth: 1200,
        }}
      >
        {/* Left: title + description */}
        <div>
          <div
            style={{
              ...monoSmall,
              fontSize: 10,
              color: "var(--fg-3)",
              marginBottom: 8,
            }}
          >
            Lab
          </div>
          <h1
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 15,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--fg)",
              margin: "0 0 12px",
              lineHeight: 1.3,
            }}
          >
            {piece.title}
          </h1>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--fg-2)",
              maxWidth: 400,
              margin: 0,
            }}
          >
            {piece.description}
          </p>
        </div>

        {/* Middle: tags */}
        <div style={{ minWidth: 120 }}>
          <div style={labelStyle}>Tags</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {piece.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  ...monoSmall,
                  color: "var(--fg-2)",
                }}
              >
                {tag}
              </span>
            ))}
            <span
              style={{
                ...monoSmall,
                color: "var(--fg-3)",
                marginTop: 4,
              }}
            >
              {piece.year}
            </span>
          </div>
        </div>

        {/* Right: placeholder for link if needed */}
        <div />
      </header>

      {/* ── Hero Image ── */}
      <section
        data-flip-id={piece.slug}
        style={{
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {piece.image ? (
          <img
            src={piece.image}
            alt={piece.title}
            style={{
              width: "100%",
              aspectRatio: "16 / 10",
              objectFit: "cover",
              borderRadius: 0,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 10",
              backgroundColor: piece.cover.bg,
              borderRadius: 0,
            }}
          />
        )}
      </section>

      {/* ── Body Content ── */}
      <article
        style={{
          maxWidth: 640,
          padding: "56px 24px 120px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontWeight: 400,
            lineHeight: 1.2,
            color: "var(--fg)",
            marginBottom: 16,
            letterSpacing: "-0.01em",
          }}
        >
          About this experiment
        </h2>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--fg-2)",
            marginBottom: 32,
          }}
        >
          {piece.description}
        </p>

        <div
          style={{
            height: 1,
            backgroundColor: "var(--fg-5)",
            margin: "40px 0",
          }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {piece.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--fg-3)",
                border: "1px solid var(--fg-4)",
                borderRadius: 3,
                padding: "3px 8px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* ── Next Experiment Nav ── */}
      {nextExperiment && (
        <div
          style={{
            borderTop: "1px solid var(--fg-5)",
            padding: "40px 24px 80px",
          }}
        >
          <Link
            href={`/lab/${nextExperiment.slug}`}
            className="nav-link"
            style={{
              ...monoSmall,
              color: "var(--fg-2)",
              textDecoration: "none",
              display: "inline-flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span style={{ color: "var(--fg-3)", fontSize: 10 }}>
              Next Project
            </span>
            <span>{nextExperiment.title}</span>
          </Link>
        </div>
      )}

      {/* ── Scroll Progress ── */}
      <ScrollProgress />
    </div>
  );
}
