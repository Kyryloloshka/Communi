/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    host: process.env.HOST,
  },
  productionBrowserSourceMaps: true,

  images: {
    domains: ['ui-avatars.com'],
  },
};

export default nextConfig;
