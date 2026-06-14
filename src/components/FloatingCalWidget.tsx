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
          
          // Agresywne wymuszenie pozycji przez CSS w nagłówku
          const style = document.createElement('style');
          style.innerHTML = `
            button[style*="background-color: rgb(0, 0, 0)"],
            [data-cal-namespace="miterion-cal"] button {
              bottom: 140px !important;
            }
          `;
          document.head.appendChild(style);
          
          // Obserwator wymuszający styl na wypadek, gdyby JS biblioteki go zmieniał
          const observer = new MutationObserver(() => {
            const buttons = document.querySelectorAll('button[style*="background-color: rgb(0, 0, 0)"]');
            buttons.forEach(button => {
              if (button instanceof HTMLElement) {
                button.style.setProperty('bottom', '140px', 'important');
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