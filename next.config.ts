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

      // 2026-05-06 spec rename: about/shelf/garden → studio/bookmarks/notes.
      // The old paths are kept as 308 aliases so any external link still
      // resolves; canonical path is the new one.
      { source: "/about", destination: "/studio", permanent: true },
      { source: "/contact", destination: "/studio", permanent: true },
      { source: "/colophon", destination: "/studio", permanent: true },
      { source: "/shelf", destination: "/bookmarks", permanent: true },
      { source: "/garden", destination: "/notes", permanent: true },
      { source: "/journal", destination: "/notes", permanent: true },
      { source: "/journal/:slug", destination: "/notes/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
