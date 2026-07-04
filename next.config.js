/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core'],
    workerThreads: false,
    cpus: 1
  }
};

module.exports = nextConfig;