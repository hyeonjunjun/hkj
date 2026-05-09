/**
 * microtype — typographic primitives for the mono-only system.
 *
 * Three structural components live here. Everything else (eyebrows,
 * captions, codes, footnotes, separators) is a single CSS class —
 * see globals.css for `.t-display`, `.t-statement`, `.t-row`,
 * `.t-prose`, `.t-section`, `.t-meta`, `.t-caption`, `.t-footnote`,
 * `.t-eyebrow`, `.t-code`, `.t-rule`, `.t-sep`.
 *
 * Modifiers (composable with any role): `.tabular`, `.caps`,
 * `.dim`, `.dimmer`, `.live`.
 *
 * Reference doc: docs/MICROTYPOGRAPHY.md
 */

export { default as SectionHeader } from "./SectionHeader";
export { default as Status } from "./Status";
export { default as Datestamp } from "./Datestamp";
