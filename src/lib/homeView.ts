/**
 * Which of home's two arrangements is on screen.
 *
 * The index is not a route. It is the same catalogue as the home spread,
 * laid out as rows instead of as one plate at a time, so it lives on `/`
 * as a state rather than at a URL of its own — the arrangement measured
 * off dylan.camera, whose Home and Index links both point at `/`.
 *
 * That has two consequences worth stating. The index cannot be linked to
 * or shared, which is the accepted cost. And the transition between the
 * two is a DOM change rather than a navigation, so it starts on the same
 * frame instead of waiting for a route to resolve — which is most of why
 * it now feels immediate.
 *
 * Persisted for the same reason the current work is: leaving the index
 * for a case study and coming back should return to the index, not to
 * the spread. Guarded like every other storage access here.
 */
export type HomeView = "home" | "index";

const KEY = "rj:home-view";

export function rememberView(view: HomeView): void {
  try {
    sessionStorage.setItem(KEY, view);
  } catch {
    /* storage unavailable — home simply opens on the spread */
  }
}

export function recallView(): HomeView {
  try {
    return sessionStorage.getItem(KEY) === "index" ? "index" : "home";
  } catch {
    return "home";
  }
}
