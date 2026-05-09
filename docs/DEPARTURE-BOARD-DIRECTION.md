# Departure Board Direction

**As of 2026-05-09. Branch: `departure-board`.** Supersedes the monograph and stray-studio framings in `CREATIVE-DIRECTION.md`. Read this first.

---

## Where this came from

The site has cycled through three direction frames in this conversation:

1. **Monograph / warm paper.** Single editorial register, 12-col grid on warm paper (#FBFAF6), Aino + HS68 references, single hero atmospheric video then catalog. Captured in the original `CREATIVE-DIRECTION.md`.

2. **Stray studio rebrand.** Brief detour where the site became "stray, a creative studio" with the same warm-paper register but a renamed identity. Reverted.

3. **Departure board.** Current. Single-composition portfolio inverted to a Solari/split-flap dark register: pure black ground (#000), warm cream type (#F8F8F8), restrained Solari amber (#E8B25A) used only on truly-live elements. Tabular departure rows, not a periodic-table grid.

The departure-board frame was chosen after looking at Julia Krantz's portfolio (juliakrantz.com — pure black, monochrome, custom cursor) and recognizing two truths: (a) Krantz's structural insight (single 2D composition, equal-weight cells, hairlines forming a complete grid, fits-in-viewport) is the right scaffold for a portfolio of 4 considered projects, and (b) the periodic-table conceit is *Krantz's* organizing fiction — borrowing it directly reads as facsimile. The departure-board adopts Krantz's structural discipline with our own metaphor (Solari boards: kinetic, real-time, status-driven).

## Current state — what's built

**Identity**
- Brand: Ryan Jun, design engineer, New York
- Frame mark (top-left): `rj` (lowercase initials), Geist Mono, weight 500, 0.06em tracking, uppercase via CSS
- Domain: `hyeonjunjun.com`
- Email: `rykjun@gmail.com` (canonical, sourced from `src/constants/contact.ts`)

**Palette** ([src/app/globals.css](../src/app/globals.css))
```
--paper       #000000              ground (pure black, Krantz-line)
--paper-2     #0A0A0A              row hover, lifted cells
--paper-3     #161616              hairline-adjacent, column-header band
--ink         #F8F8F8              primary — titles, mark
--ink-2       rgba(248,...,0.92)   prose, project titles
--ink-3       rgba(248,...,0.45)   chrome — labels, captions, nav
--ink-4       rgba(248,...,0.30)   faintest — sub-meta, edt label
--ink-hair    rgba(248,...,0.12)   hairline rules
--ink-ghost   rgba(248,...,0.04)   row hover ghost
--accent      #E8B25A              Solari amber — live elements only
--accent-2    rgba(232,...,0.55)   pulse trough
```

Amber is used in **exactly three places**: the live clock digits in the banner, the ◆ icon on the DEPARTURES section bar, the LIVE row's left-edge bar + status cell. Three signals, no costume.

**Typography**
- Display: `var(--font-stack-sans)` (Geist Sans). Banner h1 at `clamp(34px, 4vw, 60px)`, weight 500, -0.04em tracking. Project destinations at `clamp(20px, 1.8vw, 26px)`, weight 500.
- Chrome: `var(--font-stack-mono)` (Geist Mono). All labels, time, year, sector, status. 9-12px, 0.06-0.16em tracking depending on prominence.
- No italics. Emphasis through weight, tracking, caps only.

**Homepage layout** ([src/components/HomeView.tsx](../src/components/HomeView.tsx))
```
┌────────────────────────────────────────────────────────┐
│  Frame (fixed, 48px) — rj  ·   Work Studio Contact    │
├────────────────────────────────────────────────────────┤
│  Banner ~80px                                          │
│    Ryan Jun        DESIGN ENGINEER · NEW YORK ·        │
│                    14:32:18 EDT       rykjun@gmail.com │
├────────────────────────────────────────────────────────┤
│  Board ~400px (border on all sides)                    │
│    THUMB │ TIME │ NO │ DESTINATION │ SECTOR │ STATUS  │  Col header
│   ◆ DEPARTURES                              01 · LIVE  │  Section bar
│  ┃[▶]   │ 2026 │ 01 │ LA28        │ Brand  │ ◆ LIVE   │  Live row
│   ● ARRIVALS                                03 · ON FILE│
│   [HH]  │ 2026 │ 02 │ Halo Halo!  │ Brand  │ ● 2026   │
│   [Gy]  │ 2026 │ 03 │ Gyeol: 결    │ Brand  │ ● 2026   │
│   [Sf]  │ 2025 │ 04 │ Sift        │ Mobile │ ● 2025   │
├────────────────────────────────────────────────────────┤
│  Footer ~50px (margin-top: auto)                       │
│    © 2026 Ryan Jun ───────────  rykjun@gmail.com →    │
└────────────────────────────────────────────────────────┘
```

Total content height at 1440 wide ≈ 590px + 48px Frame = 638px. Single-viewport on any laptop ≥720px effective.

**Live elements**
- Split-flap clock (LiveTime) — HH:MM:SS, each digit a `FlapDigit` with a 320ms scaleY collapse-and-expand animation when its value changes. Mid-flip character swap at 160ms. Seconds tick every second; minutes once a minute; hours once an hour.
- DEPARTURES ◆ section icon pulses 2.6s ease-in-out, opacity 1 → 0.55.
- LIVE row gets a 3px amber bar on the left edge (full row height) + amber status cell, both pulsing in sync with the section icon.

**Components**
- [src/components/Frame.tsx](../src/components/Frame.tsx) — fixed top nav, "rj" wordmark + Work/Studio/Contact. Hides on scroll-down past 80px.
- [src/components/HomeView.tsx](../src/components/HomeView.tsx) — single-composition departure board.
- [src/components/LiveTime.tsx](../src/components/LiveTime.tsx) — split-flap clock with `FlapDigit` sub-component.
- [src/components/Folio.tsx](../src/components/Folio.tsx) — fixed bottom-right page stamp (suppressed on `/`).
- [src/components/PaperGrain.tsx](../src/components/PaperGrain.tsx) — fixed full-viewport noise overlay, `mix-blend-mode: overlay`.

**Constants**
- [src/constants/pieces.ts](../src/constants/pieces.ts) — 4 real pieces: LA28 (wip/live), Halo Halo!, Sift, Gyeol.
- [src/constants/contact.ts](../src/constants/contact.ts) — `CONTACT_EMAIL = "rykjun@gmail.com"`, NETWORKS list.

---

## Depth principles — what the brilliant portfolios all share

Looking at aino.agency, hs68.la, juliakrantz.com, and the broader cohort (Rauno Freiberg, Cathy Dolle, Wang Zhi-Hong, Locomotive, Aristide Benoist, Linear), the same handful of moves keep showing up. These are not "more designed" — they are **more committed**.

### 1. Multiple zoom levels of information on every page

Aino's homepage isn't `header + grid + footer`. It's: project codes (`A001`) + brand names + service tags + year stamps + location codes (`GBG/OSL`) + statement copy + caption microtype + footer colophon. Every element answers a different question at a different scale. The eye moves between zoom levels as it reads.

**Where we stand:** project number + title + sector + status + year. Five fields, mostly at one zoom level. **Gap:** missing the smaller meta layers (codes, locations, sub-tags).

### 2. Microtype as a signature

Aino: `A001 / SANDISK / Brand & Web / 2023`. HS68: `01 / Bespoke / Object`. Krantz: the periodic-table 4-line stack with chemistry symbols. The microtype is the IDENTITY — you see the format and know who it's from.

**Where we stand:** `2026 / 01 / LA28 / Brand · Campaign / ◆ LIVE`. Solid grammar. **Gap:** the prefix `01` doesn't say "Ryan Jun." Aino's `A001` does. Could be `RJ-01` or `RJ-26-01` (letter-year-num, encodes more).

### 3. Honest specificity is the credibility move

Real years, real client names, real coordinates (`40°43′N · 73°59′W`), real weather, real timezone, real "last updated" stamps. These sites refuse abstraction. The specificity says "this is a person, doing real work, in a real place."

**Where we stand:** NYC, EDT, year stamps. **Gap:** could add weather (real fetch), coordinates, "last updated," build SHA, time-since-shipped on each row.

### 4. One signature interactive moment, hand-tuned, repeated

- Krantz: cursor with `mix-blend-mode: difference` + scan-line on hover
- Aristide Benoist: typewriter cursor + text reveals
- Locomotive: smooth scroll with parallax-within-frame
- Linear: pixel-perfect section transitions

The signature is one move you don't see anywhere else, applied consistently across the site.

**Where we stand:** split-flap clock. That's the seed. **Gap:** not yet repeated anywhere else. Could fire on year cells on hover, on status changes, on first paint of project titles.

### 5. Case study depth is where most portfolios collapse

Aino's `/work/sandisk` will have process, sketches, copy, real screenshots, credits, dates, scope. The home is the catalog; the case studies are the substance. **A portfolio with thin case studies is a poster, not a portfolio.**

**Where we stand:** `/work/[slug]` pages exist but are stale paper-register, not iterated for the new dark register. **Gap: this is the largest gap in the entire portfolio.**

### 6. A real studio voice somewhere

HS68's heritage / "EST. 1968" narrative. Aino's "We build premium storefronts where brands grow and consumers fall in love." Krantz's bio paragraph about cutting patterns and crossing into AI. The about page isn't a CV — it's a personality statement with edges.

**Where we stand:** `/studio` lede is "I'm Ryan Jun, a design engineer working between interface and identity systems." Right register, generic content. **Gap:** lacks specific conviction (the Aino-style statement, the HS68-style heritage hook).

### 7. A persistent metadata layer readable at any zoom

Aino: location codes in the footer. Krantz: "Currently at Kurppa Hosk." Many: "selective for 2026" or "open to small collaborations." A status that says "I am here right now, doing this kind of work."

**Where we stand:** `Now Boarding` was on a previous version (removed). The amber LIVE bar is a thin substitute. **Gap:** no explicit availability / status / location strip.

---

## Where we are vs. where the brilliant ones live

| Move | Brilliant portfolios | Yours now |
|------|---------------------|-----------|
| Homepage structure | Strong | **Strong (board is locked-in)** |
| Microtype as signature | Distinctive | OK, generic |
| Honest metadata | Rich (coords, weather, build info) | Limited (year, NYC, EDT) |
| Signature interaction | One repeated move | Split-flap exists, used in 1 place |
| Case study depth | Real, substantial | **Stale / not iterated** |
| Studio voice | Personal, specific | Generic |
| Persistent status layer | Yes | Partial |

---

## The roadmap — five moves, in order

### 1. Iterate the case studies (`/work/[slug]`) — biggest gap

Right now clicking a departure row lands on a paper-register page that doesn't feel like the same site. This is the largest gap in the entire portfolio.

What a depth-portfolio case study contains:
- A masthead with the same project code/year/status format from the home
- A hero plate (the cover, larger and uncropped)
- A short opening sentence that names the *problem* — one paragraph max
- Process notes — 3-5 sections with real details (decisions, wrong turns, what got cut)
- Real visual artifacts — sketches, screen captures, wireframes, photographs
- A credits ledger — role, year, sector, scope, who else worked on it
- A "next ↗" link to the next departure (cycles through the catalog)

**File:** [src/app/work/[slug]/page.tsx](../src/app/work/) — full pass to inherit the dark register and the board's grammar.

**Investment:** Large. Each case study needs real content + the layout system.

### 2. Build a real `/studio` page with voice — second biggest gap

Right now it's three short notes. To match the depth tier, it should have:
- A specific opening conviction with edges (not "Working between interface and identity systems" — something like "I make small, slow, considered things for people who care about details that take a year to notice")
- A short bio that names the path (where you came from, what you're doing now)
- A "currently" panel — what you're reading, working on, listening to. Short, dated.
- A services / scope section — what you take on, what you don't
- A colophon for the site itself — built with what, when, where, font credits, a "last deploy" timestamp
- An opening-availability status (e.g., "selective for Q3 2026")

**File:** [src/app/studio/page.tsx](../src/app/studio/page.tsx)

**Investment:** Medium. The voice content is the hard part; the layout is straightforward editorial.

### 3. Add a metadata strip below the board

A thin one-line band that pulls more honest specificity into the home without crowding the board.

```
40°43′N · 73°59′W · 봄 · 62°F OVERCAST · STATUS: SELECTIVE FOR 2026
```

One line, mono caps, low ink, hairline-bordered top and bottom. Sits between the board and the footer. The board says "what work I make"; the strip says "this is where and when I am."

Cost: ~20px of vertical space.
Gain: enormous specificity.

**File:** [src/components/HomeView.tsx](../src/components/HomeView.tsx) — between the closing `</section>` for board and the `<footer>`.

**Investment:** Small.

### 4. Project codes with initials

Right now rows say `01 LA28`, `02 Halo Halo!`. Aino-tier portfolios have *named* code systems: `A001`, `RJ-01`, `S-26-01`. Even just `RJ-01` is enormously more "this is mine" than `01`.

Three options for the system:
- `RJ-01` — simple letter-num
- `RJ-26-01` — letter-year-num, encodes when it shipped
- `LA / HH / SF / GY` — 2-letter project codes (Krantz-style but for projects, not elements)

Recommendation: `RJ-26-01` — most information, still scannable.

**File:** [src/constants/pieces.ts](../src/constants/pieces.ts) — change `number: "01"` to `number: "RJ-26-01"`.

**Investment:** Small.

### 5. Repeat the split-flap signature

Right now the flap clock is a one-off. The same animation could fire on:
- The `STATUS` glyphs when a project moves WIP → SHIPPED (rare event)
- The "year" cell on hover (briefly flap to "today" or "shipped X days ago")
- The page-load animation: project titles flap into place once on first paint
- A "currently" value if added to the metadata strip

One additional flap point ties the signature into the layout. Two establishes a vocabulary. Three is the cap — beyond that it's costume.

**File:** [src/components/LiveTime.tsx](../src/components/LiveTime.tsx) → extract `FlapDigit` to a shared `SplitFlap` component, then use it in row's status or year column.

**Investment:** Small to medium depending on where it lands.

---

## Two bigger structural questions

These are not improvements to make right now — they are questions to settle before the next major direction pass.

### A. Single-composition forever, or opening composition with vertical scroll continuation?

You committed to "Option A" earlier — single-composition, period. Krantz is true single-composition. Aino has a sparse below-the-fold continuation. HS68 scrolls through several rhythmic sections.

Worth re-examining once cases are done. Sometimes the composition is so strong that it earns the no-scroll claim; sometimes the work below adds depth. The honest answer depends on how much practice voice exists when /studio is built out.

### B. What's your one signature move that no one else has?

Krantz: cursor + scan-line. Aristide: typewriter cursor. Linear: section transitions.

The split-flap is a great seed but it's borrowed — Solari boards exist; many sites have done flap clocks. **What's the move that's specifically Ryan-Jun-shaped?** This isn't a question that can be answered by analysis — it has to come from your taste, your obsession, the thing you'd build even if no one was watching.

The absence of it is what separates the OK-portfolio from the brilliant-portfolio.

---

## Recommended next session

If I were building this for myself I'd order it: **case studies (1) → studio voice (2) → metadata strip (3) → project codes (4) → flap repetition (5)**.

Cases first because they're where users land after the board, and they're currently the weak link. Studio voice second because it's where you become a person, not a system. The other three are smaller polish that magnifies the first two.

---

## Reference notes

### Sites studied (2026-05-09)

**aino.agency** — Light cream paper register. Project codes (A001-A019). 2-column grid, mixed aspect ratios. Single sans face, weight contrast. Footer is one row: location codes (GBG/OSL), email, social. No accent color.

**hs68.la** — Fashion brand site, not a portfolio per se. Editorial photography dominates. Numbered sections (01-04). Heritage cues ("EST. 1968"). Bespoke service CTA.

**obys.agency** — Ukrainian agency. Dark register. Numbered project grid (01-19). Industry + service tagging. Heavy hover effects (Codrops-style).

**juliakrantz.com** — Stockholm CD. Pure black `#000` ground, cool off-white `#F8F8F8` type. ClashDisplay + DM Sans typography. Custom cursor (8px dot, mix-blend-difference, scales 5.5x). Page fade-in 220ms. Element-grid pattern with aspect-ratio:1/1 cells. Intro section above with cell-labels and numbered ps-rows. Hairline borders at rgba(248,...,0.12) — the value we adopted.

### Personal-portfolio cohort worth studying

Beyond what was fetched this session, these are worth studying when planning the next direction pass:

- **rauno.me** — Vercel design engineer. Considered interaction details, custom cursor moments, dark register, restrained color.
- **brianlovin.com** — Design engineer at Github. Considered details, real "now" page, public reading list.
- **cathydolle.com** — Typographic editorial portfolio.
- **studiothomas.com** — UK studio with smart layouts.
- **cwzh.com** (Wang Zhi-Hong) — Taiwanese book designer, monograph register.
- **daikoku.ndc.co.jp** — Japanese book/identity studio.
- **aristidebenoist.com** — Interaction designer with signature cursor work.
- **locomotive.ca** — Canadian agency, deep page transitions.
- **pentagram.com** — Editorial depth at firm scale.
- **linear.app** — Not a portfolio, but the most depth-rich design system on the public web.

---

## Build / state log

- 2026-05-09: this document committed at branch `departure-board` HEAD `cd7e8da`.
- Prior canonical doc: `docs/CREATIVE-DIRECTION.md` (warm-paper monograph framing, superseded but preserved for historical reference).
- Active branch: `departure-board` (off master). Not yet merged.
