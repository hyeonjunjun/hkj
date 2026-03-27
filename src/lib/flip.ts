import { Flip } from "@/lib/gsap";

/**
 * Captures FLIP state of all [data-flip-id] items,
 * runs the view change callback, then animates to new positions.
 */
export function flipTransition(
  container: HTMLElement,
  onViewChange: () => void,
  options?: { duration?: number; ease?: string; onComplete?: () => void }
) {
  const items = container.querySelectorAll("[data-flip-id]");
  if (!items.length) {
    onViewChange();
    options?.onComplete?.();
    return;
  }

  const state = Flip.getState(items);

  onViewChange();

  // Double rAF ensures React has committed DOM changes
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const newItems = container.querySelectorAll("[data-flip-id]");
      Flip.from(state, {
        targets: newItems,
        duration: options?.duration ?? 0.6,
        ease: options?.ease ?? "expo.out",
        absolute: true,
        onComplete: options?.onComplete,
      });
    });
  });
}
