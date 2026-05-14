import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import { Sitebar } from "@/components/chrome/Sitebar";
import { Logo } from "@/components/chrome/Logo";
import { CTAPill } from "@/components/chrome/CTAPill";
import { BackButton } from "@/components/chrome/BackButton";
import Folio from "@/components/Folio";
import PaperGrain from "@/components/PaperGrain";
import Preloader from "@/components/Preloader";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { TransitionCover } from "@/components/transition/TransitionCover";

export const metadata: Metadata = {
  metadataBase: new URL("https://hyeonjunjun.com"),
  title: { default: "Ryan Jun", template: "%s / Ryan Jun" },
  description: "Ryan Jun — multidisciplinary practice. Design, engineering, direction. New York.",
  openGraph: {
    title: "Ryan Jun",
    description: "Multidisciplinary practice. Design, engineering, direction. New York.",
    url: "https://hyeonjunjun.com",
    siteName: "Ryan Jun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Jun",
    description: "Design engineer, New York.",
    creator: "@hyeonjunjun",
  },
};

// Theme init — runs synchronously in <head> before any CSS evaluation
// so the correct theme is applied on first paint. Default is light
// (the user's stated preference); only sets data-theme="dark" if a
// dark preference is stored. System preference is deliberately
// ignored — taste overrides OS.
const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('rj-theme');
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* Departure Mono is self-hosted via @font-face in globals.css —
            Google Fonts does not host it. Geist Mono stays as fallback. */}
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Skip link is the first focusable element — ahead of the
            masthead — so keyboard users land on it before tabbing
            through the nav. */}
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <TransitionProvider>
          <RouteAnnouncer />
          <Preloader />
          <Sitebar />
          <Logo />
          <CTAPill />
          <BackButton />
          <TransitionCover />
          <main id="main" data-page-root>{children}</main>
          <Folio />
          <PaperGrain />
        </TransitionProvider>
      </body>
    </html>
  );
}
