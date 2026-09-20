import type Lenis from "lenis";

/**
 * The single Lenis instance, shared.
 *
 * SmoothScroll owns the lifecycle; anything that needs to move the page
 * without fighting the smoothing reads it from here. Calling
 * window.scrollTo() while Lenis is running makes the two argue — Lenis
 * keeps animating toward its own target and undoes the jump — so the
 * looping hero has to go through the instance.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Jump with no interpolation, used for the hero's seamless wrap. Falls
 * back to a native jump when Lenis is absent (reduced motion, or before
 * mount).
 */
export function jumpTo(y: number) {
  const l = instance;
  if (l) l.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}
