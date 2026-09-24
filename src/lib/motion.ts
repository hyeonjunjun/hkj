/**
 * Centralized motion constants — the single source of truth for easing
 * curves, durations, and entrance-animation delays used across every
 * room. Tune timing here rather than inside components.
 */

/**
 * The two curves. These mirror --ease and --ease-move in globals.css,
 * which is the canonical definition; they exist here only because inline
 * styles and Framer Motion cannot read a CSS custom property.
 *
 * Both are symmetric ease-in-out on purpose — see the note in
 * globals.css for why that, and not an ease-out, is the character of
 * the site.
 */
export const easing = {
  /** easeInOutCubic. Anything that changes in place. */
  micro: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** easeInOutQuint. Anything that travels or rearranges. */
  move: "cubic-bezier(0.83, 0, 0.17, 1)",
  /** Constant-rate motion, used for continuous effects like the pulse. */
  linear: "linear",
} as const;

/** `easing.move` as a Framer Motion cubic-bezier tuple. */
export const easeMove: [number, number, number, number] = [0.83, 0, 0.17, 1];

/** Durations in milliseconds. Mirrors --dur-* in globals.css. */
export const duration = {
  /** Pairs with easing.micro. */
  micro: 200,
  /** Fades that have to fit around a move without being one. */
  mid: 400,
  /** Pairs with easing.move. */
  move: 600,
  /** Entrance animations — the same 600, named for how it reads at the call site. */
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

/**
 * Framer Motion's `transition.duration`/`transition.delay` are expressed
 * in seconds, unlike every other constant in this file (milliseconds).
 * These two objects pre-convert the existing scale so the Windswept
 * landing page's Framer Motion components share the same coordinated
 * timing without repeating a `/1000` conversion at every call site.
 */
export const delaySeconds = {
  wordmark: delay.wordmark / 1000,
  standfirst: delay.standfirst / 1000,
  nav: delay.nav / 1000,
  thesis: delay.thesis / 1000,
  cornerMark: delay.cornerMark / 1000,
} as const;

export const durationSeconds = {
  micro: duration.micro / 1000,
  mid: duration.mid / 1000,
  move: duration.move / 1000,
  reveal: duration.reveal / 1000,
} as const;
