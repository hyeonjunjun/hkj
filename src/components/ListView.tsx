"use client";

import Link from "next/link";
import type { Piece } from "@/constants/pieces";

/**
 * ListView — homepage List View per spec §05.
 *
 *   §01   Untitled                       Reserved      2026   →
 *   §02   Gyeol: 결                       Brand · 3D    2026   →
 *
 * Hairline rows, 5-column grid. Number (mono microtype) · title (sans
 * reading) · type/sector (sans micro) · year (mono micro) · arrow.
 *
 * Hover (real pieces only): subtle ink-ghost row tint, arrow slide
 * 6px, sibling rows dim to 0.55 — same parent-driven dim pattern used
 * by the grid. Placeholders render as plain rows, no link, no hover.
 *
 * Mobile (<860px): collapses to 3 columns (number / title / arrow).
 */
type Props = {
  pieces: Piece[];
};

export default function ListView({ pieces }: Props) {
  return (
    <ol className="listview">
      {pieces.map((piece) => {
        const number = `§${piece.number}`;
        const title = piece.placeholder ? "Untitled" : piece.title;
        const sector = piece.placeholder ? "Reserved" : piece.sector;
        const isLink = !piece.placeholder;

        const inner = (
          <>
            <span className="listview__num tabular">{number}</span>
            <span className="listview__title">{title}</span>
            <span className="listview__type">{sector}</span>
            <span className="listview__year tabular">{piece.year}</span>
            <span className="listview__arrow" aria-hidden>
              →
            </span>
          </>
        );

        return (
          <li
            key={piece.slug}
            className="listview__row"
            data-placeholder={piece.placeholder ? "" : undefined}
          >
            {isLink ? (
              <Link
                href={`/work/${piece.slug}`}
                className="listview__link"
                aria-label={`${title} — view`}
              >
                {inner}
              </Link>
            ) : (
              <div className="listview__link listview__link--inert">
                {inner}
              </div>
            )}
          </li>
        );
      })}

      <ListStyle />
    </ol>
  );
}

function ListStyle() {
  return (
    <style>{`
      .listview {
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
      }
      .listview__row {
        border-top: 1px solid var(--ink-hair);
      }
      .listview__row:last-child {
        border-bottom: 1px solid var(--ink-hair);
      }

      .listview__link {
        display: grid;
        grid-template-columns: 56px 1fr 240px 100px 80px;
        gap: 24px;
        align-items: baseline;
        padding: 18px 4px;
        color: inherit;
        background: transparent;
        transition: background-color 380ms var(--ease), opacity 400ms var(--ease);
      }

      /* Number — mono microtype */
      .listview__num {
        font-family: var(--font-stack-mono);
        font-size: var(--type-number);
        letter-spacing: 0.06em;
        color: var(--ink-3);
      }

      /* Title — sans reading register */
      .listview__title {
        font-family: var(--font-stack-sans);
        font-size: var(--type-title);
        font-weight: 400;
        letter-spacing: 0;
        color: var(--ink);
        line-height: 1.3;
      }

      /* Type / sector — sans micro per spec (NOT mono) */
      .listview__type {
        font-family: var(--font-stack-sans);
        font-size: var(--type-meta);
        letter-spacing: 0.04em;
        color: var(--ink-3);
        text-transform: uppercase;
      }

      /* Year — mono micro */
      .listview__year {
        font-family: var(--font-stack-mono);
        font-size: var(--type-meta);
        letter-spacing: 0.04em;
        color: var(--ink-3);
      }

      /* Arrow — text glyph, right-aligned */
      .listview__arrow {
        font-family: var(--font-stack-mono);
        font-size: var(--type-meta);
        color: var(--ink);
        justify-self: end;
        transition: transform 200ms cubic-bezier(0.33, 0.12, 0.15, 1);
      }

      /* Placeholder rows — title softens, arrow recedes, no hover. */
      .listview__row[data-placeholder] .listview__title { color: var(--ink-3); }
      .listview__row[data-placeholder] .listview__arrow { color: var(--ink-4); }
      .listview__link--inert { cursor: default; }

      /* Hover behaviour — only real pieces (Link rows) react.
         Parent-driven dim: when listview is hovered, all rows fade to
         0.55; the actively-hovered row stays at full opacity. */
      .listview:hover .listview__row .listview__link {
        opacity: 0.55;
      }
      .listview:hover .listview__row:hover .listview__link,
      .listview:hover .listview__row:focus-within .listview__link {
        opacity: 1;
      }
      .listview__row:hover a.listview__link,
      .listview__row:focus-within a.listview__link {
        background-color: var(--ink-ghost);
      }
      .listview__row:hover a.listview__link .listview__arrow,
      .listview__row:focus-within a.listview__link .listview__arrow {
        transform: translateX(6px);
      }

      /* Placeholders never tint or slide on hover. */
      .listview__row[data-placeholder]:hover .listview__link--inert {
        background-color: transparent;
      }
      .listview__row[data-placeholder]:hover .listview__arrow {
        transform: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .listview__link,
        .listview__arrow {
          transition: none;
        }
        .listview__row:hover a.listview__link .listview__arrow {
          transform: none;
        }
      }

      @media (max-width: 860px) {
        .listview__link {
          grid-template-columns: 44px 1fr 28px;
          gap: 16px;
          padding: 16px 2px;
        }
        .listview__type,
        .listview__year {
          display: none;
        }
      }
    `}</style>
  );
}
