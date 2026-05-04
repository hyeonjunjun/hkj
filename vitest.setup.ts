import "@testing-library/jest-dom/vitest";

// Node 25 ships an experimental built-in `localStorage` that takes
// precedence over jsdom's implementation but is non-functional unless
// `--localstorage-file` is provided. Override the global with a simple
// in-memory Storage for tests so `window.localStorage` behaves like a
// real browser Storage API.
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string) {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

const memoryLocalStorage = new MemoryStorage();
const memorySessionStorage = new MemoryStorage();

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  get: () => memoryLocalStorage,
});
Object.defineProperty(globalThis, "sessionStorage", {
  configurable: true,
  get: () => memorySessionStorage,
});
if (typeof window !== "undefined") {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get: () => memoryLocalStorage,
  });
  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    get: () => memorySessionStorage,
  });

  // jsdom doesn't implement window.matchMedia. Components that consult
  // (prefers-reduced-motion) via useReducedMotion need a stub so they
  // don't throw during render in tests. Default to "no preference" so
  // motion-bearing code paths execute under test.
  if (typeof window.matchMedia !== "function") {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList),
    });
  }
}
