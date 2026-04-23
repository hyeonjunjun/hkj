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
      { source: "/work", destination: "/", permanent: true },
      { source: "/works", destination: "/", permanent: true },
      { source: "/lab", destination: "/", permanent: true },
      { source: "/lab/:slug", destination: "/work/:slug", permanent: true },
      { source: "/journal", destination: "/about", permanent: true },
      { source: "/journal/:slug", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
