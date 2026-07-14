import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Standfirst from "./Standfirst";
import { studio } from "@/data/studio";

describe("Standfirst", () => {
  it("renders the standfirst copy in the existing sans font, ws-ink color", () => {
    render(<Standfirst />);
    const p = screen.getByText(studio.standfirst);
    expect(p).toHaveClass("font-sans");
    expect(p).toHaveClass("text-ws-ink");
    expect(p).not.toHaveClass("font-display");
    expect(p).not.toHaveClass("text-ink");
  });
});
