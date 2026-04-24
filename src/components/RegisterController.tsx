"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const STAGE_ROUTES = [/^\/$/, /^\/work\//];

function registerFor(pathname: string): "stage" | "paper" {
  return STAGE_ROUTES.some((re) => re.test(pathname)) ? "stage" : "paper";
}

export default function RegisterController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const next = registerFor(pathname ?? "/");
    const html = document.documentElement;
    const prev = html.dataset.register;
    if (prev && prev !== next) {
      html.dataset.prevRegister = prev;
      window.setTimeout(() => {
        if (html.dataset.prevRegister === prev) delete html.dataset.prevRegister;
      }, 600);
    }
    html.dataset.register = next;
  }, [pathname]);

  return null;
}
