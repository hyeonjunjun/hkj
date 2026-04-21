import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import SmoothScroll from "@/components/SmoothScroll";
import NavCoordinates from "@/components/NavCoordinates";

const generalSans = localFont({
  src: "../fonts/general-sans/GeneralSans-Variable.woff2",
  variable: "--font-sans",
  weight: "200 700",
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
      <body className={`${generalSans.variable} ${fragmentMono.variable}`}>
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
