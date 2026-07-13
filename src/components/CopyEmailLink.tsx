"use client";

import { useState, type MouseEvent } from "react";
import { studio } from "@/data/studio";

/**
 * CopyEmailLink — clicking the email copies it to the clipboard and
 * swaps the label to "copied" for 1.2s. Falls back to the real mailto
 * href if the Clipboard API is unavailable (middle-click, long-press,
 * old browsers). The micro-state is the reward — no toast, no overlay.
 */
type Props = {
  className?: string;
  email?: string;
};

export default function CopyEmailLink({
  className,
  email = studio.contactEmail,
}: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard?.writeText) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fall through to default mailto behavior
    }
  };

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={onClick}
      data-copied={copied ? "" : undefined}
      aria-live="polite"
    >
      {copied ? "copied" : email}
    </a>
  );
}
