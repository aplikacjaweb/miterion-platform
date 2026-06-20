'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile: any;
  }
}

export default function CaptchaWrapper({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRendered = useRef(false);

  useEffect(() => {
    // Sprawdź, czy skrypt jest już załadowany, aby nie dublować rejestracji
    if (isRendered.current) return;

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v1/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: '0x4AAAAAADoSriRgvTkLLDSW', // Wstaw tutaj swój klucz
          callback: (token: string) => {
            onVerify(token);
          },
          'execution': 'execute',
          'appearance': 'interaction-only',
        });
        isRendered.current = true;
      }
    };

    return () => {
      isRendered.current = false;
    };
  }, [onVerify]);

  return <div ref={containerRef} />;
}