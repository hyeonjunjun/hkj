import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MediaRenderer } from "./WorkTile";
import type { MediaAsset } from "@/lib/types";

const media: MediaAsset = { type: "placeholder", alt: "Placeholder for Work", aspectRatio: "square" };

describe("MediaRenderer fit prop", () => {
  it("defaults to width-driven sizing (w-full, no forced height)", () => {
    render(<MediaRenderer media={media} />);
    const root = screen.getByRole("img");
    expect(root).toHaveClass("w-full");
    expect(root).not.toHaveClass("h-full");
  });

  it("switches to height-driven sizing (h-full, w-auto) when fit='height'", () => {
    render(<MediaRenderer media={media} fit="height" />);
    const root = screen.getByRole("img");
    expect(root).toHaveClass("h-full");
    expect(root).toHaveClass("w-auto");
    expect(root).not.toHaveClass("w-full");
  });
});
