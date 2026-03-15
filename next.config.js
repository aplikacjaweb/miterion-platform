/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium', '@react-pdf/renderer'],
  },
};

module.exports = nextConfig;
