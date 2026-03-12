import type { Metadata } from "next";
import { Space_Mono, Inter, Newsreader } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CurtainPreloader from "@/components/CurtainPreloader";
import Cursor from "@/components/Cursor";
import GlobalNav from "@/components/GlobalNav";
import GlobalMarks from "@/components/GlobalMarks";
import ScrollColorController from "@/components/ScrollColorController";

/* ── Typography ── */

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-satoshi",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial-new",
  style: ["normal", "italic"],
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
    description: "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
    url: "https://hkjstudio.com",
    siteName: "HKJ Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HKJ Studio — Ryan Jun",
    description: "Design engineering at the intersection of high-fidelity craft and deep systems thinking.",
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
        className={`${spaceMono.variable} ${inter.variable} ${newsreader.variable} antialiased`}
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <CurtainPreloader />
        <GlobalMarks />
        <Cursor />
        <GlobalNav />

        {/* Paper Noise Texture */}
        <div className="paper-noise" />

        <SmoothScroll>
          <ScrollColorController />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
