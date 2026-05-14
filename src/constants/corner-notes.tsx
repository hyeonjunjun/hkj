/**
 * Corner notes — seed content for /v/corner. Each note is a small
 * unit of thinking-in-public: project notes (case-study writeups),
 * process notes (short fragments), log notes (terse changelog).
 *
 * Data shape kept parallel to /constants/notes.tsx so the rendering
 * surfaces can converge later if the corner replaces the existing
 * /notes page. Until then this is isolated.
 *
 * Numbering: N001-style catalog numbers (consistent with USB001
 * colophon convention). NEVER use § glyph.
 */

import type { ReactNode } from "react";

export type CornerCategory = "project" | "process" | "log";

export interface CornerNote {
  /** Monotonic note number — leading zeros to 3 digits for the N-prefix format. */
  number: number;
  slug: string;
  /** YYYY-MM-DD authoring stamp. */
  date: string;
  category: CornerCategory;
  title: string;
  /** One-line teaser used in OG / meta. */
  lede: string;
  body: ReactNode;
}

export const CORNER_NOTES: ReadonlyArray<CornerNote> = [
  {
    number: 3,
    slug: "the-corner-exists",
    date: "2026-05-14",
    category: "log",
    title: "the corner exists.",
    lede: "shipping the smallest possible portfolio: masthead, audio, notes.",
    body: (
      <>
        <p>
          this is the first entry. the page you&apos;re on is a corner —
          a single column where i share what i&apos;m working on and what
          i&apos;m thinking about. no case-study gallery, no hero reel,
          no manifesto banner.
        </p>
        <p>
          the form is borrowed from people whose corners i return to:
          robin rendle, maggie appleton, craig mod, patrick collison.
          tomoya okada is the closest reference for the detail register —
          minimal page chrome with motion and atmosphere quietly layered
          underneath.
        </p>
        <p>
          the player at the top of the page has no audio. it rotates a
          curated playlist as metadata only. if you screenshot it, the
          screenshot is the whole experience — there&apos;s nothing more
          to hear. (this exists because i can&apos;t legally stream music
          from my own site, but i still wanted the page to feel like the
          music is part of it.)
        </p>
        <p>
          new entries push to the top. the corner accumulates.
        </p>
      </>
    ),
  },
  {
    number: 2,
    slug: "on-staying-in-one-place",
    date: "2026-05-14",
    category: "process",
    title: "on staying in one place.",
    lede: "the cost of restarting your portfolio every two weeks.",
    body: (
      <>
        <p>
          i&apos;ve restarted my portfolio direction seven times in two
          weeks. each restart felt urgent. each ended with a spec doc
          and no shipped surface.
        </p>
        <p>
          the diagnosis is uncomfortable: the iterations weren&apos;t
          design problems, they were identity problems. art-direction is
          downstream of identity, not upstream. i kept trying to *find*
          who i was by choosing a look, when the right move was to
          choose a small honest form and let the writing reveal who i
          am over time.
        </p>
        <p>
          a corner is the form that survives identity formation. you
          don&apos;t have to decide who you are first. you just have to
          show up in the same place tomorrow.
        </p>
      </>
    ),
  },
  {
    number: 1,
    slug: "sift",
    date: "2026-04-30",
    category: "project",
    title: "sift — an AI scrapbook for the things you almost lose.",
    lede: "a mobile app for capturing the small inputs that build taste.",
    body: (
      <>
        <p>
          sift is a small ios app i shipped earlier this year. the
          premise: you encounter a lot of small inputs every day — a
          color you noticed, a phrase you overheard, a sound, a smell.
          most of them evaporate within hours.
        </p>
        <p>
          sift gives you one capture surface — text, image, voice — and
          uses on-device AI to cluster captures into a personal taste
          map you can browse later. it&apos;s not a notes app, it&apos;s
          a scrapbook. the AI is invisible: you don&apos;t prompt it,
          you just keep dropping things in.
        </p>
        <p>
          i designed and built it solo over six weeks. swift + core ml
          on-device, no server. shipped to TestFlight with 60 early
          users; the retention story was the part that surprised me —
          people opened it more on weekends, when they were noticing
          more.
        </p>
        <p>
          full write-up to come. this entry is the placeholder.
        </p>
      </>
    ),
  },
];
