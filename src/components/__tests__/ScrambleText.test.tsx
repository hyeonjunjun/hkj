import { describe, it, expect, vi } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import ScrambleText from "../ScrambleText";

describe("ScrambleText", () => {
  it("renders the text as per-character spans", () => {
    const { container } = render(<ScrambleText text="abc" />);
    const spans = container.querySelectorAll("span span");
    expect(spans).toHaveLength(3);
    expect(spans[0].textContent).toBe("a");
    expect(spans[1].textContent).toBe("b");
    expect(spans[2].textContent).toBe("c");
  });

  it("wrapper has aria-label of full text", () => {
    const { container } = render(<ScrambleText text="Gyeol" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute("aria-label")).toBe("Gyeol");
  });

  it("per-character spans are aria-hidden", () => {
    const { container } = render(<ScrambleText text="ab" />);
    const innerSpans = container.querySelectorAll("span span");
    innerSpans.forEach((s) => {
      expect(s.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("preserves non-alphanumeric characters in render", () => {
    const { container } = render(<ScrambleText text="Gyeol: 결" />);
    const spans = container.querySelectorAll("span span");
    expect(spans).toHaveLength(8); // G,y,e,o,l,:, ,결
    expect(spans[5].textContent).toBe(":");
    expect(spans[6].textContent).toBe(" ");
    expect(spans[7].textContent).toBe("결");
  });

  it("renders text with zero alphanumeric characters", () => {
    const { container } = render(<ScrambleText text="결: 結" />);
    const spans = container.querySelectorAll("span span");
    expect(spans).toHaveLength(4); // 결,:, ,結
    // No assertion on scramble — hover would no-op
  });

  it("scrambles characters on mouseEnter (using fake timers)", async () => {
    vi.useFakeTimers();
    // Use a pool disjoint from "abcd" so any scrambled position is
    // guaranteed to differ from the original — eliminates the 1/62
    // chance per char of randomly picking the original letter back.
    const { container } = render(
      <ScrambleText
        text="abcd"
        count={2}
        duration={160}
        pool="XYZ123"
      />
    );
    const wrapper = container.firstChild as HTMLElement;

    // Trigger hover via testing-library fireEvent (React synthesizes
    // onMouseEnter from mouseover delegation, so a raw mouseenter
    // dispatch won't reach the handler). Advance just past the first
    // interval tick. act() flushes React state updates from setInterval.
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
      vi.advanceTimersByTime(45);
    });

    // After one tick, at least 1 character should be from the random pool
    // (not the original a/b/c/d). Pool is disjoint, so any scrambled
    // index must differ.
    const spans = container.querySelectorAll("span span");
    const renderedChars = Array.from(spans).map((s) => s.textContent ?? "");
    const original = "abcd".split("");
    const changedCount = renderedChars.reduce(
      (n, c, i) => (c !== original[i] ? n + 1 : n),
      0
    );
    expect(changedCount).toBeGreaterThan(0);

    // Advance through full scramble duration.
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // After full duration, all characters should resolve back to original.
    const finalChars = Array.from(container.querySelectorAll("span span")).map(
      (s) => s.textContent ?? ""
    );
    expect(finalChars).toEqual(original);

    vi.useRealTimers();
  });
});
