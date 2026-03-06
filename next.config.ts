import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
      },
    ],
  },
  serverExternalPackages: ['@resvg/resvg-js', 'sharp'],
}

export default nextConfig
