/**
 * Which work the visitor is currently on, carried across navigations.
 *
 * Home, /works and a case study are three views of one catalogue rather
 * than three destinations, so moving between them should not reset which
 * project you were looking at: leaving home on project four and coming
 * back — whether from /works or from that project's own case study —
 * should return you to project four, not to project one.
 *
 * sessionStorage rather than a context or the URL: it survives a real
 * navigation and a reload, and it dies with the tab, which is the right
 * lifetime for "where I was just now". Every access is guarded — the
 * accessor itself throws in a private window or with site data blocked,
 * and the feature is a convenience, never a requirement.
 */
const KEY = "rj:current-work";

/** Record the work now on screen. Safe to call on every change. */
export function rememberWork(slug: string): void {
  try {
    sessionStorage.setItem(KEY, slug);
  } catch {
    /* storage unavailable — the site just opens on the first work */
  }
}

/** The work to open on, or null when there is nothing to restore. */
export function recallWork(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
