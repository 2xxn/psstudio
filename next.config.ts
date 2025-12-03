import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/thumbnail',
        search: '**',
      },
      {
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
