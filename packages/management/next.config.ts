import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['argon2', 'sqlite3', 'sqlite', 'argon2'],

  // biome-ignore lint/suspicious/useAwait: nextjs config requires async
  async rewrites() {
    return process.env['NODE_ENV'] === 'development'
      ? [
          {
            source: '/api/v1/:path*',
            destination: 'http://localhost:3000/api/v1/:path*',
          },
        ]
      : [];
  },
};

export default nextConfig;
