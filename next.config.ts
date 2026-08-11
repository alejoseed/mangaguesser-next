import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare Workers has no Node-native image pipeline (no sharp), so the
    // default next/image loader can't run there and /_next/image returns 502.
    // Panels are already pre-sized and CDN-cached for 7 days, so serving them
    // as-is costs us little.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'node1.alejoseed.com',
        port: '',
        pathname: '/panels/**',
      },
    ],
  },
};

export default nextConfig;
