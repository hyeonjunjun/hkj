import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Legacy routes → home
      { source: "/works",               destination: "/",            permanent: true },
      { source: "/explore",             destination: "/exploration", permanent: true },
      { source: "/explore/:slug",       destination: "/exploration", permanent: true },
      { source: "/coddiwomple",         destination: "/exploration", permanent: true },
      { source: "/coddiwomple/:slug",   destination: "/exploration/:slug", permanent: true },
      { source: "/experiments",         destination: "/exploration", permanent: true },
      { source: "/experiments/:slug",   destination: "/exploration", permanent: true },
      { source: "/journal",             destination: "/writing",      permanent: true },
      { source: "/journal/:slug",       destination: "/writing/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
