import type { Metadata } from "next";
import { Courier_Prime, Inter_Tight, Instrument_Serif, Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

/**
 * Courier Prime is the site's only monospace-register face. The Tailwind
 * `font-mono` utility is pointed at --font-courier (see tailwind.config.ts)
 * rather than a separate --font-mono variable, so every existing
 * `font-mono` class across every room — metadata, timestamps, tags,
 * labels — renders in Courier without any component needing a class
 * rewrite. Archive additionally uses this face directly (via
 * `font-courier`) as its primary body register.
 */
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

/**
 * Windswept's structural-header display face — used only by the
 * landing page's Wordmark (hero variant) and ThesisStatement, not the
 * project's default sans (Inter Tight, --font-sans). Self-hosted since
 * General Sans isn't on Google Fonts.
 */
const generalSans = localFont({
  src: [
    { path: "../fonts/general-sans/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/general-sans/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ryan jun",
  description:
    "I'm an aspiring creative director & designer based in New York.",
  authors: [{ name: "Ryan Jun" }],
  creator: "Ryan Jun",
  openGraph: {
    title: "ryan jun",
    description: "Aspiring creative director & designer",
    type: "profile",
    url: "https://hkjstudio.com",
    siteName: "ryan jun's portfolio",
    firstName: "ryan",
    lastName: "jun",
  },
  twitter: {
    card: "summary_large_image",
    title: "ryan jun",
    description: "Aspiring creative director & designer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${courierPrime.variable} ${generalSans.variable} ${instrumentSans.variable}`}
    >
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
