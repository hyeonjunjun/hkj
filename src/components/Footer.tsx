import { SOCIALS, CONTACT_EMAIL } from "@/constants/contact";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--ink-whisper)",
        padding: "48px clamp(24px, 5vw, 64px)",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div className="flex items-baseline justify-between flex-wrap" style={{ gap: 24 }}>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.04em",
            color: "var(--ink-secondary)",
            transition: "color 0.3s var(--ease-swift)",
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
                fontSize: 9,
                letterSpacing: "0.06em",
                color: "var(--ink-muted)",
                transition: "color 0.3s var(--ease-swift)",
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
          fontSize: 9,
          letterSpacing: "0.04em",
          color: "var(--ink-ghost)",
          marginTop: 32,
        }}
      >
        {new Date().getFullYear()} HKJ Studio
      </p>
    </footer>
  );
}
