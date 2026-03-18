"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";

/**
 * TransitionLink — Triggers page transition before navigation.
 *
 * Usage: Drop-in replacement for <Link> or <a> that need animated transitions.
 * Sets transitionHref in store → PageTransition plays exit → navigates on complete.
 *
 * For same-page anchors (#section), falls through to default behavior.
 */
interface TransitionLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export default function TransitionLink({
  href,
  children,
  onClick,
  ...props
}: TransitionLinkProps) {
  const pathname = usePathname();
  const setTransitionHref = useStudioStore((s) => s.setTransitionHref);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let external links, anchors, and modifier-key clicks pass through
      if (
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        onClick?.(e);
        return;
      }

      // Don't transition if already on this page
      if (href === pathname) {
        e.preventDefault();
        onClick?.(e);
        return;
      }

      e.preventDefault();
      onClick?.(e);
      setTransitionHref(href);
    },
    [href, pathname, setTransitionHref, onClick]
  );

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
