This is HKJ Studio — a "two-door house" site: a quiet landing masthead (`/`) that opens onto four rooms, each with its own route and its own register variation on a single shared design system.

- **Works** (`/works`) — a poster composition of case studies, each with its own page at `/works/[slug]`.
- **Archive** (`/archive`) — a dated, reverse-chronological personal record, set in Courier Prime, with optional permalinks at `/archive/[slug]`.
- **References** (`/references`) — a masonry grid of curated collected attention.
- **Info** (`/info`) — the colophon: practice, contact, and credits.

All four rooms share one token layer (`src/app/globals.css`), one font layer (`src/app/layout.tsx`), and one shared chrome component (`RoomHeader`) — register variation comes from a room-specific font className (e.g. Archive's `font-courier` wrapper) and typographic choices within each room's own components, not from separate systems.

**Add a Work** — append an object to the `works` array in `src/data/works.ts` with a unique `slug`; media goes in `/public/media/works/`. The first three entries render in the `/works` poster's left/center/right zones; a fourth+ entry overflows into a horizontal scroll strip below it (see the growth-strategy comment at the top of `src/components/works/WorkGrid.tsx`). Each entry automatically gets a scaffolded page at `/works/{slug}`.

**Add an Archive entry** — append an object to the `archive` array in `src/data/archive.ts`; media goes in `/public/media/archive/`. Entries sort reverse-chronologically by `date` (ISO 8601) automatically — no manual ordering. Give an entry a `slug` to also generate a permalink at `/archive/{slug}`.

**Add a Reference** — append an object to the `references` array in `src/data/references.ts`; media goes in `/public/media/references/`. The grid and its empty-state message both update automatically.

**Update studio-wide metadata** — edit `src/data/studio.ts` (wordmark, standfirst copy, thesis statement, nav items, availability, location, etc.). These values flow into `Wordmark`, `Standfirst`, `ThesisStatement`, `Nav`, and `CornerMark` on every room — no component edits required.

**Tune motion** in `src/lib/motion.ts` — `easing`, `duration`, and `delay` are the only constants that drive every entrance animation and hover transition across every room. Changing a number there (e.g. `delay.stagger`) re-times the whole load sequence without touching any component.

**Type set in Inter Tight, Courier Prime, and Instrument Serif.** There is no separate monospace face — the Tailwind `font-mono` utility is pointed at Courier Prime (see `tailwind.config.ts`), so every existing `font-mono` class across every room (metadata, timestamps, tags, labels) renders in Courier automatically.

**Responsive breakpoints** follow Tailwind's defaults: below `768px` is each room's mobile stacked layout, `768–1023px` is tablet (poster/grid compositions at reduced scale), `1024px+` is the full desktop layout.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Deploy on Vercel

Push to a repo connected to [Vercel](https://vercel.com/new) — no environment variables or build config are required.
