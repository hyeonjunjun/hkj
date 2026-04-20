"use client";

import dynamic from "next/dynamic";

// Dynamic import keeps the canvas renderer out of the initial server bundle.
const AsciiCosmos = dynamic(() => import("@/components/AsciiCosmos"), {
  ssr: false,
  loading: () => <div className="home-hero__placeholder" aria-hidden />,
});

export default function Home() {
  return (
    <main id="main" className="home" data-theme-lock="dark">
      <section className="home-hero" aria-label="Hyeonjoon Jun — design engineer, New York">
        <AsciiCosmos />
        <div className="home-hero__byline" aria-hidden>
          <span className="home-hero__name">Hyeonjoon Jun</span>
          <span className="home-hero__sep"> · </span>
          <span className="home-hero__role">design engineer, new york</span>
        </div>
      </section>

      <style>{`
        .home {
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #030408;
        }
        .home-hero {
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        .home-hero__placeholder {
          position: absolute;
          inset: 0;
          background: #030408;
        }
        .home-hero__byline {
          position: absolute;
          left: clamp(24px, 4vw, 64px);
          bottom: clamp(32px, 5vh, 56px);
          z-index: 3;
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          pointer-events: none;
          user-select: none;
        }
        .home-hero__name {
          font-family: var(--font-stack-serif);
          font-style: italic;
          font-size: 14px;
          letter-spacing: -0.01em;
          color: rgba(232, 226, 212, 0.95);
        }
        .home-hero__sep {
          color: rgba(232, 226, 212, 0.45);
          font-family: var(--font-stack-mono);
          font-size: 10px;
        }
        .home-hero__role {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(232, 226, 212, 0.7);
        }

        @media (max-width: 640px) {
          .home-hero__byline {
            left: 50%;
            bottom: clamp(32px, 6vh, 56px);
            transform: translateX(-50%);
            text-align: center;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
