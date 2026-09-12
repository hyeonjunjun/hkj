import Link from "next/link";
import { notFound } from "next/navigation";
import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import { MediaRenderer } from "@/components/works/WorkTile";
import CornerMark from "@/components/CornerMark";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const workIndex = works.findIndex((w) => w.slug === slug);
  const work = works[workIndex];
  if (!work) notFound();

  const nextWork = works[(workIndex + 1) % works.length];

  // Figures are numbered by position among sections that actually carry
  // media, not by section index — a text-only section (like every
  // second one in the placeholder data) doesn't consume a figure number.
  let figureCount = 0;
  const sections = (work.sections ?? []).map((section) => {
    const figureIndex = section.media ? ++figureCount : null;
    return { section, figureIndex };
  });

  return (
    <main className="relative min-h-screen w-full bg-ws-paper font-instrument-sans text-ws-ink">
      <RoomHeader roomLabel="Index" activeRoom="index" />

      {/* pb-56 (not a smaller pad) leaves room for CornerMark, which is
          `absolute bottom-[edge-margin]` against <main> and lands wherever
          this article's own bottom edge happens to be. */}
      <article className="pt-16 md:pt-24 pb-56">
        <div className="px-[var(--edge-margin)] max-w-[1500px] mx-auto">
          <header className="mb-16 md:mb-24 max-w-[900px]">
            <h1 className="font-instrument-sans text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.01em] text-ws-ink">
              {work.title}
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="sticky top-24 font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/50 flex flex-col gap-4">
                <div>
                  <span className="block text-ws-ink/40 mb-1">Client</span>
                  <span className="text-ws-ink">{work.title}</span>
                </div>
                <div>
                  <span className="block text-ws-ink/40 mb-1">Role</span>
                  <span className="text-ws-ink">{work.role}</span>
                </div>
                <div>
                  <span className="block text-ws-ink/40 mb-1">Year</span>
                  <span className="text-ws-ink">{work.year}</span>
                </div>
                <div>
                  <span className="block text-ws-ink/40 mb-1">Category</span>
                  <span className="text-ws-ink">{work.category.toLowerCase()}</span>
                </div>
                <div>
                  <span className="block text-ws-ink/40 mb-1">Status</span>
                  <span className="text-ws-ink">{work.status.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-7 lg:col-start-5">
              <p className="font-instrument-sans text-[15px] md:text-[16px] leading-[1.7] text-ws-ink/70">
                {work.description}
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-[70vh] w-full md:h-[85vh]">
          <MediaRenderer media={work.media} fit="cover" />
        </div>

        {sections.length > 0 && (
          <div className="px-[var(--edge-margin)] max-w-[1500px] mx-auto">
            {sections.map(({ section, figureIndex }, i) => (
              <section key={i} className={i === 0 ? "mt-24 md:mt-32" : "mt-20 md:mt-28"}>
                {(section.heading || section.body) && (
                  <div className="max-w-[640px]">
                    {section.heading && (
                      <p className="mb-3 font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/40">
                        {section.heading}
                      </p>
                    )}
                    {section.body && (
                      <p className="font-instrument-sans text-[15px] md:text-[16px] leading-[1.7] text-ws-ink/70">
                        {section.body}
                      </p>
                    )}
                  </div>
                )}

                {section.media && (
                  <div className={section.heading || section.body ? "mt-10 md:mt-12 max-w-[900px]" : "max-w-[900px]"}>
                    <MediaRenderer media={section.media} />
                    {section.caption && (
                      <p className="mt-3 font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/40">
                        fig. {String(figureIndex).padStart(2, "0")} &mdash; {section.caption}
                      </p>
                    )}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}

        <div className="mt-24 md:mt-32 px-[var(--edge-margin)] max-w-[1500px] mx-auto border-t border-ws-ink/10 pt-12 text-center">
          <p className="mb-4 font-instrument-sans text-[10px] font-medium uppercase tracking-[0.15em] text-ws-ink/40">
            next
          </p>
          <Link
            href={`/works/${nextWork.slug}`}
            className="font-instrument-sans text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-tight tracking-[-0.01em] text-ws-ink transition-opacity hover:opacity-60"
          >
            {nextWork.title}
          </Link>
        </div>
      </article>
      <CornerMark />
    </main>
  );
}
