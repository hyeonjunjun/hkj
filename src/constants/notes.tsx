/**
 * Studio notes — short entries from the practice.
 *
 * Data lives here so any surface (the /notes page, the homepage's
 * future "recent" surfacing, a feed endpoint) can consume the same
 * canonical list. Entries are in newest-first order; the page renders
 * them top-to-bottom in array order.
 *
 * `.tsx` because the body uses inline JSX for line breaks and emphasis
 * — the alternative (markdown + parser) is overkill at this scale.
 */

import type { ReactNode } from "react";

export interface Note {
  slug: string;
  /** YYYY-MM-DD authoring stamp. */
  date: string;
  title: string;
  body: ReactNode;
}

export const NOTES: ReadonlyArray<Note> = [
  {
    slug: "design-engineering-direction-one-loop",
    date: "2026-05-12",
    title: "Design, engineering, direction — one loop.",
    body: (
      <>
        the most useful change to how i work was deleting the handoff.
        when a designer hands a spec to an engineer, both jobs get worse —
        the design is constrained by what the designer can articulate,
        and the implementation is constrained by what the engineer can
        negotiate.
        <br />
        <br />
        when the same hands make and ship, the loop closes. typography
        becomes a function of how it renders. motion becomes a function
        of state. composition becomes a function of viewport. direction
        is what threads all three back together when the project is too
        big to hold in one head.
        <br />
        <br />
        i treat the three as stages of one composition, not separate
        disciplines. it isn&apos;t faster. it&apos;s more accurate.
      </>
    ),
  },
  {
    slug: "bts-as-multidisciplinary-template",
    date: "2026-05-12",
    title: "BTS as a multidisciplinary template.",
    body: (
      <>
        for a long time i described myself as a &ldquo;design
        engineer&rdquo; and then watched the term dilute into a job
        title meaning &ldquo;frontend developer who can mock things up
        in figma.&rdquo;
        <br />
        <br />
        bts made me notice a different shape. a single project — map of
        the soul, say — compounds across music, film, photography,
        fashion, world-building, and live production, and no single
        discipline carries it. the composition is the work. the
        translation between mediums is the work. the discipline of not
        specializing is the work.
        <br />
        <br />
        i want my practice to be that shape: identity that lives across
        surfaces, where the boundaries between brand, interface, and
        direction are the place the work actually happens — not the
        things to cross at the seams.
      </>
    ),
  },
  {
    slug: "tracklist-as-grammar",
    date: "2026-05-12",
    title: "Tracklist as grammar.",
    body: (
      <>
        why does the homepage read like a setlist instead of a
        portfolio? because portfolios are catalogues — they assume the
        work is the unit and your job is to file it. albums sequence.
        the order is the argument.
        <br />
        <br />
        fred again&apos;s <em>actual life</em> works because it isn&apos;t
        a collection of songs — it&apos;s a chronology that asks you to
        follow. <em>usb001</em> prints the tracklist on the back cover
        before you&apos;ve heard a note. the unstated dare: trust the
        sequence.
        <br />
        <br />
        this site puts the work in numbered slots for the same reason.
        the catalog is composed, not indexed. reordering would change
        the meaning.
      </>
    ),
  },
];
