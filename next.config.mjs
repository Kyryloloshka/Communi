/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    host: process.env.HOST,
  },
};

export default nextConfig;