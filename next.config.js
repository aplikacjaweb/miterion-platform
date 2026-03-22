/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
 experimental: {
 serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
 outputFileTracingIncludes: {
 '/api/generate-pdf': ['./node_modules/@sparticuz/chromium/bin/**'],
 },
 },
};

module.exports = nextConfig;
