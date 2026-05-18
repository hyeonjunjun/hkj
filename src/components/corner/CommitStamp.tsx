"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * CommitStamp — small fixed bottom-left stamp showing the latest git
 * commit. Mirrors the bottom-right CornerAudio with a quieter weight.
 *
 * Format: `[hash] · subject · time-ago`. Clicking the stamp opens a
 * local "Recent changes" panel above it (no longer links to GitHub).
 * Build info + a 50-commit log are injected at build time via
 * next.config.ts (see NEXT_PUBLIC_BUILD_HASH / _SUBJECT / _DATE /
 * _LOG). Vercel's VERCEL_GIT_COMMIT_* env vars take precedence; local
 * builds fall through to a git log shell call.
 *
 * Hidden on /legacy/* (the legacy site has its own bottom-left chrome
 * via the Logo component) and on small screens (no room).
 */

const HASH = process.env.NEXT_PUBLIC_BUILD_HASH ?? "";
const SUBJECT = process.env.NEXT_PUBLIC_BUILD_SUBJECT ?? "";
const DATE = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";
const LOG_RAW = process.env.NEXT_PUBLIC_BUILD_LOG ?? "[]";

const SHORT_HASH = HASH.slice(0, 7);

type LogEntry = { sha: string; subject: string; isoDate: string };

function parseLog(raw: string): LogEntry[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    return [];
  }
}

const LOG: LogEntry[] = parseLog(LOG_RAW);

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
  // SSR-stable: initialize empty; the client effect fills it.
  const [rel, setRel] = useState("");
  const [open, setOpen] = useState(false);
  // Bumped every minute so relative-time strings inside the open panel
  // re-render too. Value is unused; the state change is the signal.
  const [, setTick] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!DATE) return;
    setRel(relativeTime(DATE));
    const id = setInterval(() => {
      setRel(relativeTime(DATE));
      setTick((t) => t + 1);
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  // Close on Escape + outside click. Pointerdown beats click here so a
  // mousedown outside dismisses before the click-through fires.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const root = wrapRef.current;
      if (root && !root.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  if (pathname?.startsWith("/legacy")) return null;
  if (!SHORT_HASH) return null;

  const fullTitle = SUBJECT
    ? `${SHORT_HASH} — ${SUBJECT}${rel ? ` (${rel})` : ""}`
    : SHORT_HASH;

  return (
    <div className="commit-stamp-wrap" ref={wrapRef} data-open={open ? "" : undefined}>
      {open && (
        <div className="commit-stamp__history" role="dialog" aria-label="Recent changes">
          <div className="commit-stamp__history-head">
            <span className="commit-stamp__history-title">Recent changes</span>
            <span className="commit-stamp__history-count tabular">
              {LOG.length} commit{LOG.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="commit-stamp__history-list">
            {LOG.map((c) => {
              const isCurrent = c.sha === HASH;
              return (
                <li
                  key={c.sha}
                  className="commit-stamp__history-row"
                  data-current={isCurrent ? "" : undefined}
                >
                  <span className="commit-stamp__history-hash tabular">
                    {c.sha.slice(0, 7)}
                  </span>
                  <span className="commit-stamp__history-subject">{c.subject}</span>
                  <span className="commit-stamp__history-rel tabular">
                    {relativeTime(c.isoDate)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="commit-stamp"
        aria-label={`Latest commit ${SHORT_HASH}${SUBJECT ? `: ${SUBJECT}` : ""}. Click to view recent changes.`}
        aria-expanded={open}
        aria-haspopup="dialog"
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
      </button>

      <style>{`
        .commit-stamp-wrap {
          position: fixed;
          left: clamp(16px, 2.5vw, 28px);
          bottom: clamp(16px, 2.5vh, 28px);
          z-index: 30;
        }
        .commit-stamp {
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
          min-width: 0;
          cursor: pointer;
          transition: color 200ms var(--ease), border-color 200ms var(--ease);
        }
        .commit-stamp:hover {
          color: var(--ink-2);
          border-color: var(--ink-3);
        }
        .commit-stamp-wrap[data-open] .commit-stamp {
          color: var(--ink);
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

        .commit-stamp__history {
          position: absolute;
          left: 0;
          bottom: calc(100% + 8px);
          width: clamp(360px, 44vw, 560px);
          max-height: min(60vh, 480px);
          background: var(--paper);
          border: 1px solid var(--ink-hair);
          border-radius: 3px;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow:
            0 16px 40px rgba(0, 0, 0, 0.08),
            0 4px 12px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(4px);
          animation: commit-history-in 220ms var(--ease) forwards;
        }
        @keyframes commit-history-in {
          to { opacity: 1; transform: translateY(0); }
        }
        .commit-stamp__history-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          padding: 10px 14px 8px;
          border-bottom: 1px solid var(--ink-ghost);
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .commit-stamp__history-title {
          color: var(--ink-2);
        }
        .commit-stamp__history-count {
          color: var(--ink-4);
        }
        .commit-stamp__history-list {
          list-style: none;
          margin: 0;
          padding: 4px 0;
          overflow-y: auto;
          min-height: 0;
        }
        .commit-stamp__history-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          column-gap: 12px;
          align-items: baseline;
          padding: 6px 14px;
          border-left: 2px solid transparent;
        }
        .commit-stamp__history-row[data-current] {
          border-left-color: var(--accent);
          background: color-mix(in oklab, var(--accent) 6%, transparent);
        }
        .commit-stamp__history-hash {
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-3);
        }
        .commit-stamp__history-row[data-current] .commit-stamp__history-hash {
          color: var(--ink);
        }
        .commit-stamp__history-subject {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          line-height: 1.35;
          color: var(--ink-2);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .commit-stamp__history-row[data-current] .commit-stamp__history-subject {
          color: var(--ink);
        }
        .commit-stamp__history-rel {
          font-family: var(--font-stack-chrome);
          font-size: 9px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-4);
        }

        @media (max-width: 760px) {
          .commit-stamp-wrap {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
