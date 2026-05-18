import type { NextConfig } from "next";
import { execSync } from "node:child_process";

/**
 * Read the latest git commit at build time so the CommitStamp UI can
 * display "hash · subject · time-ago" without needing a runtime API.
 *
 * Vercel exposes its own env vars (VERCEL_GIT_COMMIT_*); fall through
 * to a local `git log` shell call for dev / non-Vercel builds. Wrapped
 * in try/catch so a missing `.git` directory (rare) doesn't break the
 * build — the stamp just renders empty.
 */
function safeGit(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

function readBuildInfo() {
  const sha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    safeGit("git rev-parse HEAD");
  const subject =
    (process.env.VERCEL_GIT_COMMIT_MESSAGE || "").split("\n")[0] ||
    safeGit("git log -1 --pretty=%s");
  // Vercel doesn't expose the commit timestamp directly; always read
  // via git when available so relative-time works in production too.
  const isoDate = safeGit("git log -1 --pretty=%cI");
  return { sha, subject, isoDate };
}

/**
 * Read the last N commits so CommitStamp can render an in-app history
 * panel without needing a runtime API. Tab-separated to avoid having to
 * escape JSON in the shell call; parsed client-side.
 */
function readBuildLog(): Array<{ sha: string; subject: string; isoDate: string }> {
  const raw = safeGit("git log -50 --pretty=format:%H%x09%s%x09%cI");
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => {
      const [sha, subject, isoDate] = line.split("\t");
      return { sha: sha || "", subject: subject || "", isoDate: isoDate || "" };
    })
    .filter((c) => c.sha);
}

const build = readBuildInfo();
const buildLog = readBuildLog();

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  env: {
    NEXT_PUBLIC_BUILD_HASH: build.sha,
    NEXT_PUBLIC_BUILD_SUBJECT: build.subject,
    NEXT_PUBLIC_BUILD_DATE: build.isoDate,
    NEXT_PUBLIC_BUILD_LOG: JSON.stringify(buildLog),
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
