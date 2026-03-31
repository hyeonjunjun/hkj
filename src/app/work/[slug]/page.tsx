import { notFound } from "next/navigation";
import Link from "next/link";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import ScrollProgress from "@/components/ScrollProgress";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PIECES.filter((p) => p.type === "project").map((p) => ({
    slug: p.slug,
  }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const piece = PIECES.find((p) => p.slug === slug && p.type === "project");

  if (!piece) notFound();

  const cs = CASE_STUDIES[piece.slug];

  // Find prev/next projects for inter-project nav
  const projects = PIECES.filter((p) => p.type === "project").sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = projects.findIndex((p) => p.slug === piece.slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

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
        {prevProject && (
          <Link
            href={`/work/${prevProject.slug}`}
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

        {/* Middle: roles / tags */}
        <div style={{ minWidth: 120 }}>
          <div style={labelStyle}>Roles</div>
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

        {/* Right: external link */}
        <div>
          {cs && (
            <a
              href="#"
              className="nav-link"
              style={{
                ...monoSmall,
                color: "var(--fg-2)",
                textDecoration: "none",
              }}
            >
              Link &#x2198;
            </a>
          )}
        </div>
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

      {/* ── Case Study Content ── */}
      <article
        style={{
          maxWidth: 640,
          padding: "56px 24px 120px",
        }}
      >
        {cs ? (
          <>
            {/* Editorial */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "var(--fg)",
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              {cs.editorial.heading}
            </h2>
            {cs.editorial.subhead && (
              <p
                style={{
                  ...monoSmall,
                  fontSize: 10,
                  color: "var(--fg-3)",
                  marginBottom: 16,
                }}
              >
                {cs.editorial.subhead}
              </p>
            )}
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--fg-2)",
                marginBottom: 0,
              }}
            >
              {cs.editorial.copy}
            </p>

            {/* Process */}
            {cs.process && (
              <>
                <div
                  style={{
                    height: 1,
                    backgroundColor: "var(--fg-5)",
                    margin: "40px 0",
                  }}
                />
                <h3 style={{ ...labelStyle, marginBottom: 16 }}>
                  {cs.process.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--fg-2)",
                  }}
                >
                  {cs.process.copy}
                </p>
              </>
            )}

            {/* Engineering */}
            {cs.engineering && (
              <>
                <div
                  style={{
                    height: 1,
                    backgroundColor: "var(--fg-5)",
                    margin: "40px 0",
                  }}
                />
                <h3 style={{ ...labelStyle, marginBottom: 16 }}>
                  {cs.engineering.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--fg-2)",
                    marginBottom: 16,
                  }}
                >
                  {cs.engineering.copy}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {cs.engineering.signals.map((signal) => (
                    <span
                      key={signal}
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
                      {signal}
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--fg-2)",
            }}
          >
            {piece.description}
          </p>
        )}
      </article>

      {/* ── Next Project Nav ── */}
      {nextProject && (
        <div
          style={{
            borderTop: "1px solid var(--fg-5)",
            padding: "40px 24px 80px",
          }}
        >
          <Link
            href={`/work/${nextProject.slug}`}
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
            <span>{nextProject.title}</span>
          </Link>
        </div>
      )}

      {/* ── Scroll Progress ── */}
      <ScrollProgress />
    </div>
  );
}
