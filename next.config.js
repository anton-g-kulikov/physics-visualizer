/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Fail the build if there are type errors
    ignoreBuildErrors: false,
  },
  
  // Custom domain configuration
  assetPrefix: "",
};

module.exports = nextConfig;
