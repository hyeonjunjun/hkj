import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PIECES, type Piece } from "@/constants/pieces";
import { WORK_CONTENT, type WorkContent } from "@/constants/work-content";
import { CornerNav } from "@/components/corner/CornerNav";
import { CornerAudio } from "@/components/corner/CornerAudio";
import { WorkCredits } from "@/components/corner/work/WorkCredits";
import { WorkSections } from "@/components/corner/work/WorkSections";
import { WorkEnd } from "@/components/corner/work/WorkEnd";

/**
 * /v/corner/work/[slug] — project detail page in the corner register.
 *
 * Reference framework: ethan&tom + naughtyduk — full-bleed hero,
 * editorial credits block, mixed media sequence, generous pacing,
 * next-project at the foot. Same CornerNav + CornerAudio for
 * continuity with the rest of /v/corner.
 *
 * Pieces with custom WORK_CONTENT entries render the authored
 * sections; pieces without fall back to default content derived from
 * the Piece data so every project has a working detail page from day
 * one.
 */

const SORTED: ReadonlyArray<Piece> = [...PIECES].sort((a, b) => a.order - b.order);

interface Params {
  slug: string;
}

export function generateStaticParams() {
  return SORTED.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const piece = SORTED.find((p) => p.slug === slug);
  if (!piece) return { title: "Project not found" };
  return {
    title: `${piece.title} — Ryan Jun`,
    description: piece.description,
  };
}

/**
 * If a piece has no explicit content entry, derive a sensible default
 * from the Piece data — hero media (from cover) + a prose section
 * with the description. Lets every piece have a working detail page
 * before bespoke content is authored.
 */
function deriveDefaultContent(piece: Piece): WorkContent {
  const heroMedia: WorkContent["sections"][number] = piece.cover
    ? piece.cover.kind === "video"
      ? {
          kind: "hero",
          full: true,
          media: {
            kind: "video",
            src: piece.cover.src,
            poster: piece.cover.poster,
            alt: piece.title,
            aspect: piece.coverAspect ?? "16 / 9",
          },
        }
      : {
          kind: "hero",
          full: true,
          media: {
            kind: "image",
            src: piece.cover.src,
            alt: piece.title,
            aspect: piece.coverAspect ?? "16 / 9",
          },
        }
    : {
        kind: "hero",
        full: true,
        media: {
          kind: "placeholder",
          alt: `${piece.title} — hero in progress`,
          aspect: piece.coverAspect ?? "16 / 9",
        },
      };

  return {
    slug: piece.slug,
    sections: [
      heroMedia,
      {
        kind: "prose",
        heading: "Brief",
        body: <p>{piece.description}</p>,
      },
    ],
  };
}

export default async function WorkDetailPage({
  params,
}: { params: Promise<Params> }) {
  const { slug } = await params;
  const piece = SORTED.find((p) => p.slug === slug);
  if (!piece) notFound();

  const content = WORK_CONTENT[slug] ?? deriveDefaultContent(piece);
  // Next piece in sorted order; loop to the first when we're on the last.
  const currentIdx = SORTED.indexOf(piece);
  const next = SORTED[(currentIdx + 1) % SORTED.length];

  return (
    <div className="work-detail" data-page="corner">
      <CornerNav />
      <main className="work-detail__main">
        <WorkSections sections={content.sections} />
        <WorkCredits piece={piece} content={WORK_CONTENT[slug]} />
        <WorkEnd next={next ?? null} />
      </main>
      <CornerAudio />

      <style>{`
        .work-detail {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr;
          row-gap: clamp(40px, 6vh, 80px);
          padding-bottom: clamp(120px, 16vh, 200px);
          position: relative;
          z-index: 2;
        }
        .work-detail__main {
          padding: 0 var(--margin-page);
          max-width: 1120px;
          margin-inline: auto;
          width: 100%;
          display: grid;
          row-gap: clamp(56px, 7vh, 96px);
        }
      `}</style>
    </div>
  );
}
