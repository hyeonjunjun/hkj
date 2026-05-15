import { notFound } from "next/navigation";

/**
 * /* catch-all — routes any unmatched URL under /
 * (e.g. /foo) to the segment-level not-found.tsx so the user
 * never falls through to the root 404. Defined as a catch-all so the
 * named segments (about, list, notes) take priority via the Next.js
 * static-before-dynamic-before-catchall route precedence.
 */
export default function CornerCatchAll() {
  notFound();
}
