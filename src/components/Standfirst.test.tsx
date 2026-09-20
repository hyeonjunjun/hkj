import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Standfirst from "./Standfirst";
import { studio } from "@/data/studio";

describe("Standfirst", () => {
  it("renders the standfirst copy in the prose role, ws-ink color", () => {
    render(<Standfirst />);
    const p = screen.getByText(studio.standfirst);
    expect(p).toHaveClass("text-prose");
    expect(p).toHaveClass("text-ws-ink");
    // The single-size system has one face; nothing restates a family, and
    // no component carries its own size any more.
    expect(p).not.toHaveClass("font-sans");
    expect(p).not.toHaveClass("font-display");
    expect(p).not.toHaveClass("text-ink");
  });
});
