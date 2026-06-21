'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile: any;
  }
}

interface CaptchaWrapperProps {
  onVerify: (token: string) => void;
}

export default function CaptchaWrapper({ onVerify }: CaptchaWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    // Funkcja inicjalizująca widget Turnstile
    const renderTurnstile = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: '0x4AAAAAADoSriRgvTkLLDSW', // Twój klucz witryny
            callback: (token: string) => {
              onVerify(token);
            },
            execution: 'render',
            appearance: 'always',
          });
          widgetIdRef.current = id;
        } catch (err) {
          console.error('[Turnstile] Render error:', err);
        }
      }
    };

    // 1. Jeśli skryptu jeszcze nie ma w DOM, utwórz go
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v1/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderTurnstile;
      document.head.appendChild(script);
    } 
    // 2. Jeśli skrypt już istnieje i Turnstile jest gotowe, po prostu wyrenderuj widget
    else if (window.turnstile) {
      renderTurnstile();
    } 
    // 3. Jeśli skrypt istnieje, ale jeszcze się ładuje, dopisz się do zdarzenia load
    else {
      script.addEventListener('load', renderTurnstile);
    }

    // Czyszczenie komponentu (Cleanup) przy odmontowywaniu
    return () => {
      if (script) {
        script.removeEventListener('load', renderTurnstile);
      }
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          console.warn('[Turnstile] Cleanup warning:', e);
        }
        widgetIdRef.current = null;
      }
    };
  }, [onVerify]);

  return <div ref={containerRef} className="min-h-[65px] w-full" />;
}