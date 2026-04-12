export const DUR = {
  micro: 0.3,
  reveal: 0.6,
  page: 1.0,
} as const;

export const EASE = {
  inOut: [0.65, 0, 0.35, 1] as const,
  out: [0.23, 0.88, 0.26, 0.92] as const,
  /** GSAP string equivalents for APIs that need strings */
  outString: "power3.out",
  inOutString: "power2.inOut",
} as const;
