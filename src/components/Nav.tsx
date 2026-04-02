"use client";

import TransitionLink from "./TransitionLink";
import ThemeToggle from "./ThemeToggle";
import ViewToggle from "./ViewToggle";
import type { PieceType } from "@/constants/pieces";

interface NavProps {
  /** Homepage mode: show filter + view controls */
  variant?: "home" | "detail";
  activeFilter?: PieceType | null;
  onFilterChange?: (filter: PieceType | null) => void;
  viewMode?: "list" | "index";
  onViewChange?: () => void;
}

export default function Nav({
  variant = "detail",
  activeFilter = null,
  onFilterChange,
  viewMode = "list",
  onViewChange,
}: NavProps) {
  const handleFilter = (type: PieceType) => {
    if (!onFilterChange) return;
    onFilterChange(activeFilter === type ? null : type);
  };

  return (
    <header className="nav" data-nav-stagger="0">
      <TransitionLink href="/" className="nav-mark">
        HKJ
      </TransitionLink>
      <div className="nav-links">
        {variant === "home" && onViewChange && (
          <ViewToggle mode={viewMode} onToggle={onViewChange} />
        )}
        <ThemeToggle />
        {variant === "home" ? (
          <>
            <button
              onClick={() => handleFilter("project")}
              className={activeFilter === "project" ? "active" : ""}
            >
              Work
            </button>
            <button
              onClick={() => handleFilter("experiment")}
              className={activeFilter === "experiment" ? "active" : ""}
            >
              Archive
            </button>
          </>
        ) : null}
        <TransitionLink href="/about">About</TransitionLink>
      </div>
    </header>
  );
}
