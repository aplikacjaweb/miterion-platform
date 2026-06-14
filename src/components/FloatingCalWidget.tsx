'use client';

import { useEffect, useRef } from 'react';
import { getCalApi } from '@calcom/embed-react';

export default function FloatingCalWidget() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    (async function () {
      const cal = await getCalApi({ namespace: 'miterion-cal' });
      if (cal) {
        cal('ui', { 
          theme: 'light', 
          cssVarsPerTheme: { light: { brandColor: '#000000' } }, 
          hideEventTypeDetails: true, 
          layout: 'month_view' 
        });
      }
    })();
  }, []);

  const openCal = async () => {
    const cal = await getCalApi({ namespace: 'miterion-cal' });
    cal('modal', { 
      calLink: 'web-app-xkqbra',
      config: { layout: 'month_view' }
    });
  };

  return (
    <button 
      onClick={openCal}
      className="fixed bottom-20 md:bottom-6 right-6 z-[9999] bg-black text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-medium text-sm"
    >
      Book a meeting
    </button>
  );
}