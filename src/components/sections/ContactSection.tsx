"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const SOCIALS = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "short",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time || "—"}</span>;
}

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
      className="relative"
      style={{
        padding: "6rem var(--page-px) 0",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* CTA area */}
      <div className="max-w-5xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="label block mb-8">Contact</span>

          <p
            className="font-sans mb-3"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text)",
            }}
          >
            Let&apos;s work together.
          </p>

          <p
            className="font-sans mb-10"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-dim)",
            }}
          >
            Open to projects that make me nervous.
          </p>

          {/* Email CTA */}
          <button
            onClick={copyEmail}
            className="group font-mono uppercase tracking-[0.1em] transition-colors duration-300"
            style={{
              fontSize: "var(--text-xl)",
              color: copied ? "var(--color-accent)" : "var(--color-text)",
              letterSpacing: "0.03em",
            }}
          >
            {copied ? "Copied ✓" : email}
          </button>

          <p
            className="mt-3 font-mono transition-opacity duration-300"
            style={{
              color: "var(--color-text-ghost)",
              fontSize: "var(--text-xs)",
              opacity: copied ? 0 : 1,
            }}
          >
            Click to copy
          </p>
        </motion.div>
      </div>

      {/* Footer bar */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "1rem var(--page-px) 1rem 0",
        }}
      >
        {/* Social links */}
        <div className="flex gap-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="font-mono uppercase tracking-[0.1em] transition-colors duration-300"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-dim)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-dim)")
              }
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Clock + Copyright */}
        <div className="flex items-center gap-6">
          <span
            className="font-mono"
            style={{
              color: "var(--color-text-dim)",
              fontSize: "var(--text-xs)",
            }}
          >
            <LiveClock />
          </span>
          <span
            className="font-mono"
            style={{
              color: "var(--color-text-ghost)",
              fontSize: "var(--text-xs)",
            }}
          >
            &copy; {new Date().getFullYear()} HKJ Studio
          </span>
        </div>
      </div>
    </section>
  );
}
