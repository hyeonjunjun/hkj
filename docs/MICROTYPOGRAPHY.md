# Microtypography Framework

**As of 2026-05-09. Branch: `departure-board`.**

Mono-only type system for the portfolio. One face (Geist Mono), nine roles, eight tracking steps, five line-heights, seven spacing tokens. Built to feel cataloged like a Wang Zhi-Hong colophon, restrained like aino.agency, rhythmic like an HS68 numbered section.

This document is the canonical reference. When in doubt about a type decision, the answer is in this file.

---

## Principles

### 1. One face. Geist Mono.
No sans, no serif. Hierarchy comes from size, weight, tracking, and color opacity steps — never from family. The discipline is the design.

### 2. Caps + tracking is the loud move.
Mono-only sites can't use display-serif italics or bold-extended-condensed for hierarchy. They use TYPED-OUT CAPS at specific tracking steps. Caps + 0.16em tracking reads as a page divider. Caps + 0.06em reads as a code identifier. Tracking IS hierarchy.

### 3. Tabular numerals everywhere.
Time digits (14:32:18), years (2026), codes (RJ-26-01), counts (04 ENTRIES) — all use tabular-nums + lining-nums via the `.tabular` modifier. Numbers must align vertically across rows.

### 4. Date format is YYYY.MM.DD with periods.
Not slashes, not dashes. Periods read "cataloged" — the bibliography style, the IBAN style, the ISO style. They make every datum feel like an entry in an index.

### 5. The hairline rule does the spatial work.
Section dividers are a 1px hairline at `--ink-hair` (0.12 alpha cream). The rule is the architecture; the type sits at its top edge with `padding-top: 0` so labels read as stamped onto the line.

### 6. Color is a fourth axis of hierarchy.
Five opacity steps on a single ink value (`#F8F8F8`):
- `--ink` 1.00 — primary, names, mark
- `--ink-2` 0.92 — prose, primary content
- `--ink-3` 0.45 — chrome, labels, captions
- `--ink-4` 0.30 — faintest, sub-meta
- `--ink-hair` 0.12 — rules

Plus `--accent #E8B25A` for live elements only (three places max — see `DEPARTURE-BOARD-DIRECTION.md`).

---

## Type scale — nine roles

Every text element on the site is one of these. **Don't add a tenth without retiring one.**

| Role | Token | Size | Weight | Tracking | Line-height | Use |
|------|-------|------|--------|----------|-------------|-----|
| **display** | `.t-display` | clamp(48-96px) | 500 | -0.04em | 1.05 | Hero name. Used **once** per page. |
| **statement** | `.t-statement` | clamp(15-18px) | 400 | -0.005em | 1.15 | Hero positioning sentence. Body register at hero scale. |
| **row** | `.t-row` | clamp(13-15px) | 500 | -0.005em | 1.15 | Primary list rows — project titles, note titles, currently entries. |
| **prose** | `.t-prose` | clamp(13-14.5px) | 400 | 0 | 1.65 | Paragraphs, longer body text. The one place we need real line-height for reading. |
| **section** | `.t-section` | 11px | 500 | 0.16em | 1 | SECTION LABELS — WORK, STUDIO, CURRENTLY. Always uppercase. |
| **meta** | `.t-meta` | 10px | 400 | 0.10em | 1.3 | Meta lines under section labels. Always caps. |
| **caption** | `.t-caption` | 10px | 400 | 0.06em | 1.3 | Captions, sub-meta on rows. Same size as meta but case-sensitive. |
| **footnote** | `.t-footnote` | 9px | 400 | 0.20em | 1.4 | Footer build info, last deploy. Faintest readable type. Always caps. |
| **eyebrow** | `.t-eyebrow` | 9px | 500 | 0.20em | 1 | Above-the-name eyebrow on the hero. Weight 500 distinguishes it from `.t-footnote`. |

Plus a tenth utility role:

| Role | Token | Size | Notes |
|------|-------|------|-------|
| **code** | `.t-code` | 10px | 500 weight, tabular, caps. Use for `RJ-26-01`-style identifiers. |

---

## Tracking scale — eight steps

| Token | Value | Use |
|-------|-------|-----|
| `--track-tightest` | -0.04em | Display — name only |
| `--track-tight` | -0.025em | Large body |
| `--track-snug` | -0.005em | Medium body, row titles |
| `--track-normal` | 0 | Default mono prose |
| `--track-loose` | 0.06em | Mono caps, tight |
| `--track-loosest` | 0.10em | Mono caps, comfortable |
| `--track-section` | 0.16em | Section labels |
| `--track-eyebrow` | 0.20em | Eyebrows, footnotes |

**Rule:** the smaller the type, the looser the tracking. Mono caps at 9px need 0.20em to read; mono caps at 11px need 0.16em.

---

## Line-height scale — five steps

| Token | Value | Use |
|-------|-------|-----|
| `--lh-tight` | 1.05 | Display — name |
| `--lh-snug` | 1.15 | Row titles, statement |
| `--lh-body` | 1.5 | Default body |
| `--lh-prose` | 1.65 | Paragraphs |
| `--lh-loose` | 1.8 | Generous prose (rarely used) |

---

## Spacing scale — seven steps

| Token | Value | Use |
|-------|-------|-----|
| `--space-hairline` | 1px | Rule lines |
| `--space-tight` | 4px | Within a meta line |
| `--space-1` | 8px | Adjacent elements |
| `--space-2` | 16px | Within a row group |
| `--space-3` | 24px | Between row groups |
| `--space-4` | 32px | Within a section, between blocks |
| `--space-5` | 64px | Between section header and body |
| `--space-6` | clamp(96-128px) | **Between sections** — load-bearing |
| `--space-7` | clamp(140-200px) | Hero → first section |

The 128px section gap is the silence that makes mono prose readable. **Don't compress it without intent.**

---

## Modifiers — composable with any role

| Class | Effect |
|-------|--------|
| `.tabular` | Enables `tabular-nums` and `lining-nums`. Required on any number that aligns across rows. |
| `.caps` | Force uppercase. (Already baked into `.t-section`, `.t-meta`, `.t-footnote`, `.t-eyebrow`, `.t-code`.) |
| `.dim` | Override color to `--ink-3`. |
| `.dimmer` | Override color to `--ink-4`. |
| `.live` | Override color to `--accent`. **Use only on live data — see three-amber-places rule.** |

Stack them: `<span className="t-row tabular live">14:32:18</span>` is a row-sized, tabular, amber-colored time display.

---

## Structural primitives — three React components

For patterns that compose multiple elements. Everything else is a CSS class.

### `<SectionHeader />`

```tsx
<SectionHeader label="Work" meta="04 entries · 2026.05.09" />
<SectionHeader label="Currently" icon="◆" iconLive />
<SectionHeader label="Notes" meta="02 entries" dim />
```

Renders the section label + optional meta + hairline rule. `iconLive` adds the 2.6s pulse animation in amber. `dim` softens the label to `--ink-3` when the prose body is the primary content (and the label should recede).

### `<Status />`

```tsx
<Status status="wip" label="Live" />
<Status status="shipped" label="2026" />
<Status status="archived" label="Retired" />
<Status status="queued" label="Q3 2026" />
```

Glyph + caps text. WIP renders in amber with the live pulse. Shipped is full cream. Archived is `--ink-4`. Queued is `--ink-4` with `◇` glyph.

### `<Datestamp />`

```tsx
<Datestamp date="2026.05.09" />        // single point
<Datestamp date="2026.05" />            // month
<Datestamp from="2026.04" />            // open-ended → " → present" in amber
<Datestamp from="2026.02" to="2026.04" /> // range
```

Tabular caption with the canonical `YYYY.MM.DD` format. Open-ended ranges use amber for the "present" marker — the only place outside the live time and LIVE row that amber appears in datestamps.

---

## Worked examples — the recurring patterns

### Hero

```tsx
<header className="hero">
  <span className="t-eyebrow live">◆ On File</span>
  <h1 className="t-display">Ryan Jun</h1>
  <p className="t-statement">
    Design engineer making small, considered things for people who
    care about details that take a year to notice.
  </p>
  <hr className="t-rule" />
  <p className="t-meta tabular">
    New York
    <span className="t-sep">·</span>
    <LiveTime />
    <span className="t-sep">·</span>
    62°F · OVERCAST
    <span className="t-sep">·</span>
    Status: Selective for Q3 2026
  </p>
</header>
```

### Section

```tsx
<section>
  <SectionHeader label="Work" meta="04 entries · 2026.05.09" />
  <ol className="rows">
    <li className="row">
      <span className="t-caption tabular dim">2026</span>
      <span className="t-code">RJ-26-01</span>
      <span className="t-row">LA28</span>
      <span className="t-meta">Brand · Campaign</span>
      <Status status="wip" label="Live" />
    </li>
    {/* ... */}
  </ol>
</section>
```

### Notes (diaristic)

```tsx
<article className="note">
  <header className="t-caption tabular dim">
    2026.05.09 03:14 <span className="t-sep">·</span> Apt, Brooklyn
  </header>
  <p className="t-prose">
    Stayed up late building the hero. Realized the sentence I keep
    writing is wrong. Going to sleep on it.
  </p>
</article>
```

### Footer

```tsx
<footer className="t-footnote">
  © 2026 Ryan Jun
  <span className="t-sep">·</span>
  hyeonjunjun.com
  <span className="t-sep">·</span>
  v0.5.0
  <span className="t-sep">·</span>
  Built with Next 16 + Geist
  <span className="t-sep">·</span>
  Last deploy 2026.05.09 14:32 EDT
</footer>
```

---

## Rules

These keep the framework from drifting:

1. **Don't add a tenth type role** without retiring one. The discipline is the design.
2. **Use `.tabular` on every number** that appears in a position where it might align across rows. Years, times, codes, counts — all tabular.
3. **Periods, not slashes or dashes, in dates.** `2026.05.09` not `2026/05/09` or `2026-05-09`. The period is the catalog signature.
4. **Amber goes in three places.** Live time, ◆ live status, hero `◆ ON FILE` eyebrow. Adding a fourth requires retiring one.
5. **One `.t-display` per page.** It's the page's anchor; multiple anchors = no anchor.
6. **Section header rule below, never above.** The rule closes the section's *upper boundary* — it sits under the label, before the body.
7. **`.t-rule` is 1px at `--ink-hair`.** Never thicker, never colored. The grid is the architecture; the rule is the tracing.
8. **Mono prose stays under 56ch.** Mono characters are wider than sans; lines longer than 56 characters become hard to track.
9. **Caps for chrome, sentence-case for prose.** Section labels, meta, captions = caps. Paragraphs, statements, note bodies = sentence case.
10. **No italics anywhere.** Geist Mono ships an italic; we don't use it. Emphasis through weight, tracking, caps, color — never slant.

---

## Migration notes

The legacy `--type-nav`, `--type-number`, `--type-title`, `--type-body`, `--type-folio` tokens still exist as aliases pointing at the new role tokens. Components that reference them won't break. When you next touch a component, migrate its tokens to the new role names and drop the alias usage.

The body's default font-family is now `var(--font-stack-mono)` (was sans). Any component using the old default will switch to mono automatically. Components that explicitly set sans (rare — almost none) will keep their sans treatment.

---

## What this framework explicitly does NOT include

- A grid system (separate concern, lives in component-local CSS).
- Animation primitives (live in `LiveTime`, `Status`, `SectionHeader` directly).
- A color palette (already in `globals.css`, see `DEPARTURE-BOARD-DIRECTION.md`).
- Image / media handling (mono-only sites have minimal media; what exists is component-local).
- A spacing rhythm utility (no auto-pacing classes — section-to-section spacing is hand-set with `--space-6`).

These intentionally stay out of the typography framework so each can evolve independently.
