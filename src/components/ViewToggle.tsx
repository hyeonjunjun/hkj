"use client";

import { useSyncExternalStore } from "react";
import { useHomeView, type HomeView } from "@/hooks/useHomeView";

// Hydration flag implemented via useSyncExternalStore: returns false
// on the server snapshot and true on the client snapshot. React flips
// it after first commit without triggering set-state-in-effect.
const subscribeNoop = () => () => {};
const getHydratedClient = () => true;
const getHydratedServer = () => false;

/**
 * ViewToggle — fixed top-right gallery/list switch. Geist Sans 10–11px
 * tracked lowercase. The home page's only persistent UI primitive
 * beyond Folio + nav. Per spec §8, this *is* the home `!` moment —
 * discoverable but unannounced.
 *
 * The active-state attributes (`data-active`, `aria-pressed`) defer
 * to the post-hydration view to avoid SSR/CSR mismatch warnings: SSR
 * always renders both buttons inactive (matches the gallery default
 * + the no-attribute fallback) and the active state appears on
 * first commit. Visual continuity is maintained because the parent
 * page's CSS (`html[data-home-view="…"] .home__gallery`) governs
 * which composition is visible — not the toggle's button state.
 */
export default function ViewToggle() {
  const { view, setView } = useHomeView();
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getHydratedClient,
    getHydratedServer,
  );

  function pick(target: HomeView) {
    if (target !== view) setView(target);
  }

  // SSR + first commit: render with no active state. Once hydrated,
  // the active state reflects the resolved view.
  const galleryActive = hydrated && view === "gallery";
  const listActive = hydrated && view === "list";

  return (
    <div className="view-toggle" role="group" aria-label="Home view">
      <button
        type="button"
        className="view-toggle__btn"
        data-active={galleryActive}
        aria-pressed={galleryActive}
        onClick={() => pick("gallery")}
      >
        gallery
      </button>
      <span className="view-toggle__sep" aria-hidden> / </span>
      <button
        type="button"
        className="view-toggle__btn"
        data-active={listActive}
        aria-pressed={listActive}
        onClick={() => pick("list")}
      >
        list
      </button>

      <style>{`
        .view-toggle {
          display: inline-flex;
          align-items: baseline;
          gap: 0;
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: var(--microtype-tracking);
          text-transform: lowercase;
          color: var(--ink-3);
          background: transparent;
        }
        .view-toggle__btn {
          background: transparent;
          border: 0;
          padding: 0;
          margin: 0;
          font: inherit;
          color: var(--ink-3);
          cursor: pointer;
          letter-spacing: inherit;
          text-transform: inherit;
          transition: color 200ms var(--ease);
        }
        .view-toggle__btn[data-active="true"] {
          color: var(--ink);
        }
        .view-toggle__btn:hover { color: var(--ink); }
        .view-toggle__sep {
          color: var(--ink-4);
          padding-inline: 0.4em;
        }

        @media (prefers-reduced-motion: reduce) {
          .view-toggle__btn { transition: none; }
        }
      `}</style>
    </div>
  );
}
