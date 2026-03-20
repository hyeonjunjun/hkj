export type JournalTag = "design" | "code" | "life";

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  tags: JournalTag[];
  /** Short entries: full content shown inline. Long entries: excerpt shown, full body on detail page. */
  excerpt: string;
  /** If present, entry gets its own /journal/[slug] detail page */
  body?: string;
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "on-restraint",
    title: "On Restraint",
    date: "2026-03-12",
    tags: ["design"],
    excerpt:
      "The hardest design decision is what to leave out. Every element you add dilutes the ones already there. The best work I've seen this year shares one trait — it knows when to stop.",
    body: "The hardest design decision is what to leave out. Every element you add dilutes the ones already there. The best work I've seen this year shares one trait — it knows when to stop.\n\nI've been thinking about this while redesigning my own portfolio. The temptation to add one more animation, one more section, one more clever interaction is constant. But each addition carries weight. Not just visual weight — cognitive weight. Every new thing asks the viewer to care about something else.\n\nDieter Rams said it decades ago: less, but better. The 'but better' part is what most people skip. Removing things is easy. Removing things while making what remains feel complete — that's the work.\n\nI've started keeping a 'cut list' for every project. Things I wanted to add but chose not to. Looking back at those lists, I've never once regretted a cut. The projects that felt most alive were always the most restrained.",
  },
  {
    id: "variable-fonts-weight",
    title: "Variable Fonts and Perceived Weight",
    date: "2026-03-05",
    tags: ["code", "design"],
    excerpt:
      "Discovered that interpolating font-weight in CSS transitions doesn't produce the same optical result as stepping between named weights. The intermediate values look muddy at small sizes. Stick to discrete weight stops for body text.",
  },
  {
    id: "walking-seoul",
    title: "Walking Seoul at 5am",
    date: "2026-02-20",
    tags: ["life"],
    excerpt:
      "The city is a different thing before the shops open. No signage competing for attention, just architecture and light. Noticed how the street grid creates these accidental frames — a gap between two buildings perfectly centers a mountain in the distance. Nobody designed that. Or maybe the city did, slowly, over centuries.",
  },
  {
    id: "scroll-hijacking",
    title: "Against Scroll Hijacking",
    date: "2026-02-14",
    tags: ["design", "code"],
    excerpt:
      "After building several smooth-scroll experiences, I've come to believe that scroll hijacking should be used sparingly — and only when the content genuinely benefits from controlled pacing.",
    body: "After building several smooth-scroll experiences, I've come to believe that scroll hijacking should be used sparingly — and only when the content genuinely benefits from controlled pacing.\n\nThe problem isn't the technique itself. Lenis, GSAP ScrollTrigger, and similar tools are beautifully engineered. The problem is applying them by default, as decoration, rather than in service of the content.\n\nWhen scroll hijacking works: case studies where you want the reader to absorb each section before moving on. Immersive storytelling where pacing is part of the narrative. Presentations disguised as websites.\n\nWhen it doesn't: portfolios where people want to quickly scan your work. Documentation. Anything where the user's intent is to find something specific.\n\nThe test I use now: would the content be worse without it? Not different — worse. If the answer is no, I use native scroll and save the custom behavior for where it matters.",
  },
];
