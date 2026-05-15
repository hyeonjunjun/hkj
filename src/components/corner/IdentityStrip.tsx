/**
 * IdentityStrip — one-line "who/what/want" under the masthead.
 *
 * The single hardest content task in the 9-day sprint (per spec). The
 * goal is a sentence Ryan can say in one breath at a networking event.
 * Editable directly here as the practice evolves; until then, a
 * working draft that's specific without overclaiming.
 *
 * Treatment: italic Newsreader is reserved for *this* element only in
 * the corner — the one editorial accent in an otherwise mono page.
 * Falls back to italic mono if Newsreader fails to load.
 */

export function IdentityStrip() {
  return (
    <p className="corner-identity t-voice">
      <span className="corner-identity__verb">currently</span>
      {" "}
      designing, building, and directing a multidisciplinary practice
      from <span className="corner-identity__place">new york</span>.
      <style>{`
        .corner-identity {
          /* Inherits italic Newsreader from t-voice. Size override pushes
             it to t-statement scale for the masthead role. */
          font-size: var(--type-statement);
          max-width: 52ch;
        }
        .corner-identity__verb {
          /* small caps register for the lede word — anchors the line */
          font-family: var(--font-stack-chrome);
          font-style: normal;
          font-size: var(--type-meta);
          letter-spacing: var(--track-loose);
          text-transform: uppercase;
          color: var(--ink-3);
          margin-right: 0.4em;
        }
        .corner-identity__place {
          color: var(--ink);
        }
      `}</style>
    </p>
  );
}
