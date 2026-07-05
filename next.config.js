/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Wymuszenie zachowania plików binarnych na Vercelu
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/@sparticuz/chromium/bin/*'],
    },
    // Wersja 14.1.0 wymaga tej nazwy wewnątrz experimental, aby wykluczyć paczki z kompilacji Webpacka
    serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  },
};

module.exports = nextConfig;