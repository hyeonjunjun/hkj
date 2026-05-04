import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePreloaderState } from "../usePreloaderState";

describe("usePreloaderState", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    delete document.documentElement.dataset.preloaderState;
  });

  it("defaults to active when DOM has no data-preloader-state", async () => {
    const { result } = renderHook(() => usePreloaderState());
    await waitFor(() => expect(result.current.state).toBe("active"));
  });

  it("returns dismissed when DOM has data-preloader-state='dismissed'", async () => {
    document.documentElement.dataset.preloaderState = "dismissed";
    const { result } = renderHook(() => usePreloaderState());
    await waitFor(() => expect(result.current.state).toBe("dismissed"));
  });

  it("dismiss writes DOM attribute and localStorage", () => {
    const { result } = renderHook(() => usePreloaderState());
    act(() => result.current.dismiss());
    expect(document.documentElement.dataset.preloaderState).toBe("dismissed");
    expect(window.localStorage.getItem("hkj.preloader.dismissed")).toBe("1");
  });
});
