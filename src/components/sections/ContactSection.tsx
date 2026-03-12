"use client";

import { useState, useCallback } from "react";
import LiveClock from "@/components/ui/LiveClock";

const PORTS = [
  { label: "Client", description: "Product & brand work" },
  { label: "Collab", description: "Joint ventures & open source" },
  { label: "Speaking", description: "Talks, panels, mentorship" },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/hyeonjunjun" },
  { label: "LinkedIn", href: "https://linkedin.com/in/hyeonjunjun" },
  { label: "Twitter", href: "https://twitter.com/hyeonjunjun" },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "hello@hkjstudio.com";

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("input");
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [email]);

  return (
    <section
      data-section="contact"
      className="relative flex flex-col justify-between"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        paddingTop: "6rem",
      }}
    >
      {/* ─── Top Grid: Contact Information ─── */}
      <div 
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
        style={{ padding: "0 var(--page-px)" }}
      >
        {/* Email Quick Copy */}
        <div className="flex flex-col gap-4">
          <span className="font-mono uppercase text-[var(--text-micro)] tracking-[0.2em] text-[var(--color-text-ghost)]">
            Start a Conversation
          </span>
          <div>
            <button
              onClick={copyEmail}
              className="font-sans text-[var(--text-xl)] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-300 text-left"
            >
              {email}
            </button>
            <p
              className="font-mono text-[var(--text-micro)] text-[var(--color-text-dim)] uppercase tracking-widest mt-2 transition-opacity duration-300"
              style={{ opacity: copied ? 1 : 0.5 }}
            >
              {copied ? "Copied to clipboard" : "Click to copy"}
            </p>
          </div>
        </div>

        {/* Ports / General Context */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <span className="font-mono uppercase text-[var(--text-micro)] tracking-[0.2em] text-[var(--color-text-ghost)]">
            Services & Context
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PORTS.map((port) => (
              <div key={port.label} className="flex flex-col gap-1 border-t border-[var(--color-border)] pt-4">
                <span className="font-mono uppercase text-[var(--text-xs)] tracking-[0.12em] text-[var(--color-text)]">
                  {port.label}
                </span>
                <span className="font-sans text-[var(--text-sm)] text-[var(--color-text-dim)]">
                  {port.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Socials & Local Time */}
        <div className="flex justify-between md:flex-col md:justify-start gap-12">
          <div className="flex flex-col gap-4">
            <span className="font-mono uppercase text-[var(--text-micro)] tracking-[0.2em] text-[var(--color-text-ghost)]">
              Socials
            </span>
            <ul className="flex flex-col gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono uppercase text-[var(--text-sm)] tracking-[0.1em] text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-300"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col gap-4">
            <span className="font-mono uppercase text-[var(--text-micro)] tracking-[0.2em] text-[var(--color-text-ghost)]">
              Local Time
            </span>
            <LiveClock showTimezone className="font-mono text-[var(--text-sm)] text-[var(--color-text)]" />
          </div>
        </div>
      </div>

      {/* ─── Massive Edge-to-Edge Typography CTA ─── */}
      <div className="w-full flex justify-center items-end overflow-hidden mt-16 pt-16">
        <h2 
          className="font-display font-bold uppercase tracking-tighter leading-[0.78] w-full text-center hover:text-[var(--color-accent)] transition-colors duration-700 cursor-crosshair pb-4"
          style={{ fontSize: "19vw", color: "var(--color-text)" }}
          onClick={copyEmail}
        >
          {copied ? "COPIED" : "LET'S TALK"}
        </h2>
      </div>

      {/* ─── Very Bottom Bar ─── */}
      <div 
        className="w-full flex justify-between items-center py-6 border-t border-[var(--color-border)]"
        style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}
      >
        <span className="font-mono uppercase text-[var(--text-micro)] tracking-[0.15em] text-[var(--color-text-ghost)]">
          HKJ Studio &copy; {new Date().getFullYear()}
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono uppercase text-[var(--text-micro)] tracking-[0.15em] text-[var(--color-text-ghost)] hover:text-[var(--color-text)] transition-colors"
        >
          Back To Top &uarr;
        </button>
      </div>
    </section>
  );
}
