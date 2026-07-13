import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimelineStop from "./TimelineStop";
import type { Work } from "@/data/works";

const work: Work = {
  id: "work-01",
  slug: "placeholder-i",
  index: 1,
  romanNumeral: "I",
  title: "Placeholder Title I",
  caption: "placeholder caption",
  description: "description",
  category: "WORK",
  year: "2025",
  status: "LIVE",
  role: "role",
  media: { type: "placeholder", alt: "Placeholder for Work I", aspectRatio: "portrait" },
  layout: {
    desktopColumn: "left",
    desktopVerticalAnchor: 0,
    desktopSize: "md",
    captionPosition: "below",
  },
};

describe("TimelineStop", () => {
  it("renders the roman numeral, category, status, and caption", () => {
    render(<TimelineStop work={work} isActive={false} />);
    expect(screen.getByText(/I \/ WORK/)).toBeInTheDocument();
    // "LIVE" is a substring of the same <p> as the numeral/category
    // ("• I / WORK · LIVE"), so an exact string match would find no element —
    // use a regex for a substring match against that element's text content.
    expect(screen.getByText(/LIVE/)).toBeInTheDocument();
    expect(screen.getByText("placeholder caption")).toBeInTheDocument();
  });

  it("links to the work's case-study page", () => {
    render(<TimelineStop work={work} isActive={false} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/works/placeholder-i");
  });

  it("applies the active emphasis class only when isActive is true", () => {
    const { rerender } = render(<TimelineStop work={work} isActive={false} />);
    expect(screen.getByRole("link")).not.toHaveClass("opacity-100");

    rerender(<TimelineStop work={work} isActive={true} />);
    expect(screen.getByRole("link")).toHaveClass("opacity-100");
  });
});
