'use client';

import { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';

export default function FloatingCalWidget() {
  useEffect(() => {
    let isMounted = true;
    
    (async function () {
      try {
        const cal = await getCalApi({ namespace: 'miterion-cal' });
        
        if (isMounted && cal) {
          cal('ui', { theme: 'light', styles: { branding: { brandColor: '#000000' } }, hideEventTypeDetails: true, layout: 'month_view' });
          cal('floatingButton', {
            calLink: 'web-app-xkqbra',
            buttonText: 'Book a meeting',
            buttonColor: '#000000',
            buttonTextColor: '#ffffff',
            buttonPosition: 'bottom-right'
          });
          
          // Funkcja sprawdzająca czy któryś baner jest widoczny
          const updateButtonPosition = () => {
            const buttons = document.querySelectorAll('button[style*="background-color: rgb(0, 0, 0)"]');
            
            // Szukamy elementów po klasach z Twoich banerów
            const cookieBanner = document.querySelector('.fixed.bottom-0'); // Klasa z CookieBanner.tsx
            const reactCookieBanner = document.querySelector('.CookieConsent'); // Domyślna klasa dla react-cookie-consent
            
            const isBannerVisible = (cookieBanner && window.getComputedStyle(cookieBanner).display !== 'none') || 
                                    (reactCookieBanner && window.getComputedStyle(reactCookieBanner).display !== 'none');
            
            const bottomPosition = isBannerVisible ? '140px' : '30px';
            
            buttons.forEach(button => {
              if (button instanceof HTMLElement) {
                button.style.setProperty('bottom', bottomPosition, 'important');
              }
            });
          };
          
          // Obserwator zmian w DOM
          const observer = new MutationObserver(updateButtonPosition);
          observer.observe(document.body, { childList: true, subtree: true });
          
          // Uruchomienie początkowe
          updateButtonPosition();
          
          return () => observer.disconnect();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    })();
    
    return () => { isMounted = false; };
  }, []);

  return null;
}