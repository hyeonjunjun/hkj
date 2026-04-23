export interface Note {
  slug: string;      // "n-001"
  number: string;    // "001"
  date: string;      // "2026-04-22" (ISO for sorting)
  dateLabel: string; // "2026.04.22" (display)
  month: string;     // "04" (for Folio month segment)
  title: string;
  excerpt: string;
  body: string;
  tags?: string[];
}

export const NOTES: Note[] = [
  {
    slug: "n-001",
    number: "001",
    date: "2026-04-22",
    dateLabel: "2026.04.22",
    month: "04",
    title: "On restraint as the hardest move",
    excerpt:
      "Notes from the last two weeks building out the portfolio's taste polish — why removing ambient motion was the single biggest quality upgrade.",
    body:
      "The harder lesson of the last two weeks: every time I added something tasteful, the site got worse.\n\n" +
      "I tried five different ambient ASCII directions. Flowers swaying. A drifting marquee. A morphing corner stamp. A density-mapped landscape. A field of dots at every opacity from 7% to 32%. None of them stayed.\n\n" +
      "The thing that finally worked was cutting them all. The site reads more like a studio catalog now and less like a portfolio template. Morrison's lesson about documentary equality — treat every object the same — applies to motion too. The absence of ambient motion is itself the restraint.",
    tags: ["process", "restraint"],
  },
];
