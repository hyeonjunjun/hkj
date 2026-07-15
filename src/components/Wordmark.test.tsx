import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Wordmark from "./Wordmark";

describe("Wordmark hero variant (default)", () => {
  it("renders as an h1 in the display grotesque, dark ink for the light background", () => {
    render(<Wordmark />);
    const heading = screen.getByRole("heading", { level: 1 });
    const mark = heading.querySelector("span");
    expect(mark).toHaveClass("font-display");
    expect(mark).toHaveClass("text-ws-ink");
    expect(mark).not.toHaveClass("font-sans");
  });

  it("uses WindBlurReveal for its entrance, not MotionReveal", () => {
    const { container } = render(<Wordmark />);
    expect(container.querySelector("filter")).toBeInTheDocument();
  });
});

describe("Wordmark room variant", () => {
  it("keeps the existing font-sans/text-ink rendering, wrapped in a link, no h1", () => {
    render(<Wordmark variant="room" />);
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    const link = screen.getByRole("link");
    const mark = link.querySelector("span");
    expect(mark).toHaveClass("font-sans");
    expect(mark).toHaveClass("text-ink");
    expect(mark).not.toHaveClass("font-display");
  });
});
