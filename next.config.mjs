/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    host: process.env.HOST,
  },
  productionBrowserSourceMaps: true,

  images: {
    domains: ['ui-avatars.com', 'firebasestorage.googleapis.com'],
  },
};

export default nextConfig;
