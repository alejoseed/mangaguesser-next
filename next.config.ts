import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
