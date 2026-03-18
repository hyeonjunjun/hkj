import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/explore",
        destination: "/coddiwomple",
        permanent: true,
      },
      {
        source: "/explore/:slug",
        destination: "/coddiwomple/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
