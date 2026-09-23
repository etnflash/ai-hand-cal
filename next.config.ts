import type { NextConfig } from "next";

/**
 * GitHub Pages (project site): https://USER.github.io/REPO/
 * CI sets GITHUB_PAGES=true and GITHUB_REPOSITORY=owner/repo
 * Local/dev: no basePath
 */
const isGhPages = process.env.GITHUB_PAGES === "true";
const repoName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "ai-hand-cal";
const basePath = isGhPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
