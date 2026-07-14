import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import WindBlurReveal from "./WindBlurReveal";

describe("WindBlurReveal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders its children", () => {
    render(
      <WindBlurReveal>
        <p>Studio name</p>
      </WindBlurReveal>,
    );
    expect(screen.getByText("Studio name")).toBeInTheDocument();
  });

  it("renders the SVG directional-blur filter definition", () => {
    const { container } = render(
      <WindBlurReveal>
        <p>Studio name</p>
      </WindBlurReveal>,
    );
    const filterDef = container.querySelector("filter");
    expect(filterDef).toHaveAttribute("id");
    expect(filterDef?.getAttribute("id")).toEqual(expect.stringMatching(/^wind-blur-/));
    const filterEl = filterDef?.querySelector("feGaussianBlur");
    expect(filterEl).toHaveAttribute("stdDeviation", "8 0");
  });

  it("starts blurred/faded and settles to sharp/visible after the delay", () => {
    const { container } = render(
      <WindBlurReveal delay={500} duration={600}>
        <p>Studio name</p>
      </WindBlurReveal>,
    );
    const filterId = container.querySelector("filter")?.getAttribute("id");
    expect(filterId).toBeTruthy();
    const wrapper = container.querySelector("div[style]");
    expect(wrapper).toHaveStyle({ opacity: "0", filter: `url(#${filterId})` });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(wrapper).toHaveStyle({ opacity: "1", filter: "none" });
  });
});
