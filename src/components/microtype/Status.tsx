/**
 * Status — a piece's lifecycle state, rendered as glyph + label.
 *
 *   ◆ LIVE     — wip, currently in development. Amber. Pulses.
 *   ● 2026     — shipped. Cream, full ink. Static.
 *   ○ ARCHIVED — retired. Dimmer ink. Static. (future)
 *   ◇ QUEUED   — planned, not started. Even dimmer. Static. (future)
 *
 * The glyph + caps text pair is the unit. Use this anywhere a piece
 * needs a visible state — work index rows, currently section, hero
 * eyebrow, etc. The pulse animation is reserved for the live state
 * only; everything else is dead-still.
 *
 * Composition:
 *   <Status status="wip" label="Live" />
 *   <Status status="shipped" label="2026" />
 */

type StatusKind = "wip" | "shipped" | "archived" | "queued";

const GLYPHS: Record<StatusKind, string> = {
  wip:      "◆",
  shipped:  "●",
  archived: "○",
  queued:   "◇",
};

type Props = {
  status: StatusKind;
  /** Right-side label text. Defaults to the status name uppercased. */
  label?: string;
};

export default function Status({ status, label }: Props) {
  const text = label ?? status;
  const live = status === "wip";

  return (
    <span className="status" data-status={status}>
      <span className="status__glyph" aria-hidden>
        {GLYPHS[status]}
      </span>
      <span className="status__label">{text}</span>

      <style>{`
        .status {
          display: inline-flex;
          align-items: baseline;
          gap: var(--space-1);
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          font-weight: 400;
          letter-spacing: var(--track-loosest);
          line-height: 1;
          text-transform: uppercase;
          color: var(--ink-3);
          font-feature-settings: "tnum" on, "lnum" on;
          font-variant-numeric: tabular-nums lining-nums;
        }
        .status__glyph {
          font-size: var(--type-section);
          line-height: 1;
        }
        .status[data-status="shipped"] .status__glyph { color: var(--ink); }
        .status[data-status="wip"] {
          color: var(--accent);
          animation: status-live 2.6s ease-in-out infinite;
        }
        .status[data-status="wip"] .status__glyph { color: var(--accent); }
        .status[data-status="archived"] { color: var(--ink-4); }
        .status[data-status="archived"] .status__glyph { color: var(--ink-4); }
        .status[data-status="queued"] { color: var(--ink-4); }
        .status[data-status="queued"] .status__glyph { color: var(--ink-3); }

        @keyframes status-live {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        @media (prefers-reduced-motion: reduce) {
          .status[data-status="wip"] { animation: none; }
        }
      `}</style>
    </span>
  );
}
