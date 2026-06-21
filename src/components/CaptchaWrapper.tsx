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
  
  // Zabezpieczenie: Przechowujemy najnowszą referencję do funkcji onVerify.
  // Dzięki temu zmiana funkcji w rodzicu NIE wywoła ponownie efektu useEffect.
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;
      
      // Jeśli widget dla tej instancji komponentu już powstał, nie duplikujemy go
      if (widgetIdRef.current) return;

      try {
        // Czyszczenie HTML wewnątrz kontenera zapobiega błędom podwójnego renderowania w React 18 Strict Mode
        containerRef.current.innerHTML = '';
        
        const id = window.turnstile.render(containerRef.current, {
          sitekey: '0x4AAAAAADoSriRgvTkLLDSW', // Klucz testowy Cloudflare (zawsze zwraca sukces)
          callback: (token: string) => {
            onVerifyRef.current(token);
          },
          execution: 'render',
          appearance: 'always',
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error('[Turnstile] Render error:', err);
      }
    };

    // Zarządzanie skryptem Cloudflare
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v1/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    } else {
      script.addEventListener('load', renderWidget);
    }

    // Sprzątanie po odmontowaniu komponentu
    return () => {
      if (script) {
        script.removeEventListener('load', renderWidget);
      }
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (err) {
          // Ignorujemy błędy, jeśli element zdążył już zniknąć z DOM
        }
        widgetIdRef.current = null;
      }
    };
  }, []); // Pusta tablica zależności – efekt odpali się tylko RAZ przy montowaniu

  return (
    <div 
      ref={containerRef} 
      className="cf-turnstile mb-4 flex justify-center min-h-[65px]" 
    />
  );
}