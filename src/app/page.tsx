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
    <main id="main" className="home" data-theme-lock="dark">
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
          background: #050710;
        }
        .home-hero {
          position: relative;
          flex: 1;
          overflow: hidden;
        }
        .home-hero__placeholder {
          position: absolute;
          inset: 0;
          background: #050710;
        }
        /* Hero-scoped light overrides — the cosmos is always night regardless
           of site theme, so nav + byline render in warm cream here. */
        .home .home-hero__byline,
        .home .home-hero {
          color: #e8e2d4;
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
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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
