import type { Metadata } from "next";
import { Newsreader, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import GlobalNav from "@/components/GlobalNav";
import StudioPreloader from "@/components/StudioPreloader";
import TransitionOverlay from "@/components/TransitionOverlay";
import AboutOverlay from "@/components/AboutOverlay";
import ContactOverlay from "@/components/ContactOverlay";

/* ── Fonts ── */

// TODO: Replace DM Sans with Neue Montreal (PPNeueMontreal) via next/font/local
// once WOFF2 files are placed in public/fonts/
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

/* ── Metadata ── */

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: {
    default: "HKJ Studio — Ryan Jun",
    template: "%s | HKJ Studio",
  },
  description:
    "Design engineering at the intersection of high-fidelity craft and deep systems thinking. Specializing in React Native, Next.js, and design systems.",
  openGraph: {
    title: "HKJ Studio — Ryan Jun",
    description:
      "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
    url: "https://hkjstudio.com",
    siteName: "HKJ Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HKJ Studio — Ryan Jun",
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
        className={`${dmSans.variable} ${newsreader.variable} ${spaceMono.variable} antialiased`}
      >
        <StudioPreloader />
        <Cursor />
        <GlobalNav />
        <TransitionOverlay />
        <AboutOverlay />
        <ContactOverlay />

        {/* Black body frame */}
        <div
          className="fixed inset-0 pointer-events-none z-[50]"
          style={{
            boxShadow: `inset 0 0 0 var(--body-frame) var(--color-bg-body)`,
          }}
        />

        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
