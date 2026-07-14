import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ThesisStatement from "./ThesisStatement";
import { studio } from "@/data/studio";

describe("ThesisStatement", () => {
  it("renders the thesis copy in the display font, ws-ink color", () => {
    render(<ThesisStatement />);
    const p = screen.getByText(studio.thesis);
    expect(p).toHaveClass("font-display");
    expect(p).toHaveClass("text-ws-ink");
    expect(p).not.toHaveClass("text-ink");
  });

  it("no longer self-positions absolutely (nested in the identity block instead)", () => {
    const { container } = render(<ThesisStatement />);
    expect(container.innerHTML).not.toContain("md:absolute");
  });
});
