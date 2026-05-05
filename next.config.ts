import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Legacy work-index aliases
      { source: "/works", destination: "/work", permanent: true },
      { source: "/lab", destination: "/work", permanent: true },
      { source: "/lab/:slug", destination: "/work/:slug", permanent: true },

      // Frame restructure 2026-05-04:
      // /studio → /about (consolidated bio + contact + colophon)
      // /bookmarks → /shelf (notes + bookmarks combined)
      // /notes (index) → /shelf (notes section lives there)
      { source: "/studio", destination: "/about", permanent: true },
      { source: "/contact", destination: "/about", permanent: true },
      { source: "/colophon", destination: "/about", permanent: true },
      { source: "/bookmarks", destination: "/shelf", permanent: true },
      { source: "/notes", destination: "/shelf", permanent: true },
      { source: "/journal", destination: "/shelf", permanent: true },
      { source: "/journal/:slug", destination: "/notes/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
