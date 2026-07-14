import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CornerMark from "./CornerMark";
import { studio } from "@/data/studio";

describe("CornerMark default (room) variant", () => {
  it("renders the full studio-info stack, positioned bottom-left", () => {
    const { container } = render(<CornerMark />);
    expect(screen.getByText(`${studio.fullName}©`, { exact: false })).toBeInTheDocument();
    expect(screen.getByText(`EST ${studio.established}`)).toBeInTheDocument();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("md:left-[var(--edge-margin)]");
  });
});

describe("CornerMark landing variant", () => {
  it("renders only availability/location/time, positioned bottom-right, no studio name", () => {
    const { container } = render(<CornerMark variant="landing" />);
    expect(screen.queryByText(`${studio.fullName}©`, { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByText(`EST ${studio.established}`)).not.toBeInTheDocument();
    expect(screen.getByText(new RegExp(studio.availability, "i"))).toBeInTheDocument();
    expect(screen.getByText(studio.location)).toBeInTheDocument();
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("md:right-[var(--edge-margin)]");
  });

  it("uses ws-accent for the indicator dot, not ember", () => {
    render(<CornerMark variant="landing" />);
    const dot = screen.getByText("•");
    expect(dot).toHaveClass("text-ws-accent");
    expect(dot).not.toHaveClass("text-ember");
  });
});
