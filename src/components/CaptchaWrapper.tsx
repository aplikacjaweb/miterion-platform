'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          execution?: 'render' | 'execute';
          appearance?: 'always' | 'execute' | 'interaction-only';
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
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

    // Bypass only for local development.
    // Vercel Preview and production must use real Cloudflare Turnstile.
    const shouldBypass =
      hostname === 'localhost' ||
      hostname === '127.0.0.1';

    if (shouldBypass) {
      setIsBypassEnv(true);

      const timer = setTimeout(() => {
        console.log('[Turnstile Bypass] Local environment detected. Automatic button unlock.');
        onVerifyRef.current('mock-vercel-development-token');
      }, 400);

      return () => clearTimeout(timer);
    }

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      console.error('[Turnstile] Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY.');
      return;
    }

    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
        return;
      }

      try {
        containerRef.current.innerHTML = '';

        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerifyRef.current(token);
          },
          'expired-callback': () => {
            onVerifyRef.current('');
          },
          'error-callback': () => {
            onVerifyRef.current('');
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
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
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
      if (script) {
        script.removeEventListener('load', renderWidget);
      }

      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}

        widgetIdRef.current = null;
      }
    };
  }, []);

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


