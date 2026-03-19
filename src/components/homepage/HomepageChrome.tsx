"use client";

import { useStudioStore } from "@/lib/store";
import { NAV_LINKS } from "@/constants/navigation";
import { CONTACT_EMAIL } from "@/constants/contact";
import TransitionLink from "@/components/TransitionLink";
import ViewToggle from "@/components/homepage/ViewToggle";
import { PROJECTS } from "@/constants/projects";

const activeProjects = PROJECTS.filter((p) => !p.wip);

export default function HomepageChrome() {
  const viewMode = useStudioStore((s) => s.viewMode);
  const activeProjectIndex = useStudioStore((s) => s.activeProjectIndex);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 200, padding: "var(--page-px)" }}
    >
      {/* Top bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        {/* Wordmark */}
        <TransitionLink
          href="/"
          className="font-mono uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-70"
          style={{
            fontSize: "var(--text-micro)",
            color: "var(--color-text-dim)",
          }}
        >
          hkj
        </TransitionLink>

        {/* Nav links — hidden on mobile, MobileMenu handles it */}
        <nav className="hidden md:flex gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className="font-mono uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-70"
              style={{
                fontSize: "var(--text-micro)",
                color: "var(--color-text-dim)",
              }}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        {/* Mobile hamburger — triggers MobileMenu */}
        <button
          className="md:hidden font-mono uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-70"
          style={{ fontSize: "var(--text-micro)", color: "var(--color-text-dim)" }}
          onClick={() => useStudioStore.getState().setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      {/* Bottom bar — desktop: single row; mobile: stacked */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-auto"
        style={{ padding: "var(--page-px)" }}
      >
        {/* Desktop bottom bar */}
        <div className="hidden md:flex justify-between items-end">
          {/* Email */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display italic transition-opacity duration-200 hover:opacity-70"
            style={{
              fontSize: "var(--text-small)",
              color: "var(--color-text-dim)",
            }}
          >
            {CONTACT_EMAIL}
          </a>

          {/* Right: counter or location + toggle */}
          <div className="flex items-end gap-8">
            {viewMode === "slider" ? (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                {String(activeProjectIndex + 1).padStart(2, "0")} /{" "}
                {String(activeProjects.length).padStart(2, "0")}
              </span>
            ) : (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                NYC
              </span>
            )}
            <ViewToggle />
          </div>
        </div>

        {/* Mobile bottom bar — stacked */}
        <div className="flex md:hidden flex-col gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display italic transition-opacity duration-200 hover:opacity-70"
            style={{
              fontSize: "var(--text-small)",
              color: "var(--color-text-dim)",
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <div className="flex justify-between items-end">
            {viewMode === "slider" ? (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                {String(activeProjectIndex + 1).padStart(2, "0")} /{" "}
                {String(activeProjects.length).padStart(2, "0")}
              </span>
            ) : (
              <span
                className="font-mono uppercase tracking-[0.1em]"
                style={{
                  fontSize: "var(--text-micro)",
                  color: "var(--color-text-ghost)",
                }}
              >
                NYC
              </span>
            )}
            <ViewToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
