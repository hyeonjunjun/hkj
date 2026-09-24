"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import type { Work } from "@/data/works";
import Clock from "@/components/Clock";
import SiteNav from "@/components/SiteNav";
import HomeIndex from "./HomeIndex";
import IndexList from "@/components/works/IndexList";
import RestoreIndexScroll from "@/components/works/RestoreIndexScroll";
import { recallView, rememberView, type HomeView } from "@/lib/homeView";

/**
 * How long the arriving view's text waits before it begins staging in —
 * 70% of the flip, by which point a quint has covered 96% of the
 * distance and the swatches are within a couple of pixels of their rows.
 * Mirrors --enter-after in globals.css.
 */
const ENTER_AFTER_MS = 440;

interface HomeShellProps {
  works: Work[];
}

/**
 * Home, in both of its arrangements.
 *
 * The spread — one plate at a time, stepped — and the index — every work
 * as a row — are two views of one catalogue, so they are two states of
 * this component rather than two routes. See lib/homeView for why.
 *
 * THE TRANSITION
 *
 * `startViewTransition` is given a synchronous DOM change, which is what
 * the API is actually designed for; the route-navigation version this
 * replaces had to hand it a promise that settled only once the next
 * route had painted, and nothing could move until it did. Here the flip
 * begins on the frame of the click.
 *
 * flushSync is not optional: the browser captures the "after" state when
 * the callback returns, and React would otherwise still have the update
 * queued, so it would capture the OLD DOM twice and animate nothing.
 *
 * The `data-vt-pair` stamp is what globals.css keys the whole
 * choreography off — which elements travel, which fade, and in what
 * order. It is set before the capture, because the browser reads
 * view-transition-name off the live DOM as it captures.
 */
export default function HomeShell({ works }: HomeShellProps) {
  const [view, setView] = useState<HomeView>("home");
  /** False until the remembered view is restored, so that restore cannot animate. */
  const [settled, setSettled] = useState(false);

  useLayoutEffect(() => {
    const remembered = recallView();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (remembered !== "home") setView(remembered);
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (settled) rememberView(view);
  }, [view, settled]);

  const show = useCallback(
    (next: HomeView) => {
      if (next === view) return;

      const root = document.documentElement;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduced) {
        setView(next);
        return;
      }

      root.dataset.vtPair = "home-index";
      // Set BEFORE the transition starts, not alongside the state that
      // renders the new view. animation-delay is live: if this arrives
      // in the same commit that mounts the staged elements, they begin
      // on the old value and the browser then re-times them, which
      // showed up as the last row snapping in at full opacity instead
      // of fading. Set here it is already in place when they mount.
      //
      // Never reset: the only arrival that should not wait for a flip
      // is the first render of a fresh document, where :root's own 0ms
      // still stands.
      root.style.setProperty("--enter-after", `${ENTER_AFTER_MS}ms`);

      const transition = document.startViewTransition(() => {
        flushSync(() => setView(next));
      });
      // finally, not then: a skipped transition rejects, and leaving the
      // stamp on would misdirect the next one.
      transition.finished.finally(() => {
        delete root.dataset.vtPair;
      });
    },
    [view],
  );

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-ws-paper">
      {/* On the spread the nav is taken OUT OF FLOW, and that is what
          makes the composition centre correctly. In flow it is 44px of
          content that the spread then has to sit below, so the plate,
          the rail and the margin all centred on the middle of what was
          left — measurably 22px, half the nav, below the middle of the
          viewport. The eye centres on the window, not on the leftover.

          The index is a document rather than a composition, so there
          the nav stays in flow and sticks, and the rows begin under it
          the way rows should. */}
      <div
        className={
          view === "home"
            ? "absolute inset-x-0 top-0 z-20 pb-[var(--space-2)]"
            : "sticky top-0 z-20 bg-ws-paper pb-[var(--space-2)]"
        }
      >
        <SiteNav
          trailing={<Clock className="text-label text-ws-ink" />}
          homeView={view}
          onShowView={show}
        />
      </div>

      {view === "home" ? (
        /* The whole viewport, not the part under the nav — see above.
           Locked to one: the spread is stepped, not scrolled. */
        <div className="absolute inset-0">
          <HomeIndex works={works} />
        </div>
      ) : (
        /* The index is a document: it flows and scrolls normally. */
        <div className="flex-1">
          <RestoreIndexScroll />
          <IndexList works={works} />
        </div>
      )}
    </main>
  );
}
