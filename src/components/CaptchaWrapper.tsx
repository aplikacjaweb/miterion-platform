'use client';
import { useEffect, useRef, useState } from 'react';

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
  const [isBypassEnv, setIsBypassEnv] = useState(false);
  
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    const hostname = window.location.hostname;

    // AUTOMATYCZNY BEZPIECZNIK (Bypass)
    const shouldBypass = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' ||
      hostname.endsWith('.vercel.app') || 
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

    if (shouldBypass) {
      setIsBypassEnv(true);
      const timer = setTimeout(() => {
        console.log('[Turnstile Bypass] Test environment detected. Automatic button unlock.');
        onVerifyRef.current('mock-vercel-development-token');
      }, 400);
      return () => clearTimeout(timer);
    }

    // --- KOD PRODUKCYJNY (Dla miterion.com) ---
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;

      try {
        containerRef.current.innerHTML = '';
        const id = window.turnstile.render(containerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
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

    return () => {
      if (script) script.removeEventListener('load', renderWidget);
      if (window.turnstile && widgetIdRef.current) {
        try { window.turnstile.remove(widgetIdRef.current); } catch (e) {}
        widgetIdRef.current = null;
      }
    };
  }, []);

  // Angielski komunikat testowy dla Vercela / Localhosta
  if (isBypassEnv) {
  return null;
}

  return (
    <div 
      ref={containerRef} 
      className="cf-turnstile mb-4 flex justify-center min-h-[65px]" 
    />
  );
}
