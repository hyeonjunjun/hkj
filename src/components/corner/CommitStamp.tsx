"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * CommitStamp — small fixed bottom-left stamp showing the latest git
 * commit. Mirrors the bottom-right CornerAudio with a quieter weight.
 *
 * Format: `[hash] · subject · time-ago`. The hash links out to the
 * commit on GitHub. The subject is truncated to fit; the title attr
 * gives the full message on hover.
 *
 * Build info is injected at build time via next.config.ts (see
 * NEXT_PUBLIC_BUILD_HASH / _SUBJECT / _DATE). Vercel's
 * VERCEL_GIT_COMMIT_* env vars take precedence; local builds fall
 * through to a git log shell call.
 *
 * Hidden on /legacy/* (the legacy site has its own bottom-left chrome
 * via the Logo component) and on small screens (no room).
 */

const HASH = process.env.NEXT_PUBLIC_BUILD_HASH ?? "";
const SUBJECT = process.env.NEXT_PUBLIC_BUILD_SUBJECT ?? "";
const DATE = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";

const SHORT_HASH = HASH.slice(0, 7);
const REPO = "https://github.com/hyeonjunjun/hkj";

function relativeTime(iso: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const sec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  const mo = Math.floor(days / 30);
  if (mo < 12) return `${mo}mo ago`;
  const yr = Math.floor(days / 365);
  return `${yr}y ago`;
}

export function CommitStamp() {
  const pathname = usePathname();
  // SSR-stable: initialize empty; the client effect fills it. Prevents
  // hydration mismatch since Date.now() differs between server render
  // and first client paint.
  const [rel, setRel] = useState("");

  useEffect(() => {
    if (!DATE) return;
    setRel(relativeTime(DATE));
    const id = setInterval(() => setRel(relativeTime(DATE)), 60_000);
    return () => clearInterval(id);
  }, []);

  // Hide on legacy (Logo owns bottom-left there) and when build info
  // is unavailable.
  if (pathname?.startsWith("/legacy")) return null;
  if (!SHORT_HASH) return null;

  const href = `${REPO}/commit/${HASH}`;
  const fullTitle = SUBJECT ? `${SHORT_HASH} — ${SUBJECT}${rel ? ` (${rel})` : ""}` : SHORT_HASH;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="commit-stamp"
      aria-label={`Latest commit ${SHORT_HASH}${SUBJECT ? `: ${SUBJECT}` : ""}`}
      title={fullTitle}
    >
      <span className="commit-stamp__label">build</span>
      <span className="commit-stamp__sep" aria-hidden>·</span>
      <span className="commit-stamp__hash tabular">{SHORT_HASH}</span>
      {SUBJECT && (
        <>
          <span className="commit-stamp__sep" aria-hidden>·</span>
          <span className="commit-stamp__subject">{SUBJECT}</span>
        </>
      )}
      {rel && (
        <>
          <span className="commit-stamp__sep" aria-hidden>·</span>
          <span className="commit-stamp__rel tabular">{rel}</span>
        </>
      )}

      <style>{`
        .commit-stamp {
          position: fixed;
          left: clamp(16px, 2.5vw, 28px);
          bottom: clamp(16px, 2.5vh, 28px);
          z-index: 30;
          display: inline-flex;
          align-items: baseline;
          gap: 6px;
          padding: 6px 10px;
          background: var(--paper);
          border: 1px solid var(--ink-hair);
          border-radius: 2px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.04),
            0 2px 6px rgba(0, 0, 0, 0.03);
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          line-height: 1.3;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-4);
          text-decoration: none;
          max-width: clamp(280px, 36vw, 480px);
          /* Subject can be long; constrain the whole row width and let
             the subject ellipsize inside the flex. */
          min-width: 0;
          transition: color 200ms var(--ease), border-color 200ms var(--ease);
        }
        .commit-stamp:hover {
          color: var(--ink-2);
          border-color: var(--ink-3);
        }
        .commit-stamp__label {
          color: var(--ink-4);
          flex: 0 0 auto;
        }
        .commit-stamp__sep {
          color: var(--ink-4);
          opacity: 0.5;
          flex: 0 0 auto;
        }
        .commit-stamp__hash {
          color: var(--ink-3);
          flex: 0 0 auto;
        }
        .commit-stamp__subject {
          /* Plain mono for the message (lowercase, conversational)
             contrasts with the small-caps chrome around it. */
          font-family: var(--font-stack-mono);
          text-transform: none;
          letter-spacing: -0.005em;
          font-size: 10px;
          color: var(--ink-3);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
          flex: 1 1 auto;
        }
        .commit-stamp:hover .commit-stamp__subject {
          color: var(--ink);
        }
        .commit-stamp__rel {
          color: var(--ink-4);
          flex: 0 0 auto;
        }
        @media (max-width: 760px) {
          .commit-stamp {
            display: none;
          }
        }
      `}</style>
    </a>
  );
}
