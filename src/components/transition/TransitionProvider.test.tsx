// src/components/transition/TransitionProvider.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { TransitionProvider } from "./TransitionProvider";
import { useRouteTransition } from "./useRouteTransition";

// Mock next/navigation. Hoist the push spy so we can assert on calls.
const pushSpy = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushSpy }),
}));

beforeEach(() => {
  pushSpy.mockClear();
});

describe("TransitionProvider", () => {
  it("starts in idle phase", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    expect(result.current.phase).toBe("idle");
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pendingPath).toBe(null);
  });

  it("transitions idle → covering on startTransition and flips isTransitioning", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    expect(result.current.phase).toBe("covering");
    expect(result.current.isTransitioning).toBe(true);
    expect(result.current.pendingPath).toBe("/about");
  });

  it("ignores startTransition while not idle", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    act(() => result.current.startTransition("/contact"));
    expect(result.current.pendingPath).toBe("/about");
  });

  it("transitions covering → exiting on onCoverComplete and runs disposers", () => {
    const disposer = vi.fn();
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("test", disposer));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(result.current.phase).toBe("exiting");
    expect(disposer).toHaveBeenCalledOnce();
  });

  it("calls router.push exactly once with pendingPath during onCoverComplete", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith("/about");
  });

  it("runs disposers before router.push", () => {
    const calls: string[] = [];
    pushSpy.mockImplementation((path: string) => calls.push(`push:${path}`));
    const disposer = vi.fn(() => calls.push("dispose"));
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("a", disposer));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(calls).toEqual(["dispose", "push:/about"]);
  });

  it("runs multiple disposers in insertion order", () => {
    const order: string[] = [];
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("first", () => order.push("first")));
    act(() => result.current.registerDisposer("second", () => order.push("second")));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(order).toEqual(["first", "second"]);
  });

  it("unregisterDisposer prevents the disposer from running on onCoverComplete", () => {
    const disposer = vi.fn();
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.registerDisposer("test", disposer));
    act(() => result.current.unregisterDisposer("test"));
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    expect(disposer).not.toHaveBeenCalled();
  });

  it("transitions exiting → idle on onExitComplete and clears pendingPath", () => {
    const { result } = renderHook(() => useRouteTransition(), {
      wrapper: TransitionProvider,
    });
    act(() => result.current.startTransition("/about"));
    act(() => result.current.onCoverComplete());
    act(() => result.current.onExitComplete());
    expect(result.current.phase).toBe("idle");
    expect(result.current.isTransitioning).toBe(false);
    expect(result.current.pendingPath).toBe(null);
  });

  it("throws if useRouteTransition called outside provider", () => {
    expect(() => renderHook(() => useRouteTransition())).toThrow(
      /useRouteTransition must be used within TransitionProvider/i,
    );
  });
});
