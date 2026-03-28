import type { Metadata } from "next";
import localFont from "next/font/local";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import { TransitionProvider } from "@/lib/transition-context";

/* ── Fonts ── */

const generalSans = localFont({
  src: "../fonts/general-sans/GeneralSans-Variable.woff2",
  variable: "--font-sans",
  weight: "200 700",
  display: "swap",
  preload: true,
});

const fragmentMono = localFont({
  src: "../fonts/fragment-mono/FragmentMono-Regular.woff2",
  variable: "--font-fragment",
  weight: "400",
  display: "swap",
  preload: true,
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
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
      <body className={`${generalSans.variable} ${fragmentMono.variable} ${dmSerif.variable}`}>
        {/* SVG grain filter — referenced by Cover component */}
        <svg
          aria-hidden="true"
          focusable="false"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <defs>
            <filter id="grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={0.65}
                numOctaves={4}
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
              <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
            </filter>
          </defs>
        </svg>

        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <RouteAnnouncer />

        {/* Transition system — provides context + progress bar */}
        <TransitionProvider>
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
