import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPagesRepo = repoName.endsWith(".github.io");
const shouldUseBasePath =
  process.env.GITHUB_ACTIONS === "true" &&
  repoName.length > 0 &&
  !isUserOrOrgPagesRepo;
const basePath = shouldUseBasePath ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
