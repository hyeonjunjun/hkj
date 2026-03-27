import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GlobalNav from "@/components/GlobalNav";
import RouteAnnouncer from "@/components/RouteAnnouncer";

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
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <RouteAnnouncer />
        <GlobalNav />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
