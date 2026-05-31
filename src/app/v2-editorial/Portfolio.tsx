"use client";

import { useCallback, useEffect, useState } from "react";
import { Spine } from "./components/Spine";
import { TopStrip } from "./components/TopStrip";
import { BottomStrip } from "./components/BottomStrip";
import { BaselineGrid } from "./components/BaselineGrid";
import { Home } from "./views/Home";
import { Projects } from "./views/Projects";
import { FOLIOS_BY_DATE } from "./lib/content";

type ViewId = "home" | "projects";

// View Transitions API — falls back to a plain setState swap when the
// browser doesn't support it.
function withViewTransition(update: () => void) {
  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(update);
  } else {
    update();
  }
}

export default function Portfolio() {
  const [view, setView] = useState<ViewId>("home");
  const [activeFolio, setActiveFolio] = useState<string | undefined>(undefined);

  // Freeze the host page; also mark the surface so global chrome
  // (Sitebar/Logo/CommitStamp/PaperGrain) hides itself via CSS.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.setAttribute("data-surface", "v2");
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      html.removeAttribute("data-surface");
    };
  }, []);

  const goto = useCallback((next: ViewId, folioId?: string) => {
    withViewTransition(() => {
      setView(next);
      if (folioId) setActiveFolio(folioId);
    });
  }, []);

  // Keyboard shortcuts — arrow keys flip between home and projects.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      }
      if (e.key === "ArrowRight" && view === "home") goto("projects");
      if (e.key === "ArrowLeft" && view === "projects") goto("home");
      if (e.key === "Escape" && view !== "home") goto("home");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, goto]);

  // Compute spine/strip context per view.
  const total = FOLIOS_BY_DATE.length;
  const isHome = view === "home";
  const spineCode = isHome ? "R000" : "C001";
  const spineKind = isHome ? "catalog" : "catalog";
  const spineDate = isHome ? "2026-05-30" : FOLIOS_BY_DATE[0].date;
  const spineIndex = isHome ? 0 : 1;

  const topDate = "2026·05·30";
  const topKind = isHome ? "frontispiece" : "catalog";
  const topStatus = isHome ? "live" : "browse";
  const topMeasure = isHome ? "—" : `${total} items`;
  const topHint = isHome ? "→ open catalog" : "g · baseline";

  return (
    <div className="v2-root">
      <Spine
        code={spineCode}
        kind={spineKind as "catalog"}
        date={spineDate}
        total={total}
        index={spineIndex}
      />
      <TopStrip date={topDate} kind={topKind} status={topStatus} measure={topMeasure} hint={topHint} />

      <main className="v2-recto" style={{ viewTransitionName: "v2-recto" } as React.CSSProperties}>
        <BaselineGrid />
        {isHome ? (
          <Home onOpenCatalog={() => goto("projects")} />
        ) : (
          <Projects onBackHome={() => goto("home")} />
        )}
      </main>

      <BottomStrip
        activeId={isHome ? undefined : activeFolio}
        onSelect={(id) => {
          // For now selecting from the bottom strip just opens the
          // catalog view (later: deep-link into the folio).
          goto("projects", id);
        }}
      />
    </div>
  );
}
