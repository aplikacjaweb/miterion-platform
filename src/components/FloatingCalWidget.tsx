'use client';

import { useEffect, useRef } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { FaCalendarAlt } from "react-icons/fa";

export default function FloatingCalWidget() {
  const isInitialized = useRef(false);
  const calRef = useRef(null);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    (async function () {
      const cal = await getCalApi({ namespace: 'miterion-cal' });
      if (cal) {
        // Dodany preload:
        cal("preload", { calLink: 'web-app-xkqbra' });

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
      className="fixed bottom-48 md:bottom-28 right-4 md:right-6 z-[9999] bg-black text-white px-4 py-3 md:px-5 md:py-3 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 font-medium text-xs md:text-sm flex items-center gap-2"
    >
      <FaCalendarAlt />
      Book a meeting
    </button>
  );
}