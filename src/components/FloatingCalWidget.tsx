'use client';

import { useEffect, useRef } from 'react';
import { getCalApi } from '@calcom/embed-react';

export default function FloatingCalWidget() {
  const calRef = useRef(null);

  useEffect(() => {
    // Wstępne załadowanie API Cal.com w tle
    (async function () {
      const cal = await getCalApi({ namespace: 'miterion-cal' });
      if (cal) {
        cal('ui', { 
          theme: 'light', 
          styles: { branding: { brandColor: '#000000' } }, 
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

  const cssVarsPerTheme = {
    light: {
      '--cal-brand': '#000000',
      '--cal-brand-text': '#ffffff',
    },
    dark: {
      '--cal-brand': '#ffffff',
      '--cal-brand-text': '#000000',
    },
  };

  return (
    <button 
      ref={calRef}
      onClick={openCal}
      className="fixed bottom-6 right-6 z-[2147483647] bg-black text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-medium text-sm"
      style={cssVarsPerTheme.light}
    >
      Book a meeting
    </button>
  );
}