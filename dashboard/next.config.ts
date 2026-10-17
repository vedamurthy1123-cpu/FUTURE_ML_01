import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let assetPrefix = "";
let basePath = "";

if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  const repo = process.env.GITHUB_REPOSITORY.split("/")[1];
  assetPrefix = `/${repo}/`;
  basePath = `/${repo}`;
}

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
