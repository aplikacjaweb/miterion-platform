'use client';
import Script from 'next/script';

export default function CalInitializer() {
  return (
    <Script
      id="cal-preload"
      src="https://cal.com/embed.js"
      strategy="afterInteractive"
      onLoad={() => {(window as any).Cal("init", {origin: "https://cal.com"});}}
    />
  );
}
