/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    host: process.env.HOST,
  },
  productionBrowserSourceMaps: true,

  images: {
    domains: ['firebasestorage.googleapis.com', 'ui-avatars.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/communichat-e4aba.appspot.com/o/images/**',
      },
    ],
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
