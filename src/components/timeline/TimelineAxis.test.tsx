import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimelineAxis from "./TimelineAxis";

describe("TimelineAxis", () => {
  it("renders one year label per distinct year, in the order given", () => {
    render(<TimelineAxis years={["2026", "2025", "2024"]} progress={0} />);
    const labels = screen.getAllByText(/^20\d\d$/).map((el) => el.textContent);
    expect(labels).toEqual(["2026", "2025", "2024"]);
  });

  it("deduplicates repeated years", () => {
    render(<TimelineAxis years={["2026", "2026", "2025"]} progress={0} />);
    expect(screen.getAllByText(/^20\d\d$/)).toHaveLength(2);
  });

  it("positions the progress indicator per the progress ratio", () => {
    render(<TimelineAxis years={["2026", "2025"]} progress={0.5} />);
    const indicator = screen.getByTestId("timeline-axis-progress");
    expect(indicator).toHaveStyle({ left: "50%" });
  });
});
