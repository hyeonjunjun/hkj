"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/** If a navigation never lands, release the snapshot rather than freeze. */
const SAFETY_MS = 1200;

/**
 * Drives the native View Transitions API across client-side navigations.
 *
 * Why this exists rather than React's `unstable_ViewTransition`: that
 * component only ships in React's experimental channel, and Next 16.1.6
 * pins React 19.2.3 stable, where the export does not exist. Verified
 * empirically too — with `experimental.viewTransition` already enabled
 * in next.config.ts, `document.startViewTransition` was called zero
 * times across a real navigation. The flag alone does nothing.
 *
 * So the API is driven by hand. The browser needs the DOM mutation to
 * happen INSIDE the callback it is given, which for a router push means
 * handing it a promise that settles once the new route has painted —
 * hence the resolver parked in a ref and released by the pathname
 * effect.
 *
 * What this buys, both from one mechanism:
 *
 *   - Every page-to-page move cross-fades, because a cross-fade is the
 *     API's default root animation. Timing is in globals.css.
 *   - Where two pages carry the same `view-transition-name` on an
 *     element — a work's plate on home, its row on /works, its hero on
 *     the case study all use `work-<slug>` — the browser tweens that
 *     element between its two positions instead of fading it. That is
 *     the flip, and it costs no animation code.
 *
 *
 * Bails out, leaving Next's normal navigation alone, when: the API is
 * absent, the viewer asked for reduced motion, the click was modified
 * or middle/right, the link is external, targets another frame, or is a
 * download.
 */
export default function ViewTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const resolveRef = useRef<(() => void) | null>(null);
  const timerRef = useRef<number | null>(null);

  // The new route has painted — let the browser swap the snapshots.
  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    resolveRef.current?.();
    resolveRef.current = null;
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined" || !document.startViewTransition) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Same-origin, and an actual route change — not a hash jump or a
      // link back to the page we are already on.
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      // Capture phase, so this runs before next/link's own handler and
      // can take the navigation over. Without stopPropagation Link would
      // also push, and the route would change outside the transition
      // callback — which is precisely the case the API cannot animate.
      event.preventDefault();
      event.stopPropagation();

      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            resolveRef.current = resolve;
            // Never leave the page under a frozen snapshot if the route
            // fails to resolve.
            timerRef.current = window.setTimeout(() => {
              resolveRef.current = null;
              resolve();
            }, SAFETY_MS);
            router.push(url.pathname + url.search);
          }),
      );
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [router]);

  return null;
}
