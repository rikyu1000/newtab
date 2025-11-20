/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

// GitHub repository name
const repoName = "Newab";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Configure basePath / assetPrefix for GitHub Pages project site:
  // https://<username>.github.io/Newtab/
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
};

module.exports = nextConfig;
