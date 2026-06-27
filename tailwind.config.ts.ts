import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F2044',
        teal: '#0D9488'
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;