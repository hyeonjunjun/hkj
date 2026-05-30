# RYKJUN Portfolio — Project Framework

> The governing document. Replaces all previous versions.
> 2026-05-30.

---

## TL;DR

A personal **archive treated as a typeset publication.** The architecture itself is the visual language — baseline grid, typographic measure, kind taxonomy, folio numbering, vertical spine. Not editorial-*looking*; editorial-*engineered*.

- **Frame:** single viewport, no scroll. Each folio = one fixed-frame composition.
- **Type:** Archivo (sans body) + Geist Mono (indexing voice). No third family.
- **Color:** warm paper, warm ink, plus a per-kind semantic color used only as an index (never decoration).
- **Influence:** Japanese editorial × swiss typography × archive systems. NOT blit.studio.
- **Build order:** foundation first (tokens, baseline grid, kind taxonomy, spine), then ONE representative writing spread to prove the system, then scale.

---

## What this replaces

- The previous **gallery-wall + FLIP-grid** framework (the prior contents of this file, Mar 27 version).
- The **`/v2` blit-style execution** (live at `/v2` on master as of 2026-05-30). Recognized as surface mimicry of blit.studio — to be **renamed `/blit`** as a negative-space reference, then `/v2` rebuilt fresh.
- The **`corner`** direction is still live at `/`. It is not being torn out yet; it stays until this new direction proves out, then `/v2` promotes to `/` and `corner` archives to `/legacy/corner` (mirroring how the prior editorial setlist was archived in commit 68231c4).

---

## 1. Concept

The site is a **catalog of one.** Every piece — writing, work, link, listen, note — is a numbered item with a fixed *kind*, sitting on a visible baseline grid, indexed by a vertical spine. The visitor moves through *folios*, not pages. The system is the brand.

What makes it editorial: the cataloguing is taken seriously and *shown*. Folio numbers, dateline, kind glyphs, marginalia, hanko mark — these are not ornaments added on top. They are the structural language.

What makes it design-engineered: the grid is real (CSS subgrid + `lh` baseline units), the measure is computed (66ch on prose, 12ch on marginalia), the kind taxonomy is enforced in code (one component per kind), the folio numbering is deterministic. Nothing decorative; everything load-bearing.

---

## 2. Influences (and anti-influences)

**Reach for:**
- Brutus / IDEA / Apartamento — magazine editorial weight, density of small marks
- Kenya Hara / Daikoku Design Institute / Mr. Design — Japanese restraint, "air + one loud thing"
- Yohji Yamamoto lookbooks, Comme des Garçons editorials — lot numbers as ornament
- 原稿用紙 (genkō yōshi) — visible composition grid as the look
- Knopf / Hartwell book interiors — baseline rhythm, real measure
- swissmiss / Are.na profiles / devine lu linvega (XXIIVV) — archive density and self-cataloguing

**Explicitly NOT:**
- blit.studio — already attempted at `/v2`, rejected as surface mimicry
- Studio-portfolio "showcase" register (huge wordmark, asymmetric hero image, accent dot, curtain wipe, custom cursor with "view" text)

---

## 3. Principles

1. **The structure is the look.** The grid is not behind the design — it IS the design.
2. **Editorial weight comes from cataloguing, not effects.**
3. **One chunky display, everything else mono micro-text.** No mid-sized headings.
4. **Color is semantic.** Used as a kind index. Never decorative.
5. **Type is restrained.** Two families only. Hierarchy from weight + tracking + case, not from a 6-size scale.
6. **Mathematical rhythm.** Baseline grid in `1lh` snaps every element.
7. **Every piece is numbered.** Folio is identity.
8. **No-scroll frame.** Each folio is one fixed-frame composition; long pieces fold into multiple folios.
9. **Creativity lives in the cataloguing system and the typographic system,** not in surface effects.
10. **Japanese editorial restraint:** huge air, one loud thing per spread, everything else whispering.

---

## 4. The kind taxonomy

| Kind    | Glyph | Color (semantic) | Body measure | What it is               |
|---------|-------|------------------|--------------|--------------------------|
| writing | W     | `#B0241A` red    | 66ch         | essays, notes, logs      |
| work    | P     | `#1A2E5A` indigo | 48ch         | projects, builds         |
| link    | L     | `#6B6B6B` graphite | 32ch       | references, sources      |
| listen  | A     | `#C58A1A` yamabuki | 24ch       | tracks, mixes, sets      |
| note    | N     | `#2E6B3A` moss   | 40ch         | fragments, asides        |

Each kind:
- Owns a one-letter prefix on its folio number (`W024`, `P007`, `L113`…)
- Owns a color used **only** for: the spine's kind glyph, the active folio's underline in the bottom-strip index, one hairline accent line per spread.
- Owns a body measure (line length) — defined in `src/app/v2/lib/kinds.ts`.
- Owns its own composition rule — defined in `src/app/v2/views/{kind}.tsx`.

Folio numbering restarts per kind. Global total computed for the spine ("no. 24 of 113").

---

## 5. The frame

Single viewport. No scroll anywhere. `100vw × 100vh`. `overflow: hidden` on html/body while `/v2` is mounted.

```
┌──┬──────────────────────────────────────┐
│  │ TOP STRIP — dateline · kind · status │  ← ~3 baselines tall
│  ├──────────────────────────────────────┤
│ S│                                      │
│ P│                                      │
│ I│      RECTO (the active folio)        │
│ N│                                      │
│ E│                                      │
│  ├──────────────────────────────────────┤
│  │ BOTTOM STRIP — folio index           │  ← ~3 baselines tall
└──┴──────────────────────────────────────┘
   ↑
   ~48px wide vertical rail, full height
```

### Spine (left vertical rail, ~48px wide)
`writing-mode: vertical-rl`. Top to bottom:
- Current folio number (mono 0.82rem) — e.g. `W024`
- Kind name (mono 0.62rem) — e.g. `writing`
- Dateline (mono 0.62rem) — `2026·05·30`
- Hanko mark — single character inside a 28×28px circle outline (mono)
- "no. 24 of 113" (mono 0.62rem, bottom-aligned)

### Top strip
`dateline · kind · status · current measure` — all mono 0.62rem, middle-dot separators. Status = `live` / `draft` / `archived`. Right side: ghost hint `g for grid` (pulses on first visit only).

### Bottom strip — folio index
Horizontal row of every folio number ever (`W001 W002 ... W024 ... W113`). The current one is underlined in the kind's semantic color. Click any to jump. Top-strip's kind label is a filter toggle (click `writing` to show only `W*`).

### Recto
The folio body. Composition rules per kind defined separately (§7).

---

## 6. Visible baseline grid

**Baseline unit:** `1lh` of body Archivo at 16px line-height 1.55 = **24.8px**.

Every element snaps to baseline. Achieved via CSS subgrid + `line-height: 1lh` discipline.

**Toggle:** `g` key shows the baseline rules as faint 0.5px hairlines drawn across the recto (genkō yōshi reveal). Off by default. The grid is always there structurally; the toggle just makes it visible.

The toggle is also a self-test: if the user presses `g` and text is *not* sitting on the lines, the implementation is broken.

---

## 7. Typography

| Role         | Family     | Weight | Size                              | Usage                                        |
|--------------|------------|--------|-----------------------------------|----------------------------------------------|
| Display      | Archivo    | 800    | `clamp(2.4rem, 4vw, 3.8rem)`      | folio title (max one per spread)             |
| Body         | Archivo    | 400    | `1rem` (16px)                     | prose, reading                               |
| Body-strong  | Archivo    | 500    | `1rem`                            | emphasis                                     |
| Mono         | Geist Mono | 400    | `0.72rem`                         | folios, marginalia, dateline                 |
| Micro        | Geist Mono | 400    | `0.62rem`                         | spine text, top/bottom strips, footnotes     |

- **No mid sizes** — no h2/h3 scale. Hierarchy from weight + tracking + case.
- All copy lowercase, except folio numbers (kind letter uppercase, digits — `W024`).
- Letter-spacing: display `-0.02em`, body `0`, mono `+0.04em`.
- Line-height: body `1.55`, display `1.05`, mono `1.3`.

---

## 8. Color

```css
/* paper register */
--paper:        #FBFAF6;   /* warm cream — primary surface */
--paper-2:      #F4F3EE;   /* paper recessed — top/bottom strips */

/* ink register */
--ink:          #1A1816;   /* warm charcoal — NEVER pure black */
--ink-2:        rgba(26, 24, 22, 0.55);
--ink-hair:     rgba(26, 24, 22, 0.14);  /* baseline rules, dividers */
--ink-ghost:    rgba(26, 24, 22, 0.05);

/* kind colors — semantic, see §4 */
--kind-writing: #B0241A;
--kind-work:    #1A2E5A;
--kind-link:    #6B6B6B;
--kind-listen:  #C58A1A;
--kind-note:    #2E6B3A;
```

**Color usage rule:** kind colors appear ONLY on (a) the spine's kind glyph, (b) the active folio's underline in the bottom strip, (c) one hairline accent line per spread. Nowhere else. Never as fills, never as backgrounds, never as button colors.

---

## 9. Transitions

Replace `/v2`'s curtain wipe (blit-derived) with a **page-turn**:

- Recto content `clip-path` peels horizontally — `inset(0 0% 0 0)` → `inset(0 100% 0 0)` — left-to-right, revealing the next spread underneath. Duration **380ms**, `cubic-bezier(0.76, 0, 0.24, 1)`.
- The spine's folio number rolls vertically (slot-reel style, 220ms) — reuses the technique already proven in `VestaboardNote` from the corner direction.
- Top and bottom strips do not transition; they update their content in place.

No curtain. No fade. The turn is the only transition.

---

## 10. Composition rules per kind

### writing
- Folio title at top-right of recto. Display 800. Max 4 words.
- Body prose at 66ch, single column, set on baseline.
- Marginalia (notes, dates, footnote refs) in the left margin of the recto, mono 0.72rem, vertically aligned to the anchor line in the body.
- One pull-quote allowed per piece — display 800, max 8 words, set at the "fold" of the spread (vertical center).

### work
- Folio title small upper-left (mono micro).
- ONE hero image bleeds top-to-bottom on the right ~70% of the recto.
- Left strip (30%): metadata stacked — date, role, stack, status.
- Bottom of recto: 24ch caption.

### link
- Tightest measure (32ch).
- Destination title in display 800 (your description, not the page's `<title>`).
- URL in mono 0.62rem below.
- Optional one-sentence "why" in body 400.
- Source date + first-seen-at stamp in mono micro.

### listen
- 24ch measure.
- Track + artist as display 800 (one line each, stacked).
- Cover image as 1:1 thumbnail right side.
- Source / link in mono.

### note
- 40ch measure.
- Plain prose. No marginalia. No pull-quote.
- Date + tag in mono micro at bottom-right.

---

## 11. Build plan — PC pickup

### State of the repo as of 2026-05-30

- `master` — clean, up to date with `origin/master`. Last commit: `a25670d "no embellishments"`.
- `/` — corner direction live. Untouched.
- `/v2` — blit-style first attempt. **Action:** rename to `/blit` (keep as reference for what to avoid), then start fresh at `/v2`.
- All `claude/*` worktrees deleted; only `master` exists locally.
- Five `claude/*` branches still exist on `origin` (not touched). Ignore.

### Order of operations

1. **Cleanup**
   - `git mv src/app/v2 src/app/blit` (or rename the directory and update the import in `src/app/blit/Portfolio.tsx`).
   - Update `metadata.title` inside `src/app/blit/layout.tsx` to reflect "blit reference".
   - Commit.

2. **Foundation (build before any view)**

   New files in `src/app/v2/`:
   - `portfolio.css` — tokens, reset, baseline grid utilities (subgrid + `lh` discipline)
   - `lib/kinds.ts` — kind taxonomy + types
   - `lib/folio.ts` — folio numbering, kind glyph, formatting helpers
   - `lib/content.ts` — load content/*.md, type frontmatter
   - `components/Spine.tsx` — vertical rail
   - `components/TopStrip.tsx` — dateline / kind / status
   - `components/BottomStrip.tsx` — folio index
   - `components/BaselineGrid.tsx` — toggleable hairline overlay (listens for `g`)
   - `components/Hanko.tsx` — personal mark
   - `layout.tsx`, `page.tsx`, `Portfolio.tsx` — same shell pattern as `/v2`/`/blit` but the chrome is the spine + strips, not a header

3. **Content schema**

   New `content/` at project root:
   ```
   content/
     writing/W001-archive-of-me.md
     work/P001-sift.md
     link/L001-xxiivv.md
     listen/A001-jonsi-tomatchi.md
     note/N001-first-fragment.md
   ```

   Frontmatter:
   ```yaml
   ---
   kind: writing
   no: 1                # restart per kind
   date: 2026-05-30
   title: archive of me
   status: draft        # draft | live | archived
   measure: 66          # optional override
   tags: [archive, system]
   ---
   ```

4. **Build ONE representative spread**
   - The writing spread `W001 — archive of me`, populated with real prose (use the conversation about why the archive needs to exist).
   - Set on baseline grid, with marginalia in the left margin of the recto, with the spine populated, with the bottom strip showing W001 highlighted in red.

5. **Stress-test the foundation**
   - Press `g` — does prose sit on the baseline rules? If not, the implementation is broken.
   - Add a second writing piece (`W002`) of very different length — does the measure hold?
   - Add a long writing piece that doesn't fit — fold it into `W003 part 1` / `W004 part 2`.
   - Add a `P001` work piece — does the composition rule for `work` engage automatically?
   - Toggle the kind filter via top strip — does the bottom strip filter to one kind?

6. **Only after the foundation passes the stress-test, build the other kind views.**

### Open questions for next session

1. **Hanko character.** Options: a custom `r` mark inside a circle, or a chosen kanji like 純 (jun, pure). Pick one. Default to `r` if undecided.
2. **Per-kind vs global folio numbering.** Plan above assumes **per-kind** (`W001`, `P001`, `L001`…). Confirm or flip to global (`#001`, `#002`…). Per-kind preferred — semantic carries more weight.
3. **Long writing pieces.** Plan above says fold into multiple folios (`W003 part 1 of 3`). Confirm. Alternative: allow scroll within a single piece. No-scroll preferred — it forces editorial cadence.
4. **Where the bio / contact lives.** Bio → a `note` (e.g. `N001 — about the practice`)? A dedicated `info` strip? Default to a single high-priority `note` until proven otherwise.

---

## 12. Anti-patterns (rule out explicitly)

- ❌ Huge wordmark + asymmetric image bleed + orange accent dot (blit grammar)
- ❌ Curtain wipe transitions
- ❌ Custom cursor with hover ring / "view" text
- ❌ Single accent color used decoratively (must be semantic per §4)
- ❌ More than 2 typefaces
- ❌ Mid-sized headings (no h2/h3 scale — display / body / micro only)
- ❌ Visible URL routing in the UX (every navigation is a folio turn, even if a query param updates behind the scenes)
- ❌ Scroll
- ❌ Loading spinners, skeleton states, micro-interactions for their own sake
- ❌ Tailwind utility soup in the layout code — use real CSS with named classes; the layout IS the brand and should be readable in CSS

---

## 13. Done = the test

The system is "done" when:

- A new piece can be added by dropping a `.md` file in `content/{kind}/` with the right frontmatter.
- It auto-renders on the baseline grid using the kind's composition rule.
- It appears in the bottom-strip index with the next folio number for its kind.
- The spine + top strip update on navigation.
- The whole thing reads as a *working artifact* — a publication that's catalogued, dated, indexed — not a brochure.
- Pressing `g` reveals the grid and proves nothing was eyeballed.

If the above holds, the architecture IS editorial. The surface is just typography on top.
