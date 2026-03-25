import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalNav from "@/components/GlobalNav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import PreloaderWrapper from "@/components/PreloaderWrapper";
import TransitionManagerWrapper from "@/components/TransitionManagerWrapper";

/* ── Fonts ── */

const newsreader = localFont({
  src: "../fonts/newsreader/Newsreader-Variable.woff2",
  variable: "--font-display",
  weight: "300 800",
  display: "swap",
  preload: true,
});

const satoshi = localFont({
  src: "../fonts/satoshi/Satoshi-Variable.woff2",
  variable: "--font-body",
  weight: "300 700",
  display: "swap",
  preload: true,
});

const fragmentMono = localFont({
  src: "../fonts/fragment-mono/FragmentMono-Regular.woff2",
  variable: "--font-mono",
  weight: "400",
  display: "swap",
  preload: true,
});

/* ── Metadata ── */

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: {
    default: "HKJ",
    template: "%s — HKJ",
  },
  description:
    "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
  openGraph: {
    title: "HKJ",
    description:
      "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
    url: "https://hkjstudio.com",
    siteName: "HKJ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HKJ",
    description:
      "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
    creator: "@hyeonjunjun",
  },
};

/* ── Root Layout ── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${satoshi.variable} ${fragmentMono.variable}`}
        suppressHydrationWarning
      >
        {/* SVG grain filter — referenced by .grain-overlay and [data-cover] */}
        <svg
          aria-hidden="true"
          focusable="false"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <defs>
            <filter id="grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves={4}
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
            </filter>
          </defs>
        </svg>

        <PreloaderWrapper />
        <TransitionManagerWrapper />

        {/* Accessibility */}
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <RouteAnnouncer />

        {/* Chrome */}
        <GlobalNav />

        {/* Content */}
        <SmoothScroll>
          <main id="main" style={{ position: "relative" }}>
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
