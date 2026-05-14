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
      // Legacy work-index aliases.
      { source: "/works",      destination: "/work",    permanent: true },
      { source: "/lab",        destination: "/work",    permanent: true },
      { source: "/lab/:slug",  destination: "/work/:slug", permanent: true },

      // /studio was renamed to /about — alias old URL forward.
      { source: "/studio",     destination: "/about",   permanent: true },

      // Old route names retained as 308 aliases. Targets must be live routes
      // (do not redirect to deleted routes — Next runs redirects before
      // handlers, so a stale target masks the real page).
      { source: "/colophon",   destination: "/about",   permanent: true },
      { source: "/shelf",      destination: "/about",   permanent: true },
      { source: "/bookmarks",  destination: "/about",   permanent: true },
      { source: "/garden",     destination: "/work",    permanent: true },
      { source: "/journal",    destination: "/notes",   permanent: true },
      { source: "/journal/:slug", destination: "/notes", permanent: true },
      { source: "/classic",    destination: "/",        permanent: true },
    ];
  },
};

export default nextConfig;
