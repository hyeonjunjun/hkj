import { notFound } from "next/navigation";
import Image from "next/image";
import { PIECES } from "@/constants/pieces";
import ScrollProgress from "@/components/ScrollProgress";
import TransitionLink from "@/components/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";

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

  const experiments = PIECES.filter((p) => p.type === "experiment").sort(
    (a, b) => a.order - b.order
  );
  const currentIndex = experiments.findIndex((p) => p.slug === piece.slug);
  const nextExperiment =
    currentIndex < experiments.length - 1
      ? experiments[currentIndex + 1]
      : null;

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
          <div className="detail-type-label">Archive</div>
          <h1 className="detail-title">{piece.title}</h1>
          <p className="detail-desc">{piece.description}</p>
        </div>
        <div className="detail-meta">
          <div className="detail-label">Tags</div>
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

      {/* ── Body Content ── */}
      <article className="detail-article" data-stagger="2">
        <h2 className="detail-heading">About this experiment</h2>
        <p className="detail-copy">{piece.description}</p>

        <div className="detail-divider" />

        <div className="detail-signals">
          {piece.tags.map((tag) => (
            <span key={tag} className="detail-signal">{tag}</span>
          ))}
        </div>
      </article>

      {/* ── Next Experiment Nav ── */}
      {nextExperiment && (
        <div className="detail-next" data-stagger="3">
          <TransitionLink
            href={`/lab/${nextExperiment.slug}`}
            className="detail-next-link"
          >
            <span className="detail-next-label">Next</span>
            <span>{nextExperiment.title}</span>
          </TransitionLink>
        </div>
      )}

      <ScrollProgress />
    </div>
  );
}
