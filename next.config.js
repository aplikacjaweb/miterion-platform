/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/@sparticuz/chromium/bin/*'],
    },
  },
  serverExternalPackages: ['@sparticuz/chromium'],
};

module.exports = nextConfig;