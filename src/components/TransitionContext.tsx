"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextValue {
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateTo: () => {},
});

export function useTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const navigateTo = useCallback(
    (href: string) => {
      const shell = document.querySelector(".page-shell");
      if (!shell) {
        router.push(href);
        return;
      }
      shell.classList.add("page-exit");
      setTimeout(() => router.push(href), 300);
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}
    </TransitionContext.Provider>
  );
}
