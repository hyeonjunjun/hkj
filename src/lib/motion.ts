/**
 * Centralized motion constants — the single source of truth for easing
 * curves, durations, and entrance-animation delays used across every
 * room. Tune timing here rather than inside components.
 */

/** Named easing curves, keyed by intent rather than by curve shape. */
export const easing = {
  /** Quick out, slow in — the primary hover/reveal curve. */
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Symmetric ease for state transitions. */
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Constant-rate motion, used for continuous effects like the pulse. */
  linear: "linear",
} as const;

/** Durations in milliseconds, keyed by the kind of motion they drive. */
export const duration = {
  fast: 180,
  base: 240,
  slow: 400,
  /** Page-load entrance animations. */
  reveal: 600,
  /** Ambient breathing pulse (corner mark dot). */
  pulse: 2400,
} as const;

/**
 * Entrance delays in milliseconds, producing one coordinated load
 * sequence: wordmark → standfirst → nav → primary content (staggered)
 * → thesis → corner mark.
 */
export const delay = {
  wordmark: 0,
  standfirst: 200,
  nav: 300,
  /** Starting delay for the first staggered item in a room's primary content. */
  primary: 400,
  /** Additional delay added per subsequent staggered item. */
  stagger: 120,
  thesis: 800,
  cornerMark: 900,
} as const;
