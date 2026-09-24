"use client";

import { useLayoutEffect } from "react";
import { recallWork } from "@/lib/currentWork";

/**
 * Brings the work you were last on into view when /works opens.
 *
 * Only when it is actually off screen: with a short catalogue every row
 * is already visible, and scrolling a list that needs no scrolling would
 * be motion for its own sake. Instant rather than smooth, and in a
 * layout effect, so the row is in place before the first paint instead
 * of sliding there after it.
 */
export default function RestoreIndexScroll() {
  useLayoutEffect(() => {
    const slug = recallWork();
    if (!slug) return;

    const row = document.querySelector<HTMLElement>(`[data-work-slug="${CSS.escape(slug)}"]`);
    if (!row) return;

    const box = row.getBoundingClientRect();
    if (box.top >= 0 && box.bottom <= window.innerHeight) return;

    row.scrollIntoView({ block: "center", behavior: "auto" });
  }, []);

  return null;
}
