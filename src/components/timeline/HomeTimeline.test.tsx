import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HomeTimeline from "./HomeTimeline";
import { works } from "@/data/works";
import { sortWorksForTimeline } from "@/lib/timelineMotion";

function mockMatchMedia(reducedMotion: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("HomeTimeline", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("renders one stop per Work, plus the active-stop title region", () => {
    render(<HomeTimeline works={works} />);
    expect(screen.getAllByRole("article")).toHaveLength(works.length);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the newest Work's title by default (sorted newest-first)", () => {
    render(<HomeTimeline works={works} />);
    const newest = sortWorksForTimeline(works)[0];
    expect(screen.getByRole("status")).toHaveTextContent(newest.title);
  });

  it("renders without throwing when prefers-reduced-motion is set", () => {
    mockMatchMedia(true);
    expect(() => render(<HomeTimeline works={works} />)).not.toThrow();
  });
});
