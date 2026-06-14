'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';

export default function FloatingCalWidget() {
  useEffect(() => {
    let isMounted = true;

    async function initCal() {
      const cal = await getCalApi({ namespace: 'miterion-cal' });
      if (!isMounted || !cal) return;

      // Inicjalizacja UI
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#000000' } },
        hideEventTypeDetails: true,
        layout: 'month_view'
      });

      cal('floatingButton', {
        calLink: 'web-app-xkqbra',
        buttonText: 'Book a meeting',
        buttonColor: '#000000',
        buttonTextColor: '#ffffff',
        buttonPosition: 'bottom-right'
      });

      // Agresywne wstrzykiwanie stylu, który wymusza pozycję
      const styleId = 'cal-position-override';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          button[style*="background-color: rgb(0, 0, 0)"] {
            bottom: 30px !important;
            transition: bottom 0.3s ease !important;
          }
          body:has(.fixed.bottom-0), 
          body:has(.CookieConsent) {
            & button[style*="background-color: rgb(0, 0, 0)"] {
              bottom: 140px !important;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }

    initCal();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}