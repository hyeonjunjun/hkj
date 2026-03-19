"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudioStore } from "@/lib/store";

interface TransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
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
  const startTransition = useStudioStore((s) => s.startTransition);
  const isTransitioning = useStudioStore((s) => s.isTransitioning);

  // External links, anchors, and mailto — use a plain <a>
  if (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("#")
  ) {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);

    // Skip if already transitioning or navigating to current page
    if (isTransitioning || href === pathname) return;

    startTransition(href);
  };

  return (
    <Link href={href} onClick={handleClick} prefetch {...props}>
      {children}
    </Link>
  );
}
