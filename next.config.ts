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
      { source: "/works",      destination: "/work",    permanent: true },
      { source: "/lab",        destination: "/work",    permanent: true },
      { source: "/lab/:slug",  destination: "/work/:slug", permanent: true },

      // Old route names retained as 308 aliases for any external links.
      { source: "/about",      destination: "/studio",  permanent: true },
      { source: "/colophon",   destination: "/studio",  permanent: true },
      { source: "/shelf",      destination: "/studio",  permanent: true },
      { source: "/bookmarks",  destination: "/studio",  permanent: true },
      { source: "/garden",     destination: "/work",    permanent: true },
      { source: "/notes",      destination: "/work",    permanent: true },
      { source: "/notes/:slug", destination: "/work",    permanent: true },
      { source: "/journal",    destination: "/work",    permanent: true },
      { source: "/journal/:slug", destination: "/work", permanent: true },
      { source: "/classic",    destination: "/",        permanent: true },
    ];
  },
};

export default nextConfig;
