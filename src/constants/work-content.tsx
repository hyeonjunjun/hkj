/**
 * Work content registry — structured section data for /v/corner/work/[slug].
 *
 * Each project's detail page is composed from an ordered array of
 * sections of varying kinds (hero, media, media-pair, prose, quote,
 * spec, divider). The renderer in WorkSections walks the array and
 * dispatches to the right component.
 *
 * Pieces without explicit WORK_CONTENT entries fall back to default
 * content derived from the PIECES data so every project has a
 * working detail page from day one. Custom entries override.
 *
 * Reference register: ethan&tom + naughtyduk — full-bleed hero,
 * generous pacing, mixed media (image + video), editorial typography
 * for any prose, no chrome.
 */

import type { ReactNode } from "react";

export type WorkMedia =
  | { kind: "image"; src: string; alt: string; aspect?: string }
  | { kind: "video"; src: string; poster?: string; alt: string; aspect?: string }
  | { kind: "placeholder"; alt: string; aspect?: string };

export type WorkSection =
  | { kind: "hero"; media: WorkMedia; caption?: string; full?: boolean }
  | { kind: "media"; media: WorkMedia; full?: boolean; caption?: string }
  | { kind: "media-pair"; left: WorkMedia; right: WorkMedia; caption?: string }
  | { kind: "prose"; heading?: string; body: ReactNode }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "spec"; rows: Array<{ label: string; value: string }> }
  | { kind: "divider" };

export interface WorkContent {
  slug: string;
  /** Optional custom credits override; defaults derived from PIECES if omitted. */
  credits?: Partial<{
    role: string;
    collaborators: string[];
    delivered: string;
  }>;
  sections: WorkSection[];
}

/**
 * Per-slug overrides. Each value is an array of structured sections
 * the renderer dispatches in order. Add entries as case studies are
 * authored; pieces without a custom entry render a sensible default.
 */
export const WORK_CONTENT: Record<string, WorkContent> = {
  aurebor: {
    slug: "aurebor",
    credits: {
      role: "Brand · Direction · Engineering",
      delivered: "2026-04 → present",
    },
    sections: [
      {
        kind: "hero",
        media: { kind: "video", src: "/assets/aurebor_jeju.mp4", alt: "AURÉBOR — Jeju atmospheric reel", aspect: "16 / 9" },
        full: true,
      },
      {
        kind: "prose",
        heading: "Brief",
        body: (
          <p>
            AURÉBOR is an atmospheric brand experiment captured on
            location in Jeju. Full case study incoming; for now this is
            the hero reel.
          </p>
        ),
      },
    ],
  },

  sift: {
    slug: "sift",
    credits: {
      role: "Design · Engineering",
      delivered: "2025-09 → 2025-12",
    },
    sections: [
      {
        kind: "hero",
        media: { kind: "image", src: "/images/sift-v2.webp", alt: "Sift — capture interface", aspect: "2 / 1" },
        full: true,
      },
      {
        kind: "prose",
        heading: "Brief",
        body: (
          <>
            <p>
              Sift is an iOS app that surfaces the small inputs that
              build taste — colours noticed, phrases overheard, sounds,
              smells. You drop captures in; on-device AI clusters them
              into a personal taste map overnight.
            </p>
            <p>
              Designed and built solo over six weeks in Swift with Core
              ML on-device. No server. Shipped to TestFlight with 60
              early users.
            </p>
          </>
        ),
      },
      {
        kind: "spec",
        rows: [
          { label: "Stack", value: "Swift · SwiftUI · Core ML" },
          { label: "Devices", value: "iPhone 12+, iOS 16+" },
          { label: "Inputs", value: "Text · Image · Voice" },
          { label: "AI", value: "On-device clustering · no server" },
        ],
      },
      {
        kind: "media-pair",
        left: { kind: "placeholder", alt: "Capture surface", aspect: "9 / 16" },
        right: { kind: "placeholder", alt: "Taste map cluster view", aspect: "9 / 16" },
        caption: "Capture surface (left) and taste-map cluster view (right).",
      },
      {
        kind: "prose",
        heading: "What surprised me",
        body: (
          <p>
            Retention was the part I didn&apos;t expect. People opened
            it more on weekends, when they were noticing more. The app
            became a function of the kind of attention you had — not
            the productivity context I assumed.
          </p>
        ),
      },
    ],
  },

  gyeol: {
    slug: "gyeol",
    credits: {
      role: "Brand · 3D · Ecommerce",
      delivered: "2026-02 → 2026-04",
    },
    sections: [
      {
        kind: "hero",
        media: { kind: "image", src: "/images/gyeol-rain.webp", alt: "Gyeol — rain plate", aspect: "16 / 9" },
        full: true,
      },
      {
        kind: "prose",
        heading: "Brief",
        body: (
          <>
            <p>
              Gyeol (결) is a fragrance brand rooted in Korean material
              grain — hanji paper, brushed metal, the texture of patience.
              The site is the store and the gallery; product photography
              treats the bottles as artifacts in a landscape rather than
              objects on a shelf.
            </p>
          </>
        ),
      },
      {
        kind: "media-pair",
        left: { kind: "image", src: "/images/gyeol-spring.webp", alt: "Gyeol — spring", aspect: "16 / 9" },
        right: { kind: "image", src: "/images/gyeol-green-tea.webp", alt: "Gyeol — tea ceremony context", aspect: "16 / 9" },
        caption: "Spring plate (left) and tea-ceremony context (right).",
      },
      {
        kind: "media",
        media: { kind: "image", src: "/images/gyeol-display-hanji.webp", alt: "Hanji packaging detail", aspect: "16 / 9" },
        caption: "Hanji packaging detail.",
      },
    ],
  },
};
