import { notFound } from "next/navigation";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import { CASE_STUDIES } from "@/constants/case-studies";
import ScrollProgress from "@/components/ScrollProgress";
import TransitionLink from "@/components/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";

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

  const projects = PIECES.filter((p) => p.type === "project").sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = projects.findIndex((p) => p.slug === piece.slug);
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div data-page-scrollable>
      {/* ── Nav ── */}
      <nav className="detail-nav" data-nav-stagger="0">
        <TransitionLink href="/" className="nav-mark">
          HKJ
        </TransitionLink>
        <div className="nav-links">
          <ThemeToggle />
          <TransitionLink href="/about">About</TransitionLink>
        </div>
      </nav>

      {/* ── Project Header ── */}
      <header className="detail-header" data-stagger="0">
        <div>
          <h1 className="detail-title">{piece.title}</h1>
          <p className="detail-desc">{piece.description}</p>
        </div>
        <div className="detail-meta">
          <div className="detail-label">Roles</div>
          {piece.tags.map((tag) => (
            <span key={tag} className="detail-tag">{tag}</span>
          ))}
          <span className="detail-year">{piece.year}</span>
        </div>
      </header>

      {/* ── Hero Image ── */}
      <section className="detail-hero" data-stagger="1">
        {piece.image ? (
          <Image src={piece.image} alt={piece.title} width={1600} height={1000} className="detail-hero-img" priority />
        ) : (
          <div
            className="detail-hero-placeholder"
            style={{ backgroundColor: piece.cover.bg }}
          />
        )}
      </section>

      {/* ── Case Study Content ── */}
      <article className="detail-article" data-stagger="2">
        {cs ? (
          <>
            <h2 className="detail-heading">{cs.editorial.heading}</h2>
            {cs.editorial.subhead && (
              <p className="detail-subhead">{cs.editorial.subhead}</p>
            )}
            <p className="detail-copy">{cs.editorial.copy}</p>

            {cs.process && (
              <>
                <div className="detail-divider" />
                <h3 className="detail-label">{cs.process.title}</h3>
                <p className="detail-copy">{cs.process.copy}</p>
              </>
            )}

            {cs.engineering && (
              <>
                <div className="detail-divider" />
                <h3 className="detail-label">{cs.engineering.title}</h3>
                <p className="detail-copy">{cs.engineering.copy}</p>
                <div className="detail-signals">
                  {cs.engineering.signals.map((signal) => (
                    <span key={signal} className="detail-signal">{signal}</span>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="detail-copy">{piece.description}</p>
        )}
      </article>

      {/* ── Next Project Nav ── */}
      {nextProject && (
        <div className="detail-next" data-stagger="3">
          <TransitionLink
            href={`/work/${nextProject.slug}`}
            className="detail-next-link"
          >
            <span className="detail-next-label">Next Project</span>
            <span>{nextProject.title}</span>
          </TransitionLink>
        </div>
      )}

      <ScrollProgress />
    </div>
  );
}
