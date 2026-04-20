"use client";

import dynamic from "next/dynamic";

// Dynamically load the three.js scene so the ~700kb of webgl stack only
// ships on the homepage route (not pre-fetched elsewhere).
const CosmosScene = dynamic(() => import("@/components/CosmosScene"), {
  ssr: false,
  loading: () => <div className="home-hero__placeholder" aria-hidden />,
});

export default function Home() {
  return (
    <main id="main" className="home">
      <section className="home-hero" aria-label="Hyeonjoon Jun — design engineer, New York">
        <CosmosScene />
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
          background: #F4F1EA;
        }
        .home-hero {
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        .home-hero__placeholder {
          position: absolute;
          inset: 0;
          background: #F4F1EA;
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
          color: var(--ink);
        }
        .home-hero__sep {
          color: var(--ink-faint);
          font-family: var(--font-stack-mono);
          font-size: 10px;
        }
        .home-hero__role {
          font-family: var(--font-stack-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-muted);
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
