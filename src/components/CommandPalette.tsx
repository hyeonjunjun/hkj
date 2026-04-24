"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { CONTACT_EMAIL, NETWORKS } from "@/constants/contact";
import { PIECES } from "@/constants/pieces";
import { NOTES } from "@/constants/notes";

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    if (typeof window !== "undefined" && !window.__hkjEntranceComplete) {
      const run = () => router.push(path);
      window.addEventListener("hkj:entranceComplete", run, { once: true });
      return;
    }
    router.push(path);
  };

  const openExternal = (href: string) => {
    setOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const copyEmail = async () => {
    setOpen(false);
    try {
      await navigator.clipboard?.writeText(CONTACT_EMAIL);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  if (!open) return null;

  return (
    <div className="palette" aria-hidden={!open}>
      <div className="palette__overlay" onClick={() => setOpen(false)} />
      <Command label="Site navigation" className="palette__root">
        <Command.Input
          placeholder="Type to filter — Work, Writing, Browse, Actions"
          autoFocus
        />
        <Command.List>
          <Command.Empty>No results.</Command.Empty>

          <Command.Group heading="Work">
            {PIECES.map((p) => (
              <Command.Item
                key={p.slug}
                onSelect={() => go(`/work/${p.slug}`)}
                value={`work ${p.title} ${p.sector}`}
              >
                <span>{p.title.replace(/:\s*[一-鿿가-힯]+/, "")}</span>
                <span className="palette__hint">{p.sector}</span>
              </Command.Item>
            ))}
          </Command.Group>

          {NOTES.length > 0 && (
            <Command.Group heading="Writing">
              <Command.Item onSelect={() => go("/notes")} value="notes all">
                <span>All notes</span>
                <span className="palette__hint">/notes</span>
              </Command.Item>
              {NOTES.slice(0, 3).map((n) => (
                <Command.Item
                  key={n.slug}
                  onSelect={() => go(`/notes/${n.slug}`)}
                  value={`note ${n.title} ${n.number}`}
                >
                  <span>{n.title}</span>
                  <span className="palette__hint">N-{n.number}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Browse">
            <Command.Item onSelect={() => go("/about")} value="about">
              <span>About</span>
              <span className="palette__hint">/about</span>
            </Command.Item>
            <Command.Item onSelect={() => go("/shelf")} value="shelf">
              <span>Shelf</span>
              <span className="palette__hint">/shelf</span>
            </Command.Item>
            <Command.Item onSelect={() => go("/colophon")} value="colophon">
              <span>Colophon</span>
              <span className="palette__hint">/colophon</span>
            </Command.Item>
            <Command.Item onSelect={() => go("/contact")} value="contact">
              <span>Contact</span>
              <span className="palette__hint">/contact</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions">
            <Command.Item onSelect={copyEmail} value="copy email">
              <span>Copy email</span>
              <span className="palette__hint">{CONTACT_EMAIL}</span>
            </Command.Item>
            {NETWORKS.map((n) => (
              <Command.Item
                key={n.label}
                onSelect={() => openExternal(n.href)}
                value={`open ${n.label} ${n.handle}`}
              >
                <span>Open {n.label}</span>
                <span className="palette__hint">{n.handle}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>

      <style>{`
        .palette {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: start center;
          padding-top: 18vh;
        }
        .palette__overlay {
          position: absolute;
          inset: 0;
          background: var(--palette-overlay);
          animation: palette-overlay-in 150ms var(--ease) both;
        }

        [cmdk-root].palette__root {
          position: relative;
          z-index: 1;
          background: var(--paper);
          border: 1px solid var(--ink-hair);
          width: 540px;
          max-width: calc(100vw - 48px);
          box-shadow: 0 18px 40px rgba(17, 17, 16, 0.08);
          animation: palette-in 150ms var(--ease) both;
          font-family: var(--font-stack-mono);
        }

        [cmdk-input] {
          font-family: var(--font-stack-mono);
          font-size: 14px;
          letter-spacing: 0.02em;
          padding: 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--ink-hair);
          color: var(--ink);
          width: 100%;
          outline: none;
        }
        [cmdk-input]::placeholder {
          color: var(--ink-4);
          text-transform: none;
          letter-spacing: 0;
        }

        [cmdk-list] {
          max-height: 60vh;
          overflow-y: auto;
          padding: 8px 0 12px;
        }

        [cmdk-group-heading] {
          font-family: var(--font-stack-mono);
          font-size: 9px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--ink-4);
          padding: 14px 16px 6px;
        }

        [cmdk-item] {
          font-family: var(--font-stack-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-3);
          padding: 10px 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          cursor: pointer;
        }
        [cmdk-item][data-selected="true"] {
          background: var(--ink-ghost);
          color: var(--ink);
        }
        .palette__hint {
          color: var(--ink-4);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: lowercase;
        }

        [cmdk-empty] {
          padding: 24px 16px;
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ink-4);
        }

        @keyframes palette-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes palette-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          [cmdk-root].palette__root,
          .palette__overlay {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
