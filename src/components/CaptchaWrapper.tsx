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

    // AUTOMATYCZNY BEZPIECZNIK:
    // Jeśli jesteś na localhost lub na dowolnym linku testowym *.vercel.app, oszukujemy system
    const shouldBypass = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' ||
      hostname.endsWith('.vercel.app') || 
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

    if (shouldBypass) {
      setIsBypassEnv(true);
      // Automatycznie odblokuj formularz po 400ms bez pytania Cloudflare o zdanie
      const timer = setTimeout(() => {
        console.log('[Turnstile Bypass] Środowisko testowe. Automatyczne odblokowanie przycisku.');
        onVerifyRef.current('mock-vercel-development-token');
      }, 400);
      return () => clearTimeout(timer);
    }

    // --- KOD PRODUKCYJNY (Uruchomi się TYLKO na Twojej docelowej domenie miterion.com) ---
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;

      try {
        containerRef.current.innerHTML = '';
        const id = window.turnstile.render(containerRef.current, {
          sitekey: '0x4AAAAAADoSriRgvTkLLDSW',
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

  // Zielona i stabilna zaślepka dla środowisk testowych
  if (isBypassEnv) {
    return (
      <div className="mb-4 flex items-center justify-center p-3 border border-green-200 bg-green-50 rounded-lg text-green-700 text-sm font-medium">
        <svg className="w-5 h-5 mr-2 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        [Vercel Test Mode] Bezpieczeństwo zweryfikowane automatycznie
      </div>
    );
  }

  // Oryginalny boks Cloudflare (Pokazuje się tylko na miterion.com)
  return (
    <div 
      ref={containerRef} 
      className="cf-turnstile mb-4 flex justify-center min-h-[65px]" 
    />
  );
}