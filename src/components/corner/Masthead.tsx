/**
 * Masthead — the corner's anchor wordmark.
 *
 * Just `RYAN JUN`. No co-naming, no studio framing. Hosts the
 * `corner-mark` view-transition-name so the masthead morphs into
 * the note-detail header on navigation. (The site-wide `rj-mark`
 * is already owned by the global Logo component; using a distinct
 * name keeps the corner's transitions independent.)
 *
 * Pure presentation. Uses the `t-monument` role from the existing
 * type system.
 */

export function Masthead() {
  return (
    <header className="corner-masthead">
      <h1 className="t-monument corner-masthead__mark">Ryan Jun</h1>
      <style>{`
        .corner-masthead {
          display: block;
        }
        .corner-masthead__mark {
          /* OBYS-tier scale already encoded in t-monument. Lowercase the
             transform here so the name reads as quiet identity rather
             than shouting masthead. */
          text-transform: none;
          letter-spacing: -0.02em;
          view-transition-name: corner-mark;
        }
      `}</style>
    </header>
  );
}
