/**
 * Standardized GSAP reveal presets.
 *
 * REVEAL_CONTENT — text, metadata, list items (subtle, fast)
 * REVEAL_MEDIA   — cards, images, gallery items (larger offset, slower)
 */

export const REVEAL_CONTENT = {
  from: { opacity: 0, y: 12 },
  to: {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.06,
    ease: "expo.out",
    delay: 0.15,
  },
} as const;

export const REVEAL_MEDIA = {
  from: { autoAlpha: 0, y: 32 },
  to: {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: "expo.out",
    delay: 0.1,
  },
} as const;
