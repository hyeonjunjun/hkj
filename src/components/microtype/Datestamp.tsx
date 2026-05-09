/**
 * Datestamp — a date in the canonical site format.
 *
 *   2026.05.09         — full (YYYY.MM.DD)
 *   2026.05            — month (YYYY.MM)
 *   2026               — year (YYYY)
 *   2026.04 → 2026.04  — range
 *   2026.04 → present  — open-ended (live)
 *
 * The site's date format is YYYY.MM.DD with periods, not slashes
 * or dashes. This is intentional: periods read as the divider
 * style of catalog numbers (RJ-26-01), bibliographies, and the
 * IBAN/ISO style. They feel "cataloged" rather than "casual."
 *
 * Composition:
 *   <Datestamp date="2026.05.09" />               — single
 *   <Datestamp date="2026.04" />                  — month
 *   <Datestamp from="2026.04" />                  — open-ended
 *   <Datestamp from="2026.02" to="2026.04" />     — range
 *
 * Pass either `date` (single point in time) OR `from`/`to`
 * (interval). Mixing both renders only `date`.
 */

type Props =
  | {
      date: string;
      from?: never;
      to?: never;
    }
  | {
      date?: never;
      from: string;
      to?: string;
    };

export default function Datestamp(props: Props) {
  if ("date" in props && props.date) {
    return (
      <span className="t-caption tabular ds">
        {props.date}
      </span>
    );
  }

  const from = "from" in props ? props.from : "";
  const to = "to" in props ? props.to : undefined;
  return (
    <span className="t-caption tabular ds">
      {from}
      <span className="ds__arrow" aria-hidden> → </span>
      {to ?? <span className="ds__present">present</span>}
      <style>{`
        .ds__arrow {
          color: var(--ink-4);
          margin: 0 0.1em;
        }
        .ds__present {
          color: var(--accent);
        }
      `}</style>
    </span>
  );
}
