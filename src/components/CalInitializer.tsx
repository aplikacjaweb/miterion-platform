'use client';
import Script from 'next/script';

export default function CalInitializer() {
  return (
    <Script
      src="https://cal.com/embed.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (!(window as any).Cal) {
          (window as any).Cal("init", { origin: "https://cal.com" });
        }
      }}
    />
  );
}
