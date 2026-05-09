import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import RouteAnnouncer from "@/components/RouteAnnouncer";
import Frame from "@/components/Frame";
import Folio from "@/components/Folio";
import PaperGrain from "@/components/PaperGrain";

export const metadata: Metadata = {
  metadataBase: new URL("https://hyeonjunjun.com"),
  title: { default: "Ryan Jun", template: "%s / Ryan Jun" },
  description: "Ryan Jun — design engineer, New York.",
  openGraph: {
    title: "Ryan Jun",
    description: "Design engineer, New York.",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Skip link is the first focusable element — ahead of the
            masthead — so keyboard users land on it before tabbing
            through the nav. */}
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <RouteAnnouncer />
        <Frame />
        {children}
        <Folio />
        <PaperGrain />
      </body>
    </html>
  );
}
