/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // serverActions is stable in Next.js 14.1 — no longer needs experimental flag
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium-min']
  }
};

export default nextConfig;
