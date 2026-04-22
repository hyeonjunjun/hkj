import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import SmoothScroll from "@/components/SmoothScroll";
import NavCoordinates from "@/components/NavCoordinates";
import AmbientAscii from "@/components/AmbientAscii";

const fragmentMono = localFont({
  src: "../fonts/fragment-mono/FragmentMono-Regular.woff2",
  variable: "--font-mono",
  weight: "400",
  display: "swap",
  preload: true,
});

/** Gambetta — reserved for long-form case-study body prose only.
 *  Everywhere else is mono. Reading faces need to breathe. */
const gambetta = localFont({
  src: "../fonts/gambetta/Gambetta-Variable.woff2",
  variable: "--font-serif",
  weight: "300 800",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hkjstudio.com"),
  title: { default: "Hyeonjoon Jun", template: "%s / Hyeonjoon Jun" },
  description:
    "Hyeonjoon Jun — design engineer, New York. Observation log.",
  openGraph: {
    title: "Hyeonjoon Jun — design engineer, New York",
    description: "Observation log.",
    url: "https://hkjstudio.com",
    siteName: "Hyeonjoon Jun",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyeonjoon Jun — design engineer, New York",
    description: "Observation log.",
    creator: "@hyeonjunjun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fragmentMono.variable} ${gambetta.variable}`}>
        <AmbientAscii />
        <RouteAnnouncer />
        <SmoothScroll />
        <NavCoordinates />
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
