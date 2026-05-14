import type { WorkSection } from "@/constants/work-content";
import { WorkMediaSingle, WorkMediaPair } from "./WorkMedia";

/**
 * WorkSections — dispatch renderer for the structured section array
 * defined per project in WORK_CONTENT.
 *
 * Each section kind maps to its own component / layout:
 *
 *   hero        → full-bleed (or boxed) media at the top
 *   media       → single media block (image / video / placeholder)
 *   media-pair  → side-by-side 2-up media row
 *   prose       → editorial column with optional heading
 *   quote       → large pulled quote with attribution
 *   spec        → label/value table (uppercase label, sentence value)
 *   divider     → hairline rule with breathing room
 *
 * The first section is conventionally the hero. Subsequent sections
 * follow the project's chosen rhythm. Spacing between sections is
 * handled by the parent .work-detail__sections grid.
 */

interface Props {
  sections: WorkSection[];
}

export function WorkSections({ sections }: Props) {
  return (
    <div className="work-sections">
      {sections.map((section, i) => (
        <SectionItem key={i} section={section} index={i} />
      ))}

      <style>{`
        .work-sections {
          display: grid;
          row-gap: clamp(40px, 5.6vh, 80px);
        }
      `}</style>
    </div>
  );
}

function SectionItem({ section, index }: { section: WorkSection; index: number }) {
  switch (section.kind) {
    case "hero":
      return (
        <WorkMediaSingle
          media={section.media}
          full={section.full ?? true}
          caption={section.caption}
          priority={index === 0}
        />
      );
    case "media":
      return (
        <WorkMediaSingle
          media={section.media}
          full={section.full}
          caption={section.caption}
        />
      );
    case "media-pair":
      return <WorkMediaPair left={section.left} right={section.right} caption={section.caption} />;
    case "prose":
      return (
        <section className="work-prose">
          {section.heading && (
            <h2 className="t-warmth work-prose__h">{section.heading}</h2>
          )}
          <div className="t-warmth work-prose__body">{section.body}</div>
          <style>{`
            .work-prose {
              display: grid;
              grid-template-columns: 160px 1fr;
              column-gap: clamp(20px, 3vw, 48px);
              row-gap: 12px;
              align-items: start;
              max-width: 880px;
            }
            .work-prose__h {
              color: var(--ink-3);
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              margin: 0;
              padding-top: 4px;
              line-height: 1.3;
            }
            .work-prose__body {
              color: var(--ink-2);
              font-size: 14px;
              line-height: 1.65;
              letter-spacing: -0.005em;
              max-width: 64ch;
              display: grid;
              row-gap: 1.1em;
            }
            .work-prose__body p { margin: 0; }
            .work-prose__body em {
              font-style: italic;
              color: var(--ink);
            }
            @media (max-width: 720px) {
              .work-prose {
                grid-template-columns: 1fr;
                row-gap: 8px;
              }
            }
          `}</style>
        </section>
      );
    case "quote":
      return (
        <blockquote className="work-quote">
          <p className="t-warmth work-quote__text">
            <span aria-hidden className="work-quote__open">&ldquo;</span>
            {section.text}
            <span aria-hidden className="work-quote__close">&rdquo;</span>
          </p>
          {section.attribution && (
            <cite className="t-warmth work-quote__cite">— {section.attribution}</cite>
          )}
          <style>{`
            .work-quote {
              margin: 0;
              padding: clamp(16px, 3vh, 36px) 0;
              max-width: 880px;
              display: grid;
              row-gap: 12px;
            }
            .work-quote__text {
              color: var(--ink);
              font-family: "Newsreader", Georgia, serif;
              font-style: italic;
              font-weight: 400;
              font-size: clamp(22px, 3.4vw, 36px);
              line-height: 1.25;
              letter-spacing: -0.015em;
              margin: 0;
              max-width: 28ch;
            }
            .work-quote__open,
            .work-quote__close {
              color: var(--ink-3);
            }
            .work-quote__cite {
              color: var(--ink-3);
              font-style: normal;
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.12em;
              text-transform: uppercase;
            }
          `}</style>
        </blockquote>
      );
    case "spec":
      return (
        <section className="work-spec">
          <dl className="work-spec__list">
            {section.rows.map((row) => (
              <div key={row.label} className="work-spec__row">
                <dt className="t-warmth">{row.label}</dt>
                <dd className="t-warmth">{row.value}</dd>
              </div>
            ))}
          </dl>
          <style>{`
            .work-spec {
              max-width: 880px;
            }
            .work-spec__list {
              display: grid;
              grid-template-columns: 160px 1fr;
              column-gap: clamp(20px, 3vw, 48px);
              row-gap: 10px;
              margin: 0;
              max-width: 64ch;
            }
            .work-spec__row {
              display: contents;
            }
            .work-spec dt {
              color: var(--ink-3);
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              padding-top: 4px;
              line-height: 1.3;
            }
            .work-spec dd {
              color: var(--ink);
              font-size: 13px;
              font-weight: 400;
              letter-spacing: -0.005em;
              line-height: 1.4;
              margin: 0;
            }
            @media (max-width: 720px) {
              .work-spec__list {
                grid-template-columns: 1fr;
                row-gap: 4px;
              }
              .work-spec dd { padding-bottom: 8px; }
            }
          `}</style>
        </section>
      );
    case "divider":
      return <hr className="t-rule" />;
    default:
      return null;
  }
}
