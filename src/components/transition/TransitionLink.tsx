"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useRouteTransition } from "./useRouteTransition";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  showActiveIndicator?: boolean;
};

export function TransitionLink({
  href,
  children,
  showActiveIndicator = false,
  onClick,
  ...rest
}: Props) {
  const { startTransition, isTransitioning } = useRouteTransition();
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Pass-through to caller's onClick first
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Honor modifier-key clicks (open in new tab, etc.) by NOT intercepting
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (!isTransitioning && !isActive) startTransition(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {showActiveIndicator && isActive && (
        <span aria-hidden style={{ marginRight: "0.4em" }}>►</span>
      )}
      {children}
    </Link>
  );
}
