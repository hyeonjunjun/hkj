// src/components/chrome/Logo.tsx
"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/transition/TransitionLink";

export function Logo() {
  const pathname = usePathname();
  // The corner (everything outside /legacy) renders its own editorial
  // masthead inside CornerNav which owns the shared rj-mark
  // view-transition-name. Show this bottom-left Logo only on /legacy
  // routes so the legacy site keeps its identity affordance.
  if (!pathname?.startsWith("/legacy")) return null;
  return (
    <TransitionLink
      href="/legacy"
      className="logo"
      aria-label="Ryan Jun — home"
    >
      rj
      <style>{`
        .logo {
          position: fixed;
          bottom: var(--margin-page);
          left: var(--margin-page);
          z-index: 50;
          font-family: var(--font-stack-mono);
          font-size: var(--type-meta);
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          pointer-events: auto;
          /* Preserve the shared-element wordmark VT from the prior Frame.
             Sub-pages also use this name on their own wordmark surrogate
             (Sitebar's left text on home, BackButton arrow off-home —
             actually only one VT per page is allowed; the Logo carries
             the VT identity site-wide since it appears on every route). */
          view-transition-name: rj-mark;
        }
      `}</style>
    </TransitionLink>
  );
}
