"use client";

import { useTransition } from "./TransitionContext";
import type { AnchorHTMLAttributes } from "react";

interface TransitionLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> {
  href: string;
}

export default function TransitionLink({
  href,
  children,
  ...props
}: TransitionLinkProps) {
  const { navigateTo } = useTransition();

  const isExternal =
    href.startsWith("mailto:") ||
    href.startsWith("http") ||
    href.startsWith("tel:");

  if (isExternal) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigateTo(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
