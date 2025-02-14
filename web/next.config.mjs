import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
};
// Disable font optimization for worker builds
if (
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_RUNTIME === "edge"
) {
  nextConfig.optimizeFonts = false;
}

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
