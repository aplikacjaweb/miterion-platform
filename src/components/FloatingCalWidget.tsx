'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';

export default function FloatingCalWidget() {
  useEffect(() => {
    let isMounted = true;
    
    (async function () {
      try {
        const cal = await getCalApi({
          namespace: 'miterion-cal'
        });
        
        if (isMounted && cal) {
          cal('ui', {
            theme: 'light',
            styles: {
              branding: { brandColor: '#000000' }
            },
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
          
          const style = document.createElement('style');
          style.innerHTML = `
            .cal-com-floating-button,
            [class*="cal-com"][class*="floating"] {
              bottom: 100px !important;
            }
          `;
          document.head.appendChild(style);
          
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                const button = document.querySelector('.cal-com-floating-button') ||
                               document.querySelector('[class*="cal-com"][class*="floating"]');
                if (button && button instanceof HTMLElement) {
                  button.style.bottom = '100px';
                }
              }
            });
          });
          
          observer.observe(document.body, { childList: true, subtree: true });
          
          return () => {
            observer.disconnect();
            if (style.parentNode) {
              document.head.removeChild(style);
            }
          };
        }
      } catch (error) {
        console.error('Error loading Cal.com widget:', error);
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}