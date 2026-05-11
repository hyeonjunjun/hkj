/**
 * SectionHeader — the recurring beat of the page.
 *
 *   WORK                                       04 ENTRIES · 2026.05.09
 *   ─────────────────────────────────────────────────────────────────
 *
 * A section's beginning is always:
 *   - a `t-section` label (caps, tracked, weight 500)
 *   - an optional `t-meta` right-aligned (count + updated date / etc.)
 *   - a hairline rule below
 *
 * Used at the top of every section on the page (WORK, STUDIO,
 * CURRENTLY, NOTES, CONTACT). Reuse, don't reinvent — the rhythm
 * is what makes the mono framework feel composed.
 *
 * Composition:
 *   <SectionHeader label="Work" meta="04 entries · 2026.05.09" />
 *
 * Variants via props:
 *   - dim={true}        — labels at --ink-3 instead of --ink (used
 *                          when the section's *body* prose is the
 *                          primary content and the label should recede)
 *   - icon="◆"          — leading glyph (e.g. ◆ for live sections,
 *                          ● for static, none by default)
 *   - iconLive={true}   — pulse the icon as a live indicator
 */

import type { ReactNode } from "react";

type Props = {
  label: string;
  meta?: ReactNode;
  icon?: string;
  iconLive?: boolean;
  dim?: boolean;
};

export default function SectionHeader({
  label,
  meta,
  icon,
  iconLive,
  dim,
}: Props) {
  return (
    <header className="sh">
      <div className="sh__row">
        <span className="sh__label-group">
          {icon && (
            <span
              className="sh__icon"
              data-live={iconLive ? "" : undefined}
              aria-hidden
            >
              {icon}
            </span>
          )}
          <span className={dim ? "t-meta" : "t-section"}>{label}</span>
        </span>
        {meta && <span className="t-meta sh__meta">{meta}</span>}
      </div>
      <hr className="t-rule" />

      <style>{`
        .sh {
          display: block;
        }
        .sh__row {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: baseline;
          gap: var(--space-3);
          padding-bottom: var(--space-1);
        }
        .sh__label-group {
          display: inline-flex;
          align-items: baseline;
          gap: var(--space-1);
        }
        .sh__meta {
          justify-self: end;
          text-align: right;
        }
        .sh__icon {
          font-family: var(--font-stack-mono);
          font-size: var(--type-eyebrow);
          color: var(--ink-3);
          line-height: 1;
        }
        .sh__icon[data-live] {
          color: var(--accent);
          animation: sh-live 2.6s ease-in-out infinite;
        }
        @keyframes sh-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sh__icon[data-live] { animation: none; }
        }
      `}</style>
    </header>
  );
}
