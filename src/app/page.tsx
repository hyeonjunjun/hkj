"use client";

import GhostLetters from "@/components/GhostLetters";
import WorkSequence from "@/components/WorkSequence";
import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

export default function Home() {
  return (
    <>
      <main id="main">
        {/* First viewport — the opening measure */}
        <section
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <GhostLetters />

          {/* Colophon — bottom right */}
          <div
            className="font-mono uppercase"
            style={{
              position: "absolute",
              bottom: 20,
              right: "clamp(24px, 5vw, 64px)",
              fontSize: 11,
              letterSpacing: "0.06em",
              color: "var(--ink-ghost)",
            }}
          >
            Design Engineering &middot; New York &middot; 2026
          </div>
        </section>

        {/* Work sequence */}
        <WorkSequence />

        {/* Footer — minimal */}
        <footer
          style={{
            marginTop: "clamp(100px, 15vh, 180px)",
            marginLeft: "8vw",
            maxWidth: 900,
            paddingBottom: 72,
            paddingInline: "clamp(24px, 5vw, 64px)",
          }}
        >
          <div
            className="flex items-baseline justify-between flex-wrap"
            style={{ gap: 24 }}
          >
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--ink-secondary)",
              }}
            >
              {CONTACT_EMAIL}
            </a>
            <div className="flex" style={{ gap: 20 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono uppercase"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: "var(--ink-muted)",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <p
            className="font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--ink-ghost)",
              marginTop: 32,
            }}
          >
            &copy; {new Date().getFullYear()} HKJ Studio
          </p>
        </footer>
      </main>
    </>
  );
}
