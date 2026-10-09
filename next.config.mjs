/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Demo: allow large base64 uploads through API routes
  experimental: {
    serverActions: { bodySizeLimit: '12mb' },
  },
};

export default nextConfig;
