import PreloaderClient from "@/components/PreloaderClient";

/**
 * Preloader — renders the preloader DOM (ASCII video, source caption,
 * dismiss hint). Server component (no "use client"). Color and
 * visibility are theme-INDEPENDENT — preloader is always dark
 * regardless of resolved theme. Inline literal hex values used
 * instead of --paper / --ink tokens.
 *
 * Visibility governed by data-preloader-state on <html>:
 * - "active" → display block
 * - "dismissed" → display none
 * - unset → fallback to active (no JS / blocked script)
 *
 * Mount only on the home route (src/app/page.tsx).
 */
export default function Preloader() {
  return (
    <>
      <div className="preloader" role="presentation" aria-hidden="true">
        {/* TODO: assets pending — public/assets/preloader-ascii.webm and
            preloader-ascii-frame.png to be produced from a phyllotaxis
            (or similar spiral/circular/mathematical) source per Phase 6.1
            of the plan. Until assets land, the <video> renders as a
            broken element; click-to-dismiss still works. */}
        <video
          className="preloader__video"
          src="/assets/preloader-ascii.webm"
          poster="/assets/preloader-ascii-frame.png"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span className="preloader__caption">
          PHYLLOTAXIS · 137.508° · N=1597
        </span>
        <span className="preloader__hint">
          click to enter
          <span className="arrow-glyph"> →</span>
        </span>
      </div>

      <PreloaderClient />

      <style>{`
        .preloader {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #0E0D09;
          color: #F8F5EC;
          display: grid;
          place-items: center;
          padding: clamp(20px, 3vh, 36px) clamp(20px, 4vw, 64px);
          opacity: 1;
          transition: opacity 600ms var(--ease);
        }
        html[data-preloader-state="dismissed"] .preloader {
          display: none;
        }
        html:not([data-preloader-state]) .preloader {
          /* No-JS fallback — show the preloader. Click handler still
             dismisses if JS lands later. */
        }
        .preloader--exiting {
          opacity: 0;
          pointer-events: none;
        }
        .preloader__video {
          max-width: 80vw;
          max-height: 70vh;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        .preloader__caption {
          position: absolute;
          left: clamp(20px, 4vw, 64px);
          bottom: clamp(20px, 3vh, 36px);
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: rgba(248, 245, 236, 0.55);
        }
        .preloader__hint {
          position: absolute;
          right: clamp(20px, 4vw, 64px);
          bottom: clamp(20px, 3vh, 36px);
          font-family: var(--font-stack-sans);
          font-size: 11px;
          letter-spacing: 0.02em;
          text-transform: lowercase;
          color: rgba(248, 245, 236, 0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .preloader { transition: none; }
          .preloader--exiting { opacity: 0; }
        }

        /* Note: prefers-reduced-data is currently NOT supported in
           any stable browser (behind a flag in Chromium; not in Safari;
           partial in Firefox). The rule below is a forward-compatible
           fallback that will activate as browser support lands.
           For most real users today, this query never matches —
           the .webm always loads. Verify in DevTools by emulating
           the media feature in the Rendering panel. */
        @media (prefers-reduced-data: reduce) {
          .preloader__video {
            display: none;
          }
          /* Static PNG via background fallback */
          .preloader::after {
            content: "";
            background: url('/assets/preloader-ascii-frame.png') center / contain no-repeat;
            position: absolute;
            inset: clamp(20px, 5vh, 60px) clamp(20px, 5vw, 80px);
          }
        }
      `}</style>
    </>
  );
}
