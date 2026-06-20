'use client';
import Script from 'next/script';

export default function CalInitializer() {
  return (
    <Script
      src="https://cal.com/embed.js"
      strategy="afterInteractive"
      onLoad={() => {
        const checkCal = setInterval(() => {
          if ((window as any).Cal) {
            clearInterval(checkCal);
            (window as any).Cal("init", { origin: "https://cal.com" });
          }
        }, 50);
      }}
    />
  );
}
