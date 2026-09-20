import Link from "next/link";
import { notFound } from "next/navigation";
import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import { MediaRenderer } from "@/components/works/WorkTile";
import CaseStudyMinimap from "@/components/works/CaseStudyMinimap";
import CornerMark from "@/components/CornerMark";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Case study, laid out on the 12-column grid (see .grid12 in globals.css).
 *
 * Column assignments follow cathydolle.com/case-study/*, measured off its
 * rendered DOM: content starts at column 3 — columns 1-2 are reserved
 * margin that only the masthead occupies — metadata labels sit at columns
 * 3 / 7 / 9 with their values directly beneath rather than in a left-hand
 * sidebar, plates run 7 columns wide (or 3 for a portrait offset to
 * column 7), and prose is held to a 2-column measure of roughly 45
 * characters.
 *
 * Everything on this page is one type size. A section heading differs
 * from its own body by weight alone (text-label 500 vs text-value 400) —
 * which is why the old build's three identical microtype treatments
 * (field label / section heading / figure caption) now read apart.
 */
export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const workIndex = works.findIndex((w) => w.slug === slug);
  const work = works[workIndex];
  if (!work) notFound();

  const nextWork = works[(workIndex + 1) % works.length];

  // Figures are numbered by position among sections that actually carry
  // media, not by section index — a text-only section doesn't consume a
  // figure number.
  let figureCount = 0;
  const sections = (work.sections ?? []).map((section) => {
    const figureIndex = section.media ? ++figureCount : null;
    return { section, figureIndex };
  });

  // Hero first, then every section plate, in document order — the rail is
  // a picture of the page, so it carries exactly what the page shows.
  const minimapItems = [
    { media: work.media, label: work.title },
    ...sections
      .filter(({ section }) => section.media)
      .map(({ section, figureIndex }) => ({
        media: section.media!,
        label: section.caption ?? `figure ${figureIndex}`,
      })),
  ];

  return (
    <main className="relative min-h-screen w-full bg-ws-paper text-ws-ink">
      <RoomHeader activeRoom="index" />

      {/* pb-56 leaves room for CornerMark, which is absolutely positioned
          against <main> and lands wherever this article's bottom edge is. */}
      <article className="pb-56 pt-[var(--space-8)]">
        <header className="grid12">
          <h1 className="col-span-12 col-start-1 text-label uppercase md:col-span-4 md:col-start-3">
            {work.title}
          </h1>

          {/* Two metadata cells at columns 7 and 9. Every value carries its
              own label — stacking category and status under "Year" would
              have read as three years. Columns 11-12 stay clear because the
              minimap rail is fixed there. */}
          <div className="col-span-6 col-start-1 mt-[var(--space-3)] md:col-span-2 md:col-start-7 md:mt-0">
            <p className="text-label uppercase">Role</p>
            <p className="mt-[var(--space-3)] text-value uppercase text-ws-ink-mute">{work.role}</p>
            <p className="mt-[var(--space-3)] text-label uppercase">Category</p>
            <p className="mt-[var(--space-1)] text-value uppercase text-ws-ink-mute">
              {work.category.toLowerCase()}
            </p>
          </div>

          <div className="col-span-6 col-start-7 mt-[var(--space-3)] md:col-span-2 md:col-start-9 md:mt-0">
            <p className="text-label uppercase">Year</p>
            <p className="mt-[var(--space-3)] text-value uppercase text-ws-ink-mute">{work.year}</p>
            <p className="mt-[var(--space-3)] text-label uppercase">Status</p>
            <p className="mt-[var(--space-1)] text-value uppercase text-ws-ink-mute">
              {work.status.toLowerCase()}
            </p>
          </div>

          <p className="col-span-12 col-start-1 mt-[var(--space-3)] text-prose text-ws-ink-mute md:col-span-2 md:col-start-3">
            {work.description}
          </p>
        </header>

        <div className="grid12 mt-[var(--space-8)]">
          <div
            className="col-span-12 col-start-1 md:col-span-7 md:col-start-3"
            style={{ viewTransitionName: `work-${work.slug}` }}
          >
            <MediaRenderer media={work.media} aspectOverride="16 / 9" />
          </div>
        </div>

        {sections.map(({ section, figureIndex }, i) => {
          // Portrait plates sit 3 columns wide, offset right to column 7 —
          // the reference's second media width. Everything else runs the
          // standard 7.
          const isPortrait = section.media?.aspectRatio === "portrait";
          const plate = isPortrait
            ? "col-span-12 col-start-1 md:col-span-3 md:col-start-7"
            : "col-span-12 col-start-1 md:col-span-7 md:col-start-3";

          return (
            <section key={i} className="grid12 mt-[var(--space-8)]">
              {(section.heading || section.body) && (
                <div className="col-span-12 col-start-1 md:col-span-2 md:col-start-3">
                  {section.heading && <p className="text-label uppercase">{section.heading}</p>}
                  {section.body && (
                    <p className="mt-[var(--space-3)] text-prose text-ws-ink-mute">{section.body}</p>
                  )}
                </div>
              )}

              {section.media && (
                <div
                  className={`${plate} ${section.heading || section.body ? "mt-[var(--space-4)]" : ""}`}
                >
                  <MediaRenderer media={section.media} />
                  {section.caption && (
                    <p className="mt-[var(--space-1)] text-value uppercase text-ws-ink-mute">
                      fig. {String(figureIndex).padStart(2, "0")} &mdash; {section.caption}
                    </p>
                  )}
                </div>
              )}
            </section>
          );
        })}

        {/* Left-aligned to column 3 like everything else. The old build
            centred this block, which was the page's only axis break. */}
        <div className="grid12 mt-[var(--space-12)]">
          <div className="col-span-12 col-start-1 border-t border-ws-rule pt-[var(--space-3)] md:col-span-7 md:col-start-3">
            <p className="text-label uppercase text-ws-ink-mute">Next</p>
            <Link
              href={`/works/${nextWork.slug}`}
              className="mt-[var(--space-1)] block text-label uppercase transition-opacity hover:opacity-60"
            >
              {nextWork.title}
            </Link>
          </div>
        </div>
      </article>

      <CaseStudyMinimap items={minimapItems} />
      <CornerMark />
    </main>
  );
}
