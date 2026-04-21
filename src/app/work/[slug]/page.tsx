"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import CaseStudy from "@/components/CaseStudy";
import { PIECES } from "@/constants/pieces";

export default function WorkDetailPage() {
  const params = useParams<{ slug: string }>();
  const piece = PIECES.find((p) => p.slug === params?.slug);

  if (!piece) {
    return (
      <main id="main" className="work-404">
        <p className="eyebrow">
          <span>Work</span>
          <span className="eyebrow__sep">·</span>
          <span>Not found</span>
        </p>
        <p className="work-404__body">
          No plate at that address. <Link href="/" className="work-404__link">Return to the index</Link>.
        </p>
        <style>{`
          .work-404 {
            min-height: 100svh;
            padding: clamp(96px, 14vh, 160px) clamp(24px, 6vw, 72px);
            display: grid;
            gap: 20px;
            place-content: center;
          }
          .work-404__body {
            font-family: var(--font-stack-serif);
            font-weight: 380;
            font-size: 17px;
            line-height: 1.6;
            color: var(--ink-2);
            max-width: 40ch;
          }
          .work-404__link { color: var(--ink); border-bottom: 1px solid var(--ink-hair); }
          .work-404__link:hover { border-bottom-color: var(--ink); }
        `}</style>
      </main>
    );
  }

  return (
    <main id="main">
      <CaseStudy piece={piece} />
    </main>
  );
}
