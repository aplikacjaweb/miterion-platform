/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
    outputFileTracingIncludes: {
      '/api/generate-pdf': [
        './node_modules/@sparticuz/chromium/bin/**',
        './node_modules/@sparticuz/chromium/package.json',
      ],
    },
  },
};

module.exports = nextConfig;
