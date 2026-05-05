/**
 * / — the OS desktop surface.
 *
 * Plan A: thin desktop body. CloudscapeWallpaper, Frame, and Dock
 * render via the root layout. This component renders nothing
 * visible — the desktop IS the wallpaper + chrome — but provides
 * the <main> landmark for accessibility and a future container
 * for windows.
 *
 * Plan B will populate this with <WindowManager /> + windows.
 *
 * Server component. No interactivity in Plan A.
 */
export default function Home() {
  return (
    <main id="main" className="desktop" aria-label="Desktop">
      <style>{`
        .desktop {
          position: relative;
          z-index: 1;
          min-height: 100svh;
          width: 100%;
        }
      `}</style>
    </main>
  );
}
