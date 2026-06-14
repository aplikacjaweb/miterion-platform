'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';

export default function FloatingCalWidget() {
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi({
          namespace: 'miterion-cal'
        });
        
        if (cal) {
          console.log('Cal.com API loaded successfully');
          
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
        }
      } catch (error) {
        console.error('Error loading Cal.com widget:', error);
      }
    })();
  }, []);

  return null;
}